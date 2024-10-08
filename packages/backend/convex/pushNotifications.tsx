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
    const orgId = identity.orgId;

    // Check if the device token already exists for the user
    const existingToken = await ctx.db
      .query('userDeviceTokens')
      .filter((q) => q.eq(q.field('userId'), userId))
      .filter((q) => q.eq(q.field('orgId'), orgId))
      .filter((q) => q.eq(q.field('deviceToken'), args.deviceToken))
      .first();

    if (!existingToken) {
      // Only insert if the token doesn't already exist for the user
      await ctx.db.insert('userDeviceTokens', {
        userId,
        orgId,
        deviceToken: args.deviceToken,
      });
    }
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

export const sendPushNotificationToCurrentOrg = mutation({
  args: {
    title: v.string(),
    body: v.string(),
  },
  handler: async (ctx, args) => {
    const { title, body } = args;

    const identity = await ctx.auth.getUserIdentity();
    if (!identity) {
      throw new Error('Not authenticated');
    }

    const orgId = identity.orgId;

    // Fetch all device tokens for the current user's orgId
    const tokenRecords = await ctx.db
      .query('userDeviceTokens')
      .filter((q) => q.eq(q.field('orgId'), orgId))
      .collect();

    if (tokenRecords.length === 0) {
      return {
        success: false,
        reason: 'No valid tokens found for the organization',
      };
    }

    // Send notifications to all devices in the organization
    const notificationPromises = tokenRecords.map((record) =>
      ctx.scheduler.runAfter(0, internal.firebaseAdmin.sendFCMNotification, {
        token: record.deviceToken,
        title,
        body,
      })
    );

    await Promise.all(notificationPromises);

    return { success: true, notificationsSent: tokenRecords.length };
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
