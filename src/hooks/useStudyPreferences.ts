import { useUser } from '@clerk/clerk-react'
import { useMutation, useQuery } from 'convex/react'
import { api } from '../../convex/_generated/api'

const DEFAULTS = { showExplanations: true, dailyReminder: false, autoStarMissed: true, defaultQuizLength: 20 as 20 | 50 | 100 }

type PrefKey = 'showExplanations' | 'dailyReminder' | 'autoStarMissed'

/**
 * Signed-in user's study preferences (explanations, daily reminder, auto-star, default quiz length).
 * Falls back to DEFAULTS while loading or for signed-out users.
 */
export function useStudyPreferences() {
  const { user, isLoaded: clerkLoaded } = useUser()
  const result = useQuery(
    api.studyPreferences.getMyPreferences,
    clerkLoaded && user ? {} : 'skip'
  )
  const setPreferenceMutation = useMutation(api.studyPreferences.setPreference)
  const setDefaultQuizLengthMutation = useMutation(api.studyPreferences.setDefaultQuizLength)

  const loading = !clerkLoaded || (!!user && result === undefined)
  const prefs = result ?? DEFAULTS

  async function setPreference(key: PrefKey, value: boolean) {
    if (!user) return
    await setPreferenceMutation({
      email:   user.primaryEmailAddress?.emailAddress,
      name:    user.fullName ?? undefined,
      key,
      value,
    })
  }

  async function setDefaultQuizLength(value: 20 | 50 | 100) {
    if (!user) return
    await setDefaultQuizLengthMutation({
      email:   user.primaryEmailAddress?.emailAddress,
      name:    user.fullName ?? undefined,
      value,
    })
  }

  return { prefs, loading, setPreference, setDefaultQuizLength }
}
