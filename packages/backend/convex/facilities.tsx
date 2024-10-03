import { internal } from './_generated/api';
import { Id } from './_generated/dataModel';
import { mutation, query } from './_generated/server';
import { v } from 'convex/values';

// Upsert facility type
export const upsertFacilityType = mutation({
  args: {
    _id: v.optional(v.id('facilityTypes')),
    name: v.string(),
    description: v.string(),
  },
  handler: async (ctx, args) => {
    const identity = await ctx.auth.getUserIdentity();
    if (!identity) throw new Error('Unauthenticated');
    const orgId = identity.orgId;

    if (args._id) {
      // Update existing facility type
      const existing = await ctx.db.get(args._id);
      if (!existing || existing.orgId !== orgId) {
        throw new Error('Facility type not found or access denied');
      }
      await ctx.db.patch(args._id, {
        name: args.name,
        description: args.description,
      });
      return args._id;
    } else {
      // Insert new facility type
      return await ctx.db.insert('facilityTypes', {
        name: args.name,
        description: args.description,
        orgId,
      });
    }
  },
});

// Remove facility type
export const removeFacilityType = mutation({
  args: { _id: v.id('facilityTypes') },
  handler: async (ctx, args) => {
    const identity = await ctx.auth.getUserIdentity();
    if (!identity) throw new Error('Unauthenticated');
    const orgId = identity.orgId;

    const existing = await ctx.db.get(args._id);
    if (!existing || existing.orgId !== orgId) {
      throw new Error('Facility type not found or access denied');
    }
    await ctx.db.delete(args._id);
  },
});

// Get a single facility type by ID
export const getFacilityType = query({
  args: { _id: v.id('facilityTypes') },
  handler: async (ctx, args) => {
    const identity = await ctx.auth.getUserIdentity();
    if (!identity) throw new Error('Unauthenticated');
    const orgId = identity.orgId;

    const facilityType = await ctx.db.get(args._id);
    if (!facilityType || facilityType.orgId !== orgId) {
      return null;
    }
    return facilityType;
  },
});

// Get all facility types for the authenticated organization
export const getAllFacilityTypes = query({
  handler: async (ctx) => {
    const identity = await ctx.auth.getUserIdentity();
    if (!identity) throw new Error('Unauthenticated');
    const orgId = identity.orgId;

    return await ctx.db
      .query('facilityTypes')
      .filter((q) => q.eq(q.field('orgId'), orgId))
      .collect();
  },
});

/**
 * @function upsertFacility
 * @description Creates or updates a facility.
 * @param {Object} args - The facility data.
 * @param {string} args._id - Optional ID of an existing facility.
 * @param {string} args.name - Name of the facility.
 * @param {string} args.facilityTypeId - ID of the facility type.
 * @param {string} args.buildingId - ID of the building.
 * @param {string} args.floor - Floor number.
 * @param {boolean} args.isPublic - Whether the facility is public.
 * @param {Array} args.files - Optional array of file objects.
 * @param {Array} args.audience - Optional array of audience objects.
 * @returns {Promise<string>} The ID of the created or updated facility.
 */
export const upsertFacility = mutation({
  args: {
    _id: v.optional(v.id('facilities')),
    name: v.string(),
    description: v.string(),
    facilityTypeId: v.id('facilityTypes'),
    buildingId: v.id('sites'),
    floor: v.string(),
    isPublic: v.boolean(),
    hasAudience: v.boolean(),
    files: v.array(
      v.object({
        storageId: v.string(),
      })
    ),
    audience: v.optional(
      v.array(
        v.object({
          type: v.string(),
          entity: v.string(),
        })
      )
    ),
  },
  handler: async (ctx, args) => {
    const identity = await ctx.auth.getUserIdentity();
    if (!identity) throw new Error('Unauthenticated');
    const orgId = identity.orgId;

    const facilityData = {
      name: args.name,
      description: args.description,
      facilityTypeId: args.facilityTypeId,
      buildingId: args.buildingId,
      floor: args.floor,
      isPublic: args.isPublic,
      files: args.files,
      audience: args.audience,
      orgId,
    };

    if (args._id) {
      // Update existing facility
      const existing = await ctx.db.get(args._id);
      if (!existing || existing.orgId !== orgId) {
        throw new Error('Facility not found or access denied');
      }
      await ctx.db.patch(args._id, facilityData);
      return args._id;
    } else {
      // Insert new facility
      return await ctx.db.insert('facilities', facilityData);
    }
  },
});

/**
 * @function getFacility
 * @description Retrieves a single facility.
 * @param {Object} args - The query arguments.
 * @param {string} args._id - ID of the facility to retrieve.
 * @returns {Promise<Object|null>} The facility object or null if not found.
 */
export const getFacility = query({
  args: { _id: v.id('facilities') },
  handler: async (ctx, args) => {
    const identity = await ctx.auth.getUserIdentity();
    if (!identity) throw new Error('Unauthenticated');
    const orgId = identity.orgId;

    const facility = await ctx.db.get(args._id);
    if (!facility || facility.orgId !== orgId) {
      return null;
    }

    // Get building name
    const building = await ctx.db.get(facility.buildingId);
    const buildingName = building ? building.name : 'Unknown Building';

    // Get facility type name
    const facilityType = await ctx.db.get(facility.facilityTypeId);
    const facilityTypeName = facilityType ? facilityType.name : 'Unknown Type';

    // Map files to include URLs
    const filesWithUrls = await Promise.all(
      facility.files.map(async (file: { storageId: Id<'_storage'> }) => ({
        url: await ctx.storage.getUrl(file.storageId),
        storageId: file.storageId,
      }))
    );

    return {
      ...facility,
      buildingName: buildingName,
      facilityTypeName: facilityTypeName,
      files: filesWithUrls,
    };
  },
});

/**
 * @function getAllFacilities
 * @description Retrieves all facilities for the authenticated user's organization.
 * @returns {Promise<Array>} An array of facility objects.
 */
export const getAllFacilities = query({
  handler: async (ctx) => {
    const identity = await ctx.auth.getUserIdentity();
    if (!identity) throw new Error('Unauthenticated');
    const orgId = identity.orgId;

    const facilities = await ctx.db
      .query('facilities')
      .filter((q) => q.eq(q.field('orgId'), orgId))
      .collect();

    return await processFacilities(ctx, facilities);
  },
});

export const getAllOccupantFacilities = query({
  handler: async (ctx) => {
    const identity = await ctx.auth.getUserIdentity();
    if (!identity) throw new Error('Unauthenticated');
    const orgId = identity.orgId;

    // Call the internal function to get audience groups
    const audienceGroups = await ctx.runQuery(
      internal.helperFunctions.getOccupantAudienceGroups,
      {}
    );

    const facilities = await ctx.db
      .query('facilities')
      .filter((q) => q.eq(q.field('orgId'), orgId))
      .collect();

    const filteredFacilities = facilities.filter((facility) => {
      if (!facility.audience || facility.audience.length === 0) {
        return true; // Include facilities without specific audience
      }

      // Use filter instead of some
      const matchingAudiences = facility.audience.filter(
        (audienceItem: any) =>
          audienceGroups.filter(
            (group: any) =>
              group.type === audienceItem.type &&
              group.entity === audienceItem.entity
          ).length > 0
      );

      return matchingAudiences.length > 0;
    });

    return await processFacilities(ctx, filteredFacilities);
  },
});

async function processFacilities(ctx: any, facilities: any[]) {
  // Resolve URLs for files and add additional data
  return await Promise.all(
    facilities.map(async (facility) => {
      const filesWithUrls = await Promise.all(
        facility.files.map(async (file: { storageId: Id<'_storage'> }) => ({
          url: await ctx.storage.getUrl(file.storageId),
          storageId: file.storageId,
        }))
      );

      // Get building name
      const building = await ctx.db.get(facility.buildingId);
      const buildingName = building ? building.name : 'Unknown Building';

      // Get facility type name
      const facilityType = await ctx.db.get(facility.facilityTypeId);
      const facilityTypeName = facilityType
        ? facilityType.name
        : 'Unknown Type';

      return {
        ...facility,
        files: filesWithUrls,
        buildingName,
        facilityTypeName,
      };
    })
  );
}

/**
 * @function deleteFacility
 * @description Deletes a facility.
 * @param {Object} args - The facility data.
 * @param {string} args._id - ID of the facility to delete.
 */
export const deleteFacility = mutation({
  args: { _id: v.id('facilities') },
  handler: async (ctx, args) => {
    const identity = await ctx.auth.getUserIdentity();
    if (!identity) throw new Error('Unauthenticated');
    const orgId = identity.orgId;

    const existing = await ctx.db.get(args._id);
    if (!existing || existing.orgId !== orgId) {
      throw new Error('Facility not found or access denied');
    }
    await ctx.db.delete(args._id);
  },
});

export const getAllFacilityValueLabelPairs = query({
  handler: async (ctx) => {
    const identity = await ctx.auth.getUserIdentity();
    if (!identity) throw new Error('Unauthenticated');
    const orgId = identity.orgId;

    const rawData = await ctx.db
      .query('facilities')
      .filter((q) => q.eq(q.field('orgId'), orgId))
      .collect();

    return rawData.map((facility) => ({
      value: facility._id,
      label: facility.name,
    }));
  },
});
