import { NextResponse } from "next/server"
import { createClient } from "@supabase/supabase-js"
import { setAdminSessionCookie } from "@/lib/auth"
import { isAuthorizedAdminEmail } from "@/lib/store-db"

export async function POST(request: Request) {
  try {
    const body = await request.json()
    const { email, password } = body

    if (!email || !password) {
      return NextResponse.json({ error: "يرجى إدخال البريد الإلكتروني وكلمة المرور" }, { status: 400 })
    }

    const cleanEmail = email.trim().toLowerCase()

    // 1. Check environment ADMIN_PASSWORD if configured
    const envAdminPassword = process.env.ADMIN_PASSWORD
    if (envAdminPassword && password === envAdminPassword) {
      const authorized = await isAuthorizedAdminEmail(cleanEmail)
      if (authorized) {
        await setAdminSessionCookie(cleanEmail)
        return NextResponse.json({ success: true, redirect: "/admin" })
      } else {
        return NextResponse.json({ error: "عذراً، هذا البريد ليس لديه صلاحيات الإدارة" }, { status: 403 })
      }
    }

    // 2. Otherwise verify via Supabase Auth
    const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL
    const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY

    if (!supabaseUrl || !supabaseAnonKey) {
      return NextResponse.json({ error: "إعدادات Supabase غير متوفرة في السيرفر" }, { status: 500 })
    }

    const supabase = createClient(supabaseUrl, supabaseAnonKey)
    const { data, error } = await supabase.auth.signInWithPassword({
      email: cleanEmail,
      password,
    })

    if (error || !data?.user?.email) {
      return NextResponse.json({ error: "بيانات الدخول غير صحيحة أو الحساب غير مسجل في Supabase" }, { status: 401 })
    }

    const authorized = await isAuthorizedAdminEmail(data.user.email)
    if (!authorized) {
      await supabase.auth.signOut()
      return NextResponse.json({ error: "عذراً، هذا الحساب ليس لديه صلاحيات الإدارة" }, { status: 403 })
    }

    await setAdminSessionCookie(data.user.email)
    return NextResponse.json({ success: true, redirect: "/admin" })
  } catch (err) {
    console.error("[Gate Login Error]:", err)
    return NextResponse.json({ error: "حدث خطأ أثناء معالجة تسجيل الدخول" }, { status: 500 })
  }
}
