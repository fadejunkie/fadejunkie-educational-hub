// Convex ↔ Clerk auth wiring.
//
// This tells Convex which JWT issuer to trust so `ctx.auth.getUserIdentity()`
// returns the verified caller. Without this file, getUserIdentity() is always
// null and the backend cannot know who is calling (see SECURITY_AUDIT.md F1/F2).
//
// `domain` = the Clerk instance Frontend API (issuer). Currently the DEV
// instance (wise-ant-33). When the production Clerk instance is provisioned
// (Phase 3 / F6), change this to the production issuer, e.g.
// "https://clerk.fadejunkie.com".
//
// `applicationID` = the name of the Clerk JWT template. It MUST match the
// template name requested by ConvexProviderWithClerk in src/main.tsx
// (getToken({ template: "convex" })). Create a JWT template named "convex"
// in the Clerk dashboard before deploying the identity cutover.
export default {
  providers: [
    {
      domain: "https://wise-ant-33.clerk.accounts.dev",
      applicationID: "convex",
    },
  ],
}
