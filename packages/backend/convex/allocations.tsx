import { mutation, query } from "./_generated/server";
import { v } from "convex/values";

// Define the allocation schema for Convex
const allocationSchema = {
  name: v.string(),
  description: v.optional(v.string()),
  allocatedParks: v.number(),
  parkTypeId: v.optional(v.id("parkTypes")),
  spaceId: v.optional(v.string()),
  rentedSpaceId: v.optional(v.string()),
};

export const upsertAllocation = mutation({
  args: {
    _id: v.optional(v.id("allocations")),
    ...allocationSchema,
  },
  handler: async (ctx, args) => {
    console.log(args);
    const identity = await ctx.auth.getUserIdentity();
    if (!identity) throw new Error("Unauthenticated");
    const orgId = identity.orgId;

    let result: string;

    if (args._id) {
      // Update existing allocation
      const existing = await ctx.db.get(args._id);
      if (!existing || existing.orgId !== orgId) {
        throw new Error("Allocation not found or access denied");
      }
      await ctx.db.patch(args._id, {
        name: args.name,
        description: args.description,
        allocatedParks: args.allocatedParks,
        parkTypeId: args.parkTypeId,
        spaceId: args.spaceId,
        rentedSpaceId: args.rentedSpaceId,
      });
      result = args._id;

      // Log the update as an activity
      await ctx.db.insert("globalActivity", {
        title: "Allocation Details Updated",
        description: `Allocation details have been updated.`,
        type: "Details Updated",
        entityId: args._id,
        orgId,
      });
    } else {
      // Insert new allocation
      result = await ctx.db.insert("allocations", {
        ...args,
        orgId,
      });

      // Log the new allocation as an activity
      await ctx.db.insert("globalActivity", {
        title: "Allocation Added",
        description: `Allocation was added to the system`,
        type: "Allocation Added",
        entityId: result,
        orgId,
      });
    }

    return result;
  },
});

export const remove = mutation({
  args: { id: v.id("allocations") },
  handler: async (ctx, args) => {
    const identity = await ctx.auth.getUserIdentity();
    if (!identity) throw new Error("Unauthenticated");
    const orgId = identity.orgId;

    const existing = await ctx.db.get(args.id);
    if (!existing || existing.orgId !== orgId) {
      throw new Error("Allocation not found or access denied");
    }
    await ctx.db.delete(args.id);

    // Log the removal as an activity
    await ctx.db.insert("globalActivity", {
      title: "Allocation Removed",
      description: `Allocation was removed from the system`,
      type: "Allocation Removed",
      entityId: args.id,
      orgId,
    });
  },
});

export const get = query({
  args: { id: v.id("allocations") },
  handler: async (ctx, args) => {
    const identity = await ctx.auth.getUserIdentity();
    if (!identity) throw new Error("Unauthenticated");
    const orgId = identity.orgId;

    const allocation = await ctx.db.get(args.id);
    if (!allocation || allocation.orgId !== orgId) {
      return null;
    }
    return allocation;
  },
});

export const getAll = query({
  handler: async (ctx) => {
    const identity = await ctx.auth.getUserIdentity();
    if (!identity) throw new Error("Unauthenticated");
    const orgId = identity.orgId;

    return await ctx.db
      .query("allocations")
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
      .query("allocations")
      .filter((q) => 
        q.and(
          q.eq(q.field("orgId"), orgId),
          q.eq(q.field("spaceId"), args.spaceId)
        )
      )
      .collect();
  },
});

export const getAllocationForEdit = query({
  args: { id: v.id("allocations") },
  handler: async (ctx, args) => {
    const identity = await ctx.auth.getUserIdentity();
    if (!identity) throw new Error("Unauthenticated");
    const orgId = identity.orgId;

    const allocation = await ctx.db.get(args.id);
    if (!allocation || allocation.orgId !== orgId) {
      throw new Error("Allocation not found or access denied");
    }

    return {
      _id: allocation._id,
      name: allocation.name,
      description: allocation.description,
      allocatedParks: allocation.allocatedParks,
      spaceId: allocation.spaceId,
      rentedSpaceId: allocation.rentedSpaceId,
    };
  },
});

export const getAllocationsForVehicle = query({
  args: {
    vehicleId: v.id("vehicles"),
  },
  handler: async (ctx, args) => {
    const identity = await ctx.auth.getUserIdentity();
    if (!identity) throw new Error("Unauthenticated");
    const orgId = identity.orgId;

    // Get the vehicle
    const vehicle = await ctx.db.get(args.vehicleId);
    if (!vehicle || vehicle.orgId !== orgId) {
      throw new Error("Vehicle not found or access denied");
    }

    let allocations = [];

    if (vehicle.availableTo === "space") {
      // If available to whole space, get allocations for that space
      allocations = await ctx.db
        .query("allocations")
        .filter((q) =>
          q.and(
            q.eq(q.field("orgId"), orgId),
            q.eq(q.field("spaceId"), vehicle.spaceId),
          ),
        )
        .collect();
    } else if (vehicle.availableTo === "specific" && vehicle.drivers) {
      console.log("Vehicle available to specific drivers:", vehicle.drivers);
      // If available to specific drivers, get allocations for their spaces
      const drivers = await ctx.db
        .query("users")
        .filter((q) =>
          q.and(
            q.eq(q.field("orgId"), orgId),
            q.or(
              ...vehicle.drivers.map((driver: { id: string }) =>
                q.eq(q.field("_id"), driver.id),
              ),
            ),
          ),
        )
        .collect();

      console.log("Drivers:", drivers);

      const driverSpaces = await ctx.db
        .query("userSpaces")
        .filter((q) =>
          q.and(
            q.eq(q.field("orgId"), orgId),
            q.or(
              ...drivers.map((driver) =>
                q.eq(q.field("userId"), driver.userId),
              ),
            ),
          ),
        )
        .collect();

      console.log("Driver spaces found:", driverSpaces);

      const driverSpaceIds = driverSpaces.map((space) => space.spaceId);

      allocations = await ctx.db
        .query("allocations")
        .filter((q) =>
          q.and(
            q.eq(q.field("orgId"), orgId),
            q.or(...driverSpaceIds.map((id) => q.eq(q.field("spaceId"), id))),
          ),
        )
        .collect();
    }

    // console.log("Allocations found:", allocations);

    // Fetch park type information for each allocation
    const allocationsWithParkType = await Promise.all(
      allocations.map(async (allocation) => {
        if (allocation.parkTypeId) {
          const parkType = await ctx.db.get(allocation.parkTypeId);
          return {
            ...allocation,
            parkTypeName: parkType ? parkType.name : "Unknown",
          };
        }
        return {
          ...allocation,
          parkTypeName: "Not specified",
        };
      }),
    );

    // console.log("Allocations with park type:", allocationsWithParkType);

    return allocationsWithParkType;
  },
});
