import { NextResponse } from "next/server"
import type { NextRequest } from "next/server"

const SESSION_COOKIE = "nasmma_admin_session"

function getSessionSecret(): string {
  return process.env.ADMIN_SESSION_SECRET || process.env.SUPABASE_SERVICE_ROLE_KEY || "nasmma_session_secure_key"
}

function isValidToken(token?: string): boolean {
  if (!token) return false
  try {
    const decoded = atob(token)
    const parsed = JSON.parse(decoded)
    if (parsed.salt !== getSessionSecret()) return false
    const timestamp = parseInt(parsed.timestamp, 10)
    const maxAge = 7 * 24 * 60 * 60 * 1000
    if (Date.now() - timestamp > maxAge) return false
    return true
  } catch {
    return false
  }
}

export function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl

  // Protect /admin routes
  if (pathname.startsWith("/admin")) {
    const sessionCookie = request.cookies.get(SESSION_COOKIE)?.value
    if (!isValidToken(sessionCookie)) {
      // Return 404 rewrite so unauthorized visitors have no idea admin portal exists
      return NextResponse.rewrite(new URL("/_not-found", request.url), { status: 404 })
    }
  }

  // Protect /api/admin routes
  if (pathname.startsWith("/api/admin") && !pathname.startsWith("/api/admin/auth/gate-login")) {
    const sessionCookie = request.cookies.get(SESSION_COOKIE)?.value
    if (!isValidToken(sessionCookie)) {
      return NextResponse.json({ error: "Not found" }, { status: 404 })
    }
  }

  return NextResponse.next()
}

export const config = {
  matcher: ["/admin/:path*", "/api/admin/:path*"],
}
