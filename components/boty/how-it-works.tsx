"use client"

import Link from "next/link"
import { Sparkles, Flower2, PenLine, PackageCheck, ArrowLeft, Truck, ShieldCheck, Heart } from "lucide-react"

const steps = [
  {
    number: "01",
    title: "اخـتـر بـاقـتـك الـمـفـضـلـة",
    subtitle: "تصفح تشكيلاتنا المتنوعة من الورود المخملية، مسكات العرايس، أو المزهريات المشغولة يدوياً حبة حبة من خيوط الغليون الفاخرة.",
    icon: Flower2,
    badge: "خيوط مخملية تدوم للأبد",
    highlight: "وردة ما تذبل",
  },
  {
    number: "02",
    title: "خـصّـص كـرت الإهـداء وعـطّـرهـا",
    subtitle: "اكتب رسالتك القلبية في خانة الإهداء لنطبعها على كرت نسمة البنفسجي الفاخر ونختمها بالشمع. وبإمكانك رش الباقة بعطرك المفضل لتبقى ذكراك حية.",
    icon: PenLine,
    badge: "ختم شمع وكرت مجاني",
    highlight: "تحفظ ريحة عطرك",
  },
  {
    number: "03",
    title: "اسـتـلـمـهـا مـغـلـفـة بـأمـان لـلـبـاب",
    subtitle: "أكد الطلب والدفع الإلكتروني السريع، واستلم باقتك في صندوق نسمة الصلب الفاخر مع حماية كاملة، أو نوصلها مباشرة لبيت المهدى إليه كمفاجأة لا تُنسى.",
    icon: PackageCheck,
    badge: "شحن سريع وتغليف فاخر",
    highlight: "ضمان وصول 100%",
  },
]

export function HowItWorks() {
  return (
    <section className="py-20 sm:py-28 bg-white relative overflow-hidden border-y border-[#F0E4EC]" dir="rtl">
      {/* Subtle Background Glow */}
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[350px] bg-[#EFD9E8]/30 rounded-full blur-3xl pointer-events-none" />

      <div className="max-w-7xl mx-auto px-6 lg:px-8 relative z-10">
        
        {/* Header */}
        <div className="text-center max-w-3xl mx-auto mb-16 sm:mb-20">
          <div className="inline-flex items-center gap-2 px-3.5 py-1 rounded-full bg-[#FBF6F4] border border-[#F0E4EC] text-primary text-xs font-semibold mb-3">
            <Sparkles className="w-3.5 h-3.5 text-primary" />
            <span className="font-arabic">تـجـربـة إهـداء سـلـسـة ومـريـحـة</span>
          </div>
          <h2 className="font-arabic text-3xl sm:text-5xl text-foreground font-bold leading-tight mb-4">
            كـيـف تـطـلـب هـديـتـك فـي <span className="text-primary">3 خـطـوات بـسـيـطـة؟</span>
          </h2>
          <p className="text-xs sm:text-sm text-muted-foreground font-arabic font-light max-w-xl mx-auto leading-relaxed">
            صممنا رحلة الطلب لتكون سهلة وسريعة ومطمئنة من أول نقرة وحتى وصول الصندوق الفاخر لأيدي من تحب.
          </p>
        </div>

        {/* Steps Grid */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 relative">
          
          {/* Connector line for desktop */}
          <div className="hidden md:block absolute top-1/2 left-[15%] right-[15%] h-0.5 border-t-2 border-dashed border-[#EFD9E8] -translate-y-12 z-0" />

          {steps.map((step, idx) => {
            const Icon = step.icon
            return (
              <div
                key={step.number}
                className="relative z-10 bg-[#FBF6F4] rounded-3xl p-8 border border-[#F0E4EC] hover:border-primary/40 transition-all duration-300 nasmma-card-shadow flex flex-col justify-between group hover:-translate-y-1 text-right"
              >
                <div>
                  {/* Step Top Bar (Number & Icon) */}
                  <div className="flex items-center justify-between mb-6">
                    <div className="w-14 h-14 rounded-2xl bg-white text-primary border border-[#F0E4EC] flex items-center justify-center shadow-sm group-hover:scale-110 group-hover:bg-primary group-hover:text-white transition-all">
                      <Icon className="w-7 h-7" />
                    </div>
                    <span className="text-3xl sm:text-4xl font-mono font-bold text-primary/20 group-hover:text-primary/40 transition-colors">
                      {step.number}
                    </span>
                  </div>

                  {/* Badge */}
                  <span className="inline-block bg-[#EFD9E8]/50 text-primary text-[10px] font-bold font-arabic px-3 py-1 rounded-full mb-3 border border-[#F0E4EC]">
                    {step.badge}
                  </span>

                  {/* Title */}
                  <h3 className="font-arabic text-lg sm:text-xl font-bold text-foreground mb-3 group-hover:text-primary transition-colors">
                    {step.title}
                  </h3>

                  {/* Description */}
                  <p className="text-xs text-muted-foreground font-arabic font-light leading-relaxed mb-6">
                    {step.subtitle}
                  </p>
                </div>

                {/* Highlight Card Pill */}
                <div className="pt-4 border-t border-[#F0E4EC] flex items-center gap-2 text-xs font-bold text-primary font-arabic">
                  <Heart className="w-3.5 h-3.5 fill-primary" />
                  <span>{step.highlight}</span>
                </div>
              </div>
            )
          })}
        </div>

        {/* Bottom CTA Box */}
        <div className="mt-14 text-center">
          <Link
            href="/shop"
            className="inline-flex items-center gap-2.5 bg-primary hover:bg-primary/90 text-white px-8 py-4 rounded-full text-xs sm:text-sm font-bold font-arabic shadow-xl hover:shadow-2xl transition-all cursor-pointer hover:scale-105"
          >
            <span>ابـدأ اخـتـيـار بـاقـتـك الآن</span>
            <ArrowLeft className="w-4 h-4" />
          </Link>
        </div>

      </div>
    </section>
  )
}
