import { mutation, query } from "./_generated/server";
import { v } from "convex/values";
import { internal } from "./_generated/api";

export const upsertAnnouncement = mutation({
  args: {
    _id: v.optional(v.id("announcements")),
    title: v.string(),
    type: v.string(),
    content: v.string(),
    audience: v.optional(
      v.array(
        v.object({
          type: v.string(),
          entity: v.string(),
        }),
      ),
    ),
    scheduleSend: v.boolean(),
    dateTime: v.optional(v.string()),
  },
  handler: async (ctx, args) => {
    const identity = await ctx.auth.getUserIdentity();
    if (!identity) throw new Error("Unauthenticated");
    const orgId = identity.orgId;

    let result: string;

    if (args._id) {
      // Update existing announcement
      const existing = await ctx.db.get(args._id);
      if (!existing || existing.orgId !== orgId) {
        throw new Error("Announcement not found or access denied");
      }
      await ctx.db.patch(args._id, {
        title: args.title,
        type: args.type,
        content: args.content,
        audience: args.audience,
        scheduleSend: args.scheduleSend,
        dateTime: args.dateTime,
      });
      result = args._id;

      await ctx.db.insert("globalActivity", {
        title: "Announcement Updated",
        description: `Announcement details have been updated.`,
        type: "Announcement Updated",
        entityId: args._id,
        orgId,
      });
    } else {
      // Insert new announcement
      result = await ctx.db.insert("announcements", {
        title: args.title,
        type: args.type,
        content: args.content,
        audience: args.audience,
        scheduleSend: args.scheduleSend,
        dateTime: args.dateTime,
        orgId,
      });

      await ctx.db.insert("globalActivity", {
        title: "Announcement Created",
        description: `A new announcement was created`,
        type: "Announcement Created",
        entityId: result,
        orgId,
      });
    }

    return result;
  },
});

export const getAnnouncement = query({
  args: { id: v.id("announcements") },
  handler: async (ctx, args) => {
    const identity = await ctx.auth.getUserIdentity();
    if (!identity) throw new Error("Unauthenticated");
    const orgId = identity.orgId;

    const announcement = await ctx.db.get(args.id);
    if (!announcement || announcement.orgId !== orgId) {
      return null;
    }

    return announcement;
  },
});

export const getAllAnnouncements = query({
  handler: async (ctx) => {
    const identity = await ctx.auth.getUserIdentity();
    if (!identity) throw new Error("Unauthenticated");
    const orgId = identity.orgId;

    const announcements = await ctx.db
      .query("announcements")
      .filter((q) => q.eq(q.field("orgId"), orgId))
      .collect();

    return announcements;
  },
});

export const getAllOccupantAnnouncements = query({
  handler: async (ctx) => {
    const identity = await ctx.auth.getUserIdentity();
    if (!identity) throw new Error('Unauthenticated');
    const orgId = identity.orgId;

    // Call the internal function to get audience groups
    const audienceGroups = await ctx.runQuery(internal.helperFunctions.getOccupantAudienceGroups, {});

    const announcements = await ctx.db
      .query('announcements')
      .filter((q) => q.eq(q.field('orgId'), orgId))
      .filter((q) => 
        q.or(
          q.eq(q.field('scheduleSend'), false),
          q.and(
            q.eq(q.field('scheduleSend'), true),
            q.lt(q.field('dateTime'), new Date().toISOString())
          )
        )
      )
      .collect();

    return announcements.filter((announcement) => {
      if (!announcement.audience || announcement.audience.length === 0) {
        return true; // Include announcements without specific audience
      }
      
      // Use filter instead of some
      const matchingAudiences = announcement.audience.filter((audienceItem: any) =>
        audienceGroups.filter((group: any) =>
          group.type === audienceItem.type && group.entity === audienceItem.entity
        ).length > 0
      );
      
      return matchingAudiences.length > 0;
    });
  },
});

export const deleteAnnouncement = mutation({
  args: { id: v.id("announcements") },
  handler: async (ctx, args) => {
    const identity = await ctx.auth.getUserIdentity();
    if (!identity) throw new Error("Unauthenticated");
    const orgId = identity.orgId;

    const existing = await ctx.db.get(args.id);
    if (!existing || existing.orgId !== orgId) {
      throw new Error("Announcement not found or access denied");
    }
    await ctx.db.delete(args.id);

    await ctx.db.insert("globalActivity", {
      title: "Announcement Deleted",
      description: `An announcement was deleted`,
      type: "Announcement Deleted",
      entityId: args.id,
      orgId,
    });

    return { success: true };
  },
});
