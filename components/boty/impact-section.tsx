"use client"

import { useEffect, useRef, useState } from "react"
import Image from "next/image"
import { Heart, Clock, Sparkles, Package } from "lucide-react"

const stats = [
  {
    icon: Heart,
    value: "١٢,٠٠٠+",
    label: "ذكـرى تـم تـخـلـيـدهـا",
    description: "باقات صنعت بحب ووصلت سالمة لقلوب أصحابها"
  },
  {
    icon: Clock,
    value: "< ٣ ساعات",
    label: "تـوصـيـل سـريـع ومـحـمـي",
    description: "توصل لباب بيت المهدى إليه في مهدها الخاص"
  },
  {
    icon: Sparkles,
    value: "٠٪ ذبول",
    label: "جـمـال يـعـيـش مـعـك سـنـيـن",
    description: "خيوط غليون ناعمة تحتفظ برونقها وريحة عطرك للأبد"
  },
  {
    icon: Package,
    value: "١٠٠٪",
    label: "شـغـل يـدوي بـالـكـامـل",
    description: "كل بتلة لفت وصيغت بالصبر وحبات اللؤلؤ والحرير"
  }
]

export function ImpactSection() {
  const [headerVisible, setHeaderVisible] = useState(false)
  const [statsVisible, setStatsVisible] = useState(false)
  const [quoteVisible, setQuoteVisible] = useState(false)
  const [imageScale, setImageScale] = useState(1)
  const headerRef = useRef<HTMLDivElement>(null)
  const statsRef = useRef<HTMLDivElement>(null)
  const quoteRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    const headerObserver = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) setHeaderVisible(true)
      },
      { threshold: 0.1 }
    )

    const statsObserver = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) setStatsVisible(true)
      },
      { threshold: 0.1 }
    )

    const quoteObserver = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) setQuoteVisible(true)
      },
      { threshold: 0.1 }
    )

    if (headerRef.current) headerObserver.observe(headerRef.current)
    if (statsRef.current) statsObserver.observe(statsRef.current)
    if (quoteRef.current) quoteObserver.observe(quoteRef.current)

    return () => {
      if (headerRef.current) headerObserver.unobserve(headerRef.current)
      if (statsRef.current) statsObserver.unobserve(statsRef.current)
      if (quoteRef.current) quoteObserver.unobserve(quoteRef.current)
    }
  }, [])

  useEffect(() => {
    const handleScroll = () => {
      if (!quoteRef.current) return

      const rect = quoteRef.current.getBoundingClientRect()
      const windowHeight = window.innerHeight
      
      const visibleTop = Math.max(0, -rect.top)
      const visibleBottom = Math.min(rect.height, windowHeight - rect.top)
      const visibleHeight = visibleBottom - visibleTop
      const visiblePercent = visibleHeight / windowHeight

      const scale = 1 + (Math.min(1, Math.max(0, visiblePercent)) * 0.12)
      setImageScale(scale)
    }

    window.addEventListener('scroll', handleScroll, { passive: true })
    handleScroll()

    return () => window.removeEventListener('scroll', handleScroll)
  }, [])

  return (
    <section className="py-24 bg-background" dir="rtl">
      <div className="max-w-7xl mx-auto px-6 lg:px-8">
        {/* Header */}
        <div ref={headerRef} className="text-center mb-16 max-w-3xl mx-auto">
          <span className={`text-xs font-semibold tracking-wider uppercase text-primary mb-3 block font-arabic ${headerVisible ? 'animate-blur-in opacity-0' : 'opacity-0'}`} style={headerVisible ? { animationDelay: '0.2s', animationFillMode: 'forwards' } : {}}>
            أثـر نَـسْـمَـة فـي بـيـوتـكـم · أوعـيـة لـلـذكـريـات
          </span>
          <h2 className={`text-foreground mb-4 text-balance ${headerVisible ? 'animate-blur-in opacity-0' : 'opacity-0'}`} style={headerVisible ? { animationDelay: '0.35s', animationFillMode: 'forwards' } : {}}>
            <span className="font-arabic text-3xl sm:text-5xl md:text-6xl text-primary font-bold block mb-2 leading-tight">
              أرقـام تـحـكـي عـن وفـاء يـدوم
            </span>
          </h2>
          <p className={`text-base sm:text-lg text-muted-foreground leading-relaxed font-light ${headerVisible ? 'animate-blur-in opacity-0' : 'opacity-0'}`} style={headerVisible ? { animationDelay: '0.5s', animationFillMode: 'forwards' } : {}}>
            إحنا ما نسوي ورود تجارية تنتهي بعد يومين، إحنا نصنع أوعية للذكريات تظل في بيوتكم سنين شاهدة على أصدق حكاياتكم.
          </p>
        </div>

        {/* Stats Grid */}
        <div ref={statsRef} className="grid sm:grid-cols-2 lg:grid-cols-4 gap-6 mb-16">
          {stats.map((stat, index) => (
            <div
              key={stat.label}
              className={`bg-card p-8 rounded-3xl text-center boty-transition hover:scale-105 transition-all duration-700 ease-out border border-border/60 hover:border-primary/20 ${
                statsVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-8'
              }`}
              style={{ transitionDelay: `${index * 100}ms` }}
            >
              <div className="inline-flex items-center justify-center w-14 h-14 rounded-2xl bg-primary/10 mb-4 text-primary">
                <stat.icon className="w-7 h-7" strokeWidth={1.5} />
              </div>
              <div className="font-arabic text-3xl sm:text-4xl text-primary font-bold mb-2">{stat.value}</div>
              <h3 className="font-arabic font-bold text-foreground mb-1 text-base">{stat.label}</h3>
              <p className="text-xs text-muted-foreground leading-relaxed font-light">{stat.description}</p>
            </div>
          ))}
        </div>

        {/* Quote Block */}
        <div 
          ref={quoteRef}
          className={`relative bg-[#FBF6F4] rounded-3xl overflow-hidden transition-all duration-700 ease-out border border-border/60 ${
            quoteVisible ? 'opacity-100 scale-100' : 'opacity-0 scale-95'
          }`}
        >
          <div className="grid lg:grid-cols-2 gap-8 lg:gap-12 items-center">
            {/* Image */}
            <div className="relative aspect-[4/5] lg:aspect-auto lg:h-full min-h-[460px] overflow-hidden">
              <Image
                src="/images/lifestyle/lifestyle-3.jpg"
                alt="حكاية نسمة لصناعة الورد المخملي"
                fill
                className="object-cover transition-transform duration-300 ease-out"
                style={{ transform: `scale(${imageScale})` }}
              />
            </div>

            {/* Quote Content */}
            <div className="p-8 lg:p-12 lg:pl-16 text-right">
              <div className="text-6xl text-primary mb-4 font-serif leading-none">"</div>
              <blockquote className="font-arabic text-xl sm:text-2xl text-primary font-bold leading-relaxed mb-6">
                "إحنا ما سوّينا وردات، إحنا سوّينا أوعية للذكريات. مع نسمة، كل هدية تصير مرآة لمشاعرك، تظل تحكي عنك، وتحول اللحظة العابرة إلى قصة تظل ساكنة بالقلب."
              </blockquote>
              <p className="text-sm sm:text-base text-foreground/80 leading-relaxed mb-6 font-light">
                لما تفتح صندوق نسمة وتلمس ملمس المخمل، بتفهم إن الهدية مو بس شكل... الهدية عهد ووفاء يدوم مع كل نظرة.
              </p>
              <footer className="text-muted-foreground">
                <div className="font-arabic font-bold text-foreground text-base">نور الحسن</div>
                <div className="text-xs text-primary font-medium tracking-wide mt-0.5">مؤسسة نسمة للزهور اليدوية</div>
              </footer>
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}
