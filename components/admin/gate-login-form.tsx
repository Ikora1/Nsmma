"use client"

import { useState } from "react"
import { useRouter } from "next/navigation"
import { Lock, Mail, ArrowLeft, Loader2, ShieldCheck, AlertCircle } from "lucide-react"
import { supabase } from "@/lib/supabase"

export function GateLoginForm({
  initialError,
  attemptedEmail,
}: {
  initialError?: string
  attemptedEmail?: string
}) {
  const router = useRouter()
  const [email, setEmail] = useState("")
  const [password, setPassword] = useState("")
  const [error, setError] = useState(
    initialError === "unauthorized"
      ? `عذراً، البريد (${attemptedEmail || "المحدد"}) ليس لديه صلاحيات الإدارة.`
      : initialError || ""
  )
  const [isLoading, setIsLoading] = useState(false)
  const [isGoogleLoading, setIsGoogleLoading] = useState(false)

  const handleGoogleLogin = async () => {
    setError("")
    setIsGoogleLoading(true)

    try {
      if (!supabase) {
        setError("إعدادات Supabase غير مفعلة")
        setIsGoogleLoading(false)
        return
      }

      const redirectTo = `${window.location.origin}/auth/callback`
      const { error: oauthError } = await supabase.auth.signInWithOAuth({
        provider: "google",
        options: {
          redirectTo,
          queryParams: {
            access_type: "offline",
            prompt: "consent",
          },
        },
      })

      if (oauthError) {
        setError(oauthError.message || "فشل بدء تسجيل الدخول باستخدام Google")
        setIsGoogleLoading(false)
      }
    } catch (err: any) {
      setError(err?.message || "حدث خطأ أثناء الاتصال بموفر Google")
      setIsGoogleLoading(false)
    }
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setError("")
    setIsLoading(true)

    try {
      const res = await fetch("/api/admin/auth/gate-login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, password }),
      })

      const data = await res.json()

      if (!res.ok || data.error) {
        setError(data.error || "تعذر تسجيل الدخول")
        setIsLoading(false)
        return
      }

      router.push("/admin")
      router.refresh()
    } catch (err) {
      setError("حدث خطأ أثناء الاتصال بالخادم")
      setIsLoading(false)
    }
  }

  return (
    <div className="w-full max-w-md bg-white rounded-3xl p-8 shadow-2xl border border-[#F0E4EC] text-right">
      <div className="text-center mb-6">
        <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-[#EFD9E8] text-primary mb-4 shadow-inner">
          <ShieldCheck className="w-8 h-8" />
        </div>
        <h1 className="font-arabic text-2xl font-bold text-foreground mb-1">
          بـوابـة إدارة نَــسْــمَــة
        </h1>
        <p className="text-xs text-muted-foreground font-arabic font-light">
          نظام التوثيق السحابي الآمن عبر Supabase & Google
        </p>
      </div>

      {error && (
        <div className="mb-6 p-4 rounded-2xl bg-destructive/10 border border-destructive/20 text-destructive text-xs font-arabic flex items-start gap-2.5 leading-relaxed">
          <AlertCircle className="w-4 h-4 shrink-0 mt-0.5" />
          <span>{error}</span>
        </div>
      )}

      {/* Google OAuth Button */}
      <div className="space-y-4">
        <button
          type="button"
          onClick={handleGoogleLogin}
          disabled={isGoogleLoading || isLoading}
          className="w-full bg-white hover:bg-neutral-50 text-neutral-800 border border-neutral-200 py-3.5 px-4 rounded-2xl text-xs font-bold font-arabic transition-all shadow-sm hover:shadow flex items-center justify-center gap-3 disabled:opacity-60 cursor-pointer"
        >
          {isGoogleLoading ? (
            <>
              <Loader2 className="w-4 h-4 animate-spin text-primary" />
              <span>جاري التحويل إلى Google...</span>
            </>
          ) : (
            <>
              <svg className="w-4 h-4" viewBox="0 0 24 24">
                <path
                  fill="#4285F4"
                  d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"
                />
                <path
                  fill="#34A853"
                  d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"
                />
                <path
                  fill="#FBBC05"
                  d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.06H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.94l2.85-2.22.81-.63z"
                />
                <path
                  fill="#EA4335"
                  d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.06l3.66 2.84c.87-2.6 3.3-4.52 6.16-4.52z"
                />
              </svg>
              <span>تسجيل الدخول بحساب Google (المسؤول)</span>
            </>
          )}
        </button>

        <div className="relative flex items-center justify-center my-4">
          <div className="border-t border-border w-full"></div>
          <span className="bg-white px-3 text-[11px] text-muted-foreground font-arabic shrink-0">
            أو عبر البريد المعتمد
          </span>
          <div className="border-t border-border w-full"></div>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-xs font-semibold text-foreground mb-2 font-arabic">
              البريد الإلكتروني للمسؤول
            </label>
            <div className="relative">
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="admin@yourdomain.com"
                required
                className="w-full bg-[#FBF6F4] px-4 py-3 pl-10 rounded-2xl text-sm border border-border focus:outline-none focus:border-primary focus:ring-2 focus:ring-primary/10 transition-all text-left font-mono"
              />
              <Mail className="w-4 h-4 text-muted-foreground absolute left-3.5 top-1/2 -translate-y-1/2" />
            </div>
          </div>

          <div>
            <label className="block text-xs font-semibold text-foreground mb-2 font-arabic">
              كلمة مرور Supabase
            </label>
            <div className="relative">
              <input
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="••••••••••••"
                required
                className="w-full bg-[#FBF6F4] px-4 py-3 pl-10 rounded-2xl text-sm border border-border focus:outline-none focus:border-primary focus:ring-2 focus:ring-primary/10 transition-all text-left font-mono"
              />
              <Lock className="w-4 h-4 text-muted-foreground absolute left-3.5 top-1/2 -translate-y-1/2" />
            </div>
          </div>

          <button
            type="submit"
            disabled={isLoading || isGoogleLoading}
            className="w-full bg-primary text-white py-3.5 rounded-2xl text-xs font-bold font-arabic hover:bg-primary/90 transition-all shadow-lg hover:shadow-xl disabled:opacity-50 flex items-center justify-center gap-2 mt-4 cursor-pointer"
          >
            {isLoading ? (
              <>
                <Loader2 className="w-4 h-4 animate-spin" />
                <span>جاري التحقق عبر Supabase...</span>
              </>
            ) : (
              <>
                <span>دخول لوحة التحكم</span>
                <ArrowLeft className="w-4 h-4" />
              </>
            )}
          </button>
        </form>
      </div>

      <div className="mt-8 pt-6 border-t border-border/50 text-center text-[11px] text-muted-foreground font-arabic font-light">
        توثيق آمن مشفر بدون تخزين بيانات حساسة في الكود · استوديو نسمة 2026
      </div>
    </div>
  )
}

