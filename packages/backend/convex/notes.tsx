import { Id } from "./_generated/dataModel";
import { mutation, query } from "./_generated/server";
import { v } from "convex/values";

export const upsertGlobalNote = mutation({
  args: {
    _id: v.optional(v.id("globalNotes")),
    content: v.string(),
    isPrivate: v.boolean(),
    files: v.optional(v.array(v.id("_storage"))),
    noteType: v.string(),
    entityId: v.string(), // Add entityId to the arguments
  },
  handler: async (ctx, args) => {
    const identity = await ctx.auth.getUserIdentity();
    if (!identity) throw new Error("Unauthenticated");
    const orgId = identity.orgId;
    const author = identity.name;

    const noteData = {
      content: args.content,
      isPrivate: args.isPrivate,
      files: args.files,
      noteType: args.noteType,
      entityId: args.entityId, // Include entityId in the note data
      orgId,
      author,
    };

    if (args._id) {
      const existing = await ctx.db.get(args._id);
      if (!existing || existing.orgId !== orgId) {
        throw new Error("Note not found or access denied");
      }
      await ctx.db.patch(args._id, noteData);
      return args._id;
    } else {
      const result = await ctx.db.insert("globalNotes", noteData);

      // Log the new user space as an activity
      await ctx.db.insert("globalActivity", {
        title: "Note Added",
        description: `A new note has been added by ${author}`,
        type: "New Note",
        entityId: args.entityId,
        orgId,
      });
      return result;
    }
  },
});

export const deleteGlobalNote = mutation({
  args: { id: v.id("globalNotes") },
  handler: async (ctx, args) => {
    const identity = await ctx.auth.getUserIdentity();
    if (!identity) throw new Error("Unauthenticated");
    const orgId = identity.orgId;

    const existing = await ctx.db.get(args.id);
    if (!existing || existing.orgId !== orgId) {
      throw new Error("Note not found or access denied");
    }
    await ctx.db.delete(args.id);
  },
});

export const getGlobalNote = query({
  args: { id: v.id("globalNotes") },
  handler: async (ctx, args) => {
    const identity = await ctx.auth.getUserIdentity();
    if (!identity) throw new Error("Unauthenticated");
    const orgId = identity.orgId;

    const note = await ctx.db.get(args.id);
    if (!note || note.orgId !== orgId) {
      return null;
    }

    // Generate URLs for files
    const files = await Promise.all(
      (note.files || []).map(async (storageId: Id<"_storage">) => ({
        url: await ctx.storage.getUrl(storageId),
        storageId: storageId,
      })),
    );

    return { ...note, files };
  },
});

export const getAllGlobalNotes = query({
  args: {
    noteType: v.optional(v.string()),
    entityId: v.optional(v.string()), // Add optional entityId argument
  },
  handler: async (ctx, args) => {
    const identity = await ctx.auth.getUserIdentity();
    if (!identity) throw new Error("Unauthenticated");
    const orgId = identity.orgId;

    let query = ctx.db
      .query("globalNotes")
      .filter((q) => q.eq(q.field("orgId"), orgId));

    if (args.noteType) {
      query = query.filter((q) => q.eq(q.field("noteType"), args.noteType));
    }

    if (args.entityId) {
      query = query.filter((q) => q.eq(q.field("entityId"), args.entityId));
    }

    const notes = await query.collect();

    // Generate URLs for files for each note
    const notesWithFileUrls = await Promise.all(
      notes.map(async (note) => {
        const files = await Promise.all(
          (note.files || []).map(async (storageId: Id<"_storage">) => ({
            url: await ctx.storage.getUrl(storageId),
            storageId: storageId,
          })),
        );
        return { ...note, files };
      }),
    );

    return notesWithFileUrls;
  },
});

export const addComment = mutation({
  args: {
    noteId: v.id("globalNotes"),
    comment: v.string(),
  },
  handler: async (ctx, args) => {
    const identity = await ctx.auth.getUserIdentity();
    if (!identity) throw new Error("Unauthenticated");
    const orgId = identity.orgId; // Add orgId
    const author = identity.name;

    const commentData = {
      noteId: args.noteId,
      author,
      comment: args.comment,
      orgId, // Include orgId in the comment data
    };

    return await ctx.db.insert("noteComments", commentData);
  },
});

export const getComments = query({
  args: { noteId: v.id("globalNotes") },
  handler: async (ctx, args) => {
    const identity = await ctx.auth.getUserIdentity();
    if (!identity) throw new Error("Unauthenticated");
    const orgId = identity.orgId; // Add orgId

    const comments = await ctx.db
      .query("noteComments")
      .filter((q) => q.eq(q.field("noteId"), args.noteId))
      .filter((q) => q.eq(q.field("orgId"), orgId)) // Filter by orgId
      .collect();

    return comments;
  },
});
