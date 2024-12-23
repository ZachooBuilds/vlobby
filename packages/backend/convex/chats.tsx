import { internal } from './_generated/api';
import { mutation, query } from './_generated/server';
import { v } from 'convex/values';
import { sendPushNotificationToUser } from './pushNotifications';

export const upsertChat = mutation({
  args: {
    _id: v.optional(v.id('chats')),
    occupantId: v.id('users'),
  },
  handler: async (ctx, args) => {
    const identity = await ctx.auth.getUserIdentity();
    if (!identity) throw new Error('Unauthenticated');
    const orgId = identity.orgId;
    const userId = identity.subject;

    // Check if a chat with the occupant already exists
    const existingChat = await ctx.db
      .query('chats')
      .filter((q) => q.eq(q.field('occupantId'), args.occupantId))
      .filter((q) => q.eq(q.field('orgId'), orgId))
      .first();

    if (existingChat) {
      return existingChat._id;
    }

    let chatId: string;

    if (args._id) {
      // Update existing chat
      const existing = await ctx.db.get(args._id);
      if (!existing || existing.orgId !== orgId) {
        throw new Error('Chat not found or access denied');
      }
      await ctx.db.patch(args._id, {
        updatedAt: new Date().toISOString(),
      });
      chatId = args._id;
    } else {
      // Insert new chat
      chatId = await ctx.db.insert('chats', {
        occupantId: args.occupantId,
        orgId,
        userId,
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
      });
    }

    return chatId;
  },
});

export const addMessage = mutation({
  args: {
    chatId: v.id('chats'),
    content: v.string(),
    isFromOccupant: v.boolean(),
  },
  handler: async (ctx, args) => {
    const identity = await ctx.auth.getUserIdentity();
    if (!identity) throw new Error('Unauthenticated');
    const orgId = identity.orgId;
    const userId = identity.subject;

    const chat = await ctx.db.get(args.chatId);
    if (!chat || chat.orgId !== orgId) {
      throw new Error('Chat not found or access denied');
    }

    const messageId = await ctx.db.insert('messages', {
      chatId: args.chatId,
      content: args.content,
      isFromOccupant: args.isFromOccupant,
      orgId,
      userId: args.isFromOccupant ? chat.occupantId : userId,
      createdAt: new Date().toISOString(),
    });

    await ctx.db.patch(args.chatId, {
      updatedAt: new Date().toISOString(),
      unreadMessage: args.isFromOccupant ? true : chat.unreadMessage,
    });

    // Send a notification to the occupant if the message is not from them
    if (!args.isFromOccupant) {
      const occupant = await ctx.db.get(chat.occupantId);
      if (occupant) {
        await sendPushNotificationToUser(ctx, {
          userId: occupant.userId,
          title: '💬 New Message',
          body: args.content,
        });
      }
    }

    return messageId;
  },
});

export const getChatSummaries = query({
  handler: async (ctx) => {
    const identity = await ctx.auth.getUserIdentity();
    if (!identity) throw new Error('Unauthenticated');
    const orgId = identity.orgId;

    const chats = await ctx.db
      .query('chats')
      .filter((q) => q.eq(q.field('orgId'), orgId))
      .collect();

    const chatSummaries = await Promise.all(
      chats.map(async (chat) => {
        const latestMessage = await ctx.db
          .query('messages')
          .filter((q) => q.eq(q.field('chatId'), chat._id))
          .order('desc')
          .first();

        const occupant = await ctx.db.get(chat.occupantId);

        return {
          _id: chat._id,
          unreadMessage: chat.unreadMessage,
          occupantId: chat.occupantId,
          OccupantName: occupant
            ? `${occupant.firstName} ${occupant.lastName}`
            : 'Unknown',
          lastMessage: latestMessage ? latestMessage.content : '',
          lastMessageDate: latestMessage
            ? latestMessage.createdAt
            : chat.updatedAt,
        };
      })
    );

    // Sort chatSummaries to put unread messages at the top
    chatSummaries.sort((a, b) => {
      if (a.unreadMessage && !b.unreadMessage) return -1;
      if (!a.unreadMessage && b.unreadMessage) return 1;
      return 0;
    });

    return chatSummaries;
  },
});

export const getChatSummaryForOccupant = mutation({
  args: { occupantId: v.id('users') },
  handler: async (ctx, args) => {
    const identity = await ctx.auth.getUserIdentity();
    if (!identity) throw new Error('Unauthenticated');
    const orgId = identity.orgId;
    const userId = identity.subject;

    // Check if a chat with the occupant already exists
    let chat = await ctx.db
      .query('chats')
      .filter((q) => q.eq(q.field('occupantId'), args.occupantId))
      .filter((q) => q.eq(q.field('orgId'), orgId))
      .first();

    // If chat doesn't exist, create a new one
    if (!chat) {
      const chatId = await ctx.db.insert('chats', {
        occupantId: args.occupantId,
        orgId,
        userId,
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
      });
      chat = await ctx.db.get(chatId);
    }

    // Get the latest message
    const latestMessage = await ctx.db
      .query('messages')
      .filter((q) => q.eq(q.field('chatId'), chat!._id))
      .order('desc')
      .first();

    // Get occupant details
    const occupant = await ctx.db.get(chat!.occupantId);

    // Return chat summary
    return {
      _id: chat!._id,
      occupantId: chat!.occupantId,
      occupantName: occupant
        ? `${occupant.firstName} ${occupant.lastName}`
        : 'Unknown',
      lastMessage: latestMessage ? latestMessage.content : '',
      lastMessageDate: latestMessage
        ? latestMessage.createdAt
        : chat!.updatedAt,
    };
  },
});

// export const getChat = query({
//   args: { chatId: v.id('chats') },
//   handler: async (ctx, args) => {
//     const identity = await ctx.auth.getUserIdentity();
//     if (!identity) throw new Error('Unauthenticated');
//     const orgId = identity.orgId;

//     const chat = await ctx.db.get(args.chatId);
//     if (!chat || chat.orgId !== orgId) {
//       throw new Error('Chat not found or access denied');
//     }

//     const messages = await ctx.db
//       .query('messages')
//       .filter((q) => q.eq(q.field('chatId'), args.chatId))
//       .order('asc')
//       .collect();

//     return messages.map((message) => ({
//       chatId: message.chatId,
//       content: message.content,
//       createdAt: message.createdAt,
//       isFromOccupant: message.isFromOccupant,
//     }));
//   },
// });

export const getChat = query({
  args: { chatId: v.id('chats') },
  handler: async (ctx, args) => {
    const identity = await ctx.auth.getUserIdentity();
    if (!identity) throw new Error('Unauthenticated');
    const orgId = identity.orgId;

    const chat = await ctx.db.get(args.chatId);
    if (!chat || chat.orgId !== orgId) {
      throw new Error('Chat not found or access denied');
    }

    const messages = await ctx.db
      .query('messages')
      .filter((q) => q.eq(q.field('chatId'), args.chatId))
      .order('asc')
      .collect();

    return messages.map((message) => ({
      chatId: message.chatId,
      content: message.content,
      createdAt: message.createdAt,
      isFromOccupant: message.isFromOccupant,
    }));
  },
});

export const getChatByUserId = query({
  args: { userId: v.string() },
  handler: async (ctx, args) => {
    const identity = await ctx.auth.getUserIdentity();
    if (!identity) throw new Error('Unauthenticated');
    const orgId = identity.orgId;

    const occupant = await ctx.db
      .query('users')
      .filter((q) => q.eq(q.field('userId'), args.userId))
      .first();

    if (!occupant) {
      return null; // Return null if no chat is found
    }

    const chat = await ctx.db
      .query('chats')
      .filter((q) => q.eq(q.field('occupantId'), occupant._id))
      .filter((q) => q.eq(q.field('orgId'), orgId))
      .first();

    return chat?._id;
  },
});

// Add a new mutation to mark the chat as read
export const markChatAsRead = mutation({
  args: { chatId: v.id('chats') },
  handler: async (ctx, args) => {
    const identity = await ctx.auth.getUserIdentity();
    if (!identity) throw new Error('Unauthenticated');
    const orgId = identity.orgId;

    const chat = await ctx.db.get(args.chatId);
    if (!chat || chat.orgId !== orgId) {
      throw new Error('Chat not found or access denied');
    }

    await ctx.db.patch(args.chatId, { unreadMessage: false });
  },
});
