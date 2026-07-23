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
import type * as crons from "../crons.js";
import type * as devTickets from "../devTickets.js";
import type * as eduAccess from "../eduAccess.js";
import type * as email from "../email.js";
import type * as emails_shell from "../emails/shell.js";
import type * as emails_templates from "../emails/templates.js";
import type * as flows from "../flows.js";
import type * as http from "../http.js";
import type * as partners from "../partners.js";
import type * as progress from "../progress.js";
import type * as schoolDemos from "../schoolDemos.js";
import type * as starredCards from "../starredCards.js";
import type * as studyContent from "../studyContent.js";
import type * as studyPreferences from "../studyPreferences.js";
import type * as subscribers from "../subscribers.js";
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
  crons: typeof crons;
  devTickets: typeof devTickets;
  eduAccess: typeof eduAccess;
  email: typeof email;
  "emails/shell": typeof emails_shell;
  "emails/templates": typeof emails_templates;
  flows: typeof flows;
  http: typeof http;
  partners: typeof partners;
  progress: typeof progress;
  schoolDemos: typeof schoolDemos;
  starredCards: typeof starredCards;
  studyContent: typeof studyContent;
  studyPreferences: typeof studyPreferences;
  subscribers: typeof subscribers;
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
