/* prettier-ignore-start */

/* eslint-disable */
/**
 * Generated `api` utility.
 *
 * THIS CODE IS AUTOMATICALLY GENERATED.
 *
 * To regenerate, run `npx convex dev`.
 * @module
 */

import type {
  ApiFromModules,
  FilterApi,
  FunctionReference,
} from "convex/server";
import type * as activity from "../activity.js";
import type * as allUsers from "../allUsers.js";
import type * as allocations from "../allocations.js";
import type * as announcements from "../announcements.js";
import type * as auth from "../auth.js";
import type * as bookingTypes from "../bookingTypes.js";
import type * as bookings from "../bookings.js";
import type * as chats from "../chats.js";
import type * as contractors from "../contractors.js";
import type * as dashboard from "../dashboard.js";
import type * as documents from "../documents.js";
import type * as eventAttendees from "../eventAttendees.js";
import type * as events from "../events.js";
import type * as facilities from "../facilities.js";
import type * as features from "../features.js";
import type * as feed from "../feed.js";
import type * as handoverNotes from "../handoverNotes.js";
import type * as helperFunctions from "../helperFunctions.js";
import type * as http from "../http.js";
import type * as keys from "../keys.js";
import type * as notes from "../notes.js";
import type * as occupants from "../occupants.js";
import type * as offers from "../offers.js";
import type * as parcels from "../parcels.js";
import type * as parkTypes from "../parkTypes.js";
import type * as parking from "../parking.js";
import type * as parkingOperators from "../parkingOperators.js";
import type * as requests from "../requests.js";
import type * as site from "../site.js";
import type * as spaces from "../spaces.js";
import type * as storage from "../storage.js";
import type * as storageSpaces from "../storageSpaces.js";
import type * as theme from "../theme.js";
import type * as tickets from "../tickets.js";
import type * as vehicles from "../vehicles.js";
import type * as workOrders from "../workOrders.js";

/**
 * A utility for referencing Convex functions in your app's API.
 *
 * Usage:
 * ```js
 * const myFunctionReference = api.myModule.myFunction;
 * ```
 */
declare const fullApi: ApiFromModules<{
  activity: typeof activity;
  allUsers: typeof allUsers;
  allocations: typeof allocations;
  announcements: typeof announcements;
  auth: typeof auth;
  bookingTypes: typeof bookingTypes;
  bookings: typeof bookings;
  chats: typeof chats;
  contractors: typeof contractors;
  dashboard: typeof dashboard;
  documents: typeof documents;
  eventAttendees: typeof eventAttendees;
  events: typeof events;
  facilities: typeof facilities;
  features: typeof features;
  feed: typeof feed;
  handoverNotes: typeof handoverNotes;
  helperFunctions: typeof helperFunctions;
  http: typeof http;
  keys: typeof keys;
  notes: typeof notes;
  occupants: typeof occupants;
  offers: typeof offers;
  parcels: typeof parcels;
  parkTypes: typeof parkTypes;
  parking: typeof parking;
  parkingOperators: typeof parkingOperators;
  requests: typeof requests;
  site: typeof site;
  spaces: typeof spaces;
  storage: typeof storage;
  storageSpaces: typeof storageSpaces;
  theme: typeof theme;
  tickets: typeof tickets;
  vehicles: typeof vehicles;
  workOrders: typeof workOrders;
}>;
export declare const api: FilterApi<
  typeof fullApi,
  FunctionReference<any, "public">
>;
export declare const internal: FilterApi<
  typeof fullApi,
  FunctionReference<any, "internal">
>;

/* prettier-ignore-end */
