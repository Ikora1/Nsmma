"use client"

import { useState, useEffect } from "react"
import Image from "next/image"
import { useRouter } from "next/navigation"
import { Sparkles, X, Gift, Check, ArrowLeft } from "lucide-react"
import { useCart } from "@/components/boty/cart-context"
import type { StoreOffer } from "@/lib/store-db"

const DISMISSED_KEY = "nasmma_offer_popup_seen"

export function OfferPopup() {
  const router = useRouter()
  const { applyDiscount } = useCart()
  const [offer, setOffer] = useState<StoreOffer | null>(null)
  const [isOpen, setIsOpen] = useState(false)
  const [appliedToast, setAppliedToast] = useState(false)

  useEffect(() => {
    // Check if dismissed in this session
    try {
      const seen = sessionStorage.getItem(DISMISSED_KEY)
      if (seen) return
    } catch {}

    fetch("/api/offer")
      .then((res) => res.json())
      .then((data) => {
        if (data.offer && data.offer.enabled) {
          setOffer(data.offer)
          // Open popup after a gentle delay for optimal visitor delight
          const timer = setTimeout(() => {
            setIsOpen(true)
          }, 1500)
          return () => clearTimeout(timer)
        }
      })
      .catch((err) => console.log("[Offer Popup fetch failed]", err))
  }, [])

  const handleClose = () => {
    setIsOpen(false)
    try {
      sessionStorage.setItem(DISMISSED_KEY, "true")
    } catch {}
  }

  const handleApplyOffer = () => {
    if (!offer) return
    applyDiscount(offer.couponCode, offer.discountPercentage)
    setIsOpen(false)
    try {
      sessionStorage.setItem(DISMISSED_KEY, "true")
    } catch {}
    setAppliedToast(true)
    setTimeout(() => setAppliedToast(false), 4000)
  }

  return (
    <>
      {/* Toast Alert on successful discount application */}
      {appliedToast && offer && (
        <div className="fixed top-24 left-1/2 -translate-x-1/2 z-50 bg-[#5B1657] text-white px-6 py-3.5 rounded-full shadow-2xl flex items-center gap-3 animate-blur-in text-sm font-arabic border border-white/20">
          <Sparkles className="w-5 h-5 text-[#EFD9E8] animate-pulse" />
          <span>تم تفعيل خصم <strong>{offer.discountPercentage}%</strong> بكود <strong>{offer.couponCode}</strong> على سلتك! 🎉</span>
        </div>
      )}

      {/* Luxury Popup Modal */}
      {isOpen && offer && (
        <div className="fixed inset-0 z-50 bg-black/65 backdrop-blur-md flex items-center justify-center p-4 animate-scale-fade-in" dir="rtl">
          <div className="relative w-full max-w-lg bg-white rounded-3xl overflow-hidden nasmma-card-shadow border border-[#F0E4EC] text-right">
            
            {/* Close Button */}
            <button
              type="button"
              onClick={handleClose}
              className="absolute top-4 left-4 z-20 w-8 h-8 rounded-full bg-white/80 hover:bg-white text-foreground/80 hover:text-foreground flex items-center justify-center transition-colors shadow-sm"
              aria-label="إغلاق العرض"
            >
              <X className="w-4 h-4" />
            </button>

            {/* Visual Header / Image */}
            <div className="relative h-48 sm:h-56 bg-[#FBF6F4] overflow-hidden">
              <Image
                src={offer.imageUrl || "/images/products/product-1.jpg"}
                alt={offer.title}
                fill
                className="object-cover"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/30 to-transparent" />
              
              {/* Badge */}
              <div className="absolute top-4 right-4">
                <span className="bg-[#5B1657] text-white text-xs font-bold px-3.5 py-1 rounded-full font-arabic shadow-md border border-white/20">
                  {offer.badgeText}
                </span>
              </div>

              {/* Discount Callout */}
              <div className="absolute bottom-4 right-4 text-white">
                <span className="text-[11px] font-semibold text-[#EFD9E8] font-arabic block mb-0.5">
                  كود الخصم الحصري:
                </span>
                <span className="font-mono text-lg font-bold bg-white/20 backdrop-blur-md px-3 py-1 rounded-xl border border-white/30 tracking-widest inline-block">
                  {offer.couponCode}
                </span>
              </div>
            </div>

            {/* Content & CTAs */}
            <div className="p-6 sm:p-8 bg-[#FBF6F4]">
              <h2 className="font-arabic text-xl sm:text-2xl font-bold text-foreground mb-2 leading-tight">
                {offer.title}
              </h2>
              <p className="text-xs sm:text-sm text-muted-foreground font-arabic font-light leading-relaxed mb-6">
                {offer.subtitle}
              </p>

              <div className="space-y-3">
                <button
                  type="button"
                  onClick={handleApplyOffer}
                  className="w-full bg-primary text-white py-4 rounded-full font-bold text-xs sm:text-sm tracking-wide font-arabic hover:bg-primary/90 transition-all shadow-xl hover:shadow-2xl hover:scale-[1.02] flex items-center justify-center gap-2"
                >
                  <Sparkles className="w-4 h-4 text-[#EFD9E8]" />
                  <span>{offer.buttonText} ({offer.discountPercentage}% خصم)</span>
                  <ArrowLeft className="w-4 h-4" />
                </button>

                <button
                  type="button"
                  onClick={handleClose}
                  className="w-full text-center text-xs text-muted-foreground hover:text-foreground font-arabic py-2 transition-colors"
                >
                  تخطي واستكشاف الباقات
                </button>
              </div>

              <div className="mt-4 pt-4 border-t border-border/60 text-center text-[11px] text-muted-foreground font-arabic font-light">
                ✨ الورد المخملي من نسمة يدوم لسنوات ولا يذبل أبداً
              </div>
            </div>

          </div>
        </div>
      )}
    </>
  )
}
