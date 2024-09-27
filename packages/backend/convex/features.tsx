import { query, mutation } from "./_generated/server";
import { v } from "convex/values";

/**
 * Adds a new feature for the authenticated user's organization
 * @param {string} feature - The feature of the feature dscdsc
 * @param {boolean} enabled - The initial enabled state of the feature
 * @returns {string} The ID of the newly created feature
 */
export const addFeature = mutation({
  args: { feature: v.string(), enabled: v.boolean() },
  handler: async (ctx, args) => {
    const identity = await ctx.auth.getUserIdentity();
    if (!identity) throw new Error("Not authenticated");
    const orgId = identity.orgId;

    return await ctx.db.insert("features", {
      feature: args.feature,
      enabled: args.enabled,
      orgId,
    });
  },
});

/**
 * Retrieves a feature by feature for the authenticated user's organization
 * @param {string} feature - The feature of the feature to retrieve
 * @returns {Object|null} The feature object or null if not found
 */
export const getFeatureByfeature = query({
  args: { feature: v.string() },
  handler: async (ctx, args) => {
    const identity = await ctx.auth.getUserIdentity();
    if (!identity) throw new Error("Not authenticated");
    const orgId = identity.orgId;

    return await ctx.db
      .query("features")
      .filter((q) => q.eq(q.field("feature"), args.feature))
      .filter((q) => q.eq(q.field("orgId"), orgId))
      .first();
  },
});

/**
 * Adds multiple features at once for the authenticated user's organization
 * @param {Array<{feature: string, enabled?: boolean}>} features - Array of feature objects
 * @returns {Array<string>} Array of IDs of the newly created features
 */
export const addAllFeatures = mutation({
  args: {
    features: v.array(
      v.object({
        feature: v.string(),
        enabled: v.optional(v.boolean()),
      }),
    ),
  },
  handler: async (ctx, args) => {
    const identity = await ctx.auth.getUserIdentity();
    if (!identity) throw new Error("Not authenticated");
    const orgId = identity.orgId;

    const featureIds = await Promise.all(
      args.features.map((feature) =>
        ctx.db.insert("features", {
          feature: feature.feature,
          enabled: feature.enabled ?? true, // Default to true if not provided
          orgId,
        }),
      ),
    );

    return featureIds;
  },
});

/**
 * Retrieves all features from the featuresList table
 * @returns {Array<Object>} Array of feature objects from featuresList
 */
export const getAllFeaturesFromList = query({
  handler: async (ctx) => {
    return await ctx.db.query("featuresList").collect();
  },
});


/**
 * Retrieves all features for the authenticated user's organization
 * @returns {Array<Object>} Array of feature objects
 */
export const getAllFeatures = query({
  handler: async (ctx) => {
    const identity = await ctx.auth.getUserIdentity();
    if (!identity || !identity.orgId) return []; // Return empty array if no org
    const orgId = identity.orgId;

    return await ctx.db
      .query("features")
      .filter((q) => q.eq(q.field("orgId"), orgId))
      .collect();
  },
});


/**
 * Toggles all features to either enabled or disabled for the authenticated user's organization
 * @param {boolean} enabled - The state to set for all features
 * @returns {void}
 */
export const toggleAllFeatures = mutation({
  args: { enabled: v.boolean() },
  handler: async (ctx, args) => {
    const identity = await ctx.auth.getUserIdentity();
    if (!identity) throw new Error("Not authenticated");
    const orgId = identity.orgId;

    const features = await ctx.db
      .query("features")
      .filter((q) => q.eq(q.field("orgId"), orgId))
      .collect();

    for (const feature of features) {
      await ctx.db.patch(feature._id, { enabled: args.enabled });
    }
  },
});

/**
 * Updates the enabled status of a specific feature for the authenticated user's organization
 * @param {string} feature - The feature of the feature to update
 * @param {boolean} enabled - The new enabled state for the feature
 * @returns {void}
 * @throws {Error} If the feature is not found
 */
export const updateFeature = mutation({
  args: { feature: v.string(), enabled: v.boolean() },
  handler: async (ctx, args) => {
    const identity = await ctx.auth.getUserIdentity();
    if (!identity) throw new Error("Not authenticated");
    const orgId = identity.orgId;

    const feature = await ctx.db
      .query("features")
      .filter((q) => q.eq(q.field("feature"), args.feature))
      .filter((q) => q.eq(q.field("orgId"), orgId))
      .first();

    if (!feature) throw new Error("Feature not found");

    await ctx.db.patch(feature._id, { enabled: args.enabled });
  },
});
