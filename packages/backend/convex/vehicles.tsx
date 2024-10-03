import { mutation, query } from "./_generated/server";
import { v } from "convex/values";

// Define the vehicle schema for Convex
const vehicleSchema = {
  rego: v.string(),
  make: v.string(),
  model: v.string(),
  color: v.string(),
  year: v.string(),
  spaceId: v.optional(v.string()),
  type: v.string(),
  drivers: v.optional(v.array(v.object({ id: v.string() }))),
  image: v.optional(
    v.array(
      v.object({
        url: v.string(),
        storageId: v.string(),
      }),
    ),
  ),
  availableTo: v.union(v.literal("space"), v.literal("specific")),
};

export const upsertVehicle = mutation({
  args: {
    _id: v.optional(v.id("vehicles")),
    ...vehicleSchema,
  },
  handler: async (ctx, args) => {
    const identity = await ctx.auth.getUserIdentity();
    if (!identity) throw new Error("Unauthenticated");
    const orgId = identity.orgId;

    let result: string;

    if (args._id) {
      // Update existing vehicle
      const existing = await ctx.db.get(args._id);
      if (!existing || existing.orgId !== orgId) {
        throw new Error("Vehicle not found or access denied");
      }
      await ctx.db.patch(args._id, {
        rego: args.rego,
        make: args.make,
        model: args.model,
        color: args.color,
        year: args.year,
        spaceId: args.spaceId,
        type: args.type,
        drivers: args.drivers,
        image: args.image,
        availableTo: args.availableTo,
      });
      result = args._id;

      // Log the update as an activity
      await ctx.db.insert("globalActivity", {
        title: "Vehicle Details Updated",
        description: `Vehicle details have been updated.`,
        type: "Details Updated",
        entityId: args._id,
        orgId,
      });
    } else {
      // Insert new vehicle
      result = await ctx.db.insert("vehicles", {
        ...args,
        orgId,
      });

      // Log the new vehicle as an activity
      await ctx.db.insert("globalActivity", {
        title: "Vehicle Added",
        description: `Vehicle was added to the system`,
        type: "Vehicle Added",
        entityId: result,
        orgId,
      });
    }

    return result;
  },
});

export const remove = mutation({
  args: { id: v.id("vehicles") },
  handler: async (ctx, args) => {
    const identity = await ctx.auth.getUserIdentity();
    if (!identity) throw new Error("Unauthenticated");
    const orgId = identity.orgId;

    const existing = await ctx.db.get(args.id);
    if (!existing || existing.orgId !== orgId) {
      throw new Error("Vehicle not found or access denied");
    }
    await ctx.db.delete(args.id);

    // Log the removal as an activity
    await ctx.db.insert("globalActivity", {
      title: "Vehicle Removed",
      description: `Vehicle was removed from the system`,
      type: "Vehicle Removed",
      entityId: args.id,
      orgId,
    });
  },
});

export const get = query({
  args: { id: v.id("vehicles") },
  handler: async (ctx, args) => {
    const identity = await ctx.auth.getUserIdentity();
    if (!identity) throw new Error("Unauthenticated");
    const orgId = identity.orgId;

    const vehicle = await ctx.db.get(args.id);
    if (!vehicle || vehicle.orgId !== orgId) {
      return null;
    }
    return vehicle;
  },
});

export const getAll = query({
  handler: async (ctx) => {
    const identity = await ctx.auth.getUserIdentity();
    if (!identity) throw new Error("Unauthenticated");
    const orgId = identity.orgId;

    return await ctx.db
      .query("vehicles")
      .filter((q) => q.eq(q.field("orgId"), orgId))
      .collect();
  },
});

export const getAllForSpace = query({
  args: { spaceId: v.id("spaces") },
  handler: async (ctx, args) => {
    const identity = await ctx.auth.getUserIdentity();
    if (!identity) throw new Error("Unauthenticated");
    const orgId = identity.orgId;

    return await ctx.db
      .query("vehicles")
      .filter((q) => 
        q.and(
          q.eq(q.field("orgId"), orgId),
          q.eq(q.field("spaceId"), args.spaceId)
        )
      )
      .collect();
  },
});

export const getVehicleForEdit = query({
  args: { id: v.id("vehicles") },
  handler: async (ctx, args) => {
    const identity = await ctx.auth.getUserIdentity();
    if (!identity) throw new Error("Unauthenticated");
    const orgId = identity.orgId;

    const vehicle = await ctx.db.get(args.id);
    if (!vehicle || vehicle.orgId !== orgId) {
      throw new Error("Vehicle not found or access denied");
    }

    return {
      _id: vehicle._id,
      rego: vehicle.rego,
      make: vehicle.make,
      model: vehicle.model,
      color: vehicle.color,
      year: vehicle.year,
      spaceId: vehicle.spaceId,
      type: vehicle.type,
      drivers: vehicle.drivers,
      image: vehicle.image,
      availableTo: vehicle.availableTo,
    };
  },
});



export const getAllForUser = query({
  handler: async (ctx) => {
    const identity = await ctx.auth.getUserIdentity();
    if (!identity) throw new Error('Unauthenticated');
    const userId = identity.subject;
    const orgId = identity.orgId;

    // Get the occupant
    const occupant = await ctx.db
      .query('users')
      .filter((q) =>
        q.and(q.eq(q.field('orgId'), orgId), q.eq(q.field('userId'), userId))
      )
      .first();

    if (!occupant) throw new Error('User is not an occupant');

    // Get user's spaces
    const userSpaces = await ctx.db
      .query('userSpaces')
      .filter((q) =>
        q.and(q.eq(q.field('orgId'), orgId), q.eq(q.field('userId'), userId))
      )
      .collect();

    const spaceIds = userSpaces.map((space) => space.spaceId);

    // Get all vehicles
    const allVehicles = await ctx.db
      .query('vehicles')
      .filter((q) => q.eq(q.field('orgId'), orgId))
      .collect();

    // Get active parking logs
    const activeParkingLogs = await ctx.db
      .query('parkingLogs')
      .filter((q) => 
        q.and(
          q.eq(q.field('orgId'), orgId),
          q.eq(q.field('status'), 'active')
        )
      )
      .collect();

    // Create a Set of parked vehicle IDs for quick lookup
    const parkedVehicleIds = new Set(activeParkingLogs.map(log => log.vehicleId));

    // Filter vehicles based on conditions and add parked status
    const userVehicles = allVehicles.filter((vehicle) => {
      if (vehicle.availableTo === 'space') {
        return spaceIds.includes(vehicle.spaceId);
      } else if (vehicle.availableTo === 'specific') {
        return vehicle.drivers.some((driver: { id: string }) => driver.id === occupant._id);
      }
      return false;
    }).map(vehicle => ({
      ...vehicle,
      isParked: parkedVehicleIds.has(vehicle._id)
    }));

    return userVehicles;
  },
});

export const getAllVehicleValueLabelPair = query({
  args: { isDropoff: v.optional(v.boolean()) },
  handler: async (ctx, args) => {
    const identity = await ctx.auth.getUserIdentity();
    if (!identity) throw new Error("Unauthenticated");
    const orgId = identity.orgId;

    const vehicles = await ctx.db
      .query("vehicles")
      .filter((q) => q.eq(q.field("orgId"), orgId))
      .collect();

    const activeRequests = await ctx.db
      .query("requests")
      .filter((q) => q.eq(q.field("orgId"), orgId))
      .filter((q) => q.neq(q.field("status"), "completed"))
      .collect();

    const activeParkingLogs = await ctx.db
      .query("parkingLogs")
      .filter((q) => q.eq(q.field("orgId"), orgId))
      .filter((q) => q.eq(q.field("status"), "active"))
      .collect();

    const activeVehicleIds = new Set([
      ...activeRequests.map(r => r.vehicleId),
      ...activeParkingLogs.map(l => l.vehicleId)
    ]);

    let filteredVehicles = vehicles;
    if (args.isDropoff !== undefined) {
      filteredVehicles = vehicles.filter(vehicle => 
        args.isDropoff ? !activeVehicleIds.has(vehicle._id) : activeVehicleIds.has(vehicle._id)
      );
    }

    return filteredVehicles.map((vehicle) => ({
      value: vehicle._id,
      label: `${vehicle.make} ${vehicle.model} ${vehicle.rego}`,
    }));
  },
});
