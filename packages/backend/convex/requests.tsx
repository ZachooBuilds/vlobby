import { action, internalQuery, mutation, query } from './_generated/server';
import { v } from 'convex/values';

// Define the request schema for Convex
const requestSchema = {
  requestType: v.string(),
  vehicleId: v.string(),
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

    let result: string;

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

      result = await ctx.db.insert('requests', {
        ...args,
        parkId,
        allocationId,
        orgId,
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

// Helper function to calculate service time
function calculateServiceTime(
  createdAt: string,
  completedAt: string | undefined
): string {
  if (!completedAt) return 'In progress';
  const start = new Date(createdAt).getTime();
  const end = new Date(completedAt).getTime();
  const diff = end - start;
  const minutes = Math.floor(diff / 60000);
  return `${minutes} minutes`;
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
