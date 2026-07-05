import { useUser } from '@clerk/clerk-react'
import { useQuery } from 'convex/react'
import { api } from '../../convex/_generated/api'

/**
 * Returns whether the signed-in user has a lifetime edu hub pass.
 * - loading: true while Clerk or Convex is still resolving
 * - hasAccess: true only if user is signed in AND has a lifetime pass
 * - isSignedIn: whether the user is authenticated
 */
export function useEduAccess() {
  const { user, isLoaded: clerkLoaded } = useUser()
  const result = useQuery(
    api.eduAccess.getEduAccess,
    clerkLoaded && user ? {} : 'skip'
  )

  const loading = !clerkLoaded || (!!user && result === undefined)
  const hasAccess = result?.hasAccess ?? false

  return {
    hasAccess,
    loading,
    isSignedIn: clerkLoaded && !!user,
  }
}
