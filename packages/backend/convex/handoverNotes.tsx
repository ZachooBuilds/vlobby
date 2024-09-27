import { mutation, query } from "./_generated/server";
import { v } from "convex/values";

export const upsertHandoverNote = mutation({
  args: {
    _id: v.optional(v.id("handoverNotes")),
    priority: v.string(),
    title: v.string(),
    description: v.string(),
    followupDate: v.string(),
    isClosed: v.boolean(),
  },
  handler: async (ctx, args) => {
    const identity = await ctx.auth.getUserIdentity();
    if (!identity) throw new Error("Unauthenticated");
    const orgId = identity.orgId;

    let result: string;

    if (args._id) {
      // Update existing handover note
      const existing = await ctx.db.get(args._id);
      if (!existing || existing.orgId !== orgId) {
        throw new Error("Handover note not found or access denied");
      }
      await ctx.db.patch(args._id, {
        priority: args.priority,
        title: args.title,
        description: args.description,
        followupDate: args.followupDate,
        isClosed: args.isClosed,
      });
      result = args._id;

      // Log the update as an activity
      await ctx.db.insert("globalActivity", {
        title: "Handover Note Updated",
        description: `Handover note details have been updated.`,
        type: "Details Updated",
        entityId: args._id,
        orgId,
      });
    } else {
      // Insert new handover note
      result = await ctx.db.insert("handoverNotes", {
        priority: args.priority,
        title: args.title,
        description: args.description,
        followupDate: args.followupDate,
        isClosed: args.isClosed,
        orgId,
      });

      // Log the new handover note as an activity
      await ctx.db.insert("globalActivity", {
        title: "Handover Note Added",
        description: `Handover note was added to the system`,
        type: "Handover Note Added",
        entityId: result,
        orgId,
      });
    }

    return result;
  },
});

export const remove = mutation({
  args: { id: v.id("handoverNotes") },
  handler: async (ctx, args) => {
    const identity = await ctx.auth.getUserIdentity();
    if (!identity) throw new Error("Unauthenticated");
    const orgId = identity.orgId;

    const existing = await ctx.db.get(args.id);
    if (!existing || existing.orgId !== orgId) {
      throw new Error("Handover note not found or access denied");
    }
    await ctx.db.delete(args.id);

    // Log the removal as an activity
    await ctx.db.insert("globalActivity", {
      title: "Handover Note Removed",
      description: `Handover note was removed from the system`,
      type: "Handover Note Removed",
      entityId: args.id,
      orgId,
    });
  },
});

export const get = query({
  args: { id: v.id("handoverNotes") },
  handler: async (ctx, args) => {
    const identity = await ctx.auth.getUserIdentity();
    if (!identity) throw new Error("Unauthenticated");
    const orgId = identity.orgId;

    const handoverNote = await ctx.db.get(args.id);
    if (!handoverNote || handoverNote.orgId !== orgId) {
      return null;
    }
    return handoverNote;
  },
});

export const getAll = query({
  handler: async (ctx) => {
    const identity = await ctx.auth.getUserIdentity();
    if (!identity) throw new Error("Unauthenticated");
    const orgId = identity.orgId;

    return await ctx.db
      .query("handoverNotes")
      .filter((q) => q.eq(q.field("orgId"), orgId))
      .collect();
  },
});

export const getHandoverNoteForEdit = query({
  args: { id: v.id("handoverNotes") },
  handler: async (ctx, args) => {
    const identity = await ctx.auth.getUserIdentity();
    if (!identity) throw new Error("Unauthenticated");
    const orgId = identity.orgId;

    const handoverNote = await ctx.db.get(args.id);
    if (!handoverNote || handoverNote.orgId !== orgId) {
      throw new Error("Handover note not found or access denied");
    }

    return {
      _id: handoverNote._id,
      priority: handoverNote.priority,
      title: handoverNote.title,
      description: handoverNote.description,
      followupDate: handoverNote.followupDate,
      isClosed: handoverNote.isClosed,
    };
  },
});

export const getAllHandoverNotesFormatted = query({
  handler: async (ctx) => {
    const identity = await ctx.auth.getUserIdentity();
    if (!identity) throw new Error("Unauthenticated");
    const orgId = identity.orgId;

    const handoverNotes = await ctx.db
      .query("handoverNotes")
      .filter((q) => q.eq(q.field("orgId"), orgId))
      .collect();

    return handoverNotes.map((note) => ({
      _id: note._id,
      priority: note.priority,
      title: note.title,
      description: note.description,
      followupDate: note.followupDate,
      isClosed: note.isClosed,
    }));
  },
});
