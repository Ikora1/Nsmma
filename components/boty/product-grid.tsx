"use client"

import { useState, useEffect, useRef } from "react"
import Image from "next/image"
import Link from "next/link"
import { ArrowLeft, ShoppingBag } from "lucide-react"
import type { Product } from "@/lib/shopify"

type FilterCategory = "all" | "باقات الحب والعهود" | "مزهريات الدوام والمكتب" | "مسكات ليلة العمر"

const categories: { value: FilterCategory; label: string }[] = [
  { value: "all", label: "جميع الباقات" },
  { value: "باقات الحب والعهود", label: "باقات الحب والعهود" },
  { value: "مزهريات الدوام والمكتب", label: "مزهريات الدوام والمكتب" },
  { value: "مسكات ليلة العمر", label: "مسكات ليلة العمر" },
]

export function ProductGrid({ products }: { products: Product[] }) {
  const [selectedCategory, setSelectedCategory] = useState<FilterCategory>("all")
  const [isVisible, setIsVisible] = useState(false)
  const [isTransitioning, setIsTransitioning] = useState(false)
  const [headerVisible, setHeaderVisible] = useState(false)
  const [scrollProgress, setScrollProgress] = useState(0)
  const gridRef = useRef<HTMLDivElement>(null)
  const headerRef = useRef<HTMLDivElement>(null)
  const sectionRef = useRef<HTMLDivElement>(null)
  
  const filteredProducts = selectedCategory === "all" 
    ? products 
    : products.filter(product => product.productType === selectedCategory)

  const displayProducts = filteredProducts.length > 0 ? filteredProducts : products

  const handleCategoryChange = (category: FilterCategory) => {
    if (category !== selectedCategory) {
      setIsTransitioning(true)
      setTimeout(() => {
        setSelectedCategory(category)
        setTimeout(() => {
          setIsTransitioning(false)
        }, 50)
      }, 250)
    }
  }

  // Preload product images
  useEffect(() => {
    products.forEach((product) => {
      if (product.image) {
        const img = new window.Image()
        img.src = product.image
      }
    })
  }, [products])

  // Scrollytelling effect
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

  useEffect(() => {
    const gridObserver = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) setIsVisible(true)
      },
      { threshold: 0.1 }
    )

    const headerObserver = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) setHeaderVisible(true)
      },
      { threshold: 0.1 }
    )

    if (gridRef.current) gridObserver.observe(gridRef.current)
    if (headerRef.current) headerObserver.observe(headerRef.current)

    return () => {
      if (gridRef.current) gridObserver.unobserve(gridRef.current)
      if (headerRef.current) headerObserver.unobserve(headerRef.current)
    }
  }, [])

  const cardWidth = 320
  const gap = 24
  const totalWidth = (cardWidth + gap) * displayProducts.length - gap
  const viewportWidth = typeof window !== 'undefined' ? window.innerWidth : 1440
  const maxScroll = Math.max(0, totalWidth - viewportWidth + 120)
  const horizontalOffset = scrollProgress * maxScroll
  
  return (
    <section ref={sectionRef} className="py-24 bg-card min-h-[250vh] relative" dir="rtl">
      <div className="sticky top-0 h-screen flex flex-col justify-center overflow-hidden pt-20">
        <div className="w-full px-6 lg:px-12">
          {/* Header */}
          <div ref={headerRef} className="mb-8 max-w-3xl text-right">
            <span 
              className={`text-xs font-semibold tracking-wider uppercase text-primary mb-2 block font-arabic ${headerVisible ? 'animate-blur-in opacity-0' : 'opacity-0'}`} 
              style={headerVisible ? { animationDelay: '0.15s', animationFillMode: 'forwards' } : {}}
            >
              بـاقـات نَـسْـمَـة الـيـدويـة · هـدايـا لا تـذبـل
            </span>
            <h2 
              className={`leading-tight text-foreground mb-3 text-balance ${headerVisible ? 'animate-blur-in opacity-0' : 'opacity-0'}`} 
              style={headerVisible ? { animationDelay: '0.3s', animationFillMode: 'forwards' } : {}}
            >
              <span className="font-arabic text-3xl sm:text-4xl md:text-5xl text-primary font-bold block mb-1">
                كـل بـاقـة عـنـدنـا، وراهـا حـكـايـة تـنـتـظـر صـاحـبـهـا
              </span>
            </h2>
            <p 
              className={`text-sm sm:text-base text-muted-foreground font-light leading-relaxed ${headerVisible ? 'animate-blur-in opacity-0' : 'opacity-0'}`} 
              style={headerVisible ? { animationDelay: '0.45s', animationFillMode: 'forwards' } : {}}
            >
              تصفح حسب المشاعر اللي ودك توصلها اليوم... كل وردة مصنوعة بحب من خيوط الغليون، عشان تعيش سنين وتظل شاهدة على أصدق أوقاتكم.
            </p>
          </div>

          {/* Segmented Filter Control */}
          <div className="flex flex-wrap items-center justify-between gap-3 mb-8">
            <div className="flex flex-wrap gap-2">
              {categories.map((cat) => (
                <button
                  key={cat.value}
                  onClick={() => handleCategoryChange(cat.value)}
                  className={`px-5 py-2 rounded-full text-xs font-semibold tracking-wide transition-all duration-300 font-arabic ${
                    selectedCategory === cat.value
                      ? "bg-primary text-white shadow-md shadow-primary/20 scale-105"
                      : "bg-white/80 text-foreground/75 hover:bg-white hover:text-foreground border border-[#F0E4EC]"
                  }`}
                >
                  {cat.label}
                </button>
              ))}
            </div>

            <Link
              href="/shop"
              className="inline-flex items-center gap-2 text-xs font-semibold text-primary bg-[#EFD9E8]/60 hover:bg-[#EFD9E8] px-4 py-2 rounded-full font-arabic transition-all border border-primary/20 hover:scale-105"
            >
              <span>تسوق كل الباقات في المتجر</span>
              <ArrowLeft className="w-3.5 h-3.5" />
            </Link>
          </div>

          {/* Product Horizontal Track */}
          <div 
            ref={gridRef}
            className="flex gap-6 will-change-transform"
            style={{ transform: `translateX(${horizontalOffset}px)`, transition: 'transform 0.08s linear' }}
          >
            {displayProducts.map((product, index) => (
              <Link
                key={`${selectedCategory}-${product.id}`}
                href={`/product/${product.id}`}
                className={`group transition-all duration-500 ease-out flex-shrink-0 ${
                  isVisible && !isTransitioning ? 'opacity-100 scale-100' : 'opacity-0 scale-95'
                }`}
                style={{ 
                  transitionDelay: isTransitioning ? '0ms' : `${index * 60}ms`,
                  width: '320px',
                  height: '460px'
                }}
              >
                <div className="relative bg-background rounded-3xl overflow-hidden nasmma-card-shadow boty-transition group-hover:scale-[1.02] group-hover:shadow-2xl h-full w-full border border-border/50">
                  {/* Image - Full Height */}
                  <div className="relative h-full bg-[#FBF6F4] overflow-hidden">
                    <Image
                      src={product.image || "/placeholder.svg"}
                      alt={product.name}
                      fill
                      sizes="320px"
                      className="object-cover boty-transition group-hover:scale-105 duration-700"
                    />
                    
                    {/* Badge */}
                    {product.badge && (
                      <span
                        className={`absolute top-4 right-4 px-3 py-1 rounded-full text-xs font-bold tracking-wide shadow-sm font-arabic ${
                          product.badge === "Sale"
                            ? "bg-destructive text-white"
                            : product.badge === "New"
                            ? "bg-[#EFD9E8] text-primary border border-primary/20"
                            : "bg-[#7C8B65] text-white"
                        }`}
                      >
                        {product.badge === "Sale" && "خصم خاص"}
                        {product.badge === "New" && "جديد نسمة"}
                        {product.badge === "Bestseller" && "الأكثر طلباً"}
                      </span>
                    )}
                    
                    {/* Info with Progressive Blur */}
                    <div className="absolute bottom-0 left-0 right-0 p-5 text-right">
                      <div 
                        className="absolute inset-0 bg-gradient-to-t from-black/90 via-black/60 to-transparent backdrop-blur-[5px]" 
                        style={{ maskImage: 'linear-gradient(to top, black 0%, black 65%, transparent 100%)', WebkitMaskImage: 'linear-gradient(to top, black 0%, black 65%, transparent 100%)' }}
                      />
                      
                      {/* Content */}
                      <div className="relative z-10 text-white">
                        <h3 className="font-arabic text-base sm:text-lg text-white font-bold mb-1 line-clamp-1 group-hover:text-[#EFD9E8] transition-colors">
                          {product.name}
                        </h3>
                        <p className="text-xs text-white/85 mb-3 line-clamp-2 leading-relaxed font-light">
                          {product.description}
                        </p>
                        <div className="flex items-center justify-between gap-2">
                          <div className="flex items-center gap-2">
                            <span className="font-bold text-base text-white">
                              {product.price} ر.ع
                            </span>
                            {product.originalPrice && (
                              <span className="text-xs text-white/70 line-through">
                                {product.originalPrice} ر.ع
                              </span>
                            )}
                          </div>
                          <span className="text-[11px] font-arabic font-medium tracking-wider text-[#EFD9E8] bg-white/10 px-2.5 py-0.5 rounded-full backdrop-blur-sm">
                            شغل يدوي · ما يذبل
                          </span>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </Link>
            ))}
          </div>

          <div className="mt-6 flex items-center justify-between text-xs text-muted-foreground font-light">
            <span>اسحب أفقياً لاستكشاف كل الباقات والحكايات ←</span>
            <span>صُنعت بحب وصبر من خيوط الغليون المخملية</span>
          </div>
        </div>
      </div>
    </section>
  )
}
