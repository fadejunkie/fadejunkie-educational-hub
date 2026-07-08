import { useUser } from '@clerk/clerk-react'
import { useQuery } from 'convex/react'
import { useSearchParams } from 'react-router-dom'
import { api } from '../../convex/_generated/api'

/**
 * Returns whether the signed-in user has a lifetime edu hub pass.
 * - loading: true while Clerk or Convex is still resolving
 * - hasAccess: true only if user is signed in AND has a lifetime pass
 * - isSignedIn: whether the user is authenticated
 *
 * Admin-only test override: `?preview=locked-style` forces hasAccess to
 * false so admins can screenshot/QA gated views without revoking their own
 * pass or clicking a real Stripe CTA. Verified server-side via
 * isCurrentUserAdmin — the query param does nothing for non-admins.
 */
export function useEduAccess() {
  const { user, isLoaded: clerkLoaded } = useUser()
  const [searchParams] = useSearchParams()
  const wantsLockedPreview = searchParams.get('preview') === 'locked-style'

  const result = useQuery(
    api.eduAccess.getEduAccess,
    clerkLoaded && user ? {} : 'skip'
  )
  const isAdmin = useQuery(
    api.admin.isCurrentUserAdmin,
    clerkLoaded && user && wantsLockedPreview ? {} : 'skip'
  )

  const loading =
    !clerkLoaded ||
    (!!user && result === undefined) ||
    (!!user && wantsLockedPreview && isAdmin === undefined)
  const forceLocked = wantsLockedPreview && isAdmin === true
  const hasAccess = forceLocked ? false : result?.hasAccess ?? false

  return {
    hasAccess,
    loading,
    isSignedIn: clerkLoaded && !!user,
  }
}
