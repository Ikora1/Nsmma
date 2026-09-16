"use client"

import { useEffect, useRef, useState } from "react"
import Image from "next/image"

export function IngredientsSection() {
  const [scrollProgress, setScrollProgress] = useState(0)
  const sectionRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    const handleScroll = () => {
      if (!sectionRef.current) return

      const section = sectionRef.current
      const rect = section.getBoundingClientRect()
      const sectionTop = rect.top
      const windowHeight = window.innerHeight

      if (sectionTop > 0) {
        setScrollProgress(0)
        return
      }

      const scrollDistance = Math.abs(sectionTop)
      const maxScrollDistance = rect.height - windowHeight
      if (maxScrollDistance <= 0) return
      const progress = scrollDistance / maxScrollDistance

      const clampedProgress = Math.max(0, Math.min(1, progress))
      setScrollProgress(clampedProgress)
    }

    window.addEventListener('scroll', handleScroll, { passive: true })
    handleScroll()

    return () => window.removeEventListener('scroll', handleScroll)
  }, [])

  // Calculate blur based on scroll progress (starts at 16px, clears to 0px)
  const blurAmount = Math.max(0, 16 - (scrollProgress || 0) * 16)
  const opacity = Math.min(1, (scrollProgress || 0) + 0.35)

  return (
    <section ref={sectionRef} className="relative w-full min-h-[200vh]" dir="rtl">
      {/* Sticky Container */}
      <div className="sticky top-0 h-screen overflow-hidden">
        {/* Full Viewport Image */}
        <div className="absolute inset-0">
          <Image
            src="/images/lifestyle/farm-to-vase.jpg"
            alt="حكاية صنع الورد المخملي في نسمة"
            fill
            className="object-cover"
            priority
          />
          {/* Plum-black gradient overlay */}
          <div className="absolute inset-0 bg-gradient-to-t from-black/85 via-black/55 to-black/60" />
        </div>

        {/* Centered Text Overlay with Scroll-Based Blur */}
        <div className="absolute inset-0 flex items-center justify-center px-6 lg:px-8">
          <div 
            className="text-center max-w-4xl transition-all duration-100 ease-linear text-white"
            style={{
              filter: `blur(${blurAmount}px)`,
              opacity: opacity
            }}
          >
            <span className="text-xs sm:text-sm tracking-widest uppercase text-[#EFD9E8] mb-4 block font-semibold font-arabic">
              حـكـايـة الـصـنـع · مـن الـخـيـط لـلـمـزهـريـة
            </span>
            <h2 className="mb-6 text-balance">
              <span className="font-arabic text-3xl sm:text-5xl md:text-6xl text-[#EFD9E8] block mb-3 leading-[1.3] font-bold">
                نـسـكـب الـوقـت فـي كـل بـتـلـة...
              </span>
              <span className="font-arabic text-4xl sm:text-6xl md:text-7xl font-bold text-white leading-tight">
                عـشـان تـدوم مـعـك الـعـمـر كـلـه.
              </span>
            </h2>
            <p className="text-base sm:text-xl text-white/90 leading-relaxed max-w-2xl mx-auto font-light">
              كل زهرة تشوفها ما طلعت بلحظة، تمر بساعات من اللف والتشكيل الدقيق لخيوط الغليون الفاخرة. ننسج البتلات خيطاً خيط بميزان القلب... لأننا نعرف إن هذي الوردة رايحة لإنسان غالي، وبتعيش معاه سنين طويلة.
            </p>
          </div>
        </div>
      </div>
    </section>
  )
}
