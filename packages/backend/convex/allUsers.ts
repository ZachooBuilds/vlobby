import { internalMutation, query, QueryCtx } from './_generated/server';
import { UserJSON } from '@clerk/backend';
import { v, Validator } from 'convex/values';

export const current = query({
  args: {},
  handler: async (ctx) => {
    return await getCurrentUser(ctx);
  },
});

export const getUserById = query({
  args: { userId: v.string() },
  handler: async (ctx, args) => {
    const user = await ctx.db
      .query('allUsers')
      .filter((q) => q.eq(q.field('userId'), args.userId))
      .first();
    
    if (!user) {
      throw new Error('User not found');
    }

    return user;
  },
});


export const upsertFromClerk = internalMutation({
  args: { data: v.any() as Validator<UserJSON> }, // no runtime validation, trust Clerk
  async handler(ctx, { data }) {
    if (!data) {
      throw new Error('Data is undefined');
    }

    const userAttributes = {
      firstname: data.first_name,
      lastname: data.last_name,
      email: data.email_addresses[0]?.email_address,
      userId: data.id,
    };

    if (!userAttributes.email || !userAttributes.userId) {
      throw new Error('Missing required user attributes');
    }

    const user = await userByExternalId(ctx, data.id);
    if (user === null) {
      await ctx.db.insert('allUsers', userAttributes);
    } else {
      await ctx.db.patch(user._id, userAttributes);
    }
  },
});

export const deleteFromClerk = internalMutation({
  args: { clerkUserId: v.string() },
  async handler(ctx, { clerkUserId }) {
    const user = await userByExternalId(ctx, clerkUserId);

    if (user !== null) {
      await ctx.db.delete(user._id);
    } else {
      console.warn(
        `Can't delete user, there is none for Clerk user ID: ${clerkUserId}`
      );
    }
  },
});

export async function getCurrentUserOrThrow(ctx: QueryCtx) {
  const userRecord = await getCurrentUser(ctx);
  if (!userRecord) throw new Error("Can't get current user");
  return userRecord;
}

export async function getCurrentUser(ctx: QueryCtx) {
  const identity = await ctx.auth.getUserIdentity();
  if (identity === null) {
    return null;
  }
  return await userByExternalId(ctx, identity.subject);
}

async function userByExternalId(ctx: QueryCtx, externalId: string) {
  return await ctx.db
    .query("allUsers")
    .filter((q) => q.eq(q.field("externalId"), externalId))
    .unique();
}
