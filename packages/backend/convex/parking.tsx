import { Id } from "./_generated/dataModel";
import { mutation, query } from "./_generated/server";
import { v } from "convex/values";

export const upsertLocation = mutation({
  args: {
    _id: v.optional(v.id("parkingLocations")),
    name: v.string(),
  },
  handler: async (ctx, args) => {
    const identity = await ctx.auth.getUserIdentity();
    if (!identity) throw new Error("Unauthenticated");
    const orgId = identity.orgId;

    let result: string;

    if (args._id) {
      // Update existing location
      const existing = await ctx.db.get(args._id);
      if (!existing || existing.orgId !== orgId) {
        throw new Error("Location not found or access denied");
      }
      await ctx.db.patch(args._id, { name: args.name });
      result = args._id;

      // Log the update as an activity
      await ctx.db.insert("globalActivity", {
        title: "Parking Location Updated",
        description: `Parking location "${args.name}" has been updated.`,
        type: "Location Updated",
        entityId: args._id,
        orgId,
      });
    } else {
      // Insert new location
      result = await ctx.db.insert("parkingLocations", {
        name: args.name,
        orgId,
      });

      // Log the new location as an activity
      await ctx.db.insert("globalActivity", {
        title: "Parking Location Added",
        description: `New parking location "${args.name}" was added to the system`,
        type: "Location Added",
        entityId: result,
        orgId,
      });
    }

    return result;
  },
});

export const getAllLocations = query({
  handler: async (ctx) => {
    const identity = await ctx.auth.getUserIdentity();
    if (!identity) throw new Error("Unauthenticated");
    const orgId = identity.orgId;

    return await ctx.db
      .query("parkingLocations")
      .filter((q) => q.eq(q.field("orgId"), orgId))
      .collect();
  },
});

export const removeLocation = mutation({
  args: { id: v.id("parkingLocations") },
  handler: async (ctx, args) => {
    const identity = await ctx.auth.getUserIdentity();
    if (!identity) throw new Error("Unauthenticated");
    const orgId = identity.orgId;

    const existing = await ctx.db.get(args.id);
    if (!existing || existing.orgId !== orgId) {
      throw new Error("Location not found or access denied");
    }
    await ctx.db.delete(args.id);

    // Log the removal as an activity
    await ctx.db.insert("globalActivity", {
      title: "Parking Location Removed",
      description: `Parking location "${existing.name}" was removed from the system`,
      type: "Location Removed",
      entityId: args.id,
      orgId,
    });
  },
});

export const getLocation = query({
  args: { id: v.id("parkingLocations") },
  handler: async (ctx, args) => {
    const identity = await ctx.auth.getUserIdentity();
    if (!identity) throw new Error("Unauthenticated");
    const orgId = identity.orgId;

    const location = await ctx.db.get(args.id);
    if (!location || location.orgId !== orgId) {
      return null;
    }
    return location;
  },
});

export const getAllLocationsValueLabelPair = query({
  handler: async (ctx) => {
    const identity = await ctx.auth.getUserIdentity();
    if (!identity) throw new Error("Unauthenticated");
    const orgId = identity.orgId;

    const rawData = await ctx.db
      .query("parkingLocations")
      .filter((q) => q.eq(q.field("orgId"), orgId))
      .collect();

    return rawData.map((location) => ({
      value: location._id,
      label: location.name,
    }));
  },
});

export const upsertParkingLevel = mutation({
  args: {
    _id: v.optional(v.id("parkingLevels")),
    name: v.string(),
    locationId: v.id("parkingLocations"),
    image: v.array(
      v.object({
        url: v.string(),
        storageId: v.string(),
      }),
    ),
  },
  handler: async (ctx, args) => {
    const identity = await ctx.auth.getUserIdentity();
    if (!identity) throw new Error("Unauthenticated");
    const orgId = identity.orgId;

    let result: string;

    if (args._id) {
      // Update existing parking level
      const existing = await ctx.db.get(args._id);
      if (!existing || existing.orgId !== orgId) {
        throw new Error("Parking level not found or access denied");
      }
      await ctx.db.patch(args._id, {
        name: args.name,
        locationId: args.locationId,
        image: args.image,
      });
      result = args._id;

      // Log the update as an activity
      await ctx.db.insert("globalActivity", {
        title: "Parking Level Updated",
        description: `Parking level "${args.name}" has been updated.`,
        type: "Level Updated",
        entityId: args._id,
        orgId,
      });
    } else {
      // Insert new parking level
      result = await ctx.db.insert("parkingLevels", {
        name: args.name,
        locationId: args.locationId,
        image: args.image,
        orgId,
      });

      // Log the new parking level as an activity
      await ctx.db.insert("globalActivity", {
        title: "Parking Level Added",
        description: `New parking level "${args.name}" was added to the system`,
        type: "Level Added",
        entityId: result,
        orgId,
      });
    }

    return result;
  },
});

export const getAllParkingLevels = query({
  handler: async (ctx) => {
    const identity = await ctx.auth.getUserIdentity();
    if (!identity) throw new Error("Unauthenticated");
    const orgId = identity.orgId;

    return await ctx.db
      .query("parkingLevels")
      .filter((q) => q.eq(q.field("orgId"), orgId))
      .collect();
  },
});

export const removeParkingLevel = mutation({
  args: { id: v.id("parkingLevels") },
  handler: async (ctx, args) => {
    const identity = await ctx.auth.getUserIdentity();
    if (!identity) throw new Error("Unauthenticated");
    const orgId = identity.orgId;

    const existing = await ctx.db.get(args.id);
    if (!existing || existing.orgId !== orgId) {
      throw new Error("Parking level not found or access denied");
    }
    await ctx.db.delete(args.id);

    // Log the removal as an activity
    await ctx.db.insert("globalActivity", {
      title: "Parking Level Removed",
      description: `Parking level "${existing.name}" was removed from the system`,
      type: "Level Removed",
      entityId: args.id,
      orgId,
    });
  },
});

export const getParkingLevel = query({
  args: { id: v.id("parkingLevels") },
  handler: async (ctx, args) => {
    const identity = await ctx.auth.getUserIdentity();
    if (!identity) throw new Error("Unauthenticated");
    const orgId = identity.orgId;

    const level = await ctx.db.get(args.id);
    if (!level || level.orgId !== orgId) {
      return null;
    }

    return {
      ...level,
      imageUrl: level.image
        ? await ctx.storage.getUrl(level.image[0].storageId as Id<"_storage">)
        : null,
    };
  },
});

export const getAllParkingLevelsValueLabelPair = query({
  args: { locationId: v.id("parkingLocations") },
  handler: async (ctx, args) => {
    const identity = await ctx.auth.getUserIdentity();
    if (!identity) throw new Error("Unauthenticated");
    const orgId = identity.orgId;

    const rawData = await ctx.db
      .query("parkingLevels")
      .filter((q) =>
        q.and(
          q.eq(q.field("orgId"), orgId),
          q.eq(q.field("locationId"), args.locationId),
        ),
      )
      .collect();

    return rawData.map((level) => ({
      value: level._id,
      label: level.name,
    }));
  },
});

export const upsertParkingSpot = mutation({
  args: {
    _id: v.optional(v.id("parkingSpots")),
    name: v.string(),
    levelId: v.id("parkingLevels"),
    x: v.number(),
    y: v.number(),
  },
  handler: async (ctx, args) => {
    const identity = await ctx.auth.getUserIdentity();
    if (!identity) throw new Error("Unauthenticated");
    const orgId = identity.orgId;

    let result: string;

    if (args._id) {
      // Update existing parking spot
      const existing = await ctx.db.get(args._id);
      if (!existing || existing.orgId !== orgId) {
        throw new Error("Parking spot not found or access denied");
      }
      await ctx.db.patch(args._id, {
        name: args.name,
        levelId: args.levelId,
        x: args.x,
        y: args.y,
      });
      result = args._id;

      // Log the update as an activity
      await ctx.db.insert("globalActivity", {
        title: "Parking Spot Updated",
        description: `Parking spot "${args.name}" has been updated.`,
        type: "Spot Updated",
        entityId: args._id,
        orgId,
      });
    } else {
      // Insert new parking spot
      result = await ctx.db.insert("parkingSpots", {
        name: args.name,
        levelId: args.levelId,
        x: args.x,
        y: args.y,
        orgId,
      });

      // Log the new parking spot as an activity
      await ctx.db.insert("globalActivity", {
        title: "Parking Spot Added",
        description: `New parking spot "${args.name}" was added to the system`,
        type: "Spot Added",
        entityId: result,
        orgId,
      });
    }

    return result;
  },
});

export const getAllParkingSpots = query({
  handler: async (ctx) => {
    const identity = await ctx.auth.getUserIdentity();
    if (!identity) throw new Error("Unauthenticated");
    const orgId = identity.orgId;

    return await ctx.db
      .query("parkingSpots")
      .filter((q) => q.eq(q.field("orgId"), orgId))
      .collect();
  },
});

export const removeParkingSpot = mutation({
  args: { id: v.id("parkingSpots") },
  handler: async (ctx, args) => {
    const identity = await ctx.auth.getUserIdentity();
    if (!identity) throw new Error("Unauthenticated");
    const orgId = identity.orgId;

    const existing = await ctx.db.get(args.id);
    if (!existing || existing.orgId !== orgId) {
      throw new Error("Parking spot not found or access denied");
    }
    await ctx.db.delete(args.id);

    // Log the removal as an activity
    await ctx.db.insert("globalActivity", {
      title: "Parking Spot Removed",
      description: `Parking spot "${existing.name}" was removed from the system`,
      type: "Spot Removed",
      entityId: args.id,
      orgId,
    });
  },
});

export const getParkingSpot = query({
  args: { id: v.id("parkingSpots") },
  handler: async (ctx, args) => {
    const identity = await ctx.auth.getUserIdentity();
    if (!identity) throw new Error("Unauthenticated");
    const orgId = identity.orgId;

    const spot = await ctx.db.get(args.id);
    if (!spot || spot.orgId !== orgId) {
      return null;
    }
    return spot;
  },
});

export const getParkingSpotsByLevel = query({
  args: { levelId: v.id("parkingLevels") },
  handler: async (ctx, args) => {
    const identity = await ctx.auth.getUserIdentity();
    if (!identity) throw new Error("Unauthenticated");
    const orgId = identity.orgId;

    return await ctx.db
      .query("parkingSpots")
      .filter((q) =>
        q.and(
          q.eq(q.field("orgId"), orgId),
          q.eq(q.field("levelId"), args.levelId),
        ),
      )
      .collect();
  },
});

export const getParkingSpotById = query({
  args: { id: v.id("parkingSpots") },
  handler: async (ctx, args) => {
    const identity = await ctx.auth.getUserIdentity();
    if (!identity) throw new Error("Unauthenticated");
    const orgId = identity.orgId;

    const parkingSpot = await ctx.db.get(args.id);
    if (!parkingSpot || parkingSpot.orgId !== orgId) {
      throw new Error("Parking spot not found or access denied");
    }

    // Get the active parking log for this spot
    const activeParkingLog = await ctx.db
      .query("parkingLogs")
      .filter((q) => q.eq(q.field("parkId"), args.id))
      .filter((q) => q.eq(q.field("status"), "active"))
      .first();

    if (!activeParkingLog) {
      return { parkingSpot, activeParkingLog: null, vehicle: null, space: null };
    }

    // Get vehicle details
    const vehicle = await ctx.db.get(activeParkingLog.vehicleId);

    // Get space details if vehicle is associated with a space
    let space = null;
    if (vehicle && vehicle.spaceId) {
      space = await ctx.db.get(vehicle.spaceId);
    }

    return {
      parkingSpot,
      activeParkingLog,
      vehicle,
      space,
    };
  },
});
