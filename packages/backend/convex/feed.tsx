import { mutation, query } from './_generated/server';
import { v } from 'convex/values';
import { Id } from './_generated/dataModel';
import { getCurrentOccupant } from './occupants';

// Helper function to transform images
async function transformImages(ctx: any, images: Id<'_storage'>[]) {
  return await Promise.all(
    (images || []).map(async (storageId) => ({
      url: await ctx.storage.getUrl(storageId),
      storageId: storageId,
    }))
  );
}

export const upsertFeedPost = mutation({
  args: {
    _id: v.optional(v.id('feedPosts')),
    title: v.string(),
    content: v.string(),
    images: v.optional(v.array(v.string())),
    isAdmin: v.boolean(),
    status: v.string(),
  },
  handler: async (ctx, args) => {
    const identity = await ctx.auth.getUserIdentity();
    if (!identity) throw new Error('Unauthenticated');
    const orgId = identity.orgId;
    const userId = identity.subject;

    const { _id, ...postData } = args;

    let result: string;

    if (_id) {
      // Update existing feed post
      const existing = await ctx.db.get(_id);
      if (!existing || existing.orgId !== orgId) {
        throw new Error('Feed post not found or access denied');
      }
      await ctx.db.patch(_id, {
        ...postData,
        updatedAt: new Date().toISOString(),
      });
      result = _id;

      // Log the update as an activity
      await ctx.db.insert('globalActivity', {
        title: 'Feed Post Updated',
        description: `Feed post has been updated.`,
        type: 'Details Updated',
        entityId: _id,
        orgId,
      });
    } else {
      // Insert new feed post
      result = await ctx.db.insert('feedPosts', {
        ...postData,
        orgId,
        authorId: userId,
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
      });

      // Log the new feed post as an activity
      await ctx.db.insert('globalActivity', {
        title: 'Feed Post Added',
        description: `New feed post was added to the system`,
        type: 'Feed Post Added',
        entityId: result,
        orgId,
      });
    }

    return result;
  },
});

export const deleteFeedPost = mutation({
  args: { id: v.id('feedPosts') },
  handler: async (ctx, args) => {
    const identity = await ctx.auth.getUserIdentity();
    if (!identity) throw new Error('Unauthenticated');
    const orgId = identity.orgId;

    const existing = await ctx.db.get(args.id);
    if (!existing || existing.orgId !== orgId) {
      throw new Error('Feed post not found or access denied');
    }
    await ctx.db.delete(args.id);

    // Log the removal as an activity
    await ctx.db.insert('globalActivity', {
      title: 'Feed Post Removed',
      description: `Feed post was removed from the system`,
      type: 'Feed Post Removed',
      entityId: args.id,
      orgId,
    });
  },
});

export const getFeedPost = query({
  args: { id: v.id('feedPosts') },
  handler: async (ctx, args) => {
    const identity = await ctx.auth.getUserIdentity();
    if (!identity) throw new Error('Unauthenticated');
    const orgId = identity.orgId;

    const feedPost = await ctx.db.get(args.id);
    if (!feedPost || feedPost.orgId !== orgId) {
      return null;
    }

    const transformedImages = await transformImages(ctx, feedPost.images);

    return {
      ...feedPost,
      images: transformedImages,
    };
  },
});

export const getAllFeedPosts = query({
  handler: async (ctx) => {
    const identity = await ctx.auth.getUserIdentity();
    if (!identity) throw new Error('Unauthenticated');
    const orgId = identity.orgId;

    const feedPosts = await ctx.db
      .query('feedPosts')
      .filter((q) => q.eq(q.field('orgId'), orgId))
      .filter((q) => q.eq(q.field('status'), 'approved'))
      .order('desc')
      .collect();

    const transformedPosts = await Promise.all(
      feedPosts.map(async (post) => {
        let authorName = 'Admin';
        if (!post.isAdmin) {
          const user = await ctx.db
            .query('users')
            .filter((q) => q.eq(q.field('userId'), post.authorId))
            .first();
          authorName = user ? `${user.firstName} ${user.lastName}` : 'Unknown';
        }
        return {
          ...post,
          authorName,
          images: await transformImages(ctx, post.images),
        };
      })
    );

    return transformedPosts;
  },
});

export const getAllPendingFeedPostsForCurrentUser = query({
  handler: async (ctx) => {
    const identity = await ctx.auth.getUserIdentity();
    if (!identity) throw new Error('Unauthenticated');
    const orgId = identity.orgId;
    const userId = identity.subject;

    const currentOccupant = await getCurrentOccupant(ctx, {});

    const feedPosts = await ctx.db
      .query('feedPosts')
      .filter((q) => q.eq(q.field('orgId'), orgId))
      .filter((q) =>
        q.and(
          q.eq(q.field('authorId'), userId),
          q.neq(q.field('status'), 'approved')
        )
      )
      .order('desc')
      .collect();

    const transformedPosts = await Promise.all(
      feedPosts.map(async (post) => ({
        ...post,
        authorName:
          currentOccupant?.firstName + ' ' + currentOccupant?.lastName,
        images: await transformImages(ctx, post.images),
      }))
    );

    return transformedPosts;
  },
});

export const getPendingFeedPosts = query({
  handler: async (ctx) => {
    const identity = await ctx.auth.getUserIdentity();
    if (!identity) throw new Error('Unauthenticated');
    const orgId = identity.orgId;

    const pendingPosts = await ctx.db
      .query('feedPosts')
      .filter((q) => q.eq(q.field('orgId'), orgId))
      .filter((q) => q.eq(q.field('status'), 'pending'))
      .order('desc')
      .collect();

    const transformedPosts = await Promise.all(
      pendingPosts.map(async (post) => ({
        ...post,
        images: await transformImages(ctx, post.images),
      }))
    );

    return transformedPosts;
  },
});

export const setFeedPostStatus = mutation({
  args: {
    ids: v.array(v.id('feedPosts')),
    status: v.union(
      v.literal('pending'),
      v.literal('approved'),
      v.literal('rejected')
    ),
  },
  handler: async (ctx, args) => {
    const identity = await ctx.auth.getUserIdentity();
    if (!identity) throw new Error('Unauthenticated');
    const orgId = identity.orgId;

    for (const id of args.ids) {
      const feedPost = await ctx.db.get(id);
      if (!feedPost || feedPost.orgId !== orgId) {
        throw new Error(`Feed post ${id} not found or access denied`);
      }

      await ctx.db.patch(id, {
        status: args.status,
      });
    }
  },
});

export const getFeedPostForEdit = query({
  args: { id: v.id('feedPosts') },
  handler: async (ctx, args) => {
    const identity = await ctx.auth.getUserIdentity();
    if (!identity) throw new Error('Unauthenticated');
    const orgId = identity.orgId;

    const feedPost = await ctx.db.get(args.id);
    if (!feedPost || feedPost.orgId !== orgId) {
      throw new Error('Feed post not found or access denied');
    }

    const transformedImages = await transformImages(ctx, feedPost.images);

    return {
      ...feedPost,
      images: transformedImages,
    };
  },
});
