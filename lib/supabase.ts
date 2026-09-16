import { createClient } from "@supabase/supabase-js"

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL || process.env.SUPABASE_URL
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || process.env.SUPABASE_ANON_KEY
const supabaseServiceKey = process.env.SUPABASE_SERVICE_ROLE_KEY

export const isSupabaseConfigured = (): boolean => {
  return Boolean(supabaseUrl && (supabaseAnonKey || supabaseServiceKey))
}

// Public client for browser / public reads
export const supabase = isSupabaseConfigured()
  ? createClient(supabaseUrl!, supabaseAnonKey || supabaseServiceKey!)
  : null

// Admin server client with service role key if available
export const getSupabaseAdmin = () => {
  if (!supabaseUrl) return null
  const key = supabaseServiceKey || supabaseAnonKey
  if (!key) return null
  return createClient(supabaseUrl, key, {
    auth: {
      persistSession: false,
      autoRefreshToken: false,
    },
  })
}
