import { NextResponse } from "next/server"
import { isAuthenticatedAdmin, getAuthenticatedAdminEmail } from "@/lib/auth"

export async function GET() {
  const isAuth = await isAuthenticatedAdmin()
  if (!isAuth) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
  }
  const email = await getAuthenticatedAdminEmail()
  return NextResponse.json({
    authenticated: true,
    email,
    provider: "supabase_auth",
  })
}
