"use client"

import Link from "next/link"
import { ArrowLeft, Sparkles, Heart, ShoppingBag } from "lucide-react"

export function Hero() {
  return (
    <section className="relative min-h-screen flex items-center overflow-hidden bg-[#FBF6F4]" dir="rtl">
      {/* Background Video */}
      <video
        autoPlay
        muted
        loop
        playsInline
        className="absolute top-0 left-0 w-full h-full object-cover z-[1]"
        src="/videos/hero-nasmma-featured.mp4"
      />
      
      {/* Visual Overlay: subtle plum vignette to guarantee typography contrast and warmth */}
      <div className="absolute inset-0 bg-gradient-to-l from-black/60 via-black/35 to-transparent z-[2]" />
      
      {/* Bottom fade gradient into white background */}
      <div className="absolute bottom-0 left-0 right-0 h-[35%] bg-gradient-to-t from-background via-background/60 to-transparent z-[5]" />

      {/* Content */}
      <div className="relative z-10 w-full pt-44 pb-24">
        <div className="max-w-7xl mx-auto px-6 lg:px-8">
          <div className="w-full lg:max-w-2xl text-right">
            {/* Tagline Badge */}
            <div  
              className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-white/85 backdrop-blur-md border border-white/60 mb-6 animate-blur-in opacity-0 shadow-sm"
              style={{ animationDelay: '0.2s', animationFillMode: 'forwards' }}
            >
              <Sparkles className="w-3.5 h-3.5 text-primary" />
              <span className="text-xs font-semibold tracking-wider text-primary font-arabic">
                نَــــسْــــمَــــة لـلـزهـور الـمـخـمـلـيـة الـيـدويـة · خـيـوط الـغـلـيـون
              </span>
            </div>

            {/* Main Hook in Guesswhat-Exceptional font */}
            <h1 className="mb-6 text-balance text-white drop-shadow-md">
              <span 
                className="block font-arabic text-4xl sm:text-5xl md:text-6xl text-[#EFD9E8] mb-3 leading-[1.3] animate-blur-in opacity-0" 
                style={{ animationDelay: '0.35s', animationFillMode: 'forwards' }}
              >
                اصـنـع ذكـرى لا تُـنـسـى...
              </span>
              <span 
                className="block font-arabic text-5xl sm:text-6xl md:text-7xl font-bold leading-[1.2] animate-blur-in opacity-0 text-white" 
                style={{ animationDelay: '0.55s', animationFillMode: 'forwards' }}
              >
                بـوردةٍ لا تـمـوت.
              </span>
            </h1>

            {/* Emotional Narrative Lead */}
            <p 
              className="text-base sm:text-lg md:text-xl leading-relaxed mb-10 text-white/90 drop-shadow-sm animate-blur-in opacity-0 font-light" 
              style={{ animationDelay: '0.75s', animationFillMode: 'forwards' }}
            >
              كلنا نعرف هالشعور... تشتري أحلى باقة ورد، وتدفع فيها من قلبك، وبعد يومين ثلاثة؟ تشوفها تذبل وتصفر وتنتهي. في <strong className="font-semibold text-white font-arabic">نَـسْـمَـة</strong>، قلبنا القصة؛ سوينا لك ورد مصنوع يدوياً من أنعم خيوط الغليون، يظل معك سنين ويشهد على مشاعرك الأصدق.
            </p>

            {/* CTAs */}
            <div 
              className="flex flex-wrap items-center gap-4 animate-blur-in opacity-0"
              style={{ animationDelay: '0.95s', animationFillMode: 'forwards' }}
            >
              <Link
                href="/shop"
                className="inline-flex items-center gap-3 bg-primary text-white px-8 py-4 rounded-full font-semibold text-sm tracking-wide boty-transition hover:bg-primary/90 shadow-xl hover:shadow-2xl hover:scale-105 font-arabic group"
              >
                <ShoppingBag className="w-4 h-4 text-[#EFD9E8] group-hover:-translate-y-0.5 transition-transform" />
                <span>تـسـوق الآن · اسـتـكـشـف الـبـاقـات</span>
                <ArrowLeft className="w-4 h-4" />
              </Link>

              <a
                href="#collection"
                onClick={(e) => {
                  e.preventDefault()
                  document.getElementById('collection')?.scrollIntoView({ behavior: 'smooth' })
                }}
                className="inline-flex items-center gap-2 bg-white/85 hover:bg-white text-foreground backdrop-blur-md px-6 py-4 rounded-full font-medium text-sm tracking-wide boty-transition border border-white/60 shadow-sm font-arabic"
              >
                <span>شـاهـد الـمـجـمـوعـة الـمـخـتـارة</span>
              </a>
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}
