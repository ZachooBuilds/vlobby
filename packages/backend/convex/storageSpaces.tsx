import { mutation, query } from "./_generated/server";
import { v } from "convex/values";

export const upsertStorage = mutation({
  args: {
    _id: v.optional(v.id("storage")),
    type: v.string(),
    name: v.string(),
    description: v.string(),
    spaceId: v.optional(v.id("spaces")),
    status: v.string(),
    notes: v.optional(v.string()),
  },
  handler: async (ctx, args) => {
    const identity = await ctx.auth.getUserIdentity();
    if (!identity) throw new Error("Unauthenticated");
    const orgId = identity.orgId;

    let result: string;

    if (args._id) {
      // Update existing storage
      const existing = await ctx.db.get(args._id);
      if (!existing || existing.orgId !== orgId) {
        throw new Error("Storage not found or access denied");
      }
      await ctx.db.patch(args._id, {
        type: args.type,
        name: args.name,
        description: args.description,
        spaceId: args.spaceId,
        status: args.status,
        notes: args.notes,
      });
      result = args._id;

      // Log the update as an activity
      await ctx.db.insert("globalActivity", {
        title: "Storage Details Updated",
        description: `Storage details have been updated.`,
        type: "Details Updated",
        entityId: args._id,
        orgId,
      });
    } else {
      // Insert new storage
      result = await ctx.db.insert("storage", {
        type: args.type,
        name: args.name,
        description: args.description,
        spaceId: args.spaceId,
        status: args.status,
        notes: args.notes,
        orgId,
      });

      // Log the new storage as an activity
      await ctx.db.insert("globalActivity", {
        title: "Storage Added",
        description: `Storage was added to the system`,
        type: "Storage Added",
        entityId: result,
        orgId,
      });
    }

    return result;
  },
});

export const remove = mutation({
  args: { id: v.id("storage") },
  handler: async (ctx, args) => {
    const identity = await ctx.auth.getUserIdentity();
    if (!identity) throw new Error("Unauthenticated");
    const orgId = identity.orgId;

    const existing = await ctx.db.get(args.id);
    if (!existing || existing.orgId !== orgId) {
      throw new Error("Storage not found or access denied");
    }
    await ctx.db.delete(args.id);

    // Log the removal as an activity
    await ctx.db.insert("globalActivity", {
      title: "Storage Removed",
      description: `Storage was removed from the system`,
      type: "Storage Removed",
      entityId: args.id,
      orgId,
    });
  },
});

export const get = query({
  args: { id: v.id("storage") },
  handler: async (ctx, args) => {
    const identity = await ctx.auth.getUserIdentity();
    if (!identity) throw new Error("Unauthenticated");
    const orgId = identity.orgId;

    const storage = await ctx.db.get(args.id);
    if (!storage || storage.orgId !== orgId) {
      return null;
    }
    return storage;
  },
});

export const getAll = query({
  handler: async (ctx) => {
    const identity = await ctx.auth.getUserIdentity();
    if (!identity) throw new Error("Unauthenticated");
    const orgId = identity.orgId;

    const storageItems = await ctx.db
      .query("storage")
      .filter((q) => q.eq(q.field("orgId"), orgId))
      .collect();

    const storageWithSpaceNames = await Promise.all(
      storageItems.map(async (item) => {
        let spaceName = null;
        if (item.spaceId) {
          const space = await ctx.db.get(item.spaceId);
          spaceName = space ? space.spaceName : null;
        }
        return { ...item, spaceName };
      }),
    );

    return storageWithSpaceNames;
  },
});

export const getStorageForEdit = query({
  args: { id: v.id("storage") },
  handler: async (ctx, args) => {
    const identity = await ctx.auth.getUserIdentity();
    if (!identity) throw new Error("Unauthenticated");
    const orgId = identity.orgId;

    const storage = await ctx.db.get(args.id);
    if (!storage || storage.orgId !== orgId) {
      throw new Error("Storage not found or access denied");
    }

    return {
      _id: storage._id,
      type: storage.type,
      name: storage.name,
      description: storage.description,
      spaceId: storage.spaceId,
      status: storage.status,
      notes: storage.notes,
    };
  },
});
