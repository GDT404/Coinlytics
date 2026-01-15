import { supabase } from '@/lib/supabase'

export async function ensureUserProfile() {
  const {
    data: { user },
  } = await supabase.auth.getUser()

  if (!user) return null

  const { data: profile } = await supabase
    .from('profiles')
    .select('*')
    .eq('id', user.id)
    .single()

  if (profile) return profile

  const { data: newProfile } = await supabase
    .from('profiles')
    .insert({
      id: user.id,
      name: user.email?.split('@')[0],
    })
    .select()
    .single()

  return newProfile
}
