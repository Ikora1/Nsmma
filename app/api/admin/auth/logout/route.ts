import { NextResponse } from "next/server"
import { clearAdminSessionCookie } from "@/lib/auth"

export async function POST() {
  try {
    await clearAdminSessionCookie()
    return NextResponse.json({ success: true })
  } catch (err) {
    return NextResponse.json({ error: "Failed to logout" }, { status: 500 })
  }
}
