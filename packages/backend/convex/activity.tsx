import { Id } from "./_generated/dataModel";
import { mutation, query } from "./_generated/server";
import { v } from "convex/values";

export const upsertGlobalActivity = mutation({
  args: {
    _id: v.optional(v.id("globalNotes")),
    title: v.string(),
    description: v.string(),
    type: v.string(),
    entityId: v.string(),
  },
  handler: async (ctx, args) => {
    const identity = await ctx.auth.getUserIdentity();
    if (!identity) throw new Error("Unauthenticated");
    const orgId = identity.orgId;
    const author = identity.name;
    const authorId = identity.userId;

    const activityData = {
      title: args.title,
      description: args.description,
      type: args.type,
      entityId: args.entityId,
      orgId,
      author,
      authorId,
    };

    if (args._id) {
      const existing = await ctx.db.get(args._id);
      if (!existing || existing.orgId !== orgId) {
        throw new Error("Note not found or access denied");
      }
      await ctx.db.patch(args._id, activityData);
      return args._id;
    } else {
      return await ctx.db.insert("globalActivity", activityData);
    }
  },
});

export const getEntityActivity = query({
  args: { entityId: v.string(), isUserActivity: v.optional(v.boolean()) },
  handler: async (ctx, args) => {
    const identity = await ctx.auth.getUserIdentity();
    if (!identity) throw new Error("Unauthenticated");
    const orgId = identity.orgId;

    const activities = await ctx.db
      .query("globalActivity")
      .filter((q) => q.eq(q.field("entityId"), args.entityId))
      .filter((q) => q.eq(q.field("orgId"), orgId))
      .order("desc")
      .collect();

    return activities;
  },
});
