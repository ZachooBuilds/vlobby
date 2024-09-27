import { Id } from "./_generated/dataModel";
import { mutation, query } from "./_generated/server";
import { v } from "convex/values";

export const upsertKeyType = mutation({
  args: {
    id: v.optional(v.id("keyTypes")),
    name: v.string(),
    description: v.string(),
  },
  handler: async (ctx, args) => {
    const identity = await ctx.auth.getUserIdentity();
    if (!identity) throw new Error("Unauthenticated");
    const orgId = identity.orgId;

    if (args.id) {
      // Update existing key type
      const existing = await ctx.db.get(args.id);
      if (!existing || existing.orgId !== orgId) {
        throw new Error("Key type not found or access denied");
      }
      await ctx.db.patch(args.id, {
        name: args.name,
        description: args.description,
      });
      return args.id;
    } else {
      // Insert new key type
      return await ctx.db.insert("keyTypes", {
        name: args.name,
        description: args.description,
        orgId,
      });
    }
  },
});

export const removeKeyType = mutation({
  args: { id: v.id("keyTypes") },
  handler: async (ctx, args) => {
    const identity = await ctx.auth.getUserIdentity();
    if (!identity) throw new Error("Unauthenticated");
    const orgId = identity.orgId;

    const existing = await ctx.db.get(args.id);
    if (!existing || existing.orgId !== orgId) {
      throw new Error("Key type not found or access denied");
    }
    await ctx.db.delete(args.id);
  },
});

export const getKeyType = query({
  args: { id: v.id("keyTypes") },
  handler: async (ctx, args) => {
    const identity = await ctx.auth.getUserIdentity();
    if (!identity) throw new Error("Unauthenticated");
    const orgId = identity.orgId;

    const keyType = await ctx.db.get(args.id);
    if (!keyType || keyType.orgId !== orgId) {
      return null;
    }
    return keyType;
  },
});

export const getAllKeyTypes = query({
  handler: async (ctx) => {
    const identity = await ctx.auth.getUserIdentity();
    if (!identity) throw new Error("Unauthenticated");
    const orgId = identity.orgId;

    return await ctx.db
      .query("keyTypes")
      .filter((q) => q.eq(q.field("orgId"), orgId))
      .collect();
  },
});

export const getAllKeyTypesValueLabelPair = query({
  handler: async (ctx) => {
    const identity = await ctx.auth.getUserIdentity();
    if (!identity) throw new Error("Unauthenticated");
    const orgId = identity.orgId;

    const rawData = await ctx.db
      .query("keyTypes")
      .filter((q) => q.eq(q.field("orgId"), orgId))
      .collect();

    return rawData.map((keyType) => ({
      value: keyType._id,
      label: keyType.name,
    }));
  },
});

export const getAllKeysValueLabelPair = query({
  handler: async (ctx) => {
    const identity = await ctx.auth.getUserIdentity();
    if (!identity) throw new Error("Unauthenticated");
    const orgId = identity.orgId;

    const rawData = await ctx.db
      .query("keys")
      .filter((q) =>
        q.and(q.eq(q.field("orgId"), orgId), q.neq(q.field("isOutKey"), true)),
      )
      .collect();

    return rawData.map((key) => ({
      value: key._id,
      label: key.keyId,
    }));
  },
});

// Upsert a key entry
export const upsertKey = mutation({
  args: {
    _id: v.optional(v.id("keys")),
    keyId: v.string(),
    keyTypeId: v.string(),
    notes: v.string(),
    spaceId: v.optional(v.string()),
  },
  handler: async (ctx, args) => {
    const identity = await ctx.auth.getUserIdentity();
    if (!identity) throw new Error("Unauthenticated");
    const orgId = identity.orgId;

    const { _id, ...data } = args;
    if (_id) {
      const existing = await ctx.db.get(_id);
      if (!existing || existing.orgId !== orgId) {
        throw new Error("Key not found or access denied");
      }
      await ctx.db.patch(_id, data);
      return _id;
    } else {
      return await ctx.db.insert("keys", { ...data, orgId, isOutKey: false });
    }
  },
});

// Get a single key entry
export const getKey = query({
  args: { _id: v.id("keys") },
  handler: async (ctx, args) => {
    const identity = await ctx.auth.getUserIdentity();
    if (!identity) throw new Error("Unauthenticated");
    const orgId = identity.orgId;

    const key = await ctx.db.get(args._id);
    if (!key || key.orgId !== orgId) {
      return null;
    }
    return key;
  },
});

// Get a single key entry
export const returnKey = mutation({
  args: { _id: v.id("keys") },
  handler: async (ctx, args) => {
    const identity = await ctx.auth.getUserIdentity();
    if (!identity) throw new Error("Unauthenticated");
    const orgId = identity.orgId;

    const key = await ctx.db.get(args._id);
    if (!key || key.orgId !== orgId) {
      return null;
    }

    await ctx.db.patch(args._id, { isOutKey: false });
    return key;
  },
});

// Get all key entries
export const getAllKeys = query({
  handler: async (ctx) => {
    const identity = await ctx.auth.getUserIdentity();
    if (!identity) throw new Error("Unauthenticated");
    const orgId = identity.orgId;

    const keys = await ctx.db
      .query("keys")
      .filter((q) => q.eq(q.field("orgId"), orgId))
      .collect();

    const keysWithDetails = await Promise.all(
      keys.map(async (key) => {
        let spaceName = null;
        if (key.spaceId) {
          const space = await ctx.db.get(key.spaceId);
          spaceName = space?.spaceName;
        }

        let keyTypeName = null;
        if (key.keyTypeId) {
          const keyType = await ctx.db.get(key.keyTypeId);
          keyTypeName = keyType?.name;
        }

        return { ...key, spaceName, keyTypeName };
      }),
    );

    return keysWithDetails;
  },
});

// Remove a key entry
export const removeKey = mutation({
  args: { _id: v.id("keys") },
  handler: async (ctx, args) => {
    const identity = await ctx.auth.getUserIdentity();
    if (!identity) throw new Error("Unauthenticated");
    const orgId = identity.orgId;

    const existing = await ctx.db.get(args._id);
    if (!existing || existing.orgId !== orgId) {
      throw new Error("Key not found or access denied");
    }
    await ctx.db.delete(args._id);
  },
});

// Modify the existing upsertKey mutation
export const upsertKeyLog = mutation({
  args: {
    _id: v.optional(v.id("keys")),
    keyId: v.string(),
    notes: v.optional(v.string()),
    spaceId: v.optional(v.id("spaces")),
    connectedUser: v.optional(v.string()),
    userType: v.optional(
      v.union(
        v.literal("Visitor"),
        v.literal("Contractor"),
        v.literal("Occupant"),
      ),
    ),
    checkoutTime: v.string(),
    checkoutByUserId: v.optional(v.string()),
    checkinTime: v.optional(v.string()),
    expectedCheckinTime: v.optional(v.string()),
    isReturned: v.boolean(),
  },
  handler: async (ctx, args) => {
    const identity = await ctx.auth.getUserIdentity();
    if (!identity) throw new Error("Unauthenticated");
    const orgId = identity.orgId;
    const userId = identity.userId;

    const { _id, ...data } = args;
    if (_id) {
      const existing = await ctx.db.get(_id);
      if (!existing || existing.orgId !== orgId) {
        throw new Error("Key not found or access denied");
      }
      await ctx.db.patch(_id, data);
      return _id;
    } else {
      return await ctx.db.insert("keyLogs", {
        ...data,
        orgId,
        checkoutByUserId: userId,
      });
    }
  },
});

export const handleKeyReturned = mutation({
  args: { _id: v.id("keyLogs") , checkinTime: v.string() },
  handler: async (ctx, args) => {
    const identity = await ctx.auth.getUserIdentity();
    if (!identity) throw new Error("Unauthenticated");
    const orgId = identity.orgId;

    await ctx.db.patch(args._id, { isReturned: true, checkinTime: args.checkinTime });
  },
});

// Add a new query to get all checked out keys
export const getCheckedOutKeys = query({
  handler: async (ctx) => {
    const identity = await ctx.auth.getUserIdentity();
    if (!identity) throw new Error("Unauthenticated");
    const orgId = identity.orgId;

    const keys = await ctx.db
      .query("keyLogs")
      .filter((q) =>
        q.and(
          q.eq(q.field("orgId"), orgId),
          q.eq(q.field("isReturned"), false),
        ),
      )
      .collect();

    console.log("Keys Data:", keys);

    const keysWithDetails = await Promise.all(
      keys.map(async (key) => {
        const space = key.spaceId ? await ctx.db.get(key.spaceId) : null;
        const keyData = await ctx.db.get(key.keyId);
        const keyType = keyData ? await ctx.db.get(keyData.keyTypeId) : null;

        let userName = key.connectedUser;
        if (key.userType === "Occupant") {
          const occupant = await ctx.db.get(key.connectedUser);
          userName = occupant
            ? `${occupant.firstName} ${occupant.lastName}`
            : "Unknown Occupant";
        } else if (key.userType === "Contractor") {
          const contractor = await ctx.db.get(key.connectedUser);
          userName = contractor
            ? `${contractor.firstName} ${contractor.lastName} (${contractor.companyName})`
            : "Unknown Contractor";
        }

        return {
          ...key,
          spaceName: space ? space.spaceName : "Not Set",
          keyId: keyData ? keyData.keyId : "Error Loading Key",
          keyTypeName: keyType ? keyType.name : "Error Loading Key Type",
          connectedUser: userName,
        };
      }),
    );

    return keysWithDetails;
  },
});
