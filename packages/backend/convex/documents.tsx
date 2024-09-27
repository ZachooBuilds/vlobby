import { mutation, query } from "./_generated/server";
import { v } from "convex/values";
import { Id } from "./_generated/dataModel";

// Folder mutations and queries
export const upsertFolder = mutation({
  args: {
    _id: v.optional(v.id("folders")),
    name: v.string(),
    audience: v.array(
      v.object({
        type: v.string(),
        entity: v.string(),
      }),
    ),
  },
  handler: async (ctx, args) => {
    const identity = await ctx.auth.getUserIdentity();
    if (!identity) throw new Error("Unauthenticated");
    const orgId = identity.orgId;

    const folderData = {
      name: args.name,
      audience: args.audience,
      orgId,
    };

    if (args._id) {
      // Update existing folder
      const existing = await ctx.db.get(args._id);
      if (!existing || existing.orgId !== orgId) {
        throw new Error("Folder not found or access denied");
      }
      await ctx.db.patch(args._id, folderData);
      return args._id;
    } else {
      // Insert new folder
      return await ctx.db.insert("folders", folderData);
    }
  },
});

export const getAllFolders = query({
  handler: async (ctx) => {
    const identity = await ctx.auth.getUserIdentity();
    if (!identity) throw new Error("Unauthenticated");
    const orgId = identity.orgId;

    return await ctx.db
      .query("folders")
      .filter((q) => q.eq(q.field("orgId"), orgId))
      .collect();
  },
});

export const getAllFoldersValueLabelPairs = query({
  handler: async (ctx) => {
    const identity = await ctx.auth.getUserIdentity();
    if (!identity) throw new Error("Unauthenticated");
    const orgId = identity.orgId;

    const result = await ctx.db
      .query("folders")
      .filter((q) => q.eq(q.field("orgId"), orgId))
      .collect();

    return result.map((folder) => ({
      value: folder._id,
      label: folder.name,
    }));
  },
});

export const getAllFolderOverviews = query({
  handler: async (ctx) => {
    const identity = await ctx.auth.getUserIdentity();
    if (!identity) throw new Error("Unauthenticated");
    const orgId = identity.orgId;

    const folders = await ctx.db
      .query("folders")
      .filter((q) => q.eq(q.field("orgId"), orgId))
      .collect();

    const foldersWithFileCount = await Promise.all(
      folders.map(async (folder) => {
        const files = await ctx.db
          .query("documents")
          .filter((q) => q.eq(q.field("folderId"), folder._id))
          .collect();

        const fileCount = files.length;

        return {
          ...folder,
          fileCount,
        };
      }),
    );

    return foldersWithFileCount;
  },
});

export const getFolder = query({
  args: { id: v.id("folders") },
  handler: async (ctx, args) => {
    const identity = await ctx.auth.getUserIdentity();
    if (!identity) throw new Error("Unauthenticated");
    const orgId = identity.orgId;

    const folder = await ctx.db.get(args.id);
    if (!folder || folder.orgId !== orgId) {
      return null;
    }

    const files = await ctx.db
      .query("documents")
      .filter((q) => q.eq(q.field("folderId"), folder._id))
      .collect();

    const fileCount = files.length;

    return {
      ...folder,
      fileCount,
    };
  },
});

// Document mutations and queries
export const insertDocuments = mutation({
  args: {
    documents: v.array(
      v.object({
        name: v.string(),
        type: v.string(),
        storageId: v.string(),
      }),
    ),
    folderId: v.id("folders"),
  },
  handler: async (ctx, args) => {
    const identity = await ctx.auth.getUserIdentity();
    if (!identity) throw new Error("Unauthenticated");
    const orgId = identity.orgId;

    const results = await Promise.all(
      args.documents.map(async (doc) => {
        const documentData = {
          name: doc.name,
          type: doc.type,
          folderId: args.folderId,
          fileStorageId: doc.storageId,
          views: 0,
          orgId,
        };
        return await ctx.db.insert("documents", documentData);
      }),
    );

    return results;
  },
});

export const updateDocument = mutation({
  args: {
    _id: v.id("documents"),
    name: v.string(),
    type: v.string(),
    storageId: v.string(),
    folderId: v.id("folders"),
  },
  handler: async (ctx, args) => {
    const identity = await ctx.auth.getUserIdentity();
    if (!identity) throw new Error("Unauthenticated");
    const orgId = identity.orgId;

    const existing = await ctx.db.get(args._id);
    if (!existing || existing.orgId !== orgId) {
      throw new Error("Document not found or access denied");
    }

    const documentData = {
      name: args.name,
      type: args.type,
      folderId: args.folderId,
      fileStorageId: args.storageId,
    };

    await ctx.db.patch(args._id, documentData);
    return args._id;
  },
});

export const getAllDocuments = query({
  handler: async (ctx) => {
    const identity = await ctx.auth.getUserIdentity();
    if (!identity) throw new Error("Unauthenticated");
    const orgId = identity.orgId;

    const documents = await ctx.db
      .query("documents")
      .filter((q) => q.eq(q.field("orgId"), orgId))
      .collect();

    return await Promise.all(
      documents.map(async (doc) => {
        const folder = await ctx.db.get(doc.folderId);
        return {
          ...doc,
          fileUrl: await ctx.storage.getUrl(
            doc.fileStorageId as Id<"_storage">,
          ),
          folderName: folder ? folder.name : null,
        };
      }),
    );
  },
});

export const getDocumentsByFolderId = query({
  args: { folderId: v.id("folders") },
  handler: async (ctx, args) => {
    const identity = await ctx.auth.getUserIdentity();
    if (!identity) throw new Error("Unauthenticated");
    const orgId = identity.orgId;

    const documents = await ctx.db
      .query("documents")
      .filter((q) =>
        q.and(
          q.eq(q.field("orgId"), orgId),
          q.eq(q.field("folderId"), args.folderId),
        ),
      )
      .collect();

    return await Promise.all(
      documents.map(async (doc) => ({
        ...doc,
        fileUrl: await ctx.storage.getUrl(doc.fileStorageId as Id<"_storage">),
      })),
    );
  },
});

// export const incrementDocumentViews = mutation({
//   args: { id: v.id("documents") },
//   handler: async (ctx, args) => {
//     const identity = await ctx.auth.getUserIdentity();
//     if (!identity) throw new Error("Unauthenticated");
//     const orgId = identity.orgId;

//     const document = await ctx.db.get(args.id);
//     if (!document || document.orgId !== orgId) {
//       throw new Error("Document not found or access denied");
//     }

//     const updatedDocument = await ctx.db.patch(args.id, {
//       views: (document.views || 0) + 1,
//     });

//     return updatedDocument;
//   },
// });


export const getDocument = query({
  args: { id: v.id("documents") },
  handler: async (ctx, args) => {
    const identity = await ctx.auth.getUserIdentity();
    if (!identity) throw new Error("Unauthenticated");
    const orgId = identity.orgId;

    const document = await ctx.db.get(args.id);
    if (!document || document.orgId !== orgId) {
      return null;
    }

    const fileUrl = await ctx.storage.getUrl(
      document.fileStorageId as Id<"_storage">,
    );
    return { ...document, fileUrl };
  },
});

export const getDocumentForUpdate = query({
  args: { id: v.id("documents") },
  handler: async (ctx, args) => {
    const identity = await ctx.auth.getUserIdentity();
    if (!identity) throw new Error("Unauthenticated");
    const orgId = identity.orgId;

    const document = await ctx.db.get(args.id);
    if (!document || document.orgId !== orgId) {
      return null;
    }

    return {
      _id: document._id,
      name: document.name,
      type: document.type,
      folderId: document.folderId,
      file: {
        url: await ctx.storage.getUrl(document.fileStorageId as Id<"_storage">),
        storageId: document.fileStorageId,
      },
    };
  },
});

export const incrementDocumentViews = mutation({
  args: { id: v.id("documents") },
  handler: async (ctx, args) => {
    const identity = await ctx.auth.getUserIdentity();
    if (!identity) throw new Error("Unauthenticated");
    const orgId = identity.orgId;

    const document = await ctx.db.get(args.id);
    if (!document || document.orgId !== orgId) {
      throw new Error("Document not found or access denied");
    }

    await ctx.db.patch(args.id, {
      views: (document.views || 0) + 1,
    });
  },
});

export const deleteDocument = mutation({
  args: { id: v.id("documents") },
  handler: async (ctx, args) => {
    const identity = await ctx.auth.getUserIdentity();
    if (!identity) throw new Error("Unauthenticated");
    const orgId = identity.orgId;

    const existing = await ctx.db.get(args.id);
    if (!existing || existing.orgId !== orgId) {
      throw new Error("Document not found or access denied");
    }
    await ctx.db.delete(args.id);
  },
});
