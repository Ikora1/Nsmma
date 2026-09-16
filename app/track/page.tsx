import { Suspense } from "react"
import { Header } from "@/components/boty/header"
import { Footer } from "@/components/boty/footer"
import { OrderTracker } from "@/components/boty/order-tracker"

export const metadata = {
  title: "تتبع الطلب · نَـسْـمَـة",
  description: "تابع حالة وتفاصيل شحنة باقتك المخملية لحظة بلحظة مع متجر نسمة.",
}

export default function TrackPage() {
  return (
    <main className="min-h-screen bg-[#FBF6F4] text-foreground flex flex-col justify-between" dir="rtl">
      <Header />
      
      <div className="pt-28 pb-16 px-6 lg:px-8 max-w-7xl mx-auto w-full flex-1">
        <Suspense fallback={<div className="text-center py-12 text-sm text-muted-foreground font-arabic">جاري تحميل نظام التتبع...</div>}>
          <OrderTracker />
        </Suspense>
      </div>

      <Footer />
    </main>
  )
}
