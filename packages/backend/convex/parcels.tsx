import { mutation, query } from './_generated/server';
import { v } from 'convex/values';
import { sendPushNotificationToUser } from './pushNotifications';
import { Id } from './_generated/dataModel';

export const upsertParcel = mutation({
  args: {
    _id: v.optional(v.id('parcels')),
    spaceId: v.string(),
    occupantId: v.string(),
    parcelTypeId: v.string(),
    numPackages: v.number(),
    description: v.optional(v.string()),
    location: v.string(),
    isCollected: v.boolean(),
  },
  handler: async (ctx, args) => {
    const identity = await ctx.auth.getUserIdentity();
    if (!identity) throw new Error('Unauthenticated');
    const orgId = identity.orgId;

    const occupant = await ctx.db.get(args.occupantId as Id<string>);

    let result: string;

    if (args._id) {
      // Update existing parcel
      const existing = await ctx.db.get(args._id);
      if (!existing || existing.orgId !== orgId) {
        throw new Error('Parcel not found or access denied');
      }
      await ctx.db.patch(args._id, {
        spaceId: args.spaceId,
        occupantId: args.occupantId,
        parcelTypeId: args.parcelTypeId,
        numPackages: args.numPackages,
        description: args.description,
        location: args.location,
        isCollected: args.isCollected,
      });
      result = args._id;

      // Log the update as an activity
      await ctx.db.insert('globalActivity', {
        title: 'Parcel Details Updated',
        description: `Parcel details have been updated.`,
        type: 'Details Updated',
        entityId: args._id,
        orgId,
      });
    } else {
      // Insert new parcel
      result = await ctx.db.insert('parcels', {
        spaceId: args.spaceId,
        occupantId: args.occupantId,
        parcelTypeId: args.parcelTypeId,
        numPackages: args.numPackages,
        description: args.description,
        location: args.location,
        isCollected: args.isCollected,
        orgId,
      });

      // Log the new parcel as an activity
      await ctx.db.insert('globalActivity', {
        title: 'Parcel Added',
        description: `Parcel was added to the system`,
        type: 'Parcel Added',
        entityId: result,
        orgId,
      });

      // Send notification
      await sendPushNotificationToUser(ctx, {
        userId: occupant.userId,
        title: '📬 You have mail!',
        body: `Hey ${occupant.firstName.charAt(0).toUpperCase() + occupant.firstName.slice(1)}, some mail has arrived for you.`,
      });
    }

    return result;
  },
});

export const setCollectionDate = mutation({
  args: { 
    parcelId: v.id('parcels'),
    collectionDate: v.string()
  },
  handler: async (ctx, args) => {
    const identity = await ctx.auth.getUserIdentity();
    if (!identity) throw new Error('Unauthenticated');
    const orgId = identity.orgId;

    const parcel = await ctx.db.get(args.parcelId);
    if (!parcel || parcel.orgId !== orgId) {
      throw new Error('Parcel not found or access denied');
    }

    await ctx.db.patch(args.parcelId, { collectionDate: args.collectionDate });

    // Log the update as an activity
    await ctx.db.insert('globalActivity', {
      title: 'Parcel Collection Date Set',
      description: `Collection date set for parcel`,
      type: 'Collection Date Set',
      entityId: args.parcelId,
      orgId,
    });

    return args.parcelId;
  },
});

export const remove = mutation({
  args: { id: v.id('parcels') },
  handler: async (ctx, args) => {
    const identity = await ctx.auth.getUserIdentity();
    if (!identity) throw new Error('Unauthenticated');
    const orgId = identity.orgId;

    const existing = await ctx.db.get(args.id);
    if (!existing || existing.orgId !== orgId) {
      throw new Error('Parcel not found or access denied');
    }
    await ctx.db.delete(args.id);

    // Log the removal as an activity
    await ctx.db.insert('globalActivity', {
      title: 'Parcel Removed',
      description: `Parcel was removed from the system`,
      type: 'Parcel Removed',
      entityId: args.id,
      orgId,
    });
  },
});

export const get = query({
  args: { id: v.id('parcels') },
  handler: async (ctx, args) => {
    const identity = await ctx.auth.getUserIdentity();
    if (!identity) throw new Error('Unauthenticated');
    const orgId = identity.orgId;

    const parcel = await ctx.db.get(args.id);
    if (!parcel || parcel.orgId !== orgId) {
      return null;
    }
    return parcel;
  },
});

export const getAll = query({
  handler: async (ctx) => {
    const identity = await ctx.auth.getUserIdentity();
    if (!identity) throw new Error('Unauthenticated');
    const orgId = identity.orgId;

    return await ctx.db
      .query('parcels')
      .filter((q) => q.eq(q.field('orgId'), orgId))
      .collect();
  },
});

export const getAllForCurrentOccupant = query({
  args: { isCollected: v.boolean() },
  handler: async (ctx, args) => {
    console.log('Starting getAllForCurrentOccupant query');
    console.log('Args:', args);

    const identity = await ctx.auth.getUserIdentity();
    if (!identity) throw new Error('Unauthenticated');
    const userId = identity.subject;
    const orgId = identity.orgId;
    console.log('User ID:', userId);
    console.log('Org ID:', orgId);

    const occupant = await ctx.db
      .query('users')
      .filter((q) => q.eq(q.field('userId'), userId))
      // .filter((q) => q.eq(q.field('orgId'), orgId))
      .first();

    console.log('Occupant:', occupant);
    if (!occupant) throw new Error('Occupant not found');

    const parcels = await ctx.db
      .query('parcels')
      .filter((q) => q.eq(q.field('occupantId'), occupant._id))
      // .filter((q) => q.eq(q.field('orgId'), orgId))
      .filter((q) => q.eq(q.field('isCollected'), args.isCollected))
      .collect();

    console.log('Parcels found:', parcels.length);

    const result = await Promise.all(
      parcels.map(async (parcel) => {
        console.log('Processing parcel:', parcel._id);
        let spaceName = 'Unknown';
        if (parcel.spaceId) {
          const space = await ctx.db.get(parcel.spaceId);
          spaceName = space?.spaceName || 'Unknown';
          console.log('Space name for parcel:', spaceName);
        }
        return { ...parcel, spaceName };
      })
    );

    console.log('Returning result with', result.length, 'parcels');
    return result;
  },
});

export const getParcelForEdit = query({
  args: { id: v.id('parcels') },
  handler: async (ctx, args) => {
    const identity = await ctx.auth.getUserIdentity();
    if (!identity) throw new Error('Unauthenticated');
    const orgId = identity.orgId;

    const parcel = await ctx.db.get(args.id);
    if (!parcel || parcel.orgId !== orgId) {
      throw new Error('Parcel not found or access denied');
    }

    return {
      _id: parcel._id,
      spaceId: parcel.spaceId,
      occupantId: parcel.occupantId,
      parcelTypeId: parcel.parcelTypeId,
      numPackages: parcel.numPackages,
      description: parcel.description,
      location: parcel.location,
      isCollected: parcel.isCollected,
    };
  },
});

export const getAllParcelsFormatted = query({
  handler: async (ctx) => {
    const identity = await ctx.auth.getUserIdentity();
    if (!identity) throw new Error('Unauthenticated');
    const orgId = identity.orgId;

    const parcels = await ctx.db
      .query('parcels')
      .filter((q) => q.eq(q.field('orgId'), orgId))
      .collect();

    console.log('parcels', parcels);

    const formattedParcels = await Promise.all(
      parcels.map(async (parcel) => {
        const space = await ctx.db.get(parcel.spaceId);
        const occupant = await ctx.db.get(parcel.occupantId);

        return {
          _id: parcel._id,
          spaceId: parcel.spaceId,
          spaceName: space?.spaceName || 'Unknown',
          occupantId: parcel.occupantId,
          occupantName:
            `${occupant?.firstName} ${occupant?.lastName}` || 'Unknown',
          parcelTypeId: parcel.parcelTypeId,
          parcelTypeName: parcel?.parcelTypeId || 'Unknown',
          numPackages: parcel.numPackages,
          description: parcel.description,
          location: parcel.location,
          isCollected: parcel.isCollected,
        };
      })
    );

    return formattedParcels;
  },
});

export const markAsCollected = mutation({
  args: { id: v.id('parcels') },
  handler: async (ctx, args) => {
    const identity = await ctx.auth.getUserIdentity();
    if (!identity) throw new Error('Unauthenticated');
    const orgId = identity.orgId;

    const parcel = await ctx.db.get(args.id);
    if (!parcel || parcel.orgId !== orgId) {
      throw new Error('Parcel not found or access denied');
    }

    await ctx.db.patch(args.id, { isCollected: true });

    // Log the collection as an activity
    await ctx.db.insert('globalActivity', {
      title: 'Parcel Collected',
      description: `A parcel has been marked as collected.`,
      type: 'Parcel Collection',
      entityId: args.id,
      orgId,
    });

    return args.id;
  },
});
