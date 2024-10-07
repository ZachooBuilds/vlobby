import { action, internalAction, mutation, query } from './_generated/server';
import { v } from 'convex/values';
import { internal } from './_generated/api';

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

export const getAllUserIdsWithTokens = query({
  handler: async (ctx) => {
    const tokenRecords = await ctx.db.query('userDeviceTokens').collect();
    return tokenRecords.map((record) => record.userId);
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

export const sendPushNotificationToUser = mutation({
  args: {
    userId: v.string(),
    title: v.string(),
    body: v.string(),
  },
  handler: async (ctx, args) => {
    const { userId, title, body } = args;

    const tokenRecord = await ctx.db
      .query('userDeviceTokens')
      .filter((q) => q.eq(q.field('userId'), userId))
      .first();

    if (!tokenRecord || !tokenRecord.deviceToken) {
      return { success: false, reason: 'No valid token found' };
    }

    await ctx.scheduler.runAfter(
      0,
      internal.firebaseAdmin.sendFCMNotification,
      {
        token: tokenRecord.deviceToken,
        title,
        body,
      }
    );

    return { success: true };
  },
});
