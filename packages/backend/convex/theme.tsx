import { Id } from "./_generated/dataModel";
import { mutation, query } from "./_generated/server";
import { v } from "convex/values";

export const generateBannerUploadUrl = mutation(async (ctx) => {
  const identity = await ctx.auth.getUserIdentity();
  if (!identity) throw new Error("Unauthenticated");
  return await ctx.storage.generateUploadUrl();
});

export const uploadBannerImage = mutation({
  args: {
    storageId: v.id("_storage"),
    oldStorageId: v.optional(v.id("_storage")),
  },
  handler: async (ctx, args) => {
    const identity = await ctx.auth.getUserIdentity();
    if (!identity) throw new Error("Unauthenticated");
    const orgId = identity.orgId;

    // If there's an old storage ID, delete it
    if (args.oldStorageId) {
      await ctx.storage.delete(args.oldStorageId);
    }

    // Find the existing banner image entry
    const existingBanner = await ctx.db
      .query("bannerImages")
      .filter((q) => q.eq(q.field("orgId"), orgId))
      .unique();

    if (existingBanner) {
      // Update the existing entry
      await ctx.db.patch(existingBanner._id, { storageId: args.storageId });
    } else {
      // Create a new entry
      await ctx.db.insert("bannerImages", {
        orgId,
        storageId: args.storageId,
      });
    }

    return { success: true };
  },
});

export const getBannerImage = query({
  args: {},
  handler: async (ctx) => {
    const identity = await ctx.auth.getUserIdentity();
    if (!identity) throw new Error("Unauthenticated");
    const orgId = identity.orgId;

    const bannerImage = await ctx.db
      .query("bannerImages")
      .filter((q) => q.eq(q.field("orgId"), orgId))
      .order("desc")
      .first();
    if (!bannerImage) return null;

    const url = await ctx.storage.getUrl(
      bannerImage.storageId as Id<"_storage">,
    );
    return { ...bannerImage, url };
  },
});

export const generateLogoUploadUrl = mutation(async (ctx) => {
  const identity = await ctx.auth.getUserIdentity();
  if (!identity) throw new Error("Unauthenticated");
  return await ctx.storage.generateUploadUrl();
});

export const uploadLogoImage = mutation({
  args: {
    storageId: v.id("_storage"),
    oldStorageId: v.optional(v.id("_storage")),
  },
  handler: async (ctx, args) => {
    const identity = await ctx.auth.getUserIdentity();
    if (!identity) throw new Error("Unauthenticated");
    const orgId = identity.orgId;

    // If there's an old storage ID, delete it
    if (args.oldStorageId) {
      await ctx.storage.delete(args.oldStorageId);
    }

    // Find the existing logo image entry
    const existingLogo = await ctx.db
      .query("logoImages")
      .filter((q) => q.eq(q.field("orgId"), orgId))
      .unique();

    if (existingLogo) {
      // Update the existing entry
      await ctx.db.patch(existingLogo._id, { storageId: args.storageId });
    } else {
      // Create a new entry
      await ctx.db.insert("logoImages", {
        orgId,
        storageId: args.storageId,
      });
    }

    return { success: true };
  },
});

export const getLogoImage = query({
  args: {},
  handler: async (ctx) => {
    const identity = await ctx.auth.getUserIdentity();
    if (!identity) throw new Error("Unauthenticated");
    const orgId = identity.orgId;

    const logoImage = await ctx.db
      .query("logoImages")
      .filter((q) => q.eq(q.field("orgId"), orgId))
      .order("desc")
      .first();
    if (!logoImage) return null;

    const url = await ctx.storage.getUrl(logoImage.storageId as Id<"_storage">);
    return { ...logoImage, url };
  },
});

export const generateIconUploadUrl = mutation(async (ctx) => {
  const identity = await ctx.auth.getUserIdentity();
  if (!identity) throw new Error("Unauthenticated");
  return await ctx.storage.generateUploadUrl();
});

export const uploadIconImage = mutation({
  args: {
    storageId: v.id("_storage"),
    oldStorageId: v.optional(v.id("_storage")),
  },
  handler: async (ctx, args) => {
    const identity = await ctx.auth.getUserIdentity();
    if (!identity) throw new Error("Unauthenticated");
    const orgId = identity.orgId;

    // If there's an old storage ID, delete it
    if (args.oldStorageId) {
      await ctx.storage.delete(args.oldStorageId);
    }

    // Find the existing icon image entry
    const existingIcon = await ctx.db
      .query("iconImages")
      .filter((q) => q.eq(q.field("orgId"), orgId))
      .unique();

    if (existingIcon) {
      // Update the existing entry
      await ctx.db.patch(existingIcon._id, { storageId: args.storageId });
    } else {
      // Create a new entry
      await ctx.db.insert("iconImages", {
        orgId,
        storageId: args.storageId,
      });
    }

    return { success: true };
  },
});

export const getIconImage = query({
  args: {},
  handler: async (ctx) => {
    const identity = await ctx.auth.getUserIdentity();
    if (!identity) throw new Error("Unauthenticated");
    const orgId = identity.orgId;

    const iconImage = await ctx.db
      .query("iconImages")
      .filter((q) => q.eq(q.field("orgId"), orgId))
      .order("desc")
      .first();
    if (!iconImage) return null;

    const url = await ctx.storage.getUrl(iconImage.storageId as Id<"_storage">);
    return { ...iconImage, url };
  },
});

export const generateMobileBackgroundUploadUrl = mutation(async (ctx) => {
  const identity = await ctx.auth.getUserIdentity();
  if (!identity) throw new Error("Unauthenticated");
  return await ctx.storage.generateUploadUrl();
});

export const uploadMobileBackground = mutation({
  args: {
    storageId: v.id("_storage"),
  },
  handler: async (ctx, args) => {
    const identity = await ctx.auth.getUserIdentity();
    if (!identity) throw new Error("Unauthenticated");
    const orgId = identity.orgId;

    await ctx.db.insert("mobileAppBackgrounds", {
      orgId,
      storageId: args.storageId,
    });

    return { success: true };
  },
});

export const getMobileBackgrounds = query({
  args: {},
  handler: async (ctx) => {
    const identity = await ctx.auth.getUserIdentity();
    if (!identity) throw new Error("Unauthenticated");
    const orgId = identity.orgId;

    const backgrounds = await ctx.db
      .query("mobileAppBackgrounds")
      .filter((q) => q.eq(q.field("orgId"), orgId))
      .collect();

    return Promise.all(
      backgrounds.map(async (background) => ({
        ...background,
        url: await ctx.storage.getUrl(background.storageId as Id<"_storage">),
      })),
    );
  },
});

export const deleteMobileBackground = mutation({
  args: {
    backgroundId: v.id("mobileAppBackgrounds"),
  },
  handler: async (ctx, args) => {
    const identity = await ctx.auth.getUserIdentity();
    if (!identity) throw new Error("Unauthenticated");
    const orgId = identity.orgId;

    const background = await ctx.db.get(args.backgroundId);
    if (!background || background.orgId !== orgId) {
      throw new Error("Background not found or unauthorized");
    }

    await ctx.storage.delete(background.storageId as Id<"_storage">);
    await ctx.db.delete(args.backgroundId);

    return { success: true };
  },
});
