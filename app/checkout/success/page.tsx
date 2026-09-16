"use client"

import { useEffect, useState, Suspense } from "react"
import { useSearchParams } from "next/navigation"
import Link from "next/link"
import { useCart } from "@/components/boty/cart-context"
import { CheckCircle2, Heart, Copy, Check, MessageCircle, Truck, Package, Sparkles } from "lucide-react"

function SuccessContent() {
  const searchParams = useSearchParams()
  const sessionId = searchParams.get("session_id")
  const { clearCart } = useCart()
  const [cleared, setCleared] = useState(false)
  const [orderId, setOrderId] = useState<string | null>(null)
  const [copied, setCopied] = useState(false)
  const [isVerifying, setIsVerifying] = useState(true)

  useEffect(() => {
    if (!cleared) {
      clearCart()
      setCleared(true)
    }
    if (sessionId) {
      setIsVerifying(true)
      fetch("/api/checkout/confirm", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ sessionId }),
      })
        .then((res) => res.json())
        .then((data) => {
          if (data.orderId) {
            setOrderId(data.orderId)
          }
        })
        .catch((err) => console.error("Auto confirm error:", err))
        .finally(() => setIsVerifying(false))
    } else {
      setIsVerifying(false)
    }
  }, [clearCart, cleared, sessionId])

  const copyTrackingCode = () => {
    const codeToCopy = orderId || sessionId || ""
    if (codeToCopy) {
      navigator.clipboard.writeText(codeToCopy)
      setCopied(true)
      setTimeout(() => setCopied(false), 2500)
    }
  }

  const displayCode = orderId || (sessionId ? sessionId.slice(0, 18) + "..." : "NASMMA-OM-" + Date.now().toString(36).toUpperCase())

  return (
    <div className="min-h-screen bg-[#FBF9F5] text-right font-arabic flex flex-col items-center justify-center p-4 sm:p-6" dir="rtl">
      <div className="bg-white rounded-3xl p-6 sm:p-10 border border-[#F0E4EC] shadow-sm max-w-lg w-full text-center space-y-6">
        
        {/* Animated checkmark */}
        <div className="w-20 h-20 rounded-full bg-emerald-50 border border-emerald-100 flex items-center justify-center text-emerald-600 mx-auto shadow-inner">
          <CheckCircle2 className="w-10 h-10 animate-scale-fade-in" />
        </div>

        <div className="space-y-2">
          <span className="text-xs font-semibold text-primary uppercase tracking-widest flex items-center justify-center gap-1">
            <Sparkles className="w-3.5 h-3.5" />
            <span>نَـسْـمَـة · سـلـطـنـة عُـمـان</span>
          </span>
          <h1 className="text-2xl sm:text-3xl font-serif font-bold text-foreground">
            تم تأكيد طلبك بنجاح!
          </h1>
          <p className="text-muted-foreground text-xs sm:text-sm leading-relaxed">
            شكراً لثقتك بنسمة. باقتك المخملية قيد التحضير والتنسيق اليدوي بعناية لتصل في أبهى حُلة لمن تحب.
          </p>
        </div>

        {/* PROMINENT ORDER TRACKING CODE CARD */}
        <div className="bg-gradient-to-b from-[#FBF6F4] to-[#FAF0F5] p-5 rounded-2xl border-2 border-[#EFD9E8] shadow-sm text-center relative overflow-hidden">
          <div className="flex items-center justify-center gap-2 mb-2 text-xs font-bold text-primary">
            <Package className="w-4 h-4" />
            <span>رمـز تـتـبـع الـطـلـب (ORDER ID)</span>
          </div>

          <div className="flex items-center justify-center gap-2 bg-white px-4 py-3 rounded-xl border border-[#E9DFD2] shadow-inner my-2">
            <span className="font-mono text-base sm:text-lg font-extrabold text-foreground tracking-wider select-all">
              {orderId || (isVerifying ? "جارٍ توليد الرمز..." : displayCode)}
            </span>

            <button
              type="button"
              onClick={copyTrackingCode}
              aria-label="نسخ رمز التتبع"
              title="نسخ رمز التتبع"
              className="inline-flex items-center gap-1 text-xs text-primary hover:text-primary/80 bg-[#EFD9E8]/50 hover:bg-[#EFD9E8] px-3 py-1.5 rounded-lg font-bold transition-all cursor-pointer"
            >
              {copied ? (
                <>
                  <Check className="w-3.5 h-3.5 text-emerald-600" />
                  <span className="text-emerald-700">تـم الـنـسـخ</span>
                </>
              ) : (
                <>
                  <Copy className="w-3.5 h-3.5" />
                  <span>نسخ الرمز</span>
                </>
              )}
            </button>
          </div>

          <p className="text-[11px] text-muted-foreground font-light mt-2">
            احتفظ بهذا الرمز لمتابعة خط سير وتجهيز باقتك في أي وقت عبر صفحة التتبع.
          </p>
        </div>

        {/* Delivery Note */}
        <div className="p-3.5 rounded-2xl bg-muted/30 border border-border/40 text-xs text-foreground/80 flex items-center gap-3 text-right">
          <Truck className="w-5 h-5 text-primary shrink-0" />
          <p className="text-[11px] leading-relaxed">
            سيصلك إشعار وتحديث لحظي عبر الواتساب عند تسليم باقتك لمندوب التوصيل في محافظتك.
          </p>
        </div>

        {/* Actions */}
        <div className="space-y-3 pt-1">
          <Link
            href={orderId ? `/track?id=${encodeURIComponent(orderId)}` : "/track"}
            className="w-full bg-primary hover:bg-primary/90 text-white py-3.5 rounded-2xl text-xs sm:text-sm font-bold transition flex items-center justify-center gap-2 shadow-md hover:shadow-lg cursor-pointer"
          >
            <Truck className="w-4 h-4" />
            <span>تـتـبـع حـالـة الـطـلـب مـبـاشـرة 📦</span>
          </Link>

          <a
            href={`https://wa.me/96890000000?text=${encodeURIComponent(`مرحباً متجر نسمة، أود الاستفسار عن طلبي رقم: ${orderId || displayCode}`)}`}
            target="_blank"
            rel="noopener noreferrer"
            className="w-full bg-[#25D366] hover:bg-[#20bd5a] text-white py-3.5 rounded-2xl text-xs sm:text-sm font-bold transition flex items-center justify-center gap-2 shadow-sm cursor-pointer"
          >
            <MessageCircle className="w-4 h-4" />
            <span>متابعة الطلب عبر واتساب نسمة</span>
          </a>

          <Link
            href="/"
            className="inline-flex items-center justify-center gap-2 w-full bg-neutral-100 hover:bg-neutral-200 text-foreground py-3 rounded-2xl text-xs font-semibold transition"
          >
            <Heart className="w-3.5 h-3.5 text-primary" />
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
