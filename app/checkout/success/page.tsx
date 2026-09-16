"use client"

import { useEffect, useState, Suspense } from "react"
import { useSearchParams } from "next/navigation"
import Link from "next/link"
import { useCart } from "@/components/boty/cart-context"
import { CheckCircle2, Heart, ArrowRight, MessageCircle, Truck } from "lucide-react"

function SuccessContent() {
  const searchParams = useSearchParams()
  const sessionId = searchParams.get("session_id")
  const { clearCart } = useCart()
  const [cleared, setCleared] = useState(false)

  useEffect(() => {
    if (!cleared) {
      clearCart()
      setCleared(true)
    }
    if (sessionId) {
      fetch("/api/checkout/confirm", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ sessionId }),
      }).catch((err) => console.error("Auto confirm error:", err))
    }
  }, [clearCart, cleared, sessionId])

  return (
    <div className="min-h-screen bg-[#FBF9F5] text-right font-arabic flex flex-col items-center justify-center p-4 sm:p-6" dir="rtl">
      <div className="bg-white rounded-3xl p-8 sm:p-12 border border-border/50 shadow-sm max-w-lg w-full text-center space-y-6">
        {/* Animated checkmark & velvet flower aura */}
        <div className="w-20 h-20 rounded-full bg-[#52796F]/15 flex items-center justify-center text-[#52796F] mx-auto shadow-inner">
          <CheckCircle2 className="w-10 h-10" />
        </div>

        <div className="space-y-2">
          <span className="text-xs font-semibold text-primary uppercase tracking-widest">
            نَـسْـمَـة · عُـمـان
          </span>
          <h1 className="text-2xl sm:text-3xl font-serif font-bold text-foreground">
            تم تأكيد طلبك بنجاح!
          </h1>
          <p className="text-muted-foreground text-sm leading-relaxed">
            شكراً لثقتك بنسمة. باقتك المخملية قيد التحضير والتنسيق اليدوي بعناية لتصل في أبهى حُلة لمن تحب داخل سلطنة عُمان.
          </p>
        </div>

        {sessionId && (
          <div className="bg-[#FAF6F0] p-4 rounded-2xl border border-[#E9DFD2] text-xs text-muted-foreground text-center">
            <span className="block font-medium text-foreground/80 mb-1">رقم مرجع الدفع الآمن (Stripe):</span>
            <span className="font-mono text-[11px] text-primary select-all break-all">{sessionId}</span>
          </div>
        )}

        <div className="p-4 rounded-2xl bg-muted/30 border border-border/40 text-xs text-foreground/80 flex items-center gap-3 text-right">
          <Truck className="w-6 h-6 text-primary flex-shrink-0" />
          <p>
            سيصلك إشعار ومتابعة لحظية عبر الواتساب من فريق التوصيل عند تسليم الباقة لمندوب الشحن في محافظتك.
          </p>
        </div>

        {/* Quick Actions */}
        <div className="space-y-3 pt-2">
          <a
            href="https://wa.me/96890000000?text=%D9%85%D8%B1%D8%AD%D8%A8%D8%A7%D9%8B%20%D9%86%D8%B3%D9%85%D8%A9%D8%8C%20%D8%A3%D8%AA%D8%A7%D8%A8%D8%B9%20%D8%B7%D9%84%D8%A8%D9%8A%20%D8%A7%D9%84%D8%AC%D8%AF%D9%8A%D8%AF"
            target="_blank"
            rel="noopener noreferrer"
            className="w-full bg-[#25D366] text-white py-3.5 rounded-full text-sm font-semibold hover:bg-[#20bd5a] transition flex items-center justify-center gap-2 shadow-sm"
          >
            <MessageCircle className="w-4 h-4" />
            <span>متابعة الطلب عبر واتساب عُمان</span>
          </a>

          <Link
            href="/"
            className="inline-flex items-center justify-center gap-2 w-full bg-primary text-white py-3.5 rounded-full text-sm font-semibold hover:bg-primary/90 transition shadow-sm"
          >
            <Heart className="w-4 h-4" />
            <span>العودة لمتجر نسمة</span>
          </Link>
        </div>
      </div>
    </div>
  )
}

export default function CheckoutSuccessPage() {
  return (
    <Suspense fallback={
      <div className="min-h-screen bg-[#FBF9F5] flex items-center justify-center text-center p-6" dir="rtl">
        <p className="text-sm font-arabic text-muted-foreground">جارٍ تحميل بيانات تأكيد الطلب...</p>
      </div>
    }>
      <SuccessContent />
    </Suspense>
  )
}
