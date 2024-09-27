// import { mutation, query } from "./_generated/server";
// import { v } from "convex/values";

// export const upsert = mutation({
//   args: {
//     id: v.optional(v.id("buildings")),
//     name: v.string(),
//     description: v.string(),
//   },
//   handler: async (ctx, args) => {
//     const identity = await ctx.auth.getUserIdentity();
//     if (!identity) throw new Error("Unauthenticated");
//     const orgId = identity.orgId;

//     if (args.id) {
//       // Update existing space type
//       const existing = await ctx.db.get(args.id);
//       if (!existing || existing.orgId !== orgId) {
//         throw new Error("Building not found or access denied");
//       }
//       await ctx.db.patch(args.id, {
//         name: args.name,
//         description: args.description,
//       });
//       return args.id;
//     } else {
//       // Insert new space type
//       return await ctx.db.insert("buildings", {
//         name: args.name,
//         description: args.description,
//         orgId,
//       });
//     }
//   },
// });

// export const remove = mutation({
//   args: { id: v.id("spaceTypes") },
//   handler: async (ctx, args) => {
//     const identity = await ctx.auth.getUserIdentity();
//     if (!identity) throw new Error("Unauthenticated");
//     const orgId = identity.orgId;

//     const existing = await ctx.db.get(args.id);
//     if (!existing || existing.orgId !== orgId) {
//       throw new Error("Space type not found or access denied");
//     }
//     await ctx.db.delete(args.id);
//   },
// });

// export const get = query({
//   args: { id: v.id("spaceTypes") },
//   handler: async (ctx, args) => {
//     const identity = await ctx.auth.getUserIdentity();
//     if (!identity) throw new Error("Unauthenticated");
//     const orgId = identity.orgId;

//     const spaceType = await ctx.db.get(args.id);
//     if (!spaceType || spaceType.orgId !== orgId) {
//       return null;
//     }
//     return spaceType;
//   },
// });

// export const getAll = query({
//   handler: async (ctx) => {
//     const identity = await ctx.auth.getUserIdentity();
//     if (!identity) throw new Error("Unauthenticated");
//     const orgId = identity.orgId;

//     return await ctx.db
//       .query("spaceTypes")
//       .filter((q) => q.eq(q.field("orgId"), orgId))
//       .collect();
//   },
// });
