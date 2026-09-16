"use client"

import React, { useState } from "react"
import { ArrowLeft, Check, Sparkles } from "lucide-react"

export function Newsletter() {
  const [email, setEmail] = useState("")
  const [isSubscribed, setIsSubscribed] = useState(false)

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    if (email) {
      setIsSubscribed(true)
      setEmail("")
    }
  }

  return (
    <section className="py-24 bg-primary text-primary-foreground relative overflow-hidden" dir="rtl">
      {/* Decorative accents */}
      <div className="absolute top-0 left-0 -ml-20 -mt-20 w-80 h-80 rounded-full bg-white/5 blur-3xl pointer-events-none" />
      <div className="absolute bottom-0 right-0 -mr-20 -mb-20 w-80 h-80 rounded-full bg-[#EFD9E8]/10 blur-3xl pointer-events-none" />

      <div className="max-w-7xl mx-auto px-6 lg:px-8 relative z-10">
        <div className="max-w-2xl mx-auto text-center">
          <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-white/10 backdrop-blur-sm mb-4">
            <Sparkles className="w-3.5 h-3.5 text-[#EFD9E8]" />
            <span className="text-xs font-semibold tracking-wider uppercase text-[#EFD9E8] font-arabic">
              مـجـلـة نَـسْـمَـة لـلـورود والـذكـريـات
            </span>
          </div>

          <h2 className="mb-4 text-balance">
            <span className="font-arabic text-4xl sm:text-6xl font-bold leading-tight block">
              خـلّـك قـريـب مـن نـسـيـمـنـا
            </span>
          </h2>

          <p className="text-sm sm:text-base text-primary-foreground/85 mb-10 max-w-md mx-auto font-light leading-relaxed">
            اشترك معنا عشان توصلك أفكار هدايا دافئة، وتصاميم باقات حصرية قبل الكل، مع عروض خاصة تسعد قلبك وقلب من تحب.
          </p>

          {isSubscribed ? (
            <div className="inline-flex items-center gap-3 bg-white/20 backdrop-blur-md rounded-full px-8 py-4 border border-white/30 animate-scale-fade-in font-arabic">
              <Check className="w-5 h-5 text-[#EFD9E8]" />
              <span className="text-white font-bold">يا هلا فيك! نورت عائلة نسمة</span>
            </div>
          ) : (
            <form onSubmit={handleSubmit} className="flex flex-col sm:flex-row gap-3 max-w-md mx-auto">
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="سجّل بريدك الإلكتروني هنا..."
                className="flex-1 bg-white/10 backdrop-blur-md border border-white/25 rounded-full px-6 py-4 text-white placeholder:text-white/60 focus:outline-none focus:border-white focus:bg-white/15 boty-transition text-sm text-right"
                required
              />
              <button
                type="submit"
                className="group inline-flex items-center justify-center gap-2 bg-white text-primary px-8 py-4 rounded-full text-sm font-bold tracking-wide boty-transition hover:bg-[#EFD9E8] shadow-lg font-arabic"
              >
                <span>انضم لنسمة</span>
                <ArrowLeft className="w-4 h-4 group-hover:-translate-x-1 boty-transition" />
              </button>
            </form>
          )}

          <p className="text-xs text-primary-foreground/60 mt-6 font-light">
            نحترم خصوصيتك وهدوء بريدك دائماً. يمكنك إلغاء الاشتراك بنقرة واحدة.
          </p>
        </div>
      </div>
    </section>
  )
}
