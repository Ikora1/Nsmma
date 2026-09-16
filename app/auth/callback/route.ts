import { NextResponse } from "next/server"
import { createClient } from "@supabase/supabase-js"
import { isAuthorizedAdminEmail } from "@/lib/store-db"
import { setAdminSessionCookie } from "@/lib/auth"

export async function GET(request: Request) {
  const { searchParams, origin } = new URL(request.url)
  const code = searchParams.get("code")
  const error = searchParams.get("error")
  const errorDescription = searchParams.get("error_description")

  if (error) {
    console.error("[OAuth Error]:", error, errorDescription)
    return NextResponse.redirect(`${origin}/nasmma-portal-gate?error=${encodeURIComponent(errorDescription || error)}`)
  }

  if (!code) {
    return NextResponse.redirect(`${origin}/nasmma-portal-gate?error=missing_code`)
  }

  const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL
  const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY

  if (!supabaseUrl || !supabaseAnonKey) {
    return NextResponse.redirect(`${origin}/nasmma-portal-gate?error=supabase_not_configured`)
  }

  try {
    const supabase = createClient(supabaseUrl, supabaseAnonKey)
    const { data, error: exchangeError } = await supabase.auth.exchangeCodeForSession(code)

    if (exchangeError || !data?.user?.email) {
      console.error("[OAuth Exchange Error]:", exchangeError)
      return NextResponse.redirect(`${origin}/nasmma-portal-gate?error=auth_failed`)
    }

    const email = data.user.email
    const isAuthorized = await isAuthorizedAdminEmail(email)

    if (!isAuthorized) {
      // User is authenticated via Google, but not in admin whitelist!
      await supabase.auth.signOut()
      return NextResponse.redirect(`${origin}/nasmma-portal-gate?error=unauthorized&email=${encodeURIComponent(email)}`)
    }

    // Successfully verified admin! Set session cookie and redirect to /admin
    await setAdminSessionCookie(email)
    return NextResponse.redirect(`${origin}/admin`)
  } catch (err: any) {
    console.error("[OAuth Callback Exception]:", err)
    return NextResponse.redirect(`${origin}/nasmma-portal-gate?error=server_error`)
  }
}
