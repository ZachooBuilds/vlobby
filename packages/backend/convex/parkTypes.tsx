import { mutation, query } from "./_generated/server";
import { v } from "convex/values";

// Define the park type schema for Convex
const pricingConditionSchema = v.object({
  _id: v.optional(v.string()),
  startMinutes: v.number(),
  endMinutes: v.union(v.number(), v.null()),
  interval: v.number(),
  rate: v.number(),
  isFinalCondition: v.boolean(),
});

const parkTypeSchema = {
  name: v.string(),
  description: v.optional(v.string()),
  pricingConditions: v.array(pricingConditionSchema),
};

export const upsertParkType = mutation({
  args: {
    _id: v.optional(v.id("parkTypes")),
    ...parkTypeSchema,
  },
  handler: async (ctx, args) => {
    const identity = await ctx.auth.getUserIdentity();
    if (!identity) throw new Error("Unauthenticated");
    const orgId = identity.orgId;

    let result: string;

    if (args._id) {
      // Update existing park type
      const existing = await ctx.db.get(args._id);
      if (!existing || existing.orgId !== orgId) {
        throw new Error("Park type not found or access denied");
      }
      await ctx.db.patch(args._id, {
        name: args.name,
        description: args.description,
        pricingConditions: args.pricingConditions,
      });
      result = args._id;

      // Log the update as an activity
      await ctx.db.insert("globalActivity", {
        title: "Park Type Updated",
        description: `Park type "${args.name}" has been updated.`,
        type: "Park Type Updated",
        entityId: args._id,
        orgId,
      });
    } else {
      // Insert new park type
      result = await ctx.db.insert("parkTypes", {
        ...args,
        orgId,
      });

      // Log the new park type as an activity
      await ctx.db.insert("globalActivity", {
        title: "Park Type Added",
        description: `New park type "${args.name}" was added to the system`,
        type: "Park Type Added",
        entityId: result,
        orgId,
      });
    }

    return result;
  },
});

export const remove = mutation({
  args: { id: v.id("parkTypes") },
  handler: async (ctx, args) => {
    const identity = await ctx.auth.getUserIdentity();
    if (!identity) throw new Error("Unauthenticated");
    const orgId = identity.orgId;

    const existing = await ctx.db.get(args.id);
    if (!existing || existing.orgId !== orgId) {
      throw new Error("Park type not found or access denied");
    }
    await ctx.db.delete(args.id);

    // Log the removal as an activity
    await ctx.db.insert("globalActivity", {
      title: "Park Type Removed",
      description: `Park type "${existing.name}" was removed from the system`,
      type: "Park Type Removed",
      entityId: args.id,
      orgId,
    });
  },
});

export const get = query({
  args: { id: v.id("parkTypes") },
  handler: async (ctx, args) => {
    const identity = await ctx.auth.getUserIdentity();
    if (!identity) throw new Error("Unauthenticated");
    const orgId = identity.orgId;

    const parkType = await ctx.db.get(args.id);
    if (!parkType || parkType.orgId !== orgId) {
      return null;
    }
    return parkType;
  },
});

export const getAll = query({
  handler: async (ctx) => {
    const identity = await ctx.auth.getUserIdentity();
    if (!identity) throw new Error("Unauthenticated");
    const orgId = identity.orgId;

    return await ctx.db
      .query("parkTypes")
      .filter((q) => q.eq(q.field("orgId"), orgId))
      .collect();
  },
});

export const getParkTypeForEdit = query({
  args: { id: v.id("parkTypes") },
  handler: async (ctx, args) => {
    const identity = await ctx.auth.getUserIdentity();
    if (!identity) throw new Error("Unauthenticated");
    const orgId = identity.orgId;

    const parkType = await ctx.db.get(args.id);
    if (!parkType || parkType.orgId !== orgId) {
      throw new Error("Park type not found or access denied");
    }

    return {
      _id: parkType._id,
      name: parkType.name,
      description: parkType.description,
      pricingConditions: parkType.pricingConditions,
    };
  },
});

export const getAllParkTypesValueLabelPair = query({
  handler: async (ctx) => {
    const identity = await ctx.auth.getUserIdentity();
    if (!identity) throw new Error("Unauthenticated");
    const orgId = identity.orgId;

    const rawData = await ctx.db
      .query("parkTypes")
      .filter((q) => q.eq(q.field("orgId"), orgId))
      .collect();

    return rawData.map((parkType) => ({
      value: parkType._id,
      label: parkType.name,
    }));
  },
});
