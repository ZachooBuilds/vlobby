import { mutation, query } from './_generated/server';
import { v } from 'convex/values';
import { sendPushNotificationToCurrentOrg } from './pushNotifications';

/**
 * @function upsertOfferCategory
 * @description Creates or updates an offer category.
 * @param {Object} args - The offer category data.
 * @param {string} args.id - Optional ID of an existing offer category.
 * @param {string} args.name - Name of the offer category.
 * @param {string} args.description - Description of the offer category.
 * @returns {Promise<string>} The ID of the created or updated offer category.
 */
export const upsertOfferCategory = mutation({
  args: {
    id: v.optional(v.id('offerCategories')),
    name: v.string(),
    description: v.string(),
  },
  handler: async (ctx, args) => {
    const identity = await ctx.auth.getUserIdentity();
    if (!identity) throw new Error('Unauthenticated');
    const orgId = identity.orgId;

    if (args.id) {
      // Update existing offer category
      const existing = await ctx.db.get(args.id);
      if (!existing || existing.orgId !== orgId) {
        throw new Error('Offer category not found or access denied');
      }
      await ctx.db.patch(args.id, {
        name: args.name,
        description: args.description,
      });
      return args.id;
    } else {
      // Insert new offer category
      return await ctx.db.insert('offerCategories', {
        name: args.name,
        description: args.description,
        orgId,
      });
    }
  },
});

/**
 * @function removeOfferCategory
 * @description Deletes an offer category.
 * @param {Object} args - The offer category data.
 * @param {string} args.id - ID of the offer category to delete.
 */
export const removeOfferCategory = mutation({
  args: { id: v.id('offerCategories') },
  handler: async (ctx, args) => {
    const identity = await ctx.auth.getUserIdentity();
    if (!identity) throw new Error('Unauthenticated');
    const orgId = identity.orgId;

    const existing = await ctx.db.get(args.id);
    if (!existing || existing.orgId !== orgId) {
      throw new Error('Offer category not found or access denied');
    }
    await ctx.db.delete(args.id);
  },
});

/**
 * @function getOfferCategory
 * @description Retrieves a single offer category.
 * @param {Object} args - The query arguments.
 * @param {string} args.id - ID of the offer category to retrieve.
 * @returns {Promise<Object|null>} The offer category object or null if not found.
 */
export const getOfferCategory = query({
  args: { id: v.id('offerCategories') },
  handler: async (ctx, args) => {
    const identity = await ctx.auth.getUserIdentity();
    if (!identity) throw new Error('Unauthenticated');
    const orgId = identity.orgId;

    const offerCategory = await ctx.db.get(args.id);
    if (!offerCategory || offerCategory.orgId !== orgId) {
      return null;
    }
    return offerCategory;
  },
});

/**
 * @function getAllOfferCategories
 * @description Retrieves all offer categories for the authenticated user's organization.
 * @returns {Promise<Array>} An array of offer category objects.
 */
export const getAllOfferCategories = query({
  handler: async (ctx) => {
    const identity = await ctx.auth.getUserIdentity();
    if (!identity) throw new Error('Unauthenticated');
    const orgId = identity.orgId;

    return await ctx.db
      .query('offerCategories')
      .filter((q) => q.eq(q.field('orgId'), orgId))
      .collect();
  },
});

/**
 * @function upsertOffer
 * @description Creates or updates an offer.
 * @param {Object} args - The offer data.
 * @param {string} args.id - Optional ID of an existing offer.
 * @param {string} args.title - Title of the offer.
 * @param {string} args.type - Type of the offer.
 * @param {string} args.offerDescription - Description of the offer.
 * @param {string} args.colour - Color associated with the offer.
 * @param {Array} args.files - Optional array of file objects.
 * @param {string} args.startDate - Start date of the offer.
 * @param {string} args.endDate - End date of the offer.
 * @returns {Promise<string>} The ID of the created or updated offer.
 */
export const upsertOffer = mutation({
  args: {
    id: v.optional(v.id('offers')),
    title: v.string(),
    type: v.string(),
    offerDescription: v.string(),
    colour: v.string(),
    files: v.array(
      v.object({
        url: v.string(),
        storageId: v.string(),
      })
    ),
    startDate: v.string(),
    endDate: v.string(),
  },
  handler: async (ctx, args) => {
    const identity = await ctx.auth.getUserIdentity();
    if (!identity) throw new Error('Unauthenticated');
    const orgId = identity.orgId;

    const offerData = {
      title: args.title,
      type: args.type,
      description: args.offerDescription,
      colour: args.colour,
      image: args.files[0]!.storageId,
      startDate: args.startDate,
      endDate: args.endDate,
      orgId,
    };

    if (args.id) {
      // Update existing offer
      const existing = await ctx.db.get(args.id);
      if (!existing || existing.orgId !== orgId) {
        throw new Error('Offer not found or access denied');
      }
      await ctx.db.patch(args.id, offerData);
      return args.id;
    } else {
      // Insert new offer
      const offer = await ctx.db.insert('offers', offerData);
      await sendPushNotificationToCurrentOrg(ctx, {
        title: '🔔 New Offer',
        body: args.title,
      });
      return offer;
    }
  },
});

/**
 * @function getOfferForUpdate
 * @description Retrieves a single offer with additional data for updating.
 * @param {Object} args - The query arguments.
 * @param {string} args.id - ID of the offer to retrieve.
 * @returns {Promise<Object|null>} The offer object with additional update data or null if not found.
 */
export const getOfferForUpdate = query({
  args: { id: v.id('offers') },
  handler: async (ctx, args) => {
    const identity = await ctx.auth.getUserIdentity();
    if (!identity) throw new Error('Unauthenticated');
    const orgId = identity.orgId;

    const offer = await ctx.db.get(args.id);
    if (!offer || offer.orgId !== orgId) {
      return null;
    }

    return {
      _id: offer._id,
      title: offer.title,
      type: offer.type,
      offerDescription: offer.description,
      colour: offer.colour,
      files: offer.image
        ? [
            {
              url: await ctx.storage.getUrl(offer.image),
              storageId: offer.image,
            },
          ]
        : [],
      startDate: new Date(offer.startDate),
      endDate: new Date(offer.endDate),
    };
  },
});

/**
 * @function getAllOffersForUpdate
 * @description Retrieves all offers with additional data for updating.
 * @returns {Promise<Array>} An array of offer objects with additional update data.
 */
export const getAllOffersForUpdate = query({
  handler: async (ctx) => {
    const identity = await ctx.auth.getUserIdentity();
    if (!identity) throw new Error('Unauthenticated');
    const orgId = identity.orgId;

    const offers = await ctx.db
      .query('offers')
      .filter((q) => q.eq(q.field('orgId'), orgId))
      .collect();

    return Promise.all(
      offers.map(async (offer) => ({
        _id: offer._id,
        title: offer.title,
        type: offer.type,
        offerDescription: offer.description,
        colour: offer.colour,
        files: [
          {
            url: await ctx.storage.getUrl(offer.image),
            storageId: offer.image,
          },
        ],
        startDate: offer.startDate,
        endDate: offer.endDate,
      }))
    );
  },
});

/**
 * @function getOffer
 * @description Retrieves a single offer.
 * @param {Object} args - The query arguments.
 * @param {string} args.id - ID of the offer to retrieve.
 * @returns {Promise<Object|null>} The offer object or null if not found.
 */
export const getOffer = query({
  args: { id: v.id('offers') },
  handler: async (ctx, args) => {
    const identity = await ctx.auth.getUserIdentity();
    if (!identity) throw new Error('Unauthenticated');
    const orgId = identity.orgId;

    const offer = await ctx.db.get(args.id);
    if (!offer || offer.orgId !== orgId) {
      return null;
    }
    return offer;
  },
});

/**
 * @function getAllOffers
 * @description Retrieves all offers for the authenticated user's organization.
 * @returns {Promise<Array>} An array of offer objects with image URLs.
 */
export const getAllOffers = query({
  handler: async (ctx) => {
    const identity = await ctx.auth.getUserIdentity();
    if (!identity) throw new Error('Unauthenticated');
    const orgId = identity.orgId;

    const offers = await ctx.db
      .query('offers')
      .filter((q) => q.eq(q.field('orgId'), orgId))
      .collect();

    return Promise.all(
      offers.map(async (offer) => ({
        ...offer,
        imageUrl: offer.image ? await ctx.storage.getUrl(offer.image) : null,
      }))
    );
  },
});

/**
 * @function deleteOffer
 * @description Deletes an offer.
 * @param {Object} args - The offer data.
 * @param {string} args.id - ID of the offer to delete.
 */
export const deleteOffer = mutation({
  args: { id: v.id('offers') },
  handler: async (ctx, args) => {
    const identity = await ctx.auth.getUserIdentity();
    if (!identity) throw new Error('Unauthenticated');
    const orgId = identity.orgId;

    const existing = await ctx.db.get(args.id);
    if (!existing || existing.orgId !== orgId) {
      throw new Error('Offer not found or access denied');
    }
    await ctx.db.delete(args.id);
  },
});
