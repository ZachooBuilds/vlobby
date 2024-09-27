import { mutation, query } from "./_generated/server";
import { v } from "convex/values";

export const upsertContractor = mutation({
  args: {
    _id: v.optional(v.id("contractors")),
    firstName: v.string(),
    lastName: v.string(),
    companyName: v.string(),
    email: v.string(),
    phone: v.string(),
    notes: v.optional(v.string()),
    preferredServiceCategories: v.array(
      v.object({
        value: v.string(),
        label: v.string(),
      }),
    ),
  },
  handler: async (ctx, args) => {
    const identity = await ctx.auth.getUserIdentity();
    if (!identity) throw new Error("Unauthenticated");
    const orgId = identity.orgId;

    let result: string;

    if (args._id) {
      // Update existing contractor
      const existing = await ctx.db.get(args._id);
      if (!existing || existing.orgId !== orgId) {
        throw new Error("Contractor not found or access denied");
      }
      await ctx.db.patch(args._id, {
        firstName: args.firstName,
        lastName: args.lastName,
        companyName: args.companyName,
        email: args.email,
        phone: args.phone,
        notes: args.notes,
        preferredServiceCategories: args.preferredServiceCategories,
      });
      result = args._id;

      // Log the update as an activity
      await ctx.db.insert("globalActivity", {
        title: "Contractor Details Updated",
        description: `Contractor details have been updated.`,
        type: "Details Updated",
        entityId: args._id,
        orgId,
      });
    } else {
      // Insert new contractor
      result = await ctx.db.insert("contractors", {
        firstName: args.firstName,
        lastName: args.lastName,
        companyName: args.companyName,
        email: args.email,
        phone: args.phone,
        notes: args.notes,
        preferredServiceCategories: args.preferredServiceCategories,
        orgId,
      });

      // Log the new contractor as an activity
      await ctx.db.insert("globalActivity", {
        title: "Contractor Added",
        description: `Contractor was added to the system`,
        type: "Contractor Added",
        entityId: result,
        orgId,
      });
    }

    return result;
  },
});

export const getAllContractorsValueLabelPair = query({
  handler: async (ctx) => {
    const identity = await ctx.auth.getUserIdentity();
    if (!identity) throw new Error("Unauthenticated");
    const orgId = identity.orgId;

    const rawData = await ctx.db
      .query("contractors")
      .filter((q) => q.eq(q.field("orgId"), orgId))
      .collect();

    return rawData.map((contractor) => ({
      value: contractor._id,
      label: `${contractor.firstName} ${contractor.lastName} - ${contractor.companyName}`,
    }));
  },
});

export const remove = mutation({
  args: { id: v.id("contractors") },
  handler: async (ctx, args) => {
    const identity = await ctx.auth.getUserIdentity();
    if (!identity) throw new Error("Unauthenticated");
    const orgId = identity.orgId;

    const existing = await ctx.db.get(args.id);
    if (!existing || existing.orgId !== orgId) {
      throw new Error("Contractor not found or access denied");
    }
    await ctx.db.delete(args.id);

    // Log the removal as an activity
    await ctx.db.insert("globalActivity", {
      title: "Contractor Removed",
      description: `Contractor was removed from the system`,
      type: "Contractor Removed",
      entityId: args.id,
      orgId,
    });
  },
});

export const get = query({
  args: { id: v.id("contractors") },
  handler: async (ctx, args) => {
    const identity = await ctx.auth.getUserIdentity();
    if (!identity) throw new Error("Unauthenticated");
    const orgId = identity.orgId;

    const contractor = await ctx.db.get(args.id);
    if (!contractor || contractor.orgId !== orgId) {
      return null;
    }
    return contractor;
  },
});

export const getAll = query({
  handler: async (ctx) => {
    const identity = await ctx.auth.getUserIdentity();
    if (!identity) throw new Error("Unauthenticated");
    const orgId = identity.orgId;

    return await ctx.db
      .query("contractors")
      .filter((q) => q.eq(q.field("orgId"), orgId))
      .collect();
  },
});

export const getContractorForEdit = query({
  args: { id: v.id("contractors") },
  handler: async (ctx, args) => {
    const identity = await ctx.auth.getUserIdentity();
    if (!identity) throw new Error("Unauthenticated");
    const orgId = identity.orgId;

    const contractor = await ctx.db.get(args.id);
    if (!contractor || contractor.orgId !== orgId) {
      throw new Error("Contractor not found or access denied");
    }

    return {
      _id: contractor._id,
      firstName: contractor.firstName,
      lastName: contractor.lastName,
      companyName: contractor.companyName,
      email: contractor.email,
      phone: contractor.phone,
      notes: contractor.notes,
      preferredServiceCategories: contractor.preferredServiceCategories,
    };
  },
});
