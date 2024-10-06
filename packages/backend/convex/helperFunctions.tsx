import { v } from 'convex/values';
import { internalQuery } from './_generated/server';

export const getOccupantAudienceGroups = internalQuery({
  args: {},
  handler: async (ctx, args) => {
    const audienceGroups = [];
    const identity = await ctx.auth.getUserIdentity();
    if (!identity) throw new Error('Unauthenticated');
    const userId = identity.userId;
    const orgId = identity.orgId;

    const occupant = await ctx.db
      .query('users')
      .filter((q) => q.eq(q.field('userId'), userId))
      .first();

    // Add occupant (user) to audience groups
    audienceGroups.push({
      entity: occupant._id,
      type: 'occupant',
    });

    // Get user's spaces
    const userSpaces = await ctx.db
      .query('userSpaces')
      .filter((q) => q.eq(q.field('userId'), userId))
      .collect();

    // Loop through each user space and get the space details
    for (const userSpace of userSpaces) {
      const space = await ctx.db.get(userSpace.spaceId);
      if (!space) continue;

      // Add space to audience groups
      audienceGroups.push({
        entity: space._id,
        type: 'space',
      });

      // Add floor to audience groups
      if (space.floor) {
        audienceGroups.push({
          entity: space.floor,
          type: 'floor',
        });
      }

      // Add building to audience groups
      if (space.buildingId) {
        audienceGroups.push({
          entity: space.buildingId,
          type: 'building',
        });
      }

      // Add space type to audience groups
      if (space.spaceTypeId) {
        audienceGroups.push({
          entity: space.spaceTypeId,
          type: 'spaceType',
        });
      }
    }

    return audienceGroups;
  },
});
