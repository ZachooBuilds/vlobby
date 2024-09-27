import { mutation, query } from "./_generated/server";
import { v } from "convex/values";

export const upsertOperator = mutation({
  args: {
    _id: v.optional(v.id("operators")),
    userId: v.string(),
    firstName: v.string(),
    lastName: v.string(),
    email: v.string(),
  },
  handler: async (ctx, args) => {
    const identity = await ctx.auth.getUserIdentity();
    if (!identity) throw new Error("Unauthenticated");
    const orgId = identity.orgId;

    let result: string;

    if (args._id) {
      // Update existing operator
      const existing = await ctx.db.get(args._id);
      if (!existing || existing.orgId !== orgId) {
        throw new Error("Operator not found or access denied");
      }
      await ctx.db.patch(args._id, {
        userId: args.userId,
        firstName: args.firstName,
        lastName: args.lastName,
        email: args.email,
      });
      result = args._id;

      // Log the update as an activity
      await ctx.db.insert("globalActivity", {
        title: "Operator Details Updated",
        description: `Operator details have been updated.`,
        type: "Details Updated",
        entityId: args._id,
        orgId,
      });
    } else {
      // Insert new operator
      result = await ctx.db.insert("operators", {
        userId: args.userId,
        firstName: args.firstName,
        lastName: args.lastName,
        email: args.email,
        orgId,
      });

      // Log the new operator as an activity
      await ctx.db.insert("globalActivity", {
        title: "Operator Added",
        description: `Operator was added to the system`,
        type: "Operator Added",
        entityId: result,
        orgId,
      });
    }

    return result;
  },
});

export const getAllOperatorsValueLabelPair = query({
  handler: async (ctx) => {
    const identity = await ctx.auth.getUserIdentity();
    if (!identity) throw new Error("Unauthenticated");
    const orgId = identity.orgId;

    const rawData = await ctx.db
      .query("operators")
      .filter((q) => q.eq(q.field("orgId"), orgId))
      .collect();

    return rawData.map((operator) => ({
      value: operator._id,
      label: `${operator.firstName} ${operator.lastName}`,
    }));
  },
});

export const remove = mutation({
  args: { id: v.id("operators") },
  handler: async (ctx, args) => {
    const identity = await ctx.auth.getUserIdentity();
    if (!identity) throw new Error("Unauthenticated");
    const orgId = identity.orgId;

    const existing = await ctx.db.get(args.id);
    if (!existing || existing.orgId !== orgId) {
      throw new Error("Operator not found or access denied");
    }
    await ctx.db.delete(args.id);

    // Log the removal as an activity
    await ctx.db.insert("globalActivity", {
      title: "Operator Removed",
      description: `Operator was removed from the system`,
      type: "Operator Removed",
      entityId: args.id,
      orgId,
    });
  },
});

export const get = query({
  args: { id: v.id("operators") },
  handler: async (ctx, args) => {
    const identity = await ctx.auth.getUserIdentity();
    if (!identity) throw new Error("Unauthenticated");
    const orgId = identity.orgId;

    const operator = await ctx.db.get(args.id);
    if (!operator || operator.orgId !== orgId) {
      return null;
    }
    return operator;
  },
});

export const getAll = query({
  handler: async (ctx) => {
    const identity = await ctx.auth.getUserIdentity();
    if (!identity) throw new Error("Unauthenticated");
    const orgId = identity.orgId;

    return await ctx.db
      .query("operators")
      .filter((q) => q.eq(q.field("orgId"), orgId))
      .collect();
  },
});

export const getOperatorForEdit = query({
  args: { id: v.id("operators") },
  handler: async (ctx, args) => {
    const identity = await ctx.auth.getUserIdentity();
    if (!identity) throw new Error("Unauthenticated");
    const orgId = identity.orgId;

    const operator = await ctx.db.get(args.id);
    if (!operator || operator.orgId !== orgId) {
      throw new Error("Operator not found or access denied");
    }

    return {
      _id: operator._id,
      userId: operator.userId,
      firstName: operator.firstName,
      lastName: operator.lastName,
      email: operator.email,
    };
  },
});
