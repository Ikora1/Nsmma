"use client"

import { useState, useMemo } from "react"
import Image from "next/image"
import Link from "next/link"
import { useRouter } from "next/navigation"
import { useCart } from "@/components/boty/cart-context"
import { OMAN_GOVERNORATES } from "@/lib/oman-locations"
import { 
  ArrowRight, 
  ShieldCheck, 
  Truck, 
  Heart, 
  CreditCard, 
  Loader2, 
  AlertCircle,
  Sparkles
} from "lucide-react"

export default function CheckoutPage() {
  const router = useRouter()
  const { 
    cart, 
    subtotal, 
    discountAmount, 
    finalTotal, 
    appliedDiscount, 
    itemCount 
  } = useCart()

  const [customerName, setCustomerName] = useState("")
  const [customerPhone, setCustomerPhone] = useState("")
  const [customerEmail, setCustomerEmail] = useState("")
  const [governorateId, setGovernorateId] = useState<string>("muscat")
  const [deliveryAddress, setDeliveryAddress] = useState("")
  const [giftMessage, setGiftMessage] = useState("")
  const [isLoading, setIsLoading] = useState(false)
  const [errorMessage, setErrorMessage] = useState<string | null>(null)

  const selectedGov = useMemo(() => {
    return OMAN_GOVERNORATES.find((g) => g.id === governorateId) || OMAN_GOVERNORATES[0]
  }, [governorateId])

  const deliveryFee = selectedGov.deliveryFeeOmr
  const calculatedSubtotal = finalTotal || subtotal
  const grandTotal = calculatedSubtotal + deliveryFee

  const formatPrice = (amount: number) => `${amount % 1 === 0 ? amount : amount.toFixed(1)} ر.ع`

  const lines = cart?.lines ?? []

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setErrorMessage(null)

    if (lines.length === 0) {
      setErrorMessage("سلة مشترياتك فارغة حالياً")
      return
    }

    if (!customerName.trim()) {
      setErrorMessage("يرجى إدخال اسم المستلم")
      return
    }

    if (!customerPhone.trim() || customerPhone.replace(/\D/g, "").length < 8) {
      setErrorMessage("يرجى إدخال رقم هاتف عُماني صحيح (8 أرقام)")
      return
    }

    setIsLoading(true)

    try {
      const itemsPayload = lines.map((line) => ({
        name: line.title,
        price: line.price,
        quantity: line.quantity,
        image: line.image,
      }))

      const res = await fetch("/api/checkout/stripe", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          items: itemsPayload,
          customerName: customerName.trim(),
          customerPhone: customerPhone.startsWith("+968") ? customerPhone : `+968 ${customerPhone.trim()}`,
          customerEmail: customerEmail.trim() || undefined,
          governorateId: selectedGov.id,
          deliveryAddress: deliveryAddress.trim(),
          giftMessage: giftMessage.trim(),
          discountCode: appliedDiscount?.code,
        }),
      })

      const data = await res.json()

      if (!res.ok || data.error) {
        throw new Error(data.error || "تعذر بدء عملية الدفع عبر Stripe")
      }

      if (data.url) {
        window.location.href = data.url
      } else {
        throw new Error("لم يتم العثور على رابط الدفع")
      }
    } catch (err: any) {
      console.error(err)
      setErrorMessage(err?.message || "حدث خطأ غير متوقع. يرجى المحاولة مرة أخرى.")
      setIsLoading(false)
    }
  }

  if (lines.length === 0) {
    return (
      <div className="min-h-screen bg-[#FBF9F5] text-right font-arabic flex flex-col items-center justify-center p-6" dir="rtl">
        <div className="bg-white p-8 sm:p-10 rounded-3xl shadow-sm border border-border/40 max-w-md w-full text-center">
          <div className="w-16 h-16 rounded-full bg-primary/10 flex items-center justify-center text-primary mx-auto mb-4">
            <Heart className="w-8 h-8" />
          </div>
          <h2 className="text-2xl font-bold text-foreground mb-2">سلة المشتريات فارغة</h2>
          <p className="text-muted-foreground text-sm mb-6">
            اختر باقتك المفضلة من زهور نسمة المخملية ودعنا نعتني بتوصيلها لأحبابك في عُمان.
          </p>
          <Link
            href="/"
            className="inline-flex items-center justify-center w-full bg-primary text-white py-3.5 rounded-full text-sm font-semibold hover:bg-primary/90 transition shadow-sm"
          >
            تصفح الباقات المخملية
          </Link>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-[#FBF9F5] text-right font-arabic py-8 sm:py-14" dir="rtl">
      <div className="max-w-5xl mx-auto px-4 sm:px-6">
        {/* Header Bar */}
        <div className="flex items-center justify-between pb-6 mb-8 border-b border-border/50">
          <Link href="/" className="inline-flex items-center gap-2 text-sm text-muted-foreground hover:text-primary transition">
            <ArrowRight className="w-4 h-4" />
            <span>العودة للمتجر</span>
          </Link>
          <div className="text-center">
            <h1 className="text-2xl font-serif font-bold text-foreground tracking-wide">نَـسْـمَـة · إتمام الطلب</h1>
            <p className="text-xs text-primary font-medium mt-0.5">توصيل فاخر لجميع محافظات سلطنة عُمان</p>
          </div>
          <div className="flex items-center gap-1.5 text-xs text-[#52796F] bg-[#52796F]/10 px-3 py-1.5 rounded-full font-medium">
            <ShieldCheck className="w-4 h-4" />
            <span>دفع آمن 100%</span>
          </div>
        </div>

        {errorMessage && (
          <div className="mb-6 p-4 rounded-2xl bg-red-50 border border-red-200 text-red-700 flex items-center gap-3 text-sm">
            <AlertCircle className="w-5 h-5 flex-shrink-0" />
            <span>{errorMessage}</span>
          </div>
        )}

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
          {/* Main Form (Oman Shipping & Gift Details) */}
          <form onSubmit={handleSubmit} className="lg:col-span-7 space-y-6">
            {/* Delivery Info Card */}
            <div className="bg-white rounded-3xl p-6 sm:p-8 border border-border/50 shadow-sm space-y-5">
              <div className="flex items-center gap-2.5 text-primary border-b border-border/40 pb-3">
                <Truck className="w-5 h-5" />
                <h2 className="font-semibold text-lg text-foreground">بيانات التوصيل داخل سلطنة عُمان</h2>
              </div>

              <div className="space-y-4">
                <div>
                  <label className="block text-xs font-semibold text-foreground/80 mb-1.5">
                    اسم المستلم الكريم <span className="text-red-500">*</span>
                  </label>
                  <input
                    type="text"
                    required
                    value={customerName}
                    onChange={(e) => setCustomerName(e.target.value)}
                    placeholder="مثال: أصيل بن سلطان"
                    className="w-full px-4 py-3 rounded-xl border border-border bg-background focus:outline-none focus:ring-2 focus:ring-primary/20 text-sm"
                  />
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-xs font-semibold text-foreground/80 mb-1.5">
                      رقم الهاتف العُماني <span className="text-red-500">*</span>
                    </label>
                    <div className="flex items-center rounded-xl border border-border bg-background focus-within:ring-2 focus-within:ring-primary/20 overflow-hidden">
                      <span className="px-3 text-xs font-semibold text-muted-foreground bg-muted/30 border-l border-border py-3" dir="ltr">
                        +968
                      </span>
                      <input
                        type="tel"
                        required
                        value={customerPhone}
                        onChange={(e) => setCustomerPhone(e.target.value)}
                        placeholder="9XXXXXXX"
                        className="w-full px-3 py-3 bg-transparent text-sm focus:outline-none"
                      />
                    </div>
                  </div>

                  <div>
                    <label className="block text-xs font-semibold text-foreground/80 mb-1.5">
                      المحافظة <span className="text-red-500">*</span>
                    </label>
                    <select
                      value={governorateId}
                      onChange={(e) => setGovernorateId(e.target.value)}
                      className="w-full px-4 py-3 rounded-xl border border-border bg-background focus:outline-none focus:ring-2 focus:ring-primary/20 text-sm"
                    >
                      {OMAN_GOVERNORATES.map((gov) => (
                        <option key={gov.id} value={gov.id}>
                          محافظة {gov.nameAr} ({gov.deliveryFeeOmr} ر.ع)
                        </option>
                      ))}
                    </select>
                  </div>
                </div>

                <div>
                  <label className="block text-xs font-semibold text-foreground/80 mb-1.5">
                    البريد الإلكتروني (لتأكيد الطلب والفاتورة)
                  </label>
                  <input
                    type="email"
                    value={customerEmail}
                    onChange={(e) => setCustomerEmail(e.target.value)}
                    placeholder="name@example.com"
                    className="w-full px-4 py-3 rounded-xl border border-border bg-background focus:outline-none focus:ring-2 focus:ring-primary/20 text-sm"
                  />
                </div>

                <div>
                  <label className="block text-xs font-semibold text-foreground/80 mb-1.5">
                    العنوان بالتفصيل (الولاية، المنطقة، وصف المنزل)
                  </label>
                  <textarea
                    rows={2}
                    value={deliveryAddress}
                    onChange={(e) => setDeliveryAddress(e.target.value)}
                    placeholder="مثال: ولاية السيب، الموالح الجنوبية، قرب جامع السيدة مزون، فيلا رقم 14"
                    className="w-full px-4 py-2.5 rounded-xl border border-border bg-background focus:outline-none focus:ring-2 focus:ring-primary/20 text-sm resize-none"
                  />
                </div>
              </div>
            </div>

            {/* Gift Card Message Card */}
            <div className="bg-white rounded-3xl p-6 sm:p-8 border border-border/50 shadow-sm space-y-4">
              <div className="flex items-center gap-2.5 text-primary border-b border-border/40 pb-3">
                <Sparkles className="w-5 h-5" />
                <h2 className="font-semibold text-lg text-foreground">كرت إهداء نَـسْـمَـة المخملي (مجاناً)</h2>
              </div>
              <p className="text-xs text-muted-foreground">
                اكتب الكلمات التي تحب أن نطبعها ونرفقها في كرت نسمة البنفسجي الفاخر مع باقتك:
              </p>
              <textarea
                rows={3}
                value={giftMessage}
                onChange={(e) => setGiftMessage(e.target.value)}
                placeholder="اكتب رسالتك الصادقة لمن تحب هنا..."
                className="w-full px-4 py-3 rounded-xl border border-border bg-background focus:outline-none focus:ring-2 focus:ring-primary/20 text-sm resize-none"
              />
            </div>

            {/* Payment Button & Trust Badges */}
            <div className="bg-white rounded-3xl p-6 sm:p-8 border border-border/50 shadow-sm space-y-5">
              <div className="flex items-center justify-between border-b border-border/40 pb-3">
                <div className="flex items-center gap-2 text-foreground font-semibold text-base">
                  <CreditCard className="w-5 h-5 text-primary" />
                  <span>طرق الدفع الإلكتروني المعتمدة</span>
                </div>
                <span className="text-xs text-muted-foreground font-mono">مدعوم بواسطة Stripe</span>
              </div>

              <div className="flex flex-wrap items-center gap-2 text-xs text-muted-foreground">
                <span className="px-3 py-1.5 rounded-lg bg-muted/40 font-medium">Apple Pay</span>
                <span className="px-3 py-1.5 rounded-lg bg-muted/40 font-medium">بطاقات مدى / فيزا</span>
                <span className="px-3 py-1.5 rounded-lg bg-muted/40 font-medium">Mastercard</span>
                <span className="px-3 py-1.5 rounded-lg bg-muted/40 font-medium">Stripe Link</span>
              </div>

              <button
                type="submit"
                disabled={isLoading}
                className="w-full bg-primary text-white py-4 rounded-full text-base font-semibold hover:bg-primary/90 transition shadow-lg flex items-center justify-center gap-2 disabled:opacity-60"
              >
                {isLoading ? (
                  <>
                    <Loader2 className="w-5 h-5 animate-spin" />
                    <span>جارٍ الانتقال لبوابة الدفع الآمنة...</span>
                  </>
                ) : (
                  <>
                    <ShieldCheck className="w-5 h-5" />
                    <span>إتمام الطلب والدفع ({formatPrice(grandTotal)})</span>
                  </>
                )}
              </button>

              <p className="text-center text-[11px] text-muted-foreground">
                🔒 عمليات الدفع مشفرة بأعلى معايير الأمان المصرفية العالمية من Stripe.
              </p>
            </div>
          </form>

          {/* Sidebar Order Summary */}
          <div className="lg:col-span-5 space-y-6">
            <div className="bg-white rounded-3xl p-6 sm:p-7 border border-border/50 shadow-sm space-y-5 sticky top-6">
              <h2 className="font-semibold text-lg text-foreground border-b border-border/40 pb-3">
                ملخص باقاتك ({itemCount})
              </h2>

              <div className="space-y-4 max-h-[320px] overflow-y-auto pr-1">
                {lines.map((item) => (
                  <div key={item.id} className="flex items-center gap-3.5 pb-3 border-b border-border/30 last:border-0 last:pb-0">
                    <div className="relative w-14 h-16 rounded-xl overflow-hidden bg-card border border-border/50 flex-shrink-0">
                      <Image
                        src={item.image || "/placeholder.svg"}
                        alt={item.title}
                        fill
                        className="object-cover"
                      />
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className="text-sm font-semibold text-foreground line-clamp-1">{item.title}</p>
                      <p className="text-xs text-muted-foreground mt-0.5">الكمية: {item.quantity}</p>
                    </div>
                    <div className="text-left font-semibold text-sm text-foreground">
                      {formatPrice(item.price * item.quantity)}
                    </div>
                  </div>
                ))}
              </div>

              <div className="space-y-2.5 pt-4 border-t border-border/40 text-xs sm:text-sm">
                <div className="flex justify-between text-muted-foreground">
                  <span>المجموع الفرعي</span>
                  <span className="font-medium text-foreground">{formatPrice(subtotal)}</span>
                </div>

                {appliedDiscount && (
                  <div className="flex justify-between text-primary font-medium">
                    <span>كود الخصم ({appliedDiscount.code} - {appliedDiscount.percentage}%)</span>
                    <span>-{formatPrice(discountAmount)}</span>
                  </div>
                )}

                <div className="flex justify-between text-muted-foreground">
                  <span>توصيل مبرد ({selectedGov.nameAr})</span>
                  <span className="font-medium text-foreground">{formatPrice(deliveryFee)}</span>
                </div>

                <div className="flex justify-between text-base font-bold text-foreground pt-3 border-t border-border/50">
                  <span>المبلغ الإجمالي</span>
                  <span className="text-primary text-lg">{formatPrice(grandTotal)}</span>
                </div>
              </div>

              <div className="bg-[#FAF6F0] rounded-2xl p-4 border border-[#E9DFD2] space-y-2 text-xs text-muted-foreground">
                <div className="flex items-center gap-2 text-foreground font-semibold">
                  <Heart className="w-4 h-4 text-primary" />
                  <span>وعد نسمة للزهور المخملية</span>
                </div>
                <p>
                  كل وردة يتم نسجها وتغليفها يدوياً بعناية تامة لتصل بحالة مثالية وتدوم لسنوات في منزل من تحب.
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
