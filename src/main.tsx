import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import { BrowserRouter } from 'react-router-dom'
import { ClerkProvider, useAuth } from '@clerk/clerk-react'
import { ConvexReactClient } from 'convex/react'
import { ConvexProviderWithClerk } from 'convex/react-clerk'
import './index.css'
import App from './App.tsx'

// ConvexProviderWithClerk forwards the signed-in user's Clerk JWT to Convex on
// every call, so the backend can trust ctx.auth.getUserIdentity() instead of a
// client-supplied clerkId (see SECURITY_AUDIT.md F1). Requires a Clerk JWT
// template named "convex" (matches applicationID in convex/auth.config.ts).
const convex = new ConvexReactClient(import.meta.env.VITE_CONVEX_URL)
const clerkPubKey = import.meta.env.VITE_CLERK_PUBLISHABLE_KEY

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <ClerkProvider publishableKey={clerkPubKey}>
      <ConvexProviderWithClerk client={convex} useAuth={useAuth}>
        <BrowserRouter>
          <App />
        </BrowserRouter>
      </ConvexProviderWithClerk>
    </ClerkProvider>
  </StrictMode>,
)
