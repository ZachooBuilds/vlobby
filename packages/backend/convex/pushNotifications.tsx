import { action, mutation, query } from './_generated/server';
import { v } from 'convex/values';
import { internal } from './_generated/api';

// Store device token
export const storeDeviceToken = mutation({
  args: { deviceToken: v.string() },
  handler: async (ctx, { deviceToken }) => {
    const identity = await ctx.auth.getUserIdentity();
    if (!identity) {
      // User is not signed in, do nothing
      return;
    }
    const userId = identity.subject;
    await ctx.db.insert('deviceTokens', { userId, deviceToken });
  },
});

// Send notification action
export const sendNotificationAction = action({
  args: { deviceTokens: v.array(v.string()), message: v.string() },
  handler: async (ctx, { deviceTokens, message }) => {
    const response = await fetch(
      'https://api.pushy.me/push?api_key=94db24230b9ab844499f0bf6ef4858856adc158b1188509e3392293b7989de43',
      {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          to: deviceTokens,
          data: {
            message: message,
          },
        }),
      }
    );

    if (!response.ok) {
      throw new Error('Failed to send push notification');
    }

    return await response.json();
  },
});

// Send notification mutation (which calls the action)
export const sendNotification = mutation({
  args: { userId: v.string(), message: v.string() },
  handler: async (ctx, args) => {
    const deviceTokens = await ctx.db
      .query('deviceTokens')
      .filter((q) => q.eq(q.field('userId'), args.userId))
      .collect();

    const tokens = deviceTokens.map((dt) => dt.deviceToken);
    await sendNotificationAction, {
      deviceTokens: tokens,
      message: args.message,
    };
  },
});

// Send group notification
export const sendGroupNotification = mutation({
  args: { groupId: v.string(), message: v.string() },
  handler: async (ctx, args) => {
    const users = await ctx.db
      .query('users')
      .filter(q => q.eq(q.field('groupId'), args.groupId))
      .collect();

    const userIds = users.map(user => user._id);

    const deviceTokens = await ctx.db
      .query('deviceTokens')
      .filter((q) => q.eq(q.field('userId'), userIds[0]))
      .collect();

    for (let i = 1; i < userIds.length; i++) {
      const additionalTokens = await ctx.db
        .query('deviceTokens')
        .filter(q => q.eq(q.field('userId'), userIds[i]))
        .collect();
      deviceTokens.push(...additionalTokens);
    }

    const tokens = deviceTokens.map(dt => dt.deviceToken);
    await sendNotificationAction, {
      deviceTokens: tokens,
      message: args.message,
    };
  },
});
