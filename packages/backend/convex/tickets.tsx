import { Id } from './_generated/dataModel';
import { mutation, query } from './_generated/server';
import { v } from 'convex/values';
import { upsertGlobalActivity } from './activity'; // Add this import
import { sendPushNotificationToUser } from './pushNotifications';

export const upsertTicketType = mutation({
  args: {
    id: v.optional(v.id('ticketTypes')),
    name: v.string(),
    description: v.string(),
  },
  handler: async (ctx, args) => {
    const identity = await ctx.auth.getUserIdentity();
    if (!identity) throw new Error('Unauthenticated');
    const orgId = identity.orgId;

    if (args.id) {
      // Update existing ticket type
      const existing = await ctx.db.get(args.id);
      if (!existing || existing.orgId !== orgId) {
        throw new Error('Ticket type not found or access denied');
      }
      await ctx.db.patch(args.id, {
        name: args.name,
        description: args.description,
      });
      return args.id;
    } else {
      // Insert new ticket type
      return await ctx.db.insert('ticketTypes', {
        name: args.name,
        description: args.description,
        orgId,
      });
    }
  },
});

export const removeTicketType = mutation({
  args: { id: v.id('ticketTypes') },
  handler: async (ctx, args) => {
    const identity = await ctx.auth.getUserIdentity();
    if (!identity) throw new Error('Unauthenticated');
    const orgId = identity.orgId;

    const existing = await ctx.db.get(args.id);
    if (!existing || existing.orgId !== orgId) {
      throw new Error('Ticket type not found or access denied');
    }
    await ctx.db.delete(args.id);
  },
});

export const getTicketType = query({
  args: { id: v.id('ticketTypes') },
  handler: async (ctx, args) => {
    const identity = await ctx.auth.getUserIdentity();
    if (!identity) throw new Error('Unauthenticated');
    const orgId = identity.orgId;

    const ticketType = await ctx.db.get(args.id);
    if (!ticketType || ticketType.orgId !== orgId) {
      return null;
    }
    return ticketType;
  },
});

export const getAllTicketTypesValueLabelPair = query({
  handler: async (ctx) => {
    const identity = await ctx.auth.getUserIdentity();
    if (!identity) throw new Error('Unauthenticated');
    const orgId = identity.orgId;

    const rawData = await ctx.db
      .query('ticketTypes')
      .filter((q) => q.eq(q.field('orgId'), orgId))
      .collect();

    return rawData.map((ticketType) => ({
      value: ticketType._id,
      label: ticketType.name,
    }));
  },
});

export const getAllTicketTypes = query({
  handler: async (ctx) => {
    const identity = await ctx.auth.getUserIdentity();
    if (!identity) throw new Error('Unauthenticated');
    const orgId = identity.orgId;

    return await ctx.db
      .query('ticketTypes')
      .filter((q) => q.eq(q.field('orgId'), orgId))
      .collect();
  },
});

export const upsertTicketLocation = mutation({
  args: {
    id: v.optional(v.id('ticketLocations')),
    name: v.string(),
    description: v.string(),
  },
  handler: async (ctx, args) => {
    const identity = await ctx.auth.getUserIdentity();
    if (!identity) throw new Error('Unauthenticated');
    const orgId = identity.orgId;

    if (args.id) {
      // Update existing ticket location
      const existing = await ctx.db.get(args.id);
      if (!existing || existing.orgId !== orgId) {
        throw new Error('Ticket location not found or access denied');
      }
      await ctx.db.patch(args.id, {
        name: args.name,
        description: args.description,
      });
      return args.id;
    } else {
      // Insert new ticket location
      return await ctx.db.insert('ticketLocations', {
        name: args.name,
        description: args.description,
        orgId,
      });
    }
  },
});

export const removeTicketLocation = mutation({
  args: { id: v.id('ticketLocations') },
  handler: async (ctx, args) => {
    const identity = await ctx.auth.getUserIdentity();
    if (!identity) throw new Error('Unauthenticated');
    const orgId = identity.orgId;

    const existing = await ctx.db.get(args.id);
    if (!existing || existing.orgId !== orgId) {
      throw new Error('Ticket location not found or access denied');
    }
    await ctx.db.delete(args.id);
  },
});

export const getTicketLocation = query({
  args: { id: v.id('ticketLocations') },
  handler: async (ctx, args) => {
    const identity = await ctx.auth.getUserIdentity();
    if (!identity) throw new Error('Unauthenticated');
    const orgId = identity.orgId;

    const ticketLocation = await ctx.db.get(args.id);
    if (!ticketLocation || ticketLocation.orgId !== orgId) {
      return null;
    }
    return ticketLocation;
  },
});

export const getAllTicketLocationsValueLabelPair = query({
  handler: async (ctx) => {
    const identity = await ctx.auth.getUserIdentity();
    if (!identity) throw new Error('Unauthenticated');
    const orgId = identity.orgId;

    const rawData = await ctx.db
      .query('ticketLocations')
      .filter((q) => q.eq(q.field('orgId'), orgId))
      .collect();

    return rawData.map((location) => ({
      value: location._id,
      label: location.name,
    }));
  },
});

export const getAllTicketLocations = query({
  handler: async (ctx) => {
    const identity = await ctx.auth.getUserIdentity();
    if (!identity) throw new Error('Unauthenticated');
    const orgId = identity.orgId;

    return await ctx.db
      .query('ticketLocations')
      .filter((q) => q.eq(q.field('orgId'), orgId))
      .collect();
  },
});

export const upsertIssue = mutation({
  args: {
    _id: v.optional(v.id('issues')),
    locationId: v.optional(v.id('ticketLocations')),
    spaceId: v.optional(v.id('spaces')),
    facilityId: v.optional(v.id('facilities')),
    floor: v.optional(v.string()),
    buildingId: v.optional(v.id('sites')),
    priority: v.string(),
    issueType: v.string(),
    status: v.optional(v.string()),
    assignedToId: v.optional(v.string()),
    description: v.string(),
    title: v.string(),
    tags: v.array(
      v.object({
        value: v.string(),
        label: v.string(),
      })
    ),
    followUpDate: v.optional(v.string()),
    files: v.optional(v.array(v.string())),
  },
  handler: async (ctx, args) => {
    const identity = await ctx.auth.getUserIdentity();
    if (!identity) throw new Error('Unauthenticated');
    const orgId = identity.orgId;
    const userId = identity.userId;

    let linkedAssetId = null;
    let linkedAssetType = null;
    let status = 'Pending';
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

    if (args.assignedToId) {
      status = 'Assigned';
    }

    const issueData = {
      locationId: args.locationId,
      linkedAssetId,
      linkedAssetType,
      buildingId,
      floor,
      status,
      title: args.title,
      priority: args.priority,
      issueType: args.issueType,
      assignedToId: args.assignedToId,
      facilityId: args.facilityId,
      spaceId: args.spaceId,
      description: args.description,
      tags: args.tags,
      followUpDate: args.followUpDate,
      files: args.files,
      orgId,
    };

    let issueId;
    let activityType;
    let activityTitle;

    if (args._id) {
      // Update existing issue
      const existing = await ctx.db.get(args._id);
      if (!existing || existing.orgId !== orgId) {
        throw new Error('Issue not found or access denied');
      }
      issueId = args._id;
      await ctx.db.patch(args._id, issueData);
      activityType = 'issue_updated';
      activityTitle = 'Issue Updated';

      // Move this check inside the block where 'existing' is defined
      if (args.assignedToId && !existing.assignedToId) {
        await upsertGlobalActivity(ctx, {
          title: 'Issue Assigned',
          description: `Issue "${args.title}" has been assigned`,
          type: 'issue_assigned',
          entityId: issueId,
        });
      }
    } else {
      // Create new issue
      issueId = await ctx.db.insert('issues', { ...issueData, userId });
      activityType = 'issue_created';
      activityTitle = 'New Issue Created';

      // For new issues, create the activity if assignedToId is present
      if (args.assignedToId) {
        await upsertGlobalActivity(ctx, {
          title: 'Issue Assigned',
          description: `Issue "${args.title}" has been assigned`,
          type: 'issue_assigned',
          entityId: issueId,
        });
      }
    }

    // Call upsertGlobalActivity
    await upsertGlobalActivity(ctx, {
      title: activityTitle,
      description: `Issue: ${args.title}`,
      type: activityType,
      entityId: issueId,
    });

    return issueId;
  },
});

// Get all issues for the organization
export const getAllIssues = query({
  handler: async (ctx) => {
    const identity = await ctx.auth.getUserIdentity();
    if (!identity) throw new Error('Unauthenticated');
    const orgId = identity.orgId;

    return await ctx.db
      .query('issues')
      .filter((q) => q.eq(q.field('orgId'), orgId))
      .collect();
  },
});

export const updateIssueStatus = mutation({
  args: { status: v.string(), issueId: v.id('issues') },
  handler: async (ctx, args) => {
    const identity = await ctx.auth.getUserIdentity();
    if (!identity) throw new Error('Unauthenticated');
    const orgId = identity.orgId;

    const issue = await ctx.db.get(args.issueId);
    if (!issue || issue.orgId !== orgId) {
      throw new Error('Issue not found or access denied');
    }
    await ctx.db.patch(args.issueId, {
      status: args.status,
    });

    await upsertGlobalActivity(ctx, {
      title: 'Issue Status Updated',
      description: `Issue status has been updated to ${args.status}`,
      type: 'issue_status_updated',
      entityId: args.issueId,
    });

    await sendPushNotificationToUser(ctx, {
      userId: issue.userId,
      title: '🔨 Issue Status Updated',
      body: `Your issue status has been updated to: ${args.status}`,
    });
  },
});

// Get all issues for the current occupant with detailed information
export const getAllOccupantIssues = query({
  handler: async (ctx) => {
    const identity = await ctx.auth.getUserIdentity();
    if (!identity) throw new Error('Unauthenticated');
    const userId = identity.subject;
    const orgId = identity.orgId;

    // Get user's spaces
    const userSpaces = await ctx.db
      .query('userSpaces')
      .filter((q) => q.eq(q.field('userId'), userId))
      .collect();

    const userSpaceIds = userSpaces.map((space) => space.spaceId);

    const issues = await ctx.db
      .query('issues')
      .filter((q) =>
        q.or(
          q.eq(q.field('userId'), userId),
          q.or(
            ...userSpaceIds.map((spaceId) =>
              q.and(
                q.eq(q.field('orgId'), orgId),
                q.eq(q.field('linkedAssetId'), spaceId),
                q.eq(q.field('linkedAssetType'), 'space')
              )
            )
          )
        )
      )
      .collect();

    const enhancedIssues = await Promise.all(
      issues.map(async (issue) => {
        const location = issue.locationId
          ? await ctx.db.get(issue.locationId)
          : null;

        let linkedAsset = null;
        let buildingName = null;

        if (issue.linkedAssetId) {
          if (issue.linkedAssetType === 'space') {
            linkedAsset = await ctx.db.get(issue.linkedAssetId);
          } else if (issue.linkedAssetType === 'facility') {
            linkedAsset = await ctx.db.get(issue.linkedAssetId);
          }
        }

        if (issue.buildingId) {
          const building = await ctx.db.get(issue.buildingId);
          buildingName = building ? building.name : null;
        }
        // Transform the files array
        const transformedFiles = await Promise.all(
          (issue.files || []).map(async (storageId: Id<'_storage'>) => ({
            url: await ctx.storage.getUrl(storageId),
            storageId: storageId,
          }))
        );

        return {
          ...issue,
          files: transformedFiles,
          locationName: location ? location.name : null,
          linkedAssetName: linkedAsset
            ? issue.linkedAssetType === 'space'
              ? linkedAsset.spaceName
              : linkedAsset.name
            : null,
          buildingName,
        };
      })
    );

    return enhancedIssues;
  },
});

export const getAllIssuesWithNames = query({
  handler: async (ctx) => {
    const identity = await ctx.auth.getUserIdentity();
    if (!identity) throw new Error('Unauthenticated');
    const orgId = identity.orgId;

    const issues = await ctx.db
      .query('issues')
      .filter((q) => q.eq(q.field('orgId'), orgId))
      .collect();

    const enhancedIssues = await Promise.all(
      issues.map(async (issue) => {
        const location = issue.locationId
          ? await ctx.db.get(issue.locationId)
          : null;

        let linkedAsset = null;
        let buildingName = null;

        if (issue.linkedAssetId) {
          if (issue.linkedAssetType === 'space') {
            linkedAsset = await ctx.db.get(issue.linkedAssetId);
          } else if (issue.linkedAssetType === 'facility') {
            linkedAsset = await ctx.db.get(issue.linkedAssetId);
          }
        }

        if (issue.buildingId) {
          const building = await ctx.db.get(issue.buildingId);
          buildingName = building ? building.name : null;
        }

        return {
          ...issue,
          locationName: location ? location.name : null,
          linkedAssetName: linkedAsset
            ? issue.linkedAssetType === 'space'
              ? linkedAsset.spaceName
              : linkedAsset.name
            : null,
          buildingName,
        };
      })
    );

    return enhancedIssues;
  },
});

export const getIssueDetailsById = query({
  args: { id: v.id('issues') },
  handler: async (ctx, args) => {
    const identity = await ctx.auth.getUserIdentity();
    if (!identity) throw new Error('Unauthenticated');
    const orgId = identity.orgId;

    const issue = await ctx.db.get(args.id);
    if (!issue || issue.orgId !== orgId) {
      throw new Error('Issue not found or access denied');
    }

    const location = issue.locationId
      ? await ctx.db.get(issue.locationId)
      : null;

    let linkedAsset = null;
    let buildingName = null;

    if (issue.linkedAssetId) {
      if (issue.linkedAssetType === 'space') {
        linkedAsset = await ctx.db.get(issue.linkedAssetId);
      } else if (issue.linkedAssetType === 'facility') {
        linkedAsset = await ctx.db.get(issue.linkedAssetId);
      }
    }

    if (issue.buildingId) {
      const building = await ctx.db.get(issue.buildingId);
      buildingName = building ? building.name : null;
    }

    // Transform the files array
    const transformedFiles = await Promise.all(
      (issue.files || []).map(async (storageId: Id<'_storage'>) => ({
        url: await ctx.storage.getUrl(storageId),
        storageId: storageId,
      }))
    );

    return {
      ...issue,
      files: transformedFiles,
      locationName: location ? location.name : null,
      linkedAssetName: linkedAsset
        ? issue.linkedAssetType === 'space'
          ? linkedAsset.spaceName
          : linkedAsset.name
        : null,
      buildingName,
    };
  },
});

// Get a single issue by ID
export const getIssueById = query({
  args: { id: v.id('issues') },
  handler: async (ctx, args) => {
    const identity = await ctx.auth.getUserIdentity();
    if (!identity) throw new Error('Unauthenticated');
    const orgId = identity.orgId;

    const issue = await ctx.db.get(args.id);
    if (!issue || issue.orgId !== orgId) {
      throw new Error('Issue not found or access denied');
    }

    const location = issue.locationId
      ? await ctx.db.get(issue.locationId)
      : null;

    let linkedAsset = null;
    let buildingName = null;

    if (issue.linkedAssetId) {
      if (issue.linkedAssetType === 'space') {
        linkedAsset = await ctx.db.get(issue.linkedAssetId);
      } else if (issue.linkedAssetType === 'facility') {
        linkedAsset = await ctx.db.get(issue.linkedAssetId);
      }
    }

    // Transform the files array
    const transformedFiles = await Promise.all(
      (issue.files || []).map(async (storageId: Id<'_storage'>) => ({
        url: await ctx.storage.getUrl(storageId),
        storageId: storageId,
      }))
    );

    // Return the space with transformed files
    return {
      ...issue,
      linkedAssetName: linkedAsset
        ? issue.linkedAssetType === 'space'
          ? linkedAsset.spaceName
          : linkedAsset.name
        : null,
      userId: issue.userId,
      files: transformedFiles,
      locationName: location ? location.name : null,
    };
  },
});

// Delete an issue
export const deleteIssue = mutation({
  args: { id: v.id('issues') },
  handler: async (ctx, args) => {
    const identity = await ctx.auth.getUserIdentity();
    if (!identity) throw new Error('Unauthenticated');
    const orgId = identity.orgId;

    const existing = await ctx.db.get(args.id);
    if (!existing || existing.orgId !== orgId) {
      throw new Error('Issue not found or access denied');
    }
    await ctx.db.delete(args.id);
  },
});

export const getAllIssuesValueLabelPair = query({
  handler: async (ctx) => {
    const identity = await ctx.auth.getUserIdentity();
    if (!identity) throw new Error('Unauthenticated');
    const orgId = identity.orgId;

    const issues = await ctx.db
      .query('issues')
      .filter((q) =>
        q.and(
          q.eq(q.field('orgId'), orgId),
          q.or(
            q.eq(q.field('status'), 'Assigned'),
            q.eq(q.field('status'), 'Pending')
          )
        )
      )
      .collect();

    const enhancedIssues = await Promise.all(
      issues.map(async (issue) => {
        let buildingName = null;
        let linkedAssetName = null;

        if (issue.buildingId) {
          const building = await ctx.db.get(issue.buildingId);
          buildingName = building ? building.name : null;
        }

        if (issue.linkedAssetId) {
          const linkedAsset = await ctx.db.get(issue.linkedAssetId);
          linkedAssetName = linkedAsset
            ? issue.linkedAssetType === 'space'
              ? linkedAsset.spaceName
              : linkedAsset.name
            : null;
        }

        return {
          value: issue._id,
          label: `${issue.title} - ${buildingName || 'N/A'} - ${issue.floor || 'N/A'} - ${issue.linkedAssetType || 'N/A'} - ${linkedAssetName || 'N/A'}`,
        };
      })
    );

    return enhancedIssues;
  },
});

export const getLinkedIssuesByWorkOrderId = query({
  args: { workOrderId: v.id('workOrders') },
  handler: async (ctx, args) => {
    const identity = await ctx.auth.getUserIdentity();
    if (!identity) throw new Error('Unauthenticated');
    const orgId = identity.orgId;

    const workOrder = await ctx.db.get(args.workOrderId);
    if (!workOrder || workOrder.orgId !== orgId) {
      throw new Error('Work order not found or access denied');
    }

    const linkedIssues = workOrder.linkedTickets || [];

    // Fetch all linked issues in a single query
    const issuesData = await ctx.db
      .query('issues')
      .filter((q) =>
        q.and(
          q.eq(q.field('orgId'), orgId),
          q.or(
            ...linkedIssues.map((issue: { value: string }) =>
              q.eq(q.field('_id'), issue.value as Id<'issues'>)
            )
          )
        )
      )
      .collect();

    console.log('Issues Data', issuesData);

    // Process the issues data
    const issueDetails = await Promise.all(
      issuesData.map(async (issueData) => {
        return {
          _id: issueData._id,
          title: issueData.title,
          description: issueData.description,
          _creationTime: issueData._creationTime,
          followUpDate: issueData.followUpDate,
          issueType: issueData.issueType,
          status: issueData.status,
          priority: issueData.priority,
        };
      })
    );

    return issueDetails;
  },
});

export const getTicketsByUserId = query({
  args: { userId: v.string() },
  handler: async (ctx, args) => {
    const identity = await ctx.auth.getUserIdentity();
    if (!identity) throw new Error('Unauthenticated');
    const orgId = identity.orgId;

    // Fetch all tickets for the user
    const ticketsData = await ctx.db
      .query('issues')
      .filter((q) =>
        q.and(
          q.eq(q.field('orgId'), orgId),
          q.eq(q.field('userId'), args.userId)
        )
      )
      .collect();

    console.log('Tickets Data', ticketsData);

    // Process the tickets data
    const ticketDetails = await Promise.all(
      ticketsData.map(async (ticketData) => {
        return {
          _id: ticketData._id,
          title: ticketData.title,
          description: ticketData.description,
          _creationTime: ticketData._creationTime,
          followUpDate: ticketData.followUpDate,
          issueType: ticketData.issueType,
          status: ticketData.status,
          priority: ticketData.priority,
        };
      })
    );

    return ticketDetails;
  },
});

export const getTicketsBySpaceId = query({
  args: { spaceId: v.id('spaces') },
  handler: async (ctx, args) => {
    const identity = await ctx.auth.getUserIdentity();
    if (!identity) throw new Error('Unauthenticated');
    const orgId = identity.orgId;

    // Fetch all tickets where the linked asset type is space and the linked asset id matches the given spaceId
    const ticketsData = await ctx.db
      .query('issues')
      .filter((q) =>
        q.and(
          q.eq(q.field('orgId'), orgId),
          q.eq(q.field('linkedAssetType'), 'space'),
          q.eq(q.field('linkedAssetId'), args.spaceId)
        )
      )
      .collect();

    console.log('Tickets Data', ticketsData);

    // Process the tickets data
    const ticketDetails = await Promise.all(
      ticketsData.map(async (ticketData) => {
        return {
          _id: ticketData._id,
          title: ticketData.title,
          description: ticketData.description,
          _creationTime: ticketData._creationTime,
          followUpDate: ticketData.followUpDate,
          issueType: ticketData.issueType,
          status: ticketData.status,
          priority: ticketData.priority,
        };
      })
    );

    return ticketDetails;
  },
});
