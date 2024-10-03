import { internal } from "./_generated/api";
import { mutation, query } from "./_generated/server";
import { v } from "convex/values";

/**
 * @function upsertBookingType
 * @description Creates or updates a booking type.
 * @param {Object} args - The booking type data.
 * @param {string} args.id - Optional ID of an existing booking type.
 * @param {string} args.name - Name of the booking type.
 * @param {string} args.status - Status of the booking type.
 * @param {Date} args.startTime - Start time of the booking type.
 * @param {Date} args.endTime - End time of the booking type.
 * @param {number} args.interval - Slot interval in minutes.
 * @param {number} args.maxSlots - Maximum slots per booking.
 * @param {string} args.description - Description of the booking type.
 * @param {Array} args.audience - Audience for the booking type.
 * @param {Array} args.avalibleDays - Available days for booking.
 * @param {Array} args.exceptionDates - Exception dates for booking.
 * @param {boolean} args.requiresApproval - Whether approval is required.
 * @param {boolean} args.autoProvisionAccess - Whether to auto provision access.
 * @returns {Promise<string>} The ID of the created or updated booking type.
 */
export const upsertBookingType = mutation({
  args: {
    _id: v.optional(v.id("bookingTypes")),
    name: v.string(),
    status: v.union(v.literal("status:active"), v.literal("status:inactive")),
    startTime: v.string(),
    endTime: v.string(),
    facilityId: v.optional(v.id("facilities")),
    interval: v.number(),
    maxSlots: v.number(),
    description: v.string(),
    audience: v.array(
      v.object({
        type: v.string(),
        entity: v.string(),
      }),
    ),
    avalibleDays: v.array(
      v.object({
        value: v.string(),
        label: v.string(),
      }),
    ),
    exceptionDates: v.array(
      v.object({
        date: v.string(),
        reason: v.string(),
      }),
    ),
    requiresApproval: v.boolean(),
    autoProvisionAccess: v.boolean(),
  },
  handler: async (ctx, args) => {
    const identity = await ctx.auth.getUserIdentity();
    if (!identity) throw new Error("Unauthenticated");
    const orgId = identity.orgId;

    const bookingTypeData = {
      ...args,
      orgId,
    };

    if (args._id) {
      // Update existing booking type
      const existing = await ctx.db.get(args._id);
      if (!existing || existing.orgId !== orgId) {
        throw new Error("Booking type not found or access denied");
      }
      await ctx.db.patch(args._id, bookingTypeData);
      return args._id;
    } else {
      // Insert new booking type
      return await ctx.db.insert("bookingTypes", bookingTypeData);
    }
  },
});

/**
 * @function removeBookingType
 * @description Deletes a booking type.
 * @param {Object} args - The booking type data.
 * @param {string} args.id - ID of the booking type to delete.
 */
export const removeBookingType = mutation({
  args: { _id: v.id("bookingTypes") },
  handler: async (ctx, args) => {
    const identity = await ctx.auth.getUserIdentity();
    if (!identity) throw new Error("Unauthenticated");
    const orgId = identity.orgId;

    const existing = await ctx.db.get(args._id);
    if (!existing || existing.orgId !== orgId) {
      throw new Error("Booking type not found or access denied");
    }
    await ctx.db.delete(args._id);
  },
});

/**
 * @function getBookingType
 * @description Retrieves a single booking type.
 * @param {Object} args - The query arguments.
 * @param {string} args.id - ID of the booking type to retrieve.
 * @returns {Promise<Object|null>} The booking type object or null if not found.
 */
export const getBookingType = query({
  args: { _id: v.id("bookingTypes") },
  handler: async (ctx, args) => {
    const identity = await ctx.auth.getUserIdentity();
    if (!identity) throw new Error("Unauthenticated");
    const orgId = identity.orgId;

    const bookingType = await ctx.db.get(args._id);
    if (!bookingType || bookingType.orgId !== orgId) {
      return null;
    }
    return bookingType;
  },
});

/**
 * @function getAllBookingTypes
 * @description Retrieves all booking types for the authenticated user's organization.
 * @returns {Promise<Array>} An array of booking type objects.
 */
export const getAllBookingTypes = query({
  handler: async (ctx) => {
    const identity = await ctx.auth.getUserIdentity();
    if (!identity) throw new Error("Unauthenticated");
    const orgId = identity.orgId;

    return await ctx.db
      .query("bookingTypes")
      .filter((q) => q.eq(q.field("orgId"), orgId))
      .collect();
  },
});


// ... existing code ...

/**
 * @function getBookingTypesForFacility
 * @description Retrieves all booking types for a specific facility.
 * @param {Object} args - The query arguments.
 * @param {string} args.facilityId - ID of the facility to retrieve booking types for.
 * @returns {Promise<Array>} An array of booking type objects.
 */
export const getBookingTypesForFacility = query({
  args: { facilityId: v.id("facilities") },
  handler: async (ctx, args) => {
    const identity = await ctx.auth.getUserIdentity();
    if (!identity) throw new Error("Unauthenticated");
    const orgId = identity.orgId;

    return await ctx.db
      .query("bookingTypes")
      .filter((q) => q.eq(q.field("orgId"), orgId))
      .filter((q) => q.eq(q.field("facilityId"), args.facilityId))
      .collect();
  },
});

export const getBookingTypesForFacilityForCurrentOccupant = query({
  args: { facilityId: v.id('facilities') },
  handler: async (ctx, args) => {
    const identity = await ctx.auth.getUserIdentity();
    if (!identity) throw new Error('Unauthenticated');
    const orgId = identity.orgId;

    // Call the internal function to get audience groups
    const audienceGroups = await ctx.runQuery(
      internal.helperFunctions.getOccupantAudienceGroups,
      {}
    );

    const bookingTypes = await ctx.db
      .query('bookingTypes')
      .filter((q) => q.eq(q.field('orgId'), orgId))
      .filter((q) => q.eq(q.field('facilityId'), args.facilityId))
      .collect();

    return bookingTypes.filter((bookingType) => {
      if (!bookingType.audience || bookingType.audience.length === 0) {
        return true; // Include booking types without specific audience
      }

      const matchingAudiences = bookingType.audience.filter(
        (audienceItem: any) =>
          audienceGroups.some(
            (group: any) =>
              group.type === audienceItem.type &&
              group.entity === audienceItem.entity
          )
      );

      return matchingAudiences.length > 0;
    });
  },
});

// ... existing code ...
export const getBookingTypesForFacilityValueLabelPair = query({
  args: { facilityId: v.id("facilities") },
  handler: async (ctx, args) => {
    const identity = await ctx.auth.getUserIdentity();
    if (!identity) throw new Error("Unauthenticated");
    const orgId = identity.orgId;

    const bookingTypes = await ctx.db
      .query("bookingTypes")
      .filter((q) => q.eq(q.field("orgId"), orgId))
      .filter((q) => q.eq(q.field("facilityId"), args.facilityId))
      .collect();

    return bookingTypes.map(bookingType => ({
      value: bookingType._id,
      label: bookingType.name
    }));
  },
});