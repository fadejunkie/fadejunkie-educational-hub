import { query } from "./_generated/server"

/**
 * TEMPORARY verification endpoint for the identity cutover.
 *
 * After deploying auth.config.ts + ConvexProviderWithClerk, sign in on
 * fadejunkie.com and confirm this returns a non-null { subject } for the
 * signed-in user. If it returns null while signed in, the Clerk "convex"
 * JWT template is missing or the issuer in auth.config.ts is wrong — DO NOT
 * proceed with removing the clerkId args until this returns an identity.
 *
 * Delete this file once the cutover is verified.
 */
export const whoami = query({
  args: {},
  handler: async (ctx) => {
    const identity = await ctx.auth.getUserIdentity()
    if (!identity) return null
    return {
      subject: identity.subject,
      email: (identity.email as string | undefined) ?? null,
    }
  },
})
