import { mutation, query } from "./_generated/server";
import { v } from "convex/values";

export const upsertSite = mutation({
  args: {
    id: v.optional(v.id("sites")),
    name: v.string(),
    description: v.optional(v.string()),
    floors: v.optional(v.number()),
    namedFloors: v.optional(
      v.array(
        v.object({
          index: v.number(),
          name: v.string(),
        }),
      ),
    ),
  },
  handler: async (ctx, args) => {
    const identity = await ctx.auth.getUserIdentity();
    if (!identity) throw new Error("Unauthenticated");
    const orgId = identity.orgId;
    if (!orgId) throw new Error("No organization ID found");

    if (args.id) {
      // Update existing site
      const existing = await ctx.db.get(args.id);
      if (!existing || existing.orgId !== orgId) {
        throw new Error("Site not found or access denied");
      }
      await ctx.db.patch(args.id, {
        name: args.name,
        description: args.description,
        floors: args.floors,
        namedFloors: args.namedFloors,
      });
      return args.id;
    } else {
      // Insert new site
      return await ctx.db.insert("sites", {
        name: args.name,
        description: args.description,
        floors: args.floors,
        namedFloors: args.namedFloors,
        orgId,
      });
    }
  },
});

export const removeSite = mutation({
  args: { id: v.id("sites") },
  handler: async (ctx, args) => {
    const identity = await ctx.auth.getUserIdentity();
    if (!identity) throw new Error("Unauthenticated");
    const orgId = identity.orgId;

    const existing = await ctx.db.get(args.id);
    if (!existing || existing.orgId !== orgId) {
      throw new Error("Site not found or access denied");
    }
    await ctx.db.delete(args.id);
  },
});

export const getSite = query({
  args: { id: v.id("sites") },
  handler: async (ctx, args) => {
    const identity = await ctx.auth.getUserIdentity();
    if (!identity) throw new Error("Unauthenticated");
    const orgId = identity.orgId;

    const site = await ctx.db.get(args.id);
    if (!site || site.orgId !== orgId) {
      return null;
    }
    return site;
  },
});

export const getAllSites = query({
  handler: async (ctx) => {
    const identity = await ctx.auth.getUserIdentity();
    if (!identity) throw new Error("Unauthenticated");
    const orgId = identity.orgId;

    return await ctx.db
      .query("sites")
      .filter((q) => q.eq(q.field("orgId"), orgId))
      .collect();
  },
});

export const getAllSitesValueLabelPairs = query({
  handler: async (ctx) => {
    const identity = await ctx.auth.getUserIdentity();
    if (!identity) throw new Error("Unauthenticated");
    const orgId = identity.orgId;

    const sites = await ctx.db
      .query("sites")
      .filter((q) => q.eq(q.field("orgId"), orgId))
      .collect();

    return sites.map(site => ({
      value: site._id,
      label: site.name
    }));
  },
});


export const getFloorList = query({
  args: { id: v.id("sites") },
  handler: async (ctx, args) => {
    const identity = await ctx.auth.getUserIdentity();
    if (!identity) throw new Error("Unauthenticated");
    const orgId = identity.orgId;

    const site = await ctx.db.get(args.id);
    if (!site || site.orgId !== orgId) {
      throw new Error("Site not found or access denied");
    }

    const floors = site.floors || 0;
    const namedFloors: Array<{ index: number; name: string }> = site.namedFloors || [];

    // Generate the floor list from 0 to floors, replacing with named floors where applicable
    for (let i = 0; i <= floors; i++) {
      const namedFloor = namedFloors.find(f => f.index === i);
      if (!namedFloor) {
        namedFloors.push({ index: i, name: i.toString() });
      }
    }
    // Sort the array in ascending order of index before returning
    return namedFloors.sort((a, b) => a.index - b.index);
  },
});

export const getFloorListValueLabelPairs = query({
  args: { id: v.id("sites") },
  handler: async (ctx, args) => {
    const identity = await ctx.auth.getUserIdentity();
    if (!identity) throw new Error("Unauthenticated");
    const orgId = identity.orgId;

    const site = await ctx.db.get(args.id);
    if (!site || site.orgId !== orgId) {
      throw new Error("Site not found or access denied");
    }

    const floors = site.floors || 0;
    const namedFloors: Array<{ index: number; name: string }> =
      site.namedFloors || [];

    // Generate the floor list from 0 to floors, replacing with named floors where applicable
    const floorList = [];
    for (let i = 0; i <= floors; i++) {
      const namedFloor = namedFloors.find((f) => f.index === i);
      floorList.push({
        value: i.toString(),
        label: namedFloor ? namedFloor.name : i.toString(),
      });
    }

    // Sort the array in ascending order of value before returning
    return floorList.sort((a, b) => parseInt(a.value) - parseInt(b.value));
  },
});
