"use client"

import { useState } from "react"
import Image from "next/image"
import Link from "next/link"
import { 
  Search, 
  Package, 
  Truck, 
  CheckCircle2, 
  Clock, 
  MapPin, 
  Sparkles, 
  Phone, 
  AlertCircle, 
  Loader2, 
  ArrowLeft,
  Calendar,
  Gift,
  ShieldCheck,
  MessageCircle
} from "lucide-react"

type TrackedOrder = {
  orderId: string
  customerName: string
  customerPhone: string
  governorate: string
  deliveryAddress: string
  deliveryStatus: "processing" | "shipped" | "delivered" | "cancelled"
  paymentStatus: string
  amountOmr: number
  currency: string
  items: Array<{
    name: string
    price: number
    quantity: number
    image?: string
  }>
  giftMessage?: string
  createdAt: string
}

const STATUS_STEPS = [
  {
    id: "confirmed",
    title: "تـم تـأكـيـد الـطـلـب",
    desc: "تم استلام الطلب وتأكيد الدفع بنجاح",
    icon: CheckCircle2,
  },
  {
    id: "processing",
    title: "قـيـد الـغـزل والـتـجـهـيـز",
    desc: "يعمل حرفيو نسمة على غزل وتنسيق الورد المخملي وكرت الإهداء",
    icon: Sparkles,
  },
  {
    id: "shipped",
    title: "تـم الـشـحـن والـتـسـلـيـم",
    desc: "الشحنة مع مندوب التوصيل في طريقها لعنوانك",
    icon: Truck,
  },
  {
    id: "delivered",
    title: "تـم الـتـوصـيـل بـنـجـاح",
    desc: "وصلت هديتك بسلام لتصنع ذكرى خالدة",
    icon: Gift,
  },
]

import { useSearchParams } from "next/navigation"

export function OrderTracker() {
  const searchParams = useSearchParams()
  const initialQuery = searchParams.get("id") || searchParams.get("order") || ""
  const [query, setQuery] = useState(initialQuery)
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState("")
  const [order, setOrder] = useState<TrackedOrder | null>(null)

  const executeTrack = async (searchStr: string) => {
    if (!searchStr.trim()) return

    setIsLoading(true)
    setError("")
    setOrder(null)

    try {
      const res = await fetch("/api/track", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ query: searchStr.trim() }),
      })

      const data = await res.json()

      if (!res.ok || data.error) {
        setError(data.error || "لم نتمكن من إيجاد تفاصيل هذا الطلب")
        setIsLoading(false)
        return
      }

      setOrder(data.order)
    } catch (err) {
      setError("حدث خطأ أثناء الاتصال بالخادم، يرجى المحاولة لاحقاً")
    } finally {
      setIsLoading(false)
    }
  }

  // Auto-search if query param is present on mount
  useState(() => {
    if (initialQuery) {
      executeTrack(initialQuery)
    }
  })

  const handleTrack = async (e: React.FormEvent) => {
    e.preventDefault()
    executeTrack(query)
  }

  // Calculate current active step index (0 to 3)
  const getActiveStepIndex = (status: TrackedOrder["deliveryStatus"]) => {
    switch (status) {
      case "processing":
        return 1
      case "shipped":
        return 2
      case "delivered":
        return 3
      default:
        return 1
    }
  }

  return (
    <div className="w-full max-w-4xl mx-auto py-8 text-right" dir="rtl">
      
      {/* Search Box Card */}
      <div className="bg-white rounded-3xl p-6 sm:p-10 border border-[#F0E4EC] shadow-sm mb-8 text-center">
        <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-[#EFD9E8]/60 text-primary mb-4 shadow-inner">
          <Package className="w-8 h-8" />
        </div>
        
        <h1 className="font-arabic text-2xl sm:text-3xl font-bold text-foreground mb-2">
          تـتـبـع حـالـة طـلـبـك
        </h1>
        <p className="text-xs sm:text-sm text-muted-foreground font-arabic font-light max-w-lg mx-auto mb-8 leading-relaxed">
          أدخل رقم طلبك (مثل: <code className="bg-[#FBF6F4] px-2 py-0.5 rounded font-mono font-bold text-primary">NASMMA-OM-DEMO01</code>) أو رقم هاتفك المسجل لمعرفة المرحلة الحالية لباقتك لحظة بلحظة.
        </p>

        <form onSubmit={handleTrack} className="max-w-xl mx-auto flex flex-col sm:flex-row items-center gap-3">
          <div className="relative w-full">
            <input
              type="text"
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              placeholder="رقم الطلب (Order ID) أو رقم الجوال..."
              required
              className="w-full bg-[#FBF6F4] pr-10 pl-4 py-3.5 rounded-2xl text-xs sm:text-sm border border-border focus:outline-none focus:border-primary font-arabic text-right transition-all"
            />
            <Search className="w-4 h-4 text-muted-foreground absolute right-3.5 top-1/2 -translate-y-1/2" />
          </div>

          <button
            type="submit"
            disabled={isLoading || !query.trim()}
            className="w-full sm:w-auto shrink-0 bg-primary hover:bg-primary/90 text-white px-8 py-3.5 rounded-2xl text-xs sm:text-sm font-bold font-arabic shadow-md hover:shadow-lg transition-all flex items-center justify-center gap-2 disabled:opacity-50 cursor-pointer"
          >
            {isLoading ? (
              <>
                <Loader2 className="w-4 h-4 animate-spin" />
                <span>جاري البحث...</span>
              </>
            ) : (
              <>
                <span>تـتـبـع الآن</span>
                <ArrowLeft className="w-4 h-4" />
              </>
            )}
          </button>
        </form>

        {/* Example Chips */}
        <div className="mt-4 flex items-center justify-center gap-2 text-[11px] text-muted-foreground font-arabic">
          <span>أرقام تجريبية سريعة:</span>
          <button
            type="button"
            onClick={() => setQuery("NASMMA-OM-DEMO01")}
            className="text-primary hover:underline font-mono font-bold cursor-pointer"
          >
            NASMMA-OM-DEMO01
          </button>
          <span>·</span>
          <button
            type="button"
            onClick={() => setQuery("NASMMA-OM-DEMO02")}
            className="text-primary hover:underline font-mono font-bold cursor-pointer"
          >
            NASMMA-OM-DEMO02
          </button>
        </div>

        {error && (
          <div className="mt-6 max-w-xl mx-auto p-4 rounded-2xl bg-destructive/10 border border-destructive/20 text-destructive text-xs font-arabic flex items-start gap-2.5 text-right">
            <AlertCircle className="w-4 h-4 shrink-0 mt-0.5" />
            <span>{error}</span>
          </div>
        )}
      </div>

      {/* TRACKING RESULTS CARD */}
      {order && (
        <div className="bg-white rounded-3xl p-6 sm:p-10 border border-[#F0E4EC] shadow-sm animate-scale-fade-in space-y-8">
          
          {/* Header Summary */}
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-6 border-b border-[#F0E4EC]">
            <div>
              <span className="text-[11px] font-arabic text-muted-foreground block mb-1">
                تفاصيل الشحنة والطلب
              </span>
              <h2 className="font-arabic text-lg sm:text-xl font-bold text-foreground flex items-center gap-2">
                <span>طلب رقم:</span>
                <span className="font-mono text-primary">{order.orderId}</span>
              </h2>
            </div>

            <div className="flex items-center gap-3">
              <span className={`px-4 py-1.5 rounded-full text-xs font-bold font-arabic ${
                order.deliveryStatus === "delivered"
                  ? "bg-emerald-100 text-emerald-700"
                  : order.deliveryStatus === "shipped"
                  ? "bg-blue-100 text-blue-700"
                  : "bg-amber-100 text-amber-700"
              }`}>
                {order.deliveryStatus === "delivered" ? "تم التوصيل بنجاح 🎁" : order.deliveryStatus === "shipped" ? "في الطريق للتوصيل 🚚" : "قيد الغزل والتجهيز 🎨"}
              </span>

              <span className="bg-emerald-50 text-emerald-600 text-xs font-bold font-arabic px-3 py-1.5 rounded-full border border-emerald-200">
                مدفوع إلكترونياً ✅
              </span>
            </div>
          </div>

          {/* PROGRESS TIMELINE STEPPER */}
          <div className="py-4">
            <h3 className="font-arabic text-sm font-bold text-foreground mb-8">
              مـراحـل تـجـهـيـز وتـوصـيـل الـبـاقـة:
            </h3>

            <div className="relative">
              {/* Connector Bar Background */}
              <div className="absolute top-6 left-[10%] right-[10%] h-1 bg-neutral-100 -z-0 hidden md:block" />
              
              {/* Active Connector Progress */}
              <div
                className="absolute top-6 right-[10%] h-1 bg-primary -z-0 hidden md:block transition-all duration-700"
                style={{
                  width: `${(getActiveStepIndex(order.deliveryStatus) / (STATUS_STEPS.length - 1)) * 80}%`,
                }}
              />

              <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
                {STATUS_STEPS.map((step, idx) => {
                  const currentIdx = getActiveStepIndex(order.deliveryStatus)
                  const isCompleted = idx <= currentIdx
                  const isCurrent = idx === currentIdx
                  const Icon = step.icon

                  return (
                    <div key={step.id} className="relative z-10 flex md:flex-col items-center md:text-center gap-4 md:gap-3">
                      {/* Step Circle Icon */}
                      <div
                        className={`w-12 h-12 rounded-2xl flex items-center justify-center shrink-0 transition-all ${
                          isCompleted
                            ? "bg-primary text-white shadow-md shadow-primary/20 scale-105"
                            : "bg-[#FBF6F4] text-neutral-400 border border-neutral-200"
                        }`}
                      >
                        <Icon className="w-5 h-5" />
                      </div>

                      {/* Step Text Info */}
                      <div>
                        <h4 className={`text-xs sm:text-sm font-arabic font-bold mb-1 ${
                          isCurrent ? "text-primary font-extrabold" : isCompleted ? "text-foreground" : "text-muted-foreground"
                        }`}>
                          {step.title}
                        </h4>
                        <p className="text-[11px] text-muted-foreground font-arabic font-light leading-relaxed max-w-[200px] md:mx-auto">
                          {step.desc}
                        </p>
                      </div>
                    </div>
                  )
                })}
              </div>
            </div>
          </div>

          {/* ORDER DETAILS & RECIPIENT INFO GRID */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 pt-6 border-t border-[#F0E4EC]">
            
            {/* Customer & Address Details */}
            <div className="bg-[#FBF6F4] p-5 sm:p-6 rounded-2xl border border-[#F0E4EC] space-y-3.5 text-xs font-arabic">
              <h4 className="font-bold text-foreground text-sm flex items-center gap-2 mb-3">
                <MapPin className="w-4 h-4 text-primary" />
                <span>بيانات المستلم والتوصيل</span>
              </h4>

              <div className="flex justify-between pb-2 border-b border-border/60">
                <span className="text-muted-foreground">الاسم:</span>
                <span className="font-bold text-foreground">{order.customerName}</span>
              </div>
              <div className="flex justify-between pb-2 border-b border-border/60">
                <span className="text-muted-foreground">رقم الهاتف:</span>
                <span className="font-mono font-bold text-foreground" dir="ltr">{order.customerPhone}</span>
              </div>
              <div className="flex justify-between pb-2 border-b border-border/60">
                <span className="text-muted-foreground">المحافظة / المدينة:</span>
                <span className="font-bold text-primary">{order.governorate}</span>
              </div>
              <div className="flex justify-between pb-2 border-b border-border/60">
                <span className="text-muted-foreground">العنوان:</span>
                <span className="text-foreground text-left max-w-[200px] truncate">{order.deliveryAddress}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-muted-foreground">تاريخ الطلب:</span>
                <span className="font-mono text-muted-foreground">
                  {new Date(order.createdAt).toLocaleDateString("ar-OM", { dateStyle: "medium" })}
                </span>
              </div>
            </div>

            {/* Purchased Items & Gift Message */}
            <div className="bg-[#FBF6F4] p-5 sm:p-6 rounded-2xl border border-[#F0E4EC] space-y-4">
              <h4 className="font-bold text-foreground text-sm font-arabic flex items-center gap-2 mb-2">
                <Gift className="w-4 h-4 text-primary" />
                <span>محتويات الهدية ({order.items.length})</span>
              </h4>

              <div className="space-y-3">
                {order.items.map((item, idx) => (
                  <div key={idx} className="flex items-center justify-between gap-3 bg-white p-3 rounded-xl border border-[#F0E4EC]">
                    <div className="flex items-center gap-3">
                      {item.image && (
                        <div className="relative w-11 h-11 rounded-lg overflow-hidden shrink-0 border border-border">
                          <Image src={item.image} alt={item.name} fill className="object-cover" />
                        </div>
                      )}
                      <div>
                        <p className="text-xs font-bold font-arabic text-foreground">{item.name}</p>
                        <span className="text-[11px] text-muted-foreground font-arabic">
                          الكمية: <strong className="font-mono">{item.quantity}</strong>
                        </span>
                      </div>
                    </div>

                    <div className="text-xs font-bold text-primary font-mono">
                      {(item.price * item.quantity).toFixed(1)} {order.currency}
                    </div>
                  </div>
                ))}
              </div>

              {order.giftMessage && (
                <div className="p-3.5 rounded-xl bg-[#EFD9E8]/40 border border-[#F0E4EC] text-right">
                  <span className="text-[11px] font-bold text-primary font-arabic block mb-1">
                    رسالة كرت الإهداء المرفقة:
                  </span>
                  <p className="text-xs text-foreground/90 font-arabic italic font-light">
                    &ldquo;{order.giftMessage}&rdquo;
                  </p>
                </div>
              )}
            </div>

          </div>

          {/* Need Help Footer */}
          <div className="pt-6 border-t border-[#F0E4EC] flex flex-col sm:flex-row items-center justify-between gap-4">
            <div className="flex items-center gap-2 text-xs text-muted-foreground font-arabic">
              <ShieldCheck className="w-4 h-4 text-primary shrink-0" />
              <span>شحنة مؤمنة ومغلفة بصندوق نسمة المقاوم للصدمات.</span>
            </div>

            <a
              href={`https://wa.me?text=${encodeURIComponent(`مرحباً نسمة، أستفسر بخصوص طلبي رقم ${order.orderId}`)}`}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-2 bg-[#25D366] hover:bg-[#20bd5a] text-white px-5 py-2.5 rounded-full text-xs font-bold font-arabic shadow-sm hover:shadow transition-all"
            >
              <MessageCircle className="w-4 h-4" />
              <span>استفسار عن الطلب عبر واتساب</span>
            </a>
          </div>

        </div>
      )}

    </div>
  )
}
