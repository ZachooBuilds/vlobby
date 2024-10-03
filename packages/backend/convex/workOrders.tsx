import { Id } from './_generated/dataModel';
import { mutation, query } from './_generated/server';
import { v } from 'convex/values';

export const upsertWorkOrder = mutation({
  args: {
    _id: v.optional(v.id('workOrders')),
    locationId: v.optional(v.id('ticketLocations')),
    spaceId: v.optional(v.id('spaces')),
    facilityId: v.optional(v.id('facilities')),
    floor: v.optional(v.string()),
    buildingId: v.optional(v.id('sites')),
    priority: v.string(),
    workOrderType: v.string(),
    status: v.optional(v.string()),
    assignedContractorId: v.optional(v.string()),
    description: v.string(),
    title: v.string(),
    linkedTickets: v.optional(
      v.array(
        v.object({
          value: v.string(),
          label: v.string(),
        })
      )
    ),
    tags: v.array(
      v.object({
        value: v.string(),
        label: v.string(),
      })
    ),
    dueDate: v.optional(v.string()),
    files: v.optional(v.array(v.string())),
  },
  handler: async (ctx, args) => {
    const identity = await ctx.auth.getUserIdentity();
    if (!identity) throw new Error('Unauthenticated');
    const orgId = identity.orgId;
    const userId = identity.userId;

    let linkedAssetId = null;
    let linkedAssetType = null;
    let status = 'Open';
    let buildingId = args.buildingId;
    let floor = args.floor;

    if (args.facilityId) {
      linkedAssetId = args.facilityId;
      linkedAssetType = 'facility';
      const facility = await ctx.db.get(args.facilityId);
      if (facility) {
        buildingId = facility.buildingId;
        floor = facility.floor;
      }
    } else if (args.spaceId) {
      linkedAssetId = args.spaceId;
      linkedAssetType = 'space';
      const space = await ctx.db.get(args.spaceId);
      if (space) {
        buildingId = space.buildingId;
        floor = space.floor;
      }
    }

    if (args.assignedContractorId) {
      status = 'Assigned';
    } else {
      status = 'Pending';
    }

    const workOrderData = {
      locationId: args.locationId,
      linkedAssetId,
      linkedAssetType,
      buildingId,
      floor,
      status,
      title: args.title,
      priority: args.priority,
      workOrderType: args.workOrderType,
      assignedContractorId: args.assignedContractorId,
      facilityId: args.facilityId,
      spaceId: args.spaceId,
      description: args.description,
      tags: args.tags,
      dueDate: args.dueDate,
      files: args.files,
      linkedTickets: args.linkedTickets,
      orgId,
      userId,
    };

    if (args._id) {
      // Update existing work order
      const existing = await ctx.db.get(args._id);
      if (!existing || existing.orgId !== orgId) {
        throw new Error('Work order not found or access denied');
      }
      await ctx.db.patch(args._id, workOrderData);

      // Log the work order update as an activity
      await ctx.db.insert('globalActivity', {
        title: 'Work Order Updated',
        description: `Work order details have been updated Status: ${status} Priority: ${args.priority}`,
        type: 'Work Order Updated',
        entityId: args._id,
        orgId,
      });
    } else {
      // Create new work order
      const result = await ctx.db.insert('workOrders', workOrderData);

      // Log the new work order as an activity
      await ctx.db.insert('globalActivity', {
        title: 'Work Order Created',
        description: `Work order details have been added to database`,
        type: 'New Work Order',
        entityId: result,
        orgId,
      });
    }
  },
});

export const updateAssignedContractor = mutation({
  args: { contractorId: v.id('contractors'), workOrderId: v.id('workOrders') },
  handler: async (ctx, args) => {
    const identity = await ctx.auth.getUserIdentity();
    if (!identity) throw new Error('Unauthenticated');
    const orgId = identity.orgId;

    const workOrder = await ctx.db.get(args.workOrderId);
    if (!workOrder || workOrder.orgId !== orgId) {
      throw new Error('Work order not found or access denied');
    }
    await ctx.db.patch(args.workOrderId, {
      assignedContractorId: args.contractorId,
    });
  },
});

export const updateWorkOrderStatus = mutation({
  args: { status: v.string(), workOrderId: v.id('workOrders') },
  handler: async (ctx, args) => {
    const identity = await ctx.auth.getUserIdentity();
    if (!identity) throw new Error('Unauthenticated');
    const orgId = identity.orgId;

    const workOrder = await ctx.db.get(args.workOrderId);
    if (!workOrder || workOrder.orgId !== orgId) {
      throw new Error('Work order not found or access denied');
    }
    await ctx.db.patch(args.workOrderId, {
      status: args.status,
    });

    await ctx.db.insert('globalActivity', {
      title: 'Work Order Status Updated',
      description: `Work order status has been updated to ${args.status}`,
      type: 'Status Update',
      entityId: args.workOrderId,
      orgId,
    });
  },
});

export const getWorkOrdersByUserId = query({
  args: { userId: v.string() },
  handler: async (ctx, args) => {
    const identity = await ctx.auth.getUserIdentity();
    if (!identity) throw new Error('Unauthenticated');
    const orgId = identity.orgId;

    const workOrders = await ctx.db
      .query('workOrders')
      .filter((q) => q.eq(q.field('orgId'), orgId))
      .filter((q) => q.eq(q.field('userId'), args.userId))
      .collect();

    const mappedWorkOrders = await Promise.all(
      workOrders.map(async (workOrder) => {
        let contractorFirstName = null;
        let contractorLastName = null;
        let contractorCompany = null;
        if (workOrder.assignedContractorId) {
          const contractor = await ctx.db.get(workOrder.assignedContractorId);
          if (contractor) {
            contractorFirstName = contractor.firstName;
            contractorLastName = contractor.lastName;
            contractorCompany = contractor.companyName;
          }
        }

        return {
          _id: workOrder._id,
          title: workOrder.title,
          assignedContractorId: workOrder.assignedContractorId,
          contractorFirstName,
          contractorLastName,
          contractorCompany,
          _creationTime: workOrder._creationTime,
          status: workOrder.status,
          priority: workOrder.priority,
        };
      })
    );

    console.log(mappedWorkOrders);

    return mappedWorkOrders;
  },
});

export const getWorkOrdersBySpaceId = query({
  args: { spaceId: v.id('spaces') },
  handler: async (ctx, args) => {
    const identity = await ctx.auth.getUserIdentity();
    if (!identity) throw new Error('Unauthenticated');
    const orgId = identity.orgId;

    const workOrders = await ctx.db
      .query('workOrders')
      .filter((q) =>
        q.and(
          q.eq(q.field('orgId'), orgId),
          q.eq(q.field('linkedAssetType'), 'space'),
          q.eq(q.field('linkedAssetId'), args.spaceId)
        )
      )
      .collect();

    const mappedWorkOrders = await Promise.all(
      workOrders.map(async (workOrder) => {
        let contractorFirstName = null;
        let contractorLastName = null;
        let contractorCompany = null;
        if (workOrder.assignedContractorId) {
          const contractor = await ctx.db.get(workOrder.assignedContractorId);
          if (contractor) {
            contractorFirstName = contractor.firstName;
            contractorLastName = contractor.lastName;
            contractorCompany = contractor.companyName;
          }
        }

        return {
          _id: workOrder._id,
          title: workOrder.title,
          assignedContractorId: workOrder.assignedContractorId,
          contractorFirstName,
          contractorLastName,
          contractorCompany,
          _creationTime: workOrder._creationTime,
          status: workOrder.status,
          priority: workOrder.priority,
        };
      })
    );

    console.log(mappedWorkOrders);

    return mappedWorkOrders;
  },
});

export const getWorkOrdersByTicketId = query({
  args: { ticketId: v.string() },
  handler: async (ctx, args) => {
    const identity = await ctx.auth.getUserIdentity();
    if (!identity) throw new Error('Unauthenticated');
    const orgId = identity.orgId;

    const workOrders = await ctx.db
      .query('workOrders')
      .filter((q) => q.eq(q.field('orgId'), orgId))
      .collect();

    const linkedWorkOrders = await Promise.all(
      workOrders
        .filter((workOrder) =>
          workOrder.linkedTickets?.some(
            (ticket: { value: string }) => ticket.value === args.ticketId
          )
        )
        .map(async (workOrder) => {
          let contractorFirstName = null;
          let contractorLastName = null;
          let contractorCompany = null;
          if (workOrder.assignedContractorId) {
            const contractor = await ctx.db.get(workOrder.assignedContractorId);
            if (contractor) {
              contractorFirstName = contractor.firstName;
              contractorLastName = contractor.lastName;
              contractorCompany = contractor.companyName;
            }
          }

          return {
            _id: workOrder._id,
            title: workOrder.title,
            assignedContractorId: workOrder.assignedContractorId,
            contractorFirstName,
            contractorLastName,
            contractorCompany,
            _creationTime: workOrder._creationTime,
            status: workOrder.status,
            priority: workOrder.priority,
          };
        })
    );

    console.log(linkedWorkOrders);

    return linkedWorkOrders;
  },
});

// Get all work orders for the organization
export const getAllWorkOrders = query({
  handler: async (ctx) => {
    const identity = await ctx.auth.getUserIdentity();
    if (!identity) throw new Error('Unauthenticated');
    const orgId = identity.orgId;

    return await ctx.db
      .query('workOrders')
      .filter((q) => q.eq(q.field('orgId'), orgId))
      .collect();
  },
});

export const getAllWorkOrdersWithNames = query({
  handler: async (ctx) => {
    const identity = await ctx.auth.getUserIdentity();
    if (!identity) throw new Error('Unauthenticated');
    const orgId = identity.orgId;

    const workOrders = await ctx.db
      .query('workOrders')
      .filter((q) => q.eq(q.field('orgId'), orgId))
      .collect();

    const enhancedWorkOrders = await Promise.all(
      workOrders.map(async (workOrder) => {
        const location = workOrder.locationId
          ? await ctx.db.get(workOrder.locationId)
          : null;

        let linkedAsset = null;
        let buildingName = null;

        if (workOrder.linkedAssetId) {
          if (workOrder.linkedAssetType === 'space') {
            linkedAsset = await ctx.db.get(workOrder.linkedAssetId);
          } else if (workOrder.linkedAssetType === 'facility') {
            linkedAsset = await ctx.db.get(workOrder.linkedAssetId);
          }
        }

        if (workOrder.buildingId) {
          const building = await ctx.db.get(workOrder.buildingId);
          buildingName = building ? building.name : null;
        }

        return {
          ...workOrder,
          locationName: location ? location.name : null,
          linkedAssetName: linkedAsset
            ? workOrder.linkedAssetType === 'space'
              ? linkedAsset.spaceName
              : linkedAsset.name
            : null,
          buildingName,
        };
      })
    );

    return enhancedWorkOrders;
  },
});

export const getWorkOrderDetailsById = query({
  args: { id: v.id('workOrders') },
  handler: async (ctx, args) => {
    const identity = await ctx.auth.getUserIdentity();
    if (!identity) throw new Error('Unauthenticated');
    const orgId = identity.orgId;

    const workOrder = await ctx.db.get(args.id);
    if (!workOrder || workOrder.orgId !== orgId) {
      throw new Error('Work order not found or access denied');
    }

    const location = workOrder.locationId
      ? await ctx.db.get(workOrder.locationId)
      : null;

    let linkedAsset = null;
    let buildingName = null;

    if (workOrder.linkedAssetId) {
      if (workOrder.linkedAssetType === 'space') {
        linkedAsset = await ctx.db.get(workOrder.linkedAssetId);
      } else if (workOrder.linkedAssetType === 'facility') {
        linkedAsset = await ctx.db.get(workOrder.linkedAssetId);
      }
    }

    if (workOrder.buildingId) {
      const building = await ctx.db.get(workOrder.buildingId);
      buildingName = building ? building.name : null;
    }

    // Transform the files array
    const transformedFiles = await Promise.all(
      (workOrder.files || []).map(async (storageId: Id<'_storage'>) => ({
        url: await ctx.storage.getUrl(storageId),
        storageId: storageId,
      }))
    );

    return {
      ...workOrder,
      files: transformedFiles,
      locationName: location ? location.name : null,
      linkedAssetName: linkedAsset
        ? workOrder.linkedAssetType === 'space'
          ? linkedAsset.spaceName
          : linkedAsset.name
        : null,
      buildingName,
    };
  },
});

// Get a single work order by ID
export const getWorkOrderById = query({
  args: { id: v.id('workOrders') },
  handler: async (ctx, args) => {
    const identity = await ctx.auth.getUserIdentity();
    if (!identity) throw new Error('Unauthenticated');
    const orgId = identity.orgId;

    const workOrder = await ctx.db.get(args.id);
    if (!workOrder || workOrder.orgId !== orgId) {
      throw new Error('Work order not found or access denied');
    }

    const location = workOrder.locationId
      ? await ctx.db.get(workOrder.locationId)
      : null;

    let linkedAsset = null;
    let buildingName = null;

    if (workOrder.linkedAssetId) {
      if (workOrder.linkedAssetType === 'space') {
        linkedAsset = await ctx.db.get(workOrder.linkedAssetId);
      } else if (workOrder.linkedAssetType === 'facility') {
        linkedAsset = await ctx.db.get(workOrder.linkedAssetId);
      }
    }

    let assignedContractor = null;
    if (workOrder.assignedContractorId) {
      assignedContractor = await ctx.db.get(workOrder.assignedContractorId);
    }

    // Transform the files array
    const transformedFiles = await Promise.all(
      (workOrder.files || []).map(async (storageId: Id<'_storage'>) => ({
        url: await ctx.storage.getUrl(storageId),
        storageId: storageId,
      }))
    );

    // Return the work order with transformed files
    return {
      ...workOrder,
      linkedAssetName: linkedAsset
        ? workOrder.linkedAssetType === 'space'
          ? linkedAsset.spaceName
          : linkedAsset.name
        : null,
      userId: workOrder.userId,
      files: transformedFiles,
      locationName: location ? location.name : null,
      assignedContractor: assignedContractor
        ? {
            name: `${assignedContractor.firstName} ${assignedContractor.lastName}`,
            businessName: assignedContractor.companyName,
            email: assignedContractor.email,
            // Add any other relevant contractor fields here
          }
        : null,
    };
  },
});

// Delete a work order
export const deleteWorkOrder = mutation({
  args: { id: v.id('workOrders') },
  handler: async (ctx, args) => {
    const identity = await ctx.auth.getUserIdentity();
    if (!identity) throw new Error('Unauthenticated');
    const orgId = identity.orgId;

    const existing = await ctx.db.get(args.id);
    if (!existing || existing.orgId !== orgId) {
      throw new Error('Work order not found or access denied');
    }
    await ctx.db.delete(args.id);
  },
});
