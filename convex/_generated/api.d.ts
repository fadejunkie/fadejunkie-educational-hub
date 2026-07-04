/* eslint-disable */
/**
 * Generated `api` utility.
 *
 * THIS CODE IS AUTOMATICALLY GENERATED.
 *
 * To regenerate, run `npx convex dev`.
 * @module
 */

import type * as admin from "../admin.js";
import type * as authz from "../authz.js";
import type * as barber from "../barber.js";
import type * as debug from "../debug.js";
import type * as devTickets from "../devTickets.js";
import type * as eduAccess from "../eduAccess.js";
import type * as partners from "../partners.js";
import type * as progress from "../progress.js";
import type * as starredCards from "../starredCards.js";
import type * as studyPreferences from "../studyPreferences.js";
import type * as userProfile from "../userProfile.js";
import type * as waitlist from "../waitlist.js";

import type {
  ApiFromModules,
  FilterApi,
  FunctionReference,
} from "convex/server";

declare const fullApi: ApiFromModules<{
  admin: typeof admin;
  authz: typeof authz;
  barber: typeof barber;
  debug: typeof debug;
  devTickets: typeof devTickets;
  eduAccess: typeof eduAccess;
  partners: typeof partners;
  progress: typeof progress;
  starredCards: typeof starredCards;
  studyPreferences: typeof studyPreferences;
  userProfile: typeof userProfile;
  waitlist: typeof waitlist;
}>;

/**
 * A utility for referencing Convex functions in your app's public API.
 *
 * Usage:
 * ```js
 * const myFunctionReference = api.myModule.myFunction;
 * ```
 */
export declare const api: FilterApi<
  typeof fullApi,
  FunctionReference<any, "public">
>;

/**
 * A utility for referencing Convex functions in your app's internal API.
 *
 * Usage:
 * ```js
 * const myFunctionReference = internal.myModule.myFunction;
 * ```
 */
export declare const internal: FilterApi<
  typeof fullApi,
  FunctionReference<any, "internal">
>;

export declare const components: {};
