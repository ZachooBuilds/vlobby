import { Id } from "./_generated/dataModel";
import { mutation, query } from "./_generated/server";
import { v } from "convex/values";

export const upsertSpaceType = mutation({
  args: {
    id: v.optional(v.id("spaceTypes")),
    name: v.string(),
    description: v.string(),
  },
  handler: async (ctx, args) => {
    const identity = await ctx.auth.getUserIdentity();
    if (!identity) throw new Error("Unauthenticated");
    const orgId = identity.orgId;

    if (args.id) {
      // Update existing space type
      const existing = await ctx.db.get(args.id);
      if (!existing || existing.orgId !== orgId) {
        throw new Error("Space type not found or access denied");
      }
      await ctx.db.patch(args.id, {
        name: args.name,
        description: args.description,
      });
      return args.id;
    } else {
      // Insert new space type
      return await ctx.db.insert("spaceTypes", {
        name: args.name,
        description: args.description,
        orgId,
      });
    }
  },
});

export const removeSpaceType = mutation({
  args: { id: v.id("spaceTypes") },
  handler: async (ctx, args) => {
    const identity = await ctx.auth.getUserIdentity();
    if (!identity) throw new Error("Unauthenticated");
    const orgId = identity.orgId;

    const existing = await ctx.db.get(args.id);
    if (!existing || existing.orgId !== orgId) {
      throw new Error("Space type not found or access denied");
    }
    await ctx.db.delete(args.id);
  },
});

export const getSpaceType = query({
  args: { id: v.id("spaceTypes") },
  handler: async (ctx, args) => {
    const identity = await ctx.auth.getUserIdentity();
    if (!identity) throw new Error("Unauthenticated");
    const orgId = identity.orgId;

    const spaceType = await ctx.db.get(args.id);
    if (!spaceType || spaceType.orgId !== orgId) {
      return null;
    }
    return spaceType;
  },
});

export const getAllSpaceTypes = query({
  handler: async (ctx) => {
    const identity = await ctx.auth.getUserIdentity();
    if (!identity) throw new Error("Unauthenticated");
    const orgId = identity.orgId;

    return await ctx.db
      .query("spaceTypes")
      .filter((q) => q.eq(q.field("orgId"), orgId))
      .collect();
  },
});

export const getAllSpaceTypesValueLabelPair = query({
  handler: async (ctx) => {
    const identity = await ctx.auth.getUserIdentity();
    if (!identity) throw new Error("Unauthenticated");
    const orgId = identity.orgId;

    const rawData = await ctx.db
      .query("spaceTypes")
      .filter((q) => q.eq(q.field("orgId"), orgId))
      .collect();

    return rawData.map((spaceType) => ({
      value: spaceType._id,
      label: spaceType.name,
    }));
  },
});

export const getAllSpaceValueLabelPairs = query({
  handler: async (ctx) => {
    const identity = await ctx.auth.getUserIdentity();
    if (!identity) throw new Error("Unauthenticated");
    const orgId = identity.orgId;

    const rawData = await ctx.db
      .query("spaces")
      .filter((q) => q.eq(q.field("orgId"), orgId))
      .collect();

    return rawData.map((space) => ({
      value: space._id,
      label: space.spaceName,
    }));
  },
});

// Create or update a space
export const upsertSpace = mutation({
  args: {
    _id: v.optional(v.id("spaces")),
    spaceName: v.string(),
    titleNumber: v.string(),
    type: v.id("spaceTypes"),
    description: v.string(),
    building: v.id("sites"),
    floor: v.string(),
    settlementDate: v.string(),
    powerMeterNumber: v.string(),
    waterMeterNumber: v.string(),
    lettingEnabled: v.boolean(),
    files: v.optional(v.array(v.string())),
    accessibilityEnabled: v.boolean(),
    agentName: v.optional(v.string()),
    agentBusiness: v.optional(v.string()),
    mobile: v.optional(v.string()),
    email: v.optional(v.string()),
    accessibilityRequirement: v.optional(v.string()),
    medicalInfo: v.optional(v.string()),
    isOrientationRequired: v.optional(v.boolean()),
  },
  handler: async (ctx, args) => {
    const identity = await ctx.auth.getUserIdentity();
    if (!identity) throw new Error("Unauthenticated");
    const orgId = identity.orgId;

    // Verify that the space type exists and belongs to the same organization
    const spaceType = await ctx.db.get(args.type);
    if (!spaceType || spaceType.orgId !== orgId) {
      throw new Error("Invalid space type");
    }

    // Verify that the building exists and belongs to the same organization
    const building = await ctx.db.get(args.building);
    if (!building || building.orgId !== orgId) {
      throw new Error("Invalid building");
    }

    const spaceData = {
      spaceName: args.spaceName,
      titleNumber: args.titleNumber,
      type: args.type,
      description: args.description,
      building: args.building,
      floor: args.floor,
      settlementDate: args.settlementDate,
      powerMeterNumber: args.powerMeterNumber,
      waterMeterNumber: args.waterMeterNumber,
      lettingEnabled: args.lettingEnabled,
      accessibilityEnabled: args.accessibilityEnabled,
      orgId,
      files: args.files,
      agentName: args.agentName,
      agentBusiness: args.agentBusiness,
      mobile: args.mobile,
      email: args.email,
      accessibilityRequirement: args.accessibilityRequirement,
      medicalInfo: args.medicalInfo,
      isOrientationRequired: args.isOrientationRequired,
    };

    if (args._id) {
      const existing = await ctx.db.get(args._id);
      if (!existing || existing.orgId !== orgId) {
        throw new Error("Space not found or access denied");
      }
      await ctx.db.patch(args._id, spaceData);

      return args._id;
    } else {
      const result = await ctx.db.insert("spaces", spaceData);

      // Log the new user space as an activity
      await ctx.db.insert("globalActivity", {
        title: "Space Added",
        description: `Space details have been added to database`,
        type: "New Space",
        entityId: result,
        orgId,
      });

      return result;
    }
  },
});

export const getRoleFrequencies = query({
  handler: async (ctx) => {
    const identity = await ctx.auth.getUserIdentity();
    if (!identity) throw new Error("Unauthenticated");
    const orgId = identity.orgId;

    // Fetch all userSpaces for the organization
    const userSpaces = await ctx.db
      .query("userSpaces")
      .filter((q) => q.eq(q.field("orgId"), orgId))
      .collect();

    // Calculate the frequency of each role
    const roleFrequencies = userSpaces.reduce((acc, userSpace) => {
      const role = userSpace.role;
      if (!acc[role]) {
        acc[role] = 0;
      }
      acc[role]++;
      return acc;
    }, {});

    // Format the return value
    return Object.entries(roleFrequencies).map(([role, count]) => ({
      key: role,
      value: count,
      label: role,
    }));
  },
});

export const getOccupancy = query({
  handler: async (ctx) => {
    const identity = await ctx.auth.getUserIdentity();
    if (!identity) throw new Error("Unauthenticated");
    const orgId = identity.orgId;

    // Get all userSpaces for the organization
    const userSpaces = await ctx.db
      .query("userSpaces")
      .filter((q) => q.eq(q.field("orgId"), orgId))
      .collect();

    // Extract unique space IDs
    const uniqueSpaceIds = new Set(
      userSpaces.map((userSpace) => userSpace.spaceId),
    );

    // Get all spaces for the organization
    const spaces = await ctx.db
      .query("spaces")
      .filter((q) => q.eq(q.field("orgId"), orgId))
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
      { value: occupiedCount, label: "Occupied", key: "occupied" },
      { value: unoccupiedCount, label: "Un-Occupied", key: "unoccupied" },
    ];
  },
});

// Get a single space by ID
export const getSpace = query({
  args: { id: v.id("spaces") },
  handler: async (ctx, args) => {
    const identity = await ctx.auth.getUserIdentity();
    if (!identity) throw new Error("Unauthenticated");
    const orgId = identity.orgId;

    const space = await ctx.db.get(args.id);
    if (!space || space.orgId !== orgId) {
      return null;
    }

    // Transform the files array
    const transformedFiles = await Promise.all(
      (space.files || []).map(async (storageId: Id<"_storage">) => ({
        url: await ctx.storage.getUrl(storageId),
        storageId: storageId,
      })),
    );

    // Return the space with transformed files
    return {
      ...space,
      files: transformedFiles,
    };
  },
});

export const getSpaceWithDetails = query({
  args: { id: v.id("spaces") },
  handler: async (ctx, args) => {
    const identity = await ctx.auth.getUserIdentity();
    if (!identity) throw new Error("Unauthenticated");
    const orgId = identity.orgId;

    const space = await ctx.db.get(args.id);
    if (!space || space.orgId !== orgId) {
      return null;
    }

    const spaceType = await ctx.db.get(space.type);
    const building = await ctx.db.get(space.building);

    return {
      ...space,
      type: spaceType?.name || "Unknown",
      building: building?.name || "Unknown",
    };
  },
});

export const getSpacesForUser = query({
  args: { id: v.id("users") },
  handler: async (ctx, args) => {
    const identity = await ctx.auth.getUserIdentity();
    if (!identity) throw new Error("Unauthenticated");
    const orgId = identity.orgId;

    const user = await ctx.db.get(args.id);
    if (!user || user.orgId !== orgId) {
      return null;
    }

    console.log(user);

    // Step 1: Get all userSpaces for the given userId
    const userSpaces = await ctx.db
      .query("userSpaces")
      .filter((q) => q.eq(q.field("userId"), user.userId))
      .filter((q) => q.eq(q.field("orgId"), orgId))
      .collect();

    console.log(userSpaces);

    // Step 2: Fetch spaces based on the extracted spaceIds and include their roles
    const spaces = await Promise.all(
      userSpaces.map(async (userSpace) => {
        const space = await ctx.db
          .query("spaces")
          .filter((q) => q.eq(q.field("orgId"), orgId))
          .filter((q) => q.eq(q.field("_id"), userSpace.spaceId))
          .first();

        if (space) {
          const building = await ctx.db.get(space.building);
          return {
            ...space,
            role: userSpace.role,
            buildingName: building ? building.name : "Unknown",
          };
        }
        return null;
      }),
    );

    console.log(spaces);

    return spaces.filter((space) => space !== null) ?? [];
  },
});

// Get all spaces for the authenticated organization
export const getAllSpaces = query({
  handler: async (ctx) => {
    const identity = await ctx.auth.getUserIdentity();
    if (!identity) throw new Error("Unauthenticated");
    const orgId = identity.orgId;

    const spaces = await ctx.db
      .query("spaces")
      .filter((q) => q.eq(q.field("orgId"), orgId))
      .collect();

    const spaceTypesMap = new Map(
      (await ctx.db.query("spaceTypes").collect()).map((type) => [
        type._id,
        type.name,
      ]),
    );

    const buildingsMap = new Map(
      (await ctx.db.query("sites").collect()).map((site) => [
        site._id,
        site.name,
      ]),
    );

    return spaces.map((space) => ({
      ...space,
      type: spaceTypesMap.get(space.type) || "Unknown",
      building: buildingsMap.get(space.building) || "Unknown",
    }));
  },
});

// Get all spaces with only id and name
export const getAllSpacesDropdown = query({
  handler: async (ctx) => {
    const identity = await ctx.auth.getUserIdentity();
    if (!identity) throw new Error("Unauthenticated");
    const orgId = identity.orgId;

    const spaces = await ctx.db
      .query("spaces")
      .filter((q) => q.eq(q.field("orgId"), orgId))
      .collect();

    return spaces.map((space) => ({
      _id: space._id,
      spaceName: space.spaceName,
    }));
  },
});

// Remove a space
export const removeSpace = mutation({
  args: { id: v.id("spaces") },
  handler: async (ctx, args) => {
    const identity = await ctx.auth.getUserIdentity();
    if (!identity) throw new Error("Unauthenticated");
    const orgId = identity.orgId;

    const existing = await ctx.db.get(args.id);
    if (!existing || existing.orgId !== orgId) {
      throw new Error("Space not found or access denied");
    }
    await ctx.db.delete(args.id);
  },
});

// Get spaces by building
export const getSpacesByBuilding = query({
  args: { buildingId: v.id("buildings") },
  handler: async (ctx, args) => {
    const identity = await ctx.auth.getUserIdentity();
    if (!identity) throw new Error("Unauthenticated");
    const orgId = identity.orgId;

    return await ctx.db
      .query("spaces")
      .filter((q) => q.eq(q.field("orgId"), orgId))
      .filter((q) => q.eq(q.field("building"), args.buildingId))
      .collect();
  },
});

// Get spaces by type
export const getSpacesByType = query({
  args: { typeId: v.id("spaceTypes") },
  handler: async (ctx, args) => {
    const identity = await ctx.auth.getUserIdentity();
    if (!identity) throw new Error("Unauthenticated");
    const orgId = identity.orgId;

    return await ctx.db
      .query("spaces")
      .filter((q) => q.eq(q.field("orgId"), orgId))
      .filter((q) => q.eq(q.field("type"), args.typeId))
      .collect();
  },
});

// ... existing code ...

// Get total count of spaces by type
export const getTotalSpacesByType = query({
  handler: async (ctx) => {
    const identity = await ctx.auth.getUserIdentity();
    if (!identity) throw new Error("Unauthenticated");
    const orgId = identity.orgId;

    // Get all space types for the organization
    const spaceTypes = await ctx.db
      .query("spaceTypes")
      .filter((q) => q.eq(q.field("orgId"), orgId))
      .collect();

    // Get all spaces for the organization
    const spaces = await ctx.db
      .query("spaces")
      .filter((q) => q.eq(q.field("orgId"), orgId))
      .collect();

    // Count spaces for each type
    const spaceCounts = spaceTypes.map((type) => {
      const count = spaces.filter((space) => space.type === type._id).length;
      return {
        key: type._id,
        value: count,
        label: type.name,
      };
    });

    return spaceCounts;
  },
});

export const getAllSpacesWithBuilding = query({
  handler: async (ctx) => {
    const identity = await ctx.auth.getUserIdentity();
    if (!identity) throw new Error("Unauthenticated");
    const orgId = identity.orgId;

    // Get all spaces for the organization
    const spaces = await ctx.db
      .query("spaces")
      .filter((q) => q.eq(q.field("orgId"), orgId))
      .collect();

    // Fetch building names for all spaces
    const spacesWithBuilding = await Promise.all(
      spaces.map(async (space) => {
        const building = await ctx.db.get(space.building);
        return {
          ...space,
          buildingName: building ? building.name : "Unknown",
        };
      }),
    );

    return spacesWithBuilding;
  },
});
