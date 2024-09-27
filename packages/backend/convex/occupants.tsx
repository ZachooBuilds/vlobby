import { mutation, query } from "./_generated/server";
import { v } from "convex/values";

export const upsertOccupant = mutation({
  args: {
    _id: v.optional(v.id("users")),
    userId: v.string(),
    firstName: v.string(),
    lastName: v.string(),
    email: v.string(),
    phoneNumber: v.string(),
    parcelPreference: v.union(
      v.literal("hold"),
      v.literal("deliver"),
      v.literal("notify"),
    ),
    notes: v.optional(v.string()),
    occupantSpaces: v.array(
      v.object({
        spaceId: v.string(),
        role: v.string(),
      }),
    ),
  },
  handler: async (ctx, args) => {
    const identity = await ctx.auth.getUserIdentity();
    if (!identity) throw new Error("Unauthenticated");
    const orgId = identity.orgId;

    let result: string;

    if (args._id) {
      console.log("Updating existing user");
      // Update existing user
      const existing = await ctx.db.get(args._id);
      if (!existing || existing.orgId !== orgId) {
        throw new Error("User not found or access denied");
      }
      await ctx.db.patch(args._id, {
        firstName: args.firstName,
        lastName: args.lastName,
        email: args.email,
        phoneNumber: args.phoneNumber,
        parcelPreference: args.parcelPreference,
        notes: args.notes,
      });
      result = args._id;

      // Log the new user space as an activity
      await ctx.db.insert("globalActivity", {
        title: "User Details Updated",
        description: `User details have been updated.`,
        type: "Details Updated",
        entityId: args._id,
        orgId,
      });
    } else {
      // Insert new user
      result = await ctx.db.insert("users", {
        userId: args.userId,
        firstName: args.firstName,
        lastName: args.lastName,
        email: args.email,
        phoneNumber: args.phoneNumber,
        parcelPreference: args.parcelPreference,
        notes: args.notes,
        orgId,
      });

      // Log the new user space as an activity
      await ctx.db.insert("globalActivity", {
        title: "User Added",
        description: `User was added to the system`,
        type: "Occupant Added",
        entityId: result,
        orgId,
      });
    }

    // Get existing user spaces
    const existingUserSpaces = await ctx.db
      .query("userSpaces")
      .filter((q) => q.eq(q.field("userId"), args.userId))
      .collect();

    // Create a set of spaceIds from the new data
    const newSpaceIds = new Set(args.occupantSpaces.map((os) => os.spaceId));

    // Delete user spaces that are not in the new data
    for (const userSpace of existingUserSpaces) {
      if (!newSpaceIds.has(userSpace.spaceId)) {
        await ctx.db.delete(userSpace._id);
      }
    }

    // Update or insert user spaces
    for (const spaceRole of args.occupantSpaces) {
      const existingUserSpace = existingUserSpaces.find(
        (us) => us.spaceId === spaceRole.spaceId,
      );
      if (existingUserSpace) {
        // Update existing user space if role has changed
        if (existingUserSpace.role !== spaceRole.role) {
          await ctx.db.patch(existingUserSpace._id, { role: spaceRole.role });
        }
      } else {
        // Insert new user space
        await ctx.db.insert("userSpaces", {
          userId: args.userId,
          spaceId: spaceRole.spaceId,
          role: spaceRole.role,
          orgId,
        });
      }
    }

    return result;
  },
});

export const getAllOccupantsValueLabelPair = query({
  handler: async (ctx) => {
    const identity = await ctx.auth.getUserIdentity();
    if (!identity) throw new Error("Unauthenticated");
    const orgId = identity.orgId;

    const rawData = await ctx.db
      .query("users")
      .filter((q) => q.eq(q.field("orgId"), orgId))
      .collect();

    return rawData.map((occupant) => ({
      value: occupant._id,
      label: `${occupant.firstName} ${occupant.lastName}`,
    }));
  },
});

export const remove = mutation({
  args: { id: v.id("users") },
  handler: async (ctx, args) => {
    const identity = await ctx.auth.getUserIdentity();
    if (!identity) throw new Error("Unauthenticated");
    const orgId = identity.orgId;

    const existing = await ctx.db.get(args.id);
    if (!existing || existing.orgId !== orgId) {
      throw new Error("User not found or access denied");
    }
    await ctx.db.delete(args.id);

    // Also remove associated userSpaces
    const userSpaces = await ctx.db
      .query("userSpaces")
      .filter((q) => q.eq(q.field("userId"), existing.userId))
      .collect();

    for (const userSpace of userSpaces) {
      await ctx.db.delete(userSpace._id);
    }
  },
});

export const get = query({
  args: { id: v.id("users") },
  handler: async (ctx, args) => {
    const identity = await ctx.auth.getUserIdentity();
    if (!identity) throw new Error("Unauthenticated");
    const orgId = identity.orgId;

    const user = await ctx.db.get(args.id);
    if (!user || user.orgId !== orgId) {
      return null;
    }
    return user;
  },
});

export const addUserToSpace = mutation({
  args: {
    id: v.id("users"),
    spaceId: v.string(),
    role: v.string(),
  },
  handler: async (ctx, args) => {
    const { id, spaceId, role } = args;

    // Get the authenticated user's identity and orgId
    const identity = await ctx.auth.getUserIdentity();
    if (!identity) throw new Error("Unauthenticated");
    const orgId = identity.orgId;
    const userId = identity.userId;

    const user = await ctx.db.get(id);
    if (!user || user.orgId !== orgId) {
      throw new Error("User not found or access denied");
    }

    // Check if the user-space relationship already exists
    const existingUserSpace = await ctx.db
      .query("userSpaces")
      .filter((q) => q.eq(q.field("userId"), user.userId))
      .filter((q) => q.eq(q.field("spaceId"), spaceId))
      .unique();

    if (existingUserSpace) {
      throw new Error("User is already associated with this space");
    }

    // Create the new user-space relationship
    const newUserSpace = await ctx.db.insert("userSpaces", {
      userId: user.userId,
      spaceId,
      role,
      orgId,
    });

    // Log the new user space as an activity
    await ctx.db.insert("globalActivity", {
      title: "User Added to Space",
      description: `User ${user.firstName} ${user.lastName} was added to space ${spaceId} with role ${role}.`,
      type: "Space Added",
      entityId: id,
      orgId,
    });

    // Log the new user space as an activity
    await ctx.db.insert("globalActivity", {
      title: "User Added to Space",
      description: `User ${user.firstName} ${user.lastName} was added to space ${spaceId} with role ${role}.`,
      type: "Space Added",
      entityId: spaceId,
      orgId,
    });

    return newUserSpace;
  },
});

export const removeUserFromSpace = mutation({
  args: {
    userId: v.string(),
    spaceId: v.string(),
  },
  handler: async (ctx, args) => {
    const { userId, spaceId } = args;

    // Check if the user is authenticated and get the orgId
    const identity = await ctx.auth.getUserIdentity();
    if (!identity) throw new Error("Unauthenticated");
    const orgId = identity.orgId;

    // Find the user-space relationship
    const userSpace = await ctx.db
      .query("userSpaces")
      .filter((q) => q.eq(q.field("userId"), userId))
      .filter((q) => q.eq(q.field("spaceId"), spaceId))
      .filter((q) => q.eq(q.field("orgId"), orgId))
      .unique();

    if (!userSpace) {
      throw new Error("User is not associated with this space");
    }

    // Remove the user-space relationship
    await ctx.db.delete(userSpace._id);

    return { success: true, message: "User removed from space" };
  },
});

export const getAll = query({
  handler: async (ctx) => {
    const identity = await ctx.auth.getUserIdentity();
    if (!identity) throw new Error("Unauthenticated");
    const orgId = identity.orgId;

    return await ctx.db
      .query("users")
      .filter((q) => q.eq(q.field("orgId"), orgId))
      .collect();
  },
});

export const getUsersForSpace = query({
  args: { spaceId: v.id("spaces") },
  handler: async (ctx, args) => {
    const identity = await ctx.auth.getUserIdentity();
    if (!identity) throw new Error("Unauthenticated");
    const orgId = identity.orgId;

    // Step 1: Get all userSpaces for the given spaceId
    const userSpaces = await ctx.db
      .query("userSpaces")
      .filter((q) => q.eq(q.field("spaceId"), args.spaceId))
      .filter((q) => q.eq(q.field("orgId"), orgId))
      .collect();

    // Step 2: Fetch users based on the extracted userIds and include their roles
    const users = await Promise.all(
      userSpaces.map(async (userSpace) => {
        const user = await ctx.db
          .query("users")
          .filter((q) => q.eq(q.field("orgId"), orgId))
          .filter((q) => q.eq(q.field("userId"), userSpace.userId))
          .first();
        return user ? { ...user, role: userSpace.role } : null;
      }),
    );

    return users.filter((user) => user.user !== null);
  },
});

export const getUsersWithSpaces = query({
  handler: async (ctx) => {
    const identity = await ctx.auth.getUserIdentity();
    if (!identity) throw new Error("Unauthenticated");
    const orgId = identity.orgId;

    // Fetch all users for the organization
    const users = await ctx.db
      .query("users")
      .filter((q) => q.eq(q.field("orgId"), orgId))
      .collect();

    // Fetch all userSpaces for the organization
    const userSpaces = await ctx.db
      .query("userSpaces")
      .filter((q) => q.eq(q.field("orgId"), orgId))
      .collect();

    // Group userSpaces by userId
    const userSpacesMap = userSpaces.reduce((acc, userSpace) => {
      if (!acc[userSpace.userId]) {
        acc[userSpace.userId] = [];
      }
      acc[userSpace.userId].push(userSpace);
      return acc;
    }, {});

    // Combine user data with their spaces
    const usersWithSpaces = users.map((user) => ({
      ...user,
      occupantSpaces: userSpacesMap[user.userId] || [],
    }));

    return usersWithSpaces;
  },
});

// If you need to fetch a single user with their spaces:
export const getUserWithSpaces = query({
  args: { userId: v.id("users") },
  handler: async (ctx, args) => {
    const identity = await ctx.auth.getUserIdentity();
    if (!identity) throw new Error("Unauthenticated");
    const orgId = identity.orgId;

    const user = await ctx.db.get(args.userId);
    if (!user || user.orgId !== orgId) {
      throw new Error("User not found or access denied");
    }

    const userSpaces = await ctx.db
      .query("userSpaces")
      .filter((q) => q.eq(q.field("userId"), user.userId))
      .collect();

    return {
      ...user,
      occupantSpaces: userSpaces,
    };
  },
});

export const getOccupantForEdit = query({
  args: { id: v.id("users") },
  handler: async (ctx, args) => {
    const identity = await ctx.auth.getUserIdentity();
    if (!identity) throw new Error("Unauthenticated");
    const orgId = identity.orgId;

    const user = await ctx.db.get(args.id);
    if (!user || user.orgId !== orgId) {
      throw new Error("User not found or access denied");
    }

    const userSpaces = await ctx.db
      .query("userSpaces")
      .filter((q) => q.eq(q.field("userId"), user.userId))
      .collect();

    const spaceRoles = userSpaces.map((space) => ({
      spaceId: space.spaceId,
      role: space.role,
    }));

    return {
      id: user._id,
      userId: user.userId,
      firstName: user.firstName,
      lastName: user.lastName,
      email: user.email,
      phoneNumber: user.phoneNumber,
      parcelPreference: user.parcelPreference,
      notes: user.notes,
      spaceRoles: spaceRoles,
    };
  },
});
