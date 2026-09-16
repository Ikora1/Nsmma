"use client"

import { useEffect, useRef, useState } from "react"
import Image from "next/image"
import { Heart, Sparkles, Gift } from "lucide-react"

export function CTABanner() {
  const [isVisible, setIsVisible] = useState(false)
  const bannerRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) setIsVisible(true)
      },
      { threshold: 0.1 }
    )

    if (bannerRef.current) observer.observe(bannerRef.current)

    return () => {
      if (bannerRef.current) observer.unobserve(bannerRef.current)
    }
  }, [])

  return (
    <section className="py-20 bg-background" dir="rtl">
      <div className="max-w-7xl mx-auto px-6 lg:px-8">
        <div 
          ref={bannerRef}
          className={`rounded-3xl p-10 md:p-16 flex flex-col justify-center relative overflow-hidden min-h-[420px] transition-all duration-700 ease-out nasmma-card-shadow border border-border/50 ${
            isVisible ? 'opacity-100 scale-100' : 'opacity-0 scale-95'
          }`}
        >
          {/* Background Image */}
          <Image
            src="/images/lifestyle/cta-bg.jpg"
            alt="باقات نسمة اليدوية"
            fill
            className="object-cover"
          />
          
          {/* Progressive Blur Overlay - Right to Left */}
          <div 
            className="absolute inset-0 backdrop-blur-[10px] bg-black/55" 
            style={{ 
              maskImage: 'linear-gradient(to left, black 0%, black 50%, transparent 80%)', 
              WebkitMaskImage: 'linear-gradient(to left, black 0%, black 50%, transparent 80%)' 
            }}
          />
          
          <div className="relative z-10 text-right max-w-2xl text-white">
            <span className="font-arabic text-xl sm:text-2xl text-[#EFD9E8] font-bold block mb-2">
              وردة مـا تـمـوت... وذكـرى مـا تـروح
            </span>
            <h3 className="font-arabic text-3xl sm:text-5xl text-white mb-3 font-bold leading-tight">
              لا تـنـتـظـر مـنـاسـبـة عـشـان تـقـول لـلـغـالـي إنـه غـالـي.
            </h3>
            <p className="text-sm sm:text-base text-white/90 mb-8 font-light leading-relaxed">
              أجمل الهدايا هي اللي تجي فجأة، بدون تاريخ وبدون سبب... بس لأنك تذكرتهم وحبيت تبتسم أيامهم. اختار وردتك الحين وخلي ذكراكم تعيش.
            </p>
            
            <div className="flex flex-col items-start gap-3.5">
              <div className="flex items-center gap-3 text-white/95">
                <Heart className="w-5 h-5 flex-shrink-0 text-[#EFD9E8]" strokeWidth={1.5} />
                <span className="text-xs sm:text-sm font-light">وردة مصنوعة يدوياً بحب من خيوط الغليون المخملية</span>
              </div>
              <div className="flex items-center gap-3 text-white/95">
                <Sparkles className="w-5 h-5 flex-shrink-0 text-[#EFD9E8]" strokeWidth={1.5} />
                <span className="text-xs sm:text-sm font-light">تظل ناضرة في غرفتهم سنين بدون أي تعب سقاية أو ذبول</span>
              </div>
              <div className="flex items-center gap-3 text-white/95">
                <Gift className="w-5 h-5 flex-shrink-0 text-[#EFD9E8]" strokeWidth={1.5} />
                <span className="text-xs sm:text-sm font-light">الكرت البنفسجي الفاخر مختوم وجاهز لكتابة مشاعرك الصادقة</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}
