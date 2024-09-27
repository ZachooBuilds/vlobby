import { mutation, query } from "./_generated/server";
import { v } from "convex/values";

export const upsertParcel = mutation({
  args: {
    _id: v.optional(v.id("parcels")),
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
    if (!identity) throw new Error("Unauthenticated");
    const orgId = identity.orgId;

    let result: string;

    if (args._id) {
      // Update existing parcel
      const existing = await ctx.db.get(args._id);
      if (!existing || existing.orgId !== orgId) {
        throw new Error("Parcel not found or access denied");
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
      await ctx.db.insert("globalActivity", {
        title: "Parcel Details Updated",
        description: `Parcel details have been updated.`,
        type: "Details Updated",
        entityId: args._id,
        orgId,
      });
    } else {
      // Insert new parcel
      result = await ctx.db.insert("parcels", {
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
      await ctx.db.insert("globalActivity", {
        title: "Parcel Added",
        description: `Parcel was added to the system`,
        type: "Parcel Added",
        entityId: result,
        orgId,
      });
    }

    return result;
  },
});

export const remove = mutation({
  args: { id: v.id("parcels") },
  handler: async (ctx, args) => {
    const identity = await ctx.auth.getUserIdentity();
    if (!identity) throw new Error("Unauthenticated");
    const orgId = identity.orgId;

    const existing = await ctx.db.get(args.id);
    if (!existing || existing.orgId !== orgId) {
      throw new Error("Parcel not found or access denied");
    }
    await ctx.db.delete(args.id);

    // Log the removal as an activity
    await ctx.db.insert("globalActivity", {
      title: "Parcel Removed",
      description: `Parcel was removed from the system`,
      type: "Parcel Removed",
      entityId: args.id,
      orgId,
    });
  },
});

export const get = query({
  args: { id: v.id("parcels") },
  handler: async (ctx, args) => {
    const identity = await ctx.auth.getUserIdentity();
    if (!identity) throw new Error("Unauthenticated");
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
    if (!identity) throw new Error("Unauthenticated");
    const orgId = identity.orgId;

    return await ctx.db
      .query("parcels")
      .filter((q) => q.eq(q.field("orgId"), orgId))
      .collect();
  },
});

export const getParcelForEdit = query({
  args: { id: v.id("parcels") },
  handler: async (ctx, args) => {
    const identity = await ctx.auth.getUserIdentity();
    if (!identity) throw new Error("Unauthenticated");
    const orgId = identity.orgId;

    const parcel = await ctx.db.get(args.id);
    if (!parcel || parcel.orgId !== orgId) {
      throw new Error("Parcel not found or access denied");
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
    if (!identity) throw new Error("Unauthenticated");
    const orgId = identity.orgId;

    const parcels = await ctx.db
      .query("parcels")
      .filter((q) => q.eq(q.field("orgId"), orgId))
      .collect();

    console.log("parcels", parcels);

    const formattedParcels = await Promise.all(
      parcels.map(async (parcel) => {
        const space = await ctx.db.get(parcel.spaceId);
        const occupant = await ctx.db.get(parcel.occupantId);

        return {
          _id: parcel._id,
          spaceId: parcel.spaceId,
          spaceName: space?.spaceName || "Unknown",
          occupantId: parcel.occupantId,
          occupantName:
            `${occupant?.firstName} ${occupant?.lastName}` || "Unknown",
          parcelTypeId: parcel.parcelTypeId,
          parcelTypeName: parcel?.parcelTypeId || "Unknown",
          numPackages: parcel.numPackages,
          description: parcel.description,
          location: parcel.location,
          isCollected: parcel.isCollected,
        };
      }),
    );

    return formattedParcels;
  },
});

export const markAsCollected = mutation({
  args: { id: v.id("parcels") },
  handler: async (ctx, args) => {
    const identity = await ctx.auth.getUserIdentity();
    if (!identity) throw new Error("Unauthenticated");
    const orgId = identity.orgId;

    const parcel = await ctx.db.get(args.id);
    if (!parcel || parcel.orgId !== orgId) {
      throw new Error("Parcel not found or access denied");
    }

    await ctx.db.patch(args.id, { isCollected: true });

    // Log the collection as an activity
    await ctx.db.insert("globalActivity", {
      title: "Parcel Collected",
      description: `A parcel has been marked as collected.`,
      type: "Parcel Collection",
      entityId: args.id,
      orgId,
    });

    return args.id;
  },
});

