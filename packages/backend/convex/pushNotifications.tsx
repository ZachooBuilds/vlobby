import { mutation, query } from './_generated/server';
import { v } from 'convex/values';

export const storeDeviceToken = mutation({
  args: { deviceToken: v.string() },
  handler: async (ctx, args) => {
    const identity = await ctx.auth.getUserIdentity();
    if (!identity) {
      throw new Error('Not authenticated');
    }

    const userId = identity.subject;

    // Store or update the device token for the user
    await ctx.db.insert('userDeviceTokens', {
      userId,
      deviceToken: args.deviceToken,
    });
  },
});

export const getUserToken = query({
  handler: async (ctx) => {
    const identity = await ctx.auth.getUserIdentity();
    if (!identity) {
      return null;
    }

    const userId = identity.subject;

    // Fetch the user's device token
    const tokenRecord = await ctx.db
      .query('userDeviceTokens')
      .filter((q) => q.eq(q.field('userId'), userId))
      .first();

    return tokenRecord?.deviceToken || null;
  },
});
