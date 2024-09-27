import { v } from "convex/values";
import { action, query } from "./_generated/server";

export const getOrgId = query({
  args: {},
  handler: async (ctx) => {
    const identity = await ctx.auth.getUserIdentity();
    if (!identity) {
      throw new Error("Not authenticated");
    }
    const orgId = identity.orgId;
    if (!orgId) {
      throw new Error("No organization ID found");
    }
    return orgId;
  },
});

