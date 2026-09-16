"use client"

import { useEffect, useRef, useState } from "react"
import { Sparkles, Heart, Gift, Truck } from "lucide-react"

const badges = [
  {
    icon: Sparkles,
    title: "شـغـل يـدوي بـحـت (حـبـة حـبـة)",
    description: "مو شغل مصانع ولا قوالب... كل بتلة تتشكل بيدينا وصبرنا عشان تطلع قطعة فنية."
  },
  {
    icon: Heart,
    title: "خـيـوط غـلـيـون مـخـمـلـيـة فـاخـرة",
    description: "ملمس ناعم يدفّي الخاطر، وألوان زاهية مستحيل تبهت أو تذبل مع مرور السنين."
  },
  {
    icon: Gift,
    title: "تـغـلـيـف يـلـيـق بـمـقـام اللـي بـتـهـديـه",
    description: "أقمشة كتان طبيعية، أشرطة حرير، والكرت البنفسجي اللي يوصل مشاعرك بأرقى صورة."
  },
  {
    icon: Truck,
    title: "تـوصـيـل سـريـع ومـحـمـي لـلـبـاب",
    description: "توصلك الباقة محمية في مهدها الخاص، كأنك مستلمها من يد صانعها مباشرة."
  }
]

export function TrustBadges() {
  const [isVisible, setIsVisible] = useState(false)
  const sectionRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) setIsVisible(true)
      },
      { threshold: 0.1 }
    )

    if (sectionRef.current) observer.observe(sectionRef.current)

    return () => {
      if (sectionRef.current) observer.unobserve(sectionRef.current)
    }
  }, [])

  return (
    <section className="py-16 lg:py-20 bg-background border-b border-border/40" dir="rtl">
      <div className="max-w-7xl mx-auto px-6 lg:px-8">
        <div 
          ref={sectionRef}
          className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6"
        >
          {badges.map((badge, index) => (
            <div
              key={badge.title}
              className={`bg-card p-6 lg:p-7 text-center rounded-2xl border border-border/60 transition-all duration-700 ease-out hover:bg-white hover:border-primary/20 hover:shadow-md ${
                isVisible 
                  ? 'opacity-100 translate-y-0' 
                  : 'opacity-0 translate-y-8'
              }`}
              style={{ transitionDelay: `${index * 120}ms` }}
            >
              <div className="inline-flex items-center justify-center w-14 h-14 rounded-2xl bg-primary/10 mb-4 text-primary">
                <badge.icon className="size-7" strokeWidth={1.5} />
              </div>
              <h3 className="font-arabic text-foreground mb-2 text-lg font-bold">{badge.title}</h3>
              <p className="text-xs text-muted-foreground leading-relaxed font-light">{badge.description}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}
