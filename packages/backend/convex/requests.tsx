import { action, internalQuery, mutation, query } from './_generated/server';
import { v } from 'convex/values';
import { sendPushNotificationToUser } from './pushNotifications';
import { Id } from './_generated/dataModel';

// Define the request schema for Convex
const requestSchema = {
  requestType: v.string(),
  vehicleId: v.string(),
  createdBy: v.optional(v.string()),
  notes: v.optional(v.string()),
  allocationId: v.optional(v.string()),
  evidenceImages: v.optional(
    v.array(
      v.object({
        storageId: v.string(),
        url: v.string(),
      })
    )
  ),
  parkId: v.optional(v.string()),
  parkTypeId: v.optional(v.string()),
  status: v.optional(v.string()),
  createdAt: v.optional(v.string()),
  assignedTo: v.optional(v.id('operators')),
  assignedAt: v.optional(v.string()),
  completedAt: v.optional(v.string()),
};

export const upsertRequest = mutation({
  args: {
    _id: v.optional(v.id('requests')),
    ...requestSchema,
  },
  handler: async (ctx, args) => {
    console.log(args);
    const identity = await ctx.auth.getUserIdentity();
    if (!identity) throw new Error('Unauthenticated');
    const orgId = identity.orgId;
    const userId = identity.userId;

    let result: Id<'requests'>;

    if (args._id) {
      // Update existing request
      const existing = await ctx.db.get(args._id);
      if (!existing || existing.orgId !== orgId) {
        throw new Error('Request not found or access denied');
      }
      await ctx.db.patch(args._id, {
        requestType: args.requestType,
        vehicleId: args.vehicleId,
        notes: args.notes,
        allocationId: args.allocationId,
        evidenceImages: args.evidenceImages,
        parkId: args.parkId,
        status: args.status,
        createdBy: userId,
        assignedTo: args.assignedTo,
        assignedAt: args.assignedAt,
        completedAt: args.completedAt,
      });
      result = args._id;

      // Log the update as an activity
      await ctx.db.insert('globalActivity', {
        title: 'Request Details Updated',
        description: `Request details have been updated.`,
        type: 'Details Updated',
        entityId: args._id,
        orgId,
      });
    } else {
      // Insert new request
      let parkId = args.parkId;
      let allocationId = args.allocationId;

      if (args.requestType.startsWith('pickup')) {
        // For pickup requests, get parkId and allocationId from the active parking log
        const activeParkingLog = await ctx.db
          .query('parkingLogs')
          .filter((q) => q.eq(q.field('vehicleId'), args.vehicleId))
          .filter((q) => q.eq(q.field('status'), 'active'))
          .first();

        if (activeParkingLog) {
          parkId = activeParkingLog.parkId;
          allocationId = activeParkingLog.allocationId;
        }
      }

      const parkTypeId =
        args.parkTypeId ||
        (allocationId
          ? (await ctx.db.get(allocationId as Id<'allocations'>))?.parkTypeId
          : undefined);

      result = await ctx.db.insert('requests', {
        ...args,
        parkId,
        allocationId,
        orgId,
        parkTypeId,
        createdBy: userId,
        status: 'received',
        createdAt: new Date().toISOString(),
      });

      // Log the new request as an activity
      await ctx.db.insert('globalActivity', {
        title: 'Request Added',
        description: `Request was added to the system`,
        type: 'Request Added',
        entityId: result,
        orgId,
      });
    }

    return result;
  },
});

export const getRequestsForCards = query({
  handler: async (ctx) => {
    const identity = await ctx.auth.getUserIdentity();
    if (!identity) throw new Error('Unauthenticated');
    const orgId = identity.orgId;

    const requests = await ctx.db
      .query('requests')
      .filter((q) => q.eq(q.field('orgId'), orgId))
      .order('desc')
      .collect();

    console.log(requests);

    const requestCards = await Promise.all(
      requests.map(async (request) => {
        const park = await ctx.db.get(request.parkId);

        const vehicle = await ctx.db.get(request.vehicleId);

        let assignedToName = 'Unassigned';
        if (request.assignedTo === 'system') {
          assignedToName = 'System';
        } else if (request.assignedTo) {
          const operator = await ctx.db.get(request.assignedTo);
          assignedToName = operator ? operator.name : 'Unassigned';
        }

        return {
          _id: request._id,
          requestType: request.requestType,
          status: request.status,
          vehicleDetails: vehicle
            ? `${vehicle.make} ${vehicle.model} ${vehicle.rego}`
            : 'Unknown',
          parkName: park ? park.name : 'Unknown',
          assignedToName,
          assignedAt: request.assignedAt || '',
          serviceTime: calculateServiceTime(
            request.createdAt,
            request.completedAt
          ),
          createdAt: request.createdAt,
        };
      })
    );

    return requestCards;
  },
});

export const getOccupancy = query({
  handler: async (ctx) => {
    const identity = await ctx.auth.getUserIdentity();
    if (!identity) throw new Error('Unauthenticated');
    const orgId = identity.orgId;

    // Get all userSpaces for the organization
    const userSpaces = await ctx.db
      .query('userSpaces')
      .filter((q) => q.eq(q.field('orgId'), orgId))
      .collect();

    // Extract unique space IDs
    const uniqueSpaceIds = new Set(
      userSpaces.map((userSpace) => userSpace.spaceId)
    );

    // Get all spaces for the organization
    const spaces = await ctx.db
      .query('spaces')
      .filter((q) => q.eq(q.field('orgId'), orgId))
      .collect();

    // Calculate occupancy
    let occupiedCount = 0;
    let unoccupiedCount = 0;

    spaces.forEach((space) => {
      if (uniqueSpaceIds.has(space._id)) {
        occupiedCount++;
      } else {
        unoccupiedCount++;
      }
    });

    return [
      { value: occupiedCount, label: 'Occupied', key: 'occupied' },
      { value: unoccupiedCount, label: 'Un-Occupied', key: 'unoccupied' },
    ];
  },
});

export const getActiveParkTypeSummary = query({
  handler: async (ctx) => {
    const identity = await ctx.auth.getUserIdentity();
    if (!identity) throw new Error('Unauthenticated');
    const orgId = identity.orgId;

    // Get all active parking logs grouped by parkTypeId
    const activeParkingLogs = await ctx.db
      .query('parkingLogs')
      .filter((q) => q.eq(q.field('orgId'), orgId))
      .filter((q) => q.neq(q.field('status'), 'completed'))
      .collect();

    // Group parking logs by parkTypeId
    const groupedLogs = activeParkingLogs.reduce((acc, log) => {
      const parkTypeId = log.parkTypeId;
      if (!acc[parkTypeId]) {
        acc[parkTypeId] = 0;
      }
      acc[parkTypeId]++;
      return acc;
    }, {});

    // Get park type names
    const parkTypeIds = Object.keys(groupedLogs);
    const parkTypes = await Promise.all(
      parkTypeIds.map((id) => ctx.db.get(id as Id<'parkTypes'>))
    );

    // Create final result
    const result = parkTypes.map((parkType, index) => {
      const parkTypeId = parkTypeIds[index];
      if (!parkTypeId) {
        return null; // or handle this case as appropriate for your use case
      }
      return {
        value: groupedLogs[parkTypeId] || 0,
        label: parkType?.name || 'Unknown',
        key: parkTypeId,
      };
    }).filter((item): item is NonNullable<typeof item> => item !== null);

    return result;
  },
});

export const getCurrentlyParkedCars = query({
  args: {},
  handler: async (ctx) => {
    const identity = await ctx.auth.getUserIdentity();
    if (!identity) throw new Error('Unauthenticated');
    const orgId = identity.orgId;

    // Query active parking requests
    const activeParks = await ctx.db
      .query('parkingLogs')
      .filter((q) => q.eq(q.field('orgId'), orgId))
      .filter((q) => q.eq(q.field('status'), 'active'))
      .collect();

    return activeParks.length;
  },
});

export const getAverageDailyServiceTime = query({
  args: {
    startDate: v.string(),
    endDate: v.string(),
    requestType: v.optional(v.string()),
  },
  handler: async (ctx, args) => {
    const identity = await ctx.auth.getUserIdentity();
    if (!identity) throw new Error('Unauthenticated');
    const orgId = identity.orgId;

    let requestsQuery = ctx.db
      .query('requests')
      .filter((q) => q.eq(q.field('orgId'), orgId))
      .filter((q) => q.eq(q.field('status'), 'completed'))
      .filter((q) => q.gte(q.field('completedAt'), args.startDate))
      .filter((q) => q.lt(q.field('completedAt'), args.endDate));

    if (args.requestType) {
      requestsQuery = requestsQuery.filter((q) =>
        q.eq(q.field('requestType'), args.requestType)
      );
    }

    const completedRequests = await requestsQuery.collect();

    if (completedRequests.length === 0) {
      return '0:00';
    }

    let totalServiceTimeMs = 0;
    for (const request of completedRequests) {
      const serviceTime = calculateServiceTime(
        request.createdAt,
        request.completedAt
      );
      if (serviceTime !== 'In progress') {
        totalServiceTimeMs += serviceTime;
      }
    }

    const averageServiceTimeMs = totalServiceTimeMs / completedRequests.length;
    const minutes = Math.floor(averageServiceTimeMs / 60000);
    const seconds = Math.round((averageServiceTimeMs % 60000) / 1000);

    return `${minutes}:${seconds.toString().padStart(2, '0')}`;
  },
});

// Helper function to calculate service time
function calculateServiceTime(
  createdAt: string,
  completedAt: string | undefined
): number | 'In progress' {
  if (!completedAt) return 'In progress';
  const start = new Date(createdAt).getTime();
  const end = new Date(completedAt).getTime();
  return end - start; // Return difference in milliseconds
}

export const assignRequest = mutation({
  args: { id: v.id('requests') },
  handler: async (ctx, args) => {
    const identity = await ctx.auth.getUserIdentity();
    if (!identity) throw new Error('Unauthenticated');
    const orgId = identity.orgId;

    const existing = await ctx.db.get(args.id);
    if (!existing || existing.orgId !== orgId) {
      throw new Error('Request not found or access denied');
    }

    const operator = await ctx.db
      .query('operators')
      .filter((q) => q.eq(q.field('userId'), identity.userId))
      .first();

    let assignedTo;
    let assignedToName;

    if (!operator) {
      assignedTo = 'system';
      assignedToName = 'System Admin';
    } else {
      assignedTo = operator._id;
      assignedToName = operator.name;
    }

    await ctx.db.patch(args.id, {
      assignedTo,
      assignedToName,
      assignedAt: new Date().toISOString(),
      status: 'assigned',
    });

    // Log the assignment as an activity
    await ctx.db.insert('globalActivity', {
      title: 'Request Assigned',
      description: `Request was assigned to an operator.`,
      type: 'Request Assigned',
      entityId: args.id,
      orgId,
    });

    // Send notification
    await sendPushNotificationToUser(ctx, {
      userId: existing.createdBy,
      title: '🚙 Request Status Update',
      body: `Your request has been assigned to ${assignedToName}.`,
    });
  },
});

export const getTotalCompletedRequestsByOperator = query({
  handler: async (ctx) => {
    const identity = await ctx.auth.getUserIdentity();
    if (!identity) throw new Error('Unauthenticated');
    const orgId = identity.orgId;

    // Get all completed requests for the organization
    const completedRequests = await ctx.db
      .query('requests')
      .filter((q) => q.eq(q.field('orgId'), orgId))
      .filter((q) => q.eq(q.field('status'), 'completed'))
      .collect();

    // Count requests for each operator
    const operatorCounts: Record<string, number> = {};
    for (const request of completedRequests) {
      const assignedTo = request.assignedTo || 'unassigned';
      operatorCounts[assignedTo] = (operatorCounts[assignedTo] || 0) + 1;
    }

    // Format the counts for return
    const formattedCounts = await Promise.all(
      Object.entries(operatorCounts).map(async ([operatorId, count]) => {
        let label = 'Unassigned';
        if (operatorId === 'system') {
          label = 'System';
        } else if (operatorId !== 'unassigned') {
          const operator = await ctx.db.get(operatorId as Id<string>);
          label = operator ? operator.name : 'Unknown Operator';
        }

        return {
          key: operatorId,
          value: count,
          label: label,
        };
      })
    );

    return formattedCounts;
  },
});

export const getTotalRequestsByType = query({
  handler: async (ctx) => {
    const identity = await ctx.auth.getUserIdentity();
    if (!identity) throw new Error('Unauthenticated');
    const orgId = identity.orgId;

    // Get all requests for the organization
    const requests = await ctx.db
      .query('requests')
      .filter((q) => q.eq(q.field('orgId'), orgId))
      .collect();

    // Count requests for each type
    const requestCounts: Record<string, number> = {};
    requests.forEach((request) => {
      const requestType = request.requestType;
      if (requestCounts[requestType]) {
        requestCounts[requestType]++;
      } else {
        requestCounts[requestType] = 1;
      }
    });

    // Format the counts for return
    const formattedCounts = Object.entries(requestCounts).map(
      ([type, count]) => ({
        key: type,
        value: count,
        label: type.startsWith('dropoff:vehicle')
          ? 'Dropoff'
          : type.startsWith('pickup:vehicle')
            ? 'Pickup'
            : type.startsWith('pickup:item')
              ? 'Item'
              : type.charAt(0).toUpperCase() + type.slice(1).replace(':', ' '),
      })
    );

    return formattedCounts;
  },
});

export const completeRequest = mutation({
  args: { id: v.id('requests') },
  handler: async (ctx, args) => {
    const identity = await ctx.auth.getUserIdentity();
    if (!identity) throw new Error('Unauthenticated');
    const orgId = identity.orgId;

    const existing = await ctx.db.get(args.id);
    if (!existing || existing.orgId !== orgId) {
      throw new Error('Request not found or access denied');
    }

    const completedAt = new Date().toISOString();

    await ctx.db.patch(args.id, {
      completedAt,
      status: 'completed',
    });

    // Log the completion as an activity
    await ctx.db.insert('globalActivity', {
      title: 'Request Completed',
      description: `Request was marked as completed.`,
      type: 'Request Completed',
      entityId: args.id,
      orgId,
    });

    if (existing.requestType.startsWith('pickup:vehicle')) {
      // For pickup requests, close out the active parking log
      const activeParkingLog = await ctx.db
        .query('parkingLogs')
        .filter((q) => q.eq(q.field('vehicleId'), existing.vehicleId))
        .filter((q) => q.eq(q.field('status'), 'active'))
        .first();

      if (activeParkingLog) {
        await ctx.db.patch(activeParkingLog._id, {
          sessionEnd: completedAt,
          status: 'completed',
        });
      }
    } else if (existing.requestType.startsWith('dropoff:vehicle')) {
      // For dropoff requests, create a new parking log
      await ctx.db.insert('parkingLogs', {
        requestId: args.id,
        vehicleId: existing.vehicleId,
        parkId: existing.parkId,
        parkTypeId: existing.parkTypeId,
        allocationId: existing.allocationId,
        sessionStart: completedAt,
        status: 'active',
        orgId,
      });
    }

    // Send notification
    await sendPushNotificationToUser(ctx, {
      userId: existing.createdBy,
      title: '✅ Request Status Update',
      body: `Your request has been completed.`,
    });
  },
});

export const moveParkingLog = mutation({
  args: {
    parkingLogId: v.id('parkingLogs'),
    newParkId: v.id('parkingSpots'),
  },
  handler: async (ctx, args) => {
    const identity = await ctx.auth.getUserIdentity();
    if (!identity) throw new Error('Unauthenticated');
    const orgId = identity.orgId;

    const parkingLog = await ctx.db.get(args.parkingLogId);
    if (!parkingLog || parkingLog.orgId !== orgId) {
      throw new Error('Parking log not found or access denied');
    }

    const newParkingSpot = await ctx.db.get(args.newParkId);
    if (!newParkingSpot || newParkingSpot.orgId !== orgId) {
      throw new Error('New parking spot not found or access denied');
    }

    // Update the parking log with the new park ID
    await ctx.db.patch(args.parkingLogId, {
      parkId: args.newParkId,
    });

    // Log the move as an activity
    await ctx.db.insert('globalActivity', {
      title: 'Vehicle Moved',
      description: `Vehicle was moved to a new parking spot`,
      type: 'Vehicle Moved',
      entityId: args.parkingLogId,
      orgId,
    });

    // Optionally, you could send a notification here if needed
    // await sendPushNotificationToUser(ctx, {
    //   userId: parkingLog.createdBy,
    //   title: '🚗 Vehicle Moved',
    //   body: `Your vehicle has been moved to a new parking spot.`,
    // });
  },
});

export const removeRequest = mutation({
  args: { id: v.id('requests') },
  handler: async (ctx, args) => {
    const identity = await ctx.auth.getUserIdentity();
    if (!identity) throw new Error('Unauthenticated');
    const orgId = identity.orgId;

    const existing = await ctx.db.get(args.id);
    if (!existing || existing.orgId !== orgId) {
      throw new Error('Request not found or access denied');
    }
    await ctx.db.delete(args.id);

    // Log the removal as an activity
    await ctx.db.insert('globalActivity', {
      title: 'Request Removed',
      description: `Request was removed from the system`,
      type: 'Request Removed',
      entityId: args.id,
      orgId,
    });
  },
});

export const getRequest = query({
  args: { id: v.id('requests') },
  handler: async (ctx, args) => {
    const identity = await ctx.auth.getUserIdentity();
    if (!identity) throw new Error('Unauthenticated');
    const orgId = identity.orgId;

    const request = await ctx.db.get(args.id);
    if (!request || request.orgId !== orgId) {
      return null;
    }
    return request;
  },
});

export const getAllRequests = query({
  handler: async (ctx) => {
    const identity = await ctx.auth.getUserIdentity();
    if (!identity) throw new Error('Unauthenticated');
    const orgId = identity.orgId;

    return await ctx.db
      .query('requests')
      .filter((q) => q.eq(q.field('orgId'), orgId))
      .collect();
  },
});

export const getActiveParkingLogs = query({
  args: { parkId: v.optional(v.id('parks')) },
  handler: async (ctx, args) => {
    const identity = await ctx.auth.getUserIdentity();
    if (!identity) throw new Error('Unauthenticated');
    const orgId = identity.orgId;

    let q = ctx.db
      .query('parkingLogs')
      .filter((q) => q.eq(q.field('orgId'), orgId))
      .filter((q) => q.eq(q.field('status'), 'active'));

    if (args.parkId) {
      q = q.filter((q) => q.eq(q.field('parkId'), args.parkId));
    }

    return await q.collect();
  },
});

export const getActiveRequestsForVehicles = query({
  args: { vehicleIds: v.array(v.string()) },
  handler: async (ctx, args) => {
    console.log('Starting getActiveRequestsForVehicles query');
    console.log('Received vehicleIds:', args.vehicleIds);

    const identity = await ctx.auth.getUserIdentity();
    if (!identity) throw new Error('Unauthenticated');
    const orgId = identity.orgId;
    console.log('Authenticated user orgId:', orgId);

    // Get all active requests
    const activeRequests = await ctx.db
      .query('requests')
      .filter((q) => q.eq(q.field('orgId'), orgId))
      .filter((q) => q.neq(q.field('status'), 'completed'))
      .order('desc')
      .collect();
    console.log('Total active requests:', activeRequests.length);

    // Filter requests for the specified vehicles
    const filteredRequests = activeRequests.filter((request) =>
      args.vehicleIds.includes(request.vehicleId)
    );
    console.log('Filtered requests:', filteredRequests.length);

    // Create a map to store position for each request
    const positionMap = new Map(
      activeRequests.map((request, index) => [request._id, index + 1])
    );
    console.log('Position map created');

    // Format the results
    const formattedRequests = await Promise.all(
      filteredRequests.map(async (request) => {
        console.log('Processing request:', request._id);
        const vehicle = await ctx.db.get(request.vehicleId);
        console.log('Vehicle details:', vehicle);
        return {
          vehicle: {
            make: vehicle?.make ?? 'Unknown',
            model: vehicle?.model ?? 'Unknown',
            year: vehicle?.year ?? 0,
            rego: vehicle?.rego ?? 'Unknown',
          },
          positionInQueue: positionMap.get(request._id) ?? 0,
          createdTime: request.createdAt,
          currentStatus: request.status,
        };
      })
    );

    console.log('Formatted requests:', formattedRequests.length);
    return formattedRequests;
  },
});

export const getRequestForEdit = query({
  args: { id: v.id('requests') },
  handler: async (ctx, args) => {
    const identity = await ctx.auth.getUserIdentity();
    if (!identity) throw new Error('Unauthenticated');
    const orgId = identity.orgId;

    const request = await ctx.db.get(args.id);
    if (!request || request.orgId !== orgId) {
      throw new Error('Request not found or access denied');
    }

    return {
      _id: request._id,
      requestType: request.requestType,
      vehicleId: request.vehicleId,
      notes: request.notes,
      allocationId: request.allocationId,
      evidenceImages: request.evidenceImages,
      parkId: request.parkId,
      status: request.status,
      assignedTo: request.assignedTo,
      assignedAt: request.assignedAt,
      completedAt: request.completedAt,
    };
  },
});