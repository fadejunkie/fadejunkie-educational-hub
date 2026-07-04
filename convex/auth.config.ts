// Convex ↔ Clerk auth wiring.
//
// This tells Convex which JWT issuer to trust so `ctx.auth.getUserIdentity()`
// returns the verified caller. Without this file, getUserIdentity() is always
// null and the backend cannot know who is calling (see SECURITY_AUDIT.md F1/F2).
//
// `domain` = the Clerk instance Frontend API (issuer). Production instance
// (Phase 3 / F6), issuer is the custom domain clerk.fadejunkie.com.
//
// `applicationID` = the name of the Clerk JWT template. It MUST match the
// template name requested by ConvexProviderWithClerk in src/main.tsx
// (getToken({ template: "convex" })). Create a JWT template named "convex"
// in the Clerk dashboard before deploying the identity cutover.
export default {
  providers: [
    {
      domain: "https://clerk.fadejunkie.com",
      applicationID: "convex",
    },
  ],
}
