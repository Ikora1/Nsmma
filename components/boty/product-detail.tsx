"use client"

import { useState } from "react"
import Image from "next/image"
import Link from "next/link"
import { ChevronLeft, Minus, Plus, ChevronDown, Flower2, Heart, Award, Recycle, Star, Check } from "lucide-react"
import { Header } from "@/components/boty/header"
import { Footer } from "@/components/boty/footer"
import { useCart } from "@/components/boty/cart-context"
import type { Product } from "@/lib/shopify"

const benefits = [
  { icon: Flower2, label: "شـغـل يـدوي بـحـت (حـبـة حـبـة)" },
  { icon: Heart, label: "خـيـوط غـلـيـون مـخـمـلـيـة فـاخـرة" },
  { icon: Recycle, label: "ورد مـا يـذبـل ويـعـيـش الـعـمـر كـلـه" },
  { icon: Award, label: "تـغـلـيـف إهـداء مـلـكـي مـع كـرت" },
]

type AccordionSection = "details" | "careGuide" | "materials" | "delivery"

export function ProductDetail({ product }: { product: Product }) {
  const { addItem, setIsOpen } = useCart()
  const [quantity, setQuantity] = useState(1)
  const [openAccordion, setOpenAccordion] = useState<AccordionSection | null>("details")
  const [isAdded, setIsAdded] = useState(false)
  const [selectedImage, setSelectedImage] = useState(product.image)

  const formatPrice = (amount: number) => `${amount % 1 === 0 ? amount : amount.toFixed(1)} ر.ع`

  const toggleAccordion = (section: AccordionSection) => {
    setOpenAccordion(openAccordion === section ? null : section)
  }

  const handleAddToCart = async () => {
    if (!product.variantId) return
    await addItem(product.variantId, quantity)
    setIsAdded(true)
    setTimeout(() => setIsAdded(false), 2000)
  }

  const handleBuyNow = async () => {
    if (!product.variantId) return
    await addItem(product.variantId, quantity)
    setIsOpen(true)
  }

  const accordionItems: { key: AccordionSection; title: string; content: string }[] = [
    { 
      key: "details", 
      title: "حـكـايـة الـبـاقـة وتـفـاصـيـلـهـا", 
      content: product.descriptionHtml.replace(/<[^>]+>/g, "") || product.description 
    },
    {
      key: "careGuide",
      title: "كـيـف تـحـافـظ عـلـى ذكـراك أبـديـة؟",
      content:
        "ورد نسمة مصنوع من خيوط الغليون المخملية ليبقى نضراً معك سنين وسنين بدون أي قطرة موية ولا ذبول! كل اللي عليك تبعده عن الرطوبة المباشرة، وإذا حبيت تنظفه بعد فترة طويلة، مسحة خفيفة بفرشاة ناعمة وجافة ترجع له رونقه وملمسه المخملي كأنه انصنع لك اليوم.",
    },
    {
      key: "materials",
      title: "الـمـواد وسـر الـصـنـعـة والـتـغـلـيـف",
      content:
        "نستخدم أسلاك غليون قطنية مخملية مستوردة فائقة الكثافة والنعومة، مشغولة بحرفية تامة مع سيقان مرنة تقدر تنسقها على مزاجك، وتوصلك الباقة في تغليف ملكي متناسق مع شريطة ساتان فاخرة وكرت نسمة المخصص لتدوين مشاعرك بكل صدق.",
    },
    {
      key: "delivery",
      title: "الـشـحـن والـتـوصـيـل الـمـحـمـي لـحـد الـبـاب",
      content:
        "نوصل هديتك بسرعة فائقة مع عناية دقيقة لكل مناطق المملكة والخليج. الباقة تثبت داخل كرتون حماية صلب مخصص يضمن وصول كل بتلة بشكلها البهي وأناقتها الكاملة لحد باب الغالي.",
    },
  ]

  const galleryImages = product.images && product.images.length > 0 ? product.images : [product.image]

  return (
    <main className="min-h-screen bg-background text-foreground" dir="rtl">
      <Header />

      <div className="pt-28 pb-20">
        <div className="max-w-7xl mx-auto px-6 lg:px-8">
          {/* Back Link */}
          <Link
            href="/#collection"
            className="inline-flex items-center gap-2 text-xs font-semibold text-primary hover:text-primary/80 boty-transition mb-8"
          >
            <ChevronLeft className="w-4 h-4 rotate-180" />
            العودة لجميع باقات الذكريات
          </Link>

          <div className="grid lg:grid-cols-2 gap-12 lg:gap-16">
            {/* Product Gallery */}
            <div className="space-y-4">
              <div className="relative aspect-[4/5] rounded-3xl overflow-hidden bg-[#FBF6F4] nasmma-card-shadow border border-border/50">
                <Image
                  src={selectedImage || product.image || "/placeholder.svg"}
                  alt={product.name}
                  fill
                  className="object-cover"
                  priority
                />
                {product.badge && (
                  <span className="absolute top-4 right-4 px-3.5 py-1 rounded-full text-xs font-semibold bg-primary text-white shadow-md">
                    {product.badge}
                  </span>
                )}
              </div>

              {galleryImages.length > 1 && (
                <div className="flex gap-3">
                  {galleryImages.map((img, i) => (
                    <button
                      key={i}
                      type="button"
                      onClick={() => setSelectedImage(img)}
                      className={`relative w-20 h-24 rounded-2xl overflow-hidden border-2 transition-all ${
                        selectedImage === img ? "border-primary scale-105" : "border-border/60 opacity-70 hover:opacity-100"
                      }`}
                    >
                      <Image src={img} alt="" fill className="object-cover" />
                    </button>
                  ))}
                </div>
              )}
            </div>

            {/* Product Info */}
            <div className="flex flex-col text-right">
              {/* Header */}
              <div className="mb-6">
                <span className="text-xs font-semibold text-primary mb-2 block tracking-wider font-arabic">
                  اسـتـوديـو نَـسْـمَـة الـحـرفـي · وردة لا تـمـوت تـصـنـع ذكـرى أبـديـة
                </span>
                <h1 className="font-arabic text-3xl sm:text-4xl text-foreground mb-3 font-bold">
                  {product.name}
                </h1>

                {/* Rating */}
                <div className="flex items-center gap-2 mb-4 justify-start">
                  <div className="flex">
                    {[...Array(5)].map((_, i) => (
                      <Star key={i} className="w-4 h-4 fill-primary text-primary" />
                    ))}
                  </div>
                  <span className="text-xs text-muted-foreground font-sans">(٤٨ تجربة دافئة وتقييم ممتاز)</span>
                </div>

                <p className="text-foreground/80 leading-relaxed text-sm sm:text-base font-light">
                  {product.description}
                </p>
              </div>

              {/* Price */}
              <div className="flex items-center gap-3 mb-6">
                <span className="text-3xl font-semibold text-primary">{formatPrice(product.price)}</span>
                {product.originalPrice && (
                  <span className="text-xl text-muted-foreground line-through">
                    {formatPrice(product.originalPrice)}
                  </span>
                )}
                <span className="text-xs text-[#7C8B65] font-medium bg-[#7C8B65]/10 px-2.5 py-0.5 rounded-full mr-2">
                  جاهزة للإهداء الفوري
                </span>
              </div>

              {/* Quantity Selector */}
              <div className="mb-8">
                <label className="text-xs font-semibold text-foreground mb-2.5 block">
                  عدد الباقات:
                </label>
                <div className="inline-flex items-center gap-3 bg-card rounded-full px-2 py-1.5 border border-border">
                  <button
                    type="button"
                    onClick={() => setQuantity(Math.max(1, quantity - 1))}
                    className="w-8 h-8 rounded-full bg-white flex items-center justify-center text-foreground/70 hover:text-foreground boty-transition border border-border/40"
                    aria-label="تقليل العدد"
                  >
                    <Minus className="w-3.5 h-3.5" />
                  </button>
                  <span className="w-8 text-center font-semibold text-foreground text-sm">{quantity}</span>
                  <button
                    type="button"
                    onClick={() => setQuantity(quantity + 1)}
                    className="w-8 h-8 rounded-full bg-white flex items-center justify-center text-foreground/70 hover:text-foreground boty-transition border border-border/40"
                    aria-label="زيادة العدد"
                  >
                    <Plus className="w-3.5 h-3.5" />
                  </button>
                </div>
              </div>

              {/* Add to Cart Buttons */}
              <div className="flex flex-col sm:flex-row gap-3 mb-8">
                <button
                  type="button"
                  onClick={handleAddToCart}
                  disabled={!product.availableForSale}
                  className={`flex-1 inline-flex items-center justify-center gap-2 px-8 py-4 rounded-full text-sm font-semibold tracking-wide boty-transition shadow-md disabled:opacity-50 ${
                    isAdded
                      ? "bg-[#7C8B65] text-white"
                      : "bg-primary text-white hover:bg-primary/90"
                  }`}
                >
                  {isAdded ? (
                    <>
                      <Check className="w-4 h-4" />
                      تمت الإضافة لسلة الذكريات!
                    </>
                  ) : (
                    "أضف لسلة الذكريات"
                  )}
                </button>
                <button
                  type="button"
                  onClick={handleBuyNow}
                  disabled={!product.availableForSale}
                  className="flex-1 inline-flex items-center justify-center gap-2 bg-white border-2 border-primary text-primary px-8 py-4 rounded-full text-sm font-semibold tracking-wide boty-transition hover:bg-[#EFD9E8]/30 disabled:opacity-50"
                >
                  اطلب الآن وأهدها للغالي
                </button>
              </div>

              {/* Benefits */}
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 mb-8">
                {benefits.map((benefit) => (
                  <div
                    key={benefit.label}
                    className="flex flex-col items-center gap-1.5 p-3 rounded-2xl bg-card border border-border/50 text-center"
                  >
                    <benefit.icon className="w-5 h-5 text-primary" strokeWidth={1.5} />
                    <span className="text-[11px] font-medium text-foreground/80">{benefit.label}</span>
                  </div>
                ))}
              </div>

              {/* Accordion */}
              <div className="border-t border-border/50">
                {accordionItems.map((item) => (
                  <div key={item.key} className="border-b border-border/50">
                    <button
                      type="button"
                      onClick={() => toggleAccordion(item.key)}
                      className="w-full flex items-center justify-between py-4 text-right group"
                    >
                      <span className="font-medium text-foreground text-sm group-hover:text-primary transition-colors">
                        {item.title}
                      </span>
                      <ChevronDown
                        className={`w-4 h-4 text-muted-foreground boty-transition ${
                          openAccordion === item.key ? "rotate-180 text-primary" : ""
                        }`}
                      />
                    </button>
                    <div
                      className={`overflow-hidden boty-transition ${
                        openAccordion === item.key ? "max-h-96 pb-4" : "max-h-0"
                      }`}
                    >
                      <p className="text-xs sm:text-sm text-muted-foreground leading-relaxed">
                        {item.content}
                      </p>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>

      <Footer />
    </main>
  )
}
