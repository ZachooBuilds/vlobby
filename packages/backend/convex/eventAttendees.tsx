import { mutation, query } from "./_generated/server";
import { v } from "convex/values";

export const upsertAttendee = mutation({
  args: {
    _id: v.optional(v.id("eventAttendees")),
    eventId: v.id("events"),
    isOccupant: v.boolean(),
    occupantId: v.optional(v.string()),
    firstName: v.optional(v.string()),
    lastName: v.optional(v.string()),
    email: v.optional(v.string()),
    numberOfAttendees: v.optional(v.number()),
    notes: v.optional(v.string()),
  },
  handler: async (ctx, args) => {
    const identity = await ctx.auth.getUserIdentity();
    if (!identity) throw new Error("Unauthenticated");
    const orgId = identity.orgId;

    let result: string;

    if (args._id) {
      // Update existing attendee
      const existing = await ctx.db.get(args._id);
      if (!existing || existing.orgId !== orgId) {
        throw new Error("Attendee not found or access denied");
      }
      await ctx.db.patch(args._id, {
        isOccupant: args.isOccupant,
        occupantId: args.occupantId,
        firstName: args.firstName,
        lastName: args.lastName,
        email: args.email,
        numberOfAttendees: args.numberOfAttendees,
        notes: args.notes,
      });
      result = args._id;

      await ctx.db.insert("globalActivity", {
        title: "Event Attendee Updated",
        description: `Attendee details have been updated for an event.`,
        type: "Attendee Updated",
        entityId: args._id,
        orgId,
      });
    } else {
      // Insert new attendee
      result = await ctx.db.insert("eventAttendees", {
        eventId: args.eventId,
        isOccupant: args.isOccupant,
        occupantId: args.occupantId,
        firstName: args.firstName,
        lastName: args.lastName,
        email: args.email,
        numberOfAttendees: args.numberOfAttendees,
        notes: args.notes,
        orgId,
      });

      await ctx.db.insert("globalActivity", {
        title: "Event Attendee Added",
        description: `A new attendee was added to an event`,
        type: "Attendee Added",
        entityId: result,
        orgId,
      });
    }

    return result;
  },
});

export const removeAttendee = mutation({
  args: { id: v.id("eventAttendees"), eventId: v.id("events") },
  handler: async (ctx, args) => {
    const identity = await ctx.auth.getUserIdentity();
    if (!identity) throw new Error("Unauthenticated");
    const orgId = identity.orgId;

    const existing = await ctx.db.get(args.id);
    if (!existing || existing.orgId !== orgId) {
      throw new Error("Attendee not found or access denied");
    }
    await ctx.db.delete(args.id);

    await ctx.db.insert("globalActivity", {
      title: "Event Attendee Removed",
      description: `An attendee was removed from an event`,
      type: "Attendee Removed",
      entityId: args.id,
      orgId,
    });
  },
});

export const getAttendee = query({
  args: { id: v.id("eventAttendees") },
  handler: async (ctx, args) => {
    const identity = await ctx.auth.getUserIdentity();
    if (!identity) throw new Error("Unauthenticated");
    const orgId = identity.orgId;

    const attendee = await ctx.db.get(args.id);
    if (!attendee || attendee.orgId !== orgId) {
      return null;
    }
    return attendee;
  },
});

export const getAttendeesForEvent = query({
  args: { eventId: v.id("events") },
  handler: async (ctx, args) => {
    const identity = await ctx.auth.getUserIdentity();
    if (!identity) throw new Error("Unauthenticated");
    const orgId = identity.orgId;

    const attendees = await ctx.db
      .query("eventAttendees")
      .filter((q) => q.eq(q.field("eventId"), args.eventId))
      .filter((q) => q.eq(q.field("orgId"), orgId))
      .collect();

    const attendeesWithOccupantDetails = await Promise.all(
      attendees.map(async (attendee) => {
        if (attendee.isOccupant && attendee.occupantId) {
          const occupant = await ctx.db.get(attendee.occupantId);
          return {
            ...attendee,
            occupantName: occupant ? `${occupant.firstName} ${occupant.lastName}` : 'Unknown',
            occupantEmail: occupant ? occupant.email : 'Unknown',
          };
        }
        return attendee;
      })
    );

    return attendeesWithOccupantDetails;
  },
});

export const getAttendeeForEdit = query({
  args: { id: v.id("eventAttendees") },
  handler: async (ctx, args) => {
    const identity = await ctx.auth.getUserIdentity();
    if (!identity) throw new Error("Unauthenticated");
    const orgId = identity.orgId;

    const attendee = await ctx.db.get(args.id);
    if (!attendee || attendee.orgId !== orgId) {
      throw new Error("Attendee not found or access denied");
    }

    return {
      _id: attendee._id,
      isOccupant: attendee.isOccupant,
      occupantId: attendee.occupantId,
      firstName: attendee.firstName,
      lastName: attendee.lastName,
      email: attendee.email,
      numberOfAttendees: attendee.numberOfAttendees,
      notes: attendee.notes,
    };
  },
});
