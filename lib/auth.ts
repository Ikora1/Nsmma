import { cookies } from "next/headers"

const SESSION_COOKIE = "nasmma_admin_session"

function getSessionSecret(): string {
  return process.env.ADMIN_SESSION_SECRET || process.env.SUPABASE_SERVICE_ROLE_KEY || "nasmma_session_secure_key"
}

export function createSessionToken(email: string): string {
  const timestamp = Date.now().toString()
  const payload = JSON.stringify({ email: email.toLowerCase().trim(), timestamp, salt: getSessionSecret() })
  return Buffer.from(payload).toString("base64")
}

export function isValidSessionToken(token?: string): { valid: boolean; email?: string } {
  if (!token) return { valid: false }
  try {
    const decoded = Buffer.from(token, "base64").toString("utf8")
    const parsed = JSON.parse(decoded)
    if (parsed.salt !== getSessionSecret()) return { valid: false }
    const timestamp = parseInt(parsed.timestamp, 10)
    // 7 days validity
    const maxAge = 7 * 24 * 60 * 60 * 1000
    if (Date.now() - timestamp > maxAge) return { valid: false }
    return { valid: true, email: parsed.email }
  } catch {
    return { valid: false }
  }
}

export async function isAuthenticatedAdmin(): Promise<boolean> {
  const cookieStore = await cookies()
  const session = cookieStore.get(SESSION_COOKIE)?.value
  const check = isValidSessionToken(session)
  return check.valid
}

export async function getAuthenticatedAdminEmail(): Promise<string | null> {
  const cookieStore = await cookies()
  const session = cookieStore.get(SESSION_COOKIE)?.value
  const check = isValidSessionToken(session)
  return check.email || null
}

export async function setAdminSessionCookie(email: string): Promise<void> {
  const cookieStore = await cookies()
  const token = createSessionToken(email)
  cookieStore.set(SESSION_COOKIE, token, {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    sameSite: "lax",
    path: "/",
    maxAge: 7 * 24 * 60 * 60, // 7 days
  })
}

export async function clearAdminSessionCookie(): Promise<void> {
  const cookieStore = await cookies()
  cookieStore.delete(SESSION_COOKIE)
}
