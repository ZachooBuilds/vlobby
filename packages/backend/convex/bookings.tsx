import { mutation, query } from './_generated/server';
import { v } from 'convex/values';
import { getUserById } from './allUsers';
import { getCurrentOccupant } from './occupants';

export const upsertBooking = mutation({
  args: {
    _id: v.optional(v.id('bookings')),
    facilityId: v.id('facilities'),
    bookingTypeId: v.id('bookingTypes'),
    notes: v.optional(v.string()),
    userId: v.id('users'),
    date: v.optional(v.string()),
    slots: v.array(
      v.object({
        slotIndex: v.number(),
        slotTime: v.string(),
      })
    ),
    startTime: v.string(),
    endTime: v.string(),
    status: v.string(),
  },
  handler: async (ctx, args) => {
    const identity = await ctx.auth.getUserIdentity();
    if (!identity) throw new Error('Unauthenticated');
    const orgId = identity.orgId;

    let result: string;

    if (args._id) {
      // Update existing booking
      const existing = await ctx.db.get(args._id);
      if (!existing || existing.orgId !== orgId) {
        throw new Error('Booking not found or access denied');
      }
      await ctx.db.patch(args._id, {
        facilityId: args.facilityId,
        bookingTypeId: args.bookingTypeId,
        notes: args.notes,
        userId: args.userId,
        date: args.date,
        slots: args.slots,
        startTime: args.startTime,
        endTime: args.endTime,
        status: args.status,
      });
      result = args._id;

      await ctx.db.insert('globalActivity', {
        title: 'Booking Updated',
        description: `Booking details have been updated.`,
        type: 'Booking Updated',
        entityId: args._id,
        orgId,
      });
    } else {
      // Insert new booking
      result = await ctx.db.insert('bookings', {
        facilityId: args.facilityId,
        bookingTypeId: args.bookingTypeId,
        notes: args.notes,
        userId: args.userId,
        date: args.date,
        slots: args.slots,
        startTime: args.startTime,
        endTime: args.endTime,
        status: args.status,
        orgId,
      });

      await ctx.db.insert('globalActivity', {
        title: 'Booking Created',
        description: `A new booking was created`,
        type: 'Booking Created',
        entityId: result,
        orgId,
      });
    }

    return result;
  },
});

export const setBookingStatus = mutation({
  args: {
    bookingId: v.id('bookings'),
    status: v.string(),
  },
  handler: async (ctx, args) => {
    const identity = await ctx.auth.getUserIdentity();
    if (!identity) throw new Error('Unauthenticated');
    const orgId = identity.orgId;

    const booking = await ctx.db.get(args.bookingId);
    if (!booking || booking.orgId !== orgId) {
      throw new Error('Booking not found or access denied');
    }

    // Validate the status
    if (
      !['pending', 'approved', 'rejected', 'cancelled'].includes(args.status)
    ) {
      throw new Error('Invalid status');
    }

    // Update the booking status
    await ctx.db.patch(args.bookingId, { status: args.status });

    // Log the activity
    await ctx.db.insert('globalActivity', {
      title: 'Booking Status Updated',
      description: `Booking status has been updated to ${args.status}`,
      type: 'Booking Status Updated',
      entityId: args.bookingId,
      orgId,
    });

    return args.bookingId;
  },
});

export const getBooking = query({
  args: { id: v.id('bookings') },
  handler: async (ctx, args) => {
    const identity = await ctx.auth.getUserIdentity();
    if (!identity) throw new Error('Unauthenticated');
    const orgId = identity.orgId;

    const booking = await ctx.db.get(args.id);
    if (!booking || booking.orgId !== orgId) {
      return null;
    }
    return booking;
  },
});

export const getAllBookings = query({
  handler: async (ctx) => {
    const identity = await ctx.auth.getUserIdentity();
    if (!identity) throw new Error('Unauthenticated');
    const orgId = identity.orgId;

    return await ctx.db
      .query('bookings')
      .filter((q) => q.eq(q.field('orgId'), orgId))
      .collect();
  },
});

// Get all the bookings for a given facility.
export const getBookingsByFacilityId = query({
  args: { facilityId: v.id('facilities') },
  handler: async (ctx, args) => {
    try {
      const identity = await ctx.auth.getUserIdentity();
      if (!identity) throw new Error('User is not authenticated');
      const orgId = identity.orgId;

      // Fetch the facility details
      const facility = await ctx.db.get(args.facilityId);
      if (!facility || facility.orgId !== orgId) {
        throw new Error('Facility not found or access denied');
      }

      // fetch all the bookings for the given facility
      const bookings = await ctx.db
        .query('bookings')
        .filter((q) => q.eq(q.field('orgId'), orgId))
        .filter((q) => q.eq(q.field('facilityId'), args.facilityId))
        .collect();

      // Fetch booking type details for all bookings
      const bookingTypeIds = [
        ...new Set(bookings.map((booking) => booking.bookingTypeId)),
      ];
      const bookingTypes = await Promise.all(
        bookingTypeIds.map((id) => ctx.db.get(id))
      );

      // Create a map of booking type IDs to names
      const bookingTypeMap = new Map(
        bookingTypes.map((type) => [type._id, type.name])
      );

      // Fetch user details for all bookings
      const userIds = [...new Set(bookings.map((booking) => booking.userId))];
      const users = await Promise.all(userIds.map((id) => ctx.db.get(id)));

      // Create a map of user IDs to names
      const userMap = new Map(
        users.map((user) => [user._id, user.firstName + ' ' + user.lastName])
      );

      // Add booking type name and user name to each booking
      const bookingsWithTypeAndUserName = bookings.map((booking) => ({
        ...booking,
        facilityName: facility.name,
        bookingTypeName: bookingTypeMap.get(booking.bookingTypeId) || 'Unknown',
        userName: userMap.get(booking.userId) || 'Unknown User',
      }));

      // Return facility name and bookings with type names and user names
      return bookingsWithTypeAndUserName;
    } catch (error) {
      console.error('Error in getBookingsByFacilityId:', error);
      throw error;
    }
  },
});

export const getAllBookingsWithDetailsForCurrentOccupant = query({
  handler: async (ctx) => {
    try {
      const identity = await ctx.auth.getUserIdentity();
      if (!identity) throw new Error('User is not authenticated');
      const orgId = identity.orgId;
      const userId = identity.subject;

      const user = await getCurrentOccupant(ctx, {});

      // Fetch all bookings for the organization
      const bookings = await ctx.db
        .query('bookings')
        .filter((q) => q.eq(q.field('orgId'), orgId))
        .filter((q) => q.eq(q.field('userId'), user._id))
        .filter((q) =>
          q.gte(q.field('date'), new Date().toISOString().split('T')[0])
        )
        .collect();

      // Fetch facility details for all bookings
      const facilityIds = [
        ...new Set(bookings.map((booking) => booking.facilityId)),
      ];
      const facilities = await Promise.all(
        facilityIds.map((id) => ctx.db.get(id))
      );

      // Create a map of facility IDs to names
      const facilityMap = new Map(
        facilities.map((facility) => [facility._id, facility.name])
      );

      // Fetch booking type details for all bookings
      const bookingTypeIds = [
        ...new Set(bookings.map((booking) => booking.bookingTypeId)),
      ];
      const bookingTypes = await Promise.all(
        bookingTypeIds.map((id) => ctx.db.get(id))
      );

      // Create a map of booking type IDs to names
      const bookingTypeMap = new Map(
        bookingTypes.map((type) => [type._id, type.name])
      );

      // Fetch user details for all bookings
      const userIds = [...new Set(bookings.map((booking) => booking.userId))];
      const users = await Promise.all(userIds.map((id) => ctx.db.get(id)));

      // Create a map of user IDs to names
      const userMap = new Map(
        users.map((user) => [user._id, user.firstName + ' ' + user.lastName])
      );

      // Add facility name, booking type name, and user name to each booking
      const bookingsWithDetails = bookings.map((booking) => ({
        ...booking,
        facilityName: facilityMap.get(booking.facilityId) || 'Unknown Facility',
        bookingTypeName: bookingTypeMap.get(booking.bookingTypeId) || 'Unknown',
        userName: userMap.get(booking.userId) || 'Unknown User',
      }));

      // Return bookings with facility names, booking type names, and user names
      return bookingsWithDetails;
    } catch (error) {
      console.error('Error in getAllBookingsWithDetails:', error);
      throw error;
    }
  },
});

export const getAllBookingsWithDetails = query({
  handler: async (ctx) => {
    try {
      const identity = await ctx.auth.getUserIdentity();
      if (!identity) throw new Error('User is not authenticated');
      const orgId = identity.orgId;

      // Fetch all bookings for the organization
      const bookings = await ctx.db
        .query('bookings')
        .filter((q) => q.eq(q.field('orgId'), orgId))
        .collect();

      // Fetch facility details for all bookings
      const facilityIds = [
        ...new Set(bookings.map((booking) => booking.facilityId)),
      ];
      const facilities = await Promise.all(
        facilityIds.map((id) => ctx.db.get(id))
      );

      // Create a map of facility IDs to names
      const facilityMap = new Map(
        facilities.map((facility) => [facility._id, facility.name])
      );

      // Fetch booking type details for all bookings
      const bookingTypeIds = [
        ...new Set(bookings.map((booking) => booking.bookingTypeId)),
      ];
      const bookingTypes = await Promise.all(
        bookingTypeIds.map((id) => ctx.db.get(id))
      );

      // Create a map of booking type IDs to names
      const bookingTypeMap = new Map(
        bookingTypes.map((type) => [type._id, type.name])
      );

      // Fetch user details for all bookings
      const userIds = [...new Set(bookings.map((booking) => booking.userId))];
      const users = await Promise.all(userIds.map((id) => ctx.db.get(id)));

      // Create a map of user IDs to names
      const userMap = new Map(
        users.map((user) => [user._id, user.firstName + ' ' + user.lastName])
      );

      // Add facility name, booking type name, and user name to each booking
      const bookingsWithDetails = bookings.map((booking) => ({
        ...booking,
        facilityName: facilityMap.get(booking.facilityId) || 'Unknown Facility',
        bookingTypeName: bookingTypeMap.get(booking.bookingTypeId) || 'Unknown',
        userName: userMap.get(booking.userId) || 'Unknown User',
      }));

      // Return bookings with facility names, booking type names, and user names
      return bookingsWithDetails;
    } catch (error) {
      console.error('Error in getAllBookingsWithDetails:', error);
      throw error;
    }
  },
});

export const getAllBookingsWithDetailsByStatus = query({
  args: {
    status: v.optional(v.string()),
  },
  handler: async (ctx, args) => {
    try {
      const identity = await ctx.auth.getUserIdentity();
      if (!identity) throw new Error('User is not authenticated');
      const orgId = identity.orgId;

      // Fetch all bookings for the organization, filtered by status if provided
      let bookingsQuery = ctx.db
        .query('bookings')
        .filter((q) => q.eq(q.field('orgId'), orgId));

      if (args.status) {
        bookingsQuery = bookingsQuery.filter((q) =>
          q.eq(q.field('status'), args.status)
        );
      }

      const bookings = await bookingsQuery.collect();

      // Fetch facility details for all bookings
      const facilityIds = [
        ...new Set(bookings.map((booking) => booking.facilityId)),
      ];
      const facilities = await Promise.all(
        facilityIds.map((id) => ctx.db.get(id))
      );

      // Create a map of facility IDs to names
      const facilityMap = new Map(
        facilities.map((facility) => [facility._id, facility.name])
      );

      // Fetch booking type details for all bookings
      const bookingTypeIds = [
        ...new Set(bookings.map((booking) => booking.bookingTypeId)),
      ];
      const bookingTypes = await Promise.all(
        bookingTypeIds.map((id) => ctx.db.get(id))
      );

      // Create a map of booking type IDs to names
      const bookingTypeMap = new Map(
        bookingTypes.map((type) => [type._id, type.name])
      );

      // Fetch user details for all bookings
      const userIds = [...new Set(bookings.map((booking) => booking.userId))];
      const users = await Promise.all(userIds.map((id) => ctx.db.get(id)));

      // Create a map of user IDs to names
      const userMap = new Map(
        users.map((user) => [user._id, user.firstName + ' ' + user.lastName])
      );

      // Add facility name, booking type name, and user name to each booking
      const bookingsWithDetails = bookings.map((booking) => ({
        ...booking,
        facilityName: facilityMap.get(booking.facilityId) || 'Unknown Facility',
        bookingTypeName: bookingTypeMap.get(booking.bookingTypeId) || 'Unknown',
        userName: userMap.get(booking.userId) || 'Unknown User',
      }));

      // Return bookings with facility names, booking type names, and user names
      return bookingsWithDetails;
    } catch (error) {
      console.error('Error in getAllBookingsWithDetails:', error);
      throw error;
    }
  },
});

export const getBookingsForFacilityOnDate = query({
  args: {
    facilityId: v.id('facilities'),
    startDate: v.string(),
    endDate: v.string(),
    excludeBookingId: v.optional(v.id('bookings')),
  },
  handler: async (ctx, args) => {
    const identity = await ctx.auth.getUserIdentity();
    if (!identity) throw new Error('Unauthenticated');
    const orgId = identity.orgId;

    console.log('args', args);

    const bookings = await ctx.db
      .query('bookings')
      .filter((q) => q.eq(q.field('orgId'), orgId))
      .filter((q) => q.eq(q.field('facilityId'), args.facilityId))
      .filter((q) =>
        q.and(
          q.gte(q.field('startTime'), args.startDate),
          q.lt(q.field('endTime'), args.endDate)
        )
      )
      .filter((q) => q.neq(q.field('_id'), args.excludeBookingId))
      .collect();

    console.log('bookings with exclude', bookings);

    // Fetch booking types for all bookings
    const bookingTypeIds = [
      ...new Set(bookings.map((booking) => booking.bookingTypeId)),
    ];
    const bookingTypes = await Promise.all(
      bookingTypeIds.map((id) => ctx.db.get(id))
    );

    // Create a map of booking type IDs to names
    const bookingTypeMap = new Map(
      bookingTypes.map((type) => [type._id, type.name])
    );

    // Fetch user details for all bookings
    const userIds = [...new Set(bookings.map((booking) => booking.userId))];
    const users = await Promise.all(userIds.map((id) => ctx.db.get(id)));

    // Create a map of user IDs to names
    const userMap = new Map(
      users.map((user) => [user._id, `${user.firstName} ${user.lastName}`])
    );

    // Add booking type name and user name to each booking
    const bookingsWithDetails = bookings.map((booking) => ({
      ...booking,
      bookingTypeName: bookingTypeMap.get(booking.bookingTypeId) || 'Unknown',
      userName: userMap.get(booking.userId) || 'Unknown User',
      dateString: booking.date,
    }));

    return bookingsWithDetails;
  },
});

export const getBookedSlotsForFacility = query({
  args: {
    facilityId: v.id('facilities'),
    date: v.string(),
    bookingTypeId: v.id('bookingTypes'),
  },
  handler: async (ctx, args) => {
    const identity = await ctx.auth.getUserIdentity();
    if (!identity) throw new Error('Unauthenticated');
    const orgId = identity.orgId;

    // // Parse the date string to a Date object
    const bookingDate = new Date(args.date);
    // queryDate.setUTCHours(0, 0, 0, 0);
    // // const startOfDay = queryDate.toISOString();
    // queryDate.setUTCHours(23, 59, 59, 999);
    // // const endOfDay = queryDate.toISOString();

    // console.log("Start of day:", startOfDay);
    // console.log("End of day:", endOfDay);

    // Fetch bookings for the given facility and date
    const bookings = await ctx.db
      .query('bookings')
      .filter((q) => q.eq(q.field('orgId'), orgId))
      .filter((q) => q.eq(q.field('facilityId'), args.facilityId))
      .filter((q) => q.eq(q.field('date'), args.date))
      .collect();

    console.log('Bookings:', bookings);

    // Get the booking type
    const bookingType = await ctx.db.get(args.bookingTypeId);
    if (!bookingType || bookingType.orgId !== orgId) {
      throw new Error('Booking type not found or access denied');
    }

    console.log('Booking Type:', bookingType);

    // Calculate booked slots based on start time, end time, and booking type interval
    const bookedSlotIndexes = bookings.flatMap((booking) => {
      const startTime = new Date(booking.startTime);
      const endTime = new Date(booking.endTime);
      const bookingTypeStartTime = new Date(
        startTime.getFullYear(),
        startTime.getMonth(),
        startTime.getDate(),
        new Date(bookingType.startTime).getHours(),
        new Date(bookingType.startTime).getMinutes()
      );
      const bookingTypeEndTime = new Date(bookingTypeStartTime);
      bookingTypeEndTime.setHours(bookingTypeEndTime.getHours() + 24);

      const intervalMinutes = bookingType.interval;

      console.log('Start Time:', startTime);
      console.log('End Time:', endTime);
      console.log('Booking Type Start Time:', bookingTypeStartTime);
      console.log('Booking Type End Time:', bookingTypeEndTime);
      console.log('Interval:', intervalMinutes);

      const slots = [];
      let currentTime = bookingTypeStartTime;
      let slotIndex = 0;

      while (currentTime < bookingTypeEndTime) {
        if (currentTime >= startTime && currentTime < endTime) {
          slots.push(slotIndex);
        }
        currentTime.setMinutes(currentTime.getMinutes() + intervalMinutes);
        slotIndex++;
      }
      console.log('Slots:', slots);
      return slots;
    });

    return [...new Set(bookedSlotIndexes)]; // Remove duplicates
  },
});

export const deleteBooking = mutation({
  args: { id: v.id('bookings') },
  handler: async (ctx, args) => {
    const identity = await ctx.auth.getUserIdentity();
    if (!identity) throw new Error('Unauthenticated');
    const orgId = identity.orgId;

    const existing = await ctx.db.get(args.id);
    if (!existing || existing.orgId !== orgId) {
      throw new Error('Booking not found or access denied');
    }
    await ctx.db.delete(args.id);

    await ctx.db.insert('globalActivity', {
      title: 'Booking Deleted',
      description: `A booking was deleted`,
      type: 'Booking Deleted',
      entityId: args.id,
      orgId,
    });

    return { success: true };
  },
});
