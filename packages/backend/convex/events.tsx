import { Id } from "./_generated/dataModel";
import { mutation, query } from "./_generated/server";
import { v } from "convex/values";

export const upsertEvent = mutation({
  args: {
    _id: v.optional(v.id("events")),
    title: v.string(),
    startTime: v.string(),
    endTime: v.string(),
    description: v.string(),
    capacity: v.number(),
    audience: v.optional(
      v.array(
        v.object({
          type: v.string(),
          entity: v.string(),
        }),
      ),
    ),
    files: v.optional(v.array(v.string())),
    isPublicPlace: v.boolean(),
    address: v.optional(v.string()),
    spaceId: v.optional(v.string()),
  },
  handler: async (ctx, args) => {
    const identity = await ctx.auth.getUserIdentity();
    if (!identity) throw new Error("Unauthenticated");
    const orgId = identity.orgId;

    let result: string;

    if (args._id) {
      // Update existing event
      const existing = await ctx.db.get(args._id);
      if (!existing || existing.orgId !== orgId) {
        throw new Error("Event not found or access denied");
      }
      await ctx.db.patch(args._id, {
        title: args.title,
        startTime: args.startTime,
        endTime: args.endTime,
        description: args.description,
        capacity: args.capacity,
        audience: args.audience,
        files: args.files,
        isPublicPlace: args.isPublicPlace,
        address: args.address,
        spaceId: args.spaceId,
      });
      result = args._id;

      await ctx.db.insert("globalActivity", {
        title: "Event Updated",
        description: `Event details have been updated.`,
        type: "Event Updated",
        entityId: args._id,
        orgId,
      });
    } else {
      // Insert new event
      result = await ctx.db.insert("events", {
        title: args.title,
        startTime: args.startTime,
        endTime: args.endTime,
        description: args.description,
        capacity: args.capacity,
        audience: args.audience,
        files: args.files,
        isPublicPlace: args.isPublicPlace,
        address: args.address,
        spaceId: args.spaceId,
        orgId,
      });

      await ctx.db.insert("globalActivity", {
        title: "Event Created",
        description: `A new event was created`,
        type: "Event Created",
        entityId: result,
        orgId,
      });
    }

    return result;
  },
});

export const getEvent = query({
  args: { id: v.id("events") },
  handler: async (ctx, args) => {
    const identity = await ctx.auth.getUserIdentity();
    if (!identity) throw new Error("Unauthenticated");
    const orgId = identity.orgId;

    const event = await ctx.db.get(args.id);
    if (!event || event.orgId !== orgId) {
      return null;
    }

    console.log("event", event);

    // Transform the files array
    const transformedFiles = await Promise.all(
      (event.files || []).map(async (storageId: Id<"_storage">) => ({
        url: await ctx.storage.getUrl(storageId),
        storageId: storageId,
      })),
    );

    // Get space name if spaceId is included
    let facilityName;
    if (event.spaceId) {
      const facility = await ctx.db.get(event.spaceId);
      facilityName = facility ? facility.name : "Unknown Facility";
    }

    console.log("Facility name", facilityName);

    // Return the event with transformed files and space name
    return {
      ...event,
      files: transformedFiles,
      facilityName,
    };
  },
});

export const getAllEventsWithDetails = query({
  handler: async (ctx) => {
    const identity = await ctx.auth.getUserIdentity();
    if (!identity) throw new Error("Unauthenticated");
    const orgId = identity.orgId;

    const events = await ctx.db
      .query("events")
      .filter((q) => q.eq(q.field("orgId"), orgId))
      .collect();

    const eventsWithSpaceNames = await Promise.all(
      events.map(async (event) => {
        if (event.spaceId) {
          const facility = await ctx.db.get(event.spaceId);
          return {
            ...event,
            facilityName: facility ? facility.name : "Unknown Space",
          };
        }
        return event;
      }),
    );

    return eventsWithSpaceNames;
  },
});

export const deleteEvent = mutation({
  args: { id: v.id("events") },
  handler: async (ctx, args) => {
    const identity = await ctx.auth.getUserIdentity();
    if (!identity) throw new Error("Unauthenticated");
    const orgId = identity.orgId;

    const existing = await ctx.db.get(args.id);
    if (!existing || existing.orgId !== orgId) {
      throw new Error("Event not found or access denied");
    }
    await ctx.db.delete(args.id);

    await ctx.db.insert("globalActivity", {
      title: "Event Deleted",
      description: `An event was deleted`,
      type: "Event Deleted",
      entityId: args.id,
      orgId,
    });

    return { success: true };
  },
});
