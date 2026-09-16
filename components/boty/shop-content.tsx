"use client"

import { useState, useEffect, useRef, useMemo } from "react"
import Image from "next/image"
import Link from "next/link"
import { 
  ShoppingBag, 
  SlidersHorizontal, 
  X, 
  Search, 
  Star, 
  Sparkles, 
  Check, 
  Truck, 
  Gift, 
  ShieldCheck, 
  CreditCard,
  ArrowUpDown,
  LayoutGrid,
  Grid3X3,
  Plus,
  ArrowLeft
} from "lucide-react"
import { Header } from "@/components/boty/header"
import { Footer } from "@/components/boty/footer"
import { useCart } from "@/components/boty/cart-context"
import type { Product } from "@/lib/shopify"

type SortOption = "popular" | "price-asc" | "price-desc" | "newest"
type PriceFilter = "all" | "under-15" | "15-20" | "over-20"

export function ShopContent({ products }: { products: Product[] }) {
  const [selectedCategory, setSelectedCategory] = useState("all")
  const [priceFilter, setPriceFilter] = useState<PriceFilter>("all")
  const [sortOption, setSortOption] = useState<SortOption>("popular")
  const [searchQuery, setSearchQuery] = useState("")
  const [gridColumns, setGridColumns] = useState<3 | 4>(4)
  const [showFilters, setShowFilters] = useState(false)
  const [isVisible, setIsVisible] = useState(true)
  const [addedToast, setAddedToast] = useState<string | null>(null)
  
  const gridRef = useRef<HTMLDivElement>(null)

  // Categories list
  const categories = useMemo(() => {
    const types = Array.from(new Set(products.map((p) => p.productType).filter(Boolean)))
    return [
      { id: "all", label: "جميع الباقات" },
      ...types.map((type) => ({ id: type, label: type }))
    ]
  }, [products])

  // Filtered and sorted products
  const filteredProducts = useMemo(() => {
    return products
      .filter((product) => {
        // Category filter
        if (selectedCategory !== "all" && product.productType !== selectedCategory) {
          return false
        }
        // Price filter in OMR
        if (priceFilter === "under-15" && product.price >= 15) return false
        if (priceFilter === "15-20" && (product.price < 15 || product.price > 20)) return false
        if (priceFilter === "over-20" && product.price <= 20) return false
        // Search query
        if (searchQuery.trim()) {
          const q = searchQuery.toLowerCase()
          const matchName = product.name.toLowerCase().includes(q)
          const matchDesc = product.description.toLowerCase().includes(q)
          const matchType = product.productType?.toLowerCase().includes(q)
          if (!matchName && !matchDesc && !matchType) return false
        }
        return true
      })
      .sort((a, b) => {
        if (sortOption === "price-asc") return a.price - b.price
        if (sortOption === "price-desc") return b.price - a.price
        if (sortOption === "newest") return (b.badge === "New" ? 1 : 0) - (a.badge === "New" ? 1 : 0)
        // Default: popular
        return (b.badge === "Bestseller" ? 1 : 0) - (a.badge === "Bestseller" ? 1 : 0)
      })
  }, [products, selectedCategory, priceFilter, sortOption, searchQuery])

  useEffect(() => {
    setIsVisible(false)
    const timer = setTimeout(() => setIsVisible(true), 60)
    return () => clearTimeout(timer)
  }, [selectedCategory, priceFilter, sortOption, searchQuery])

  return (
    <main className="min-h-screen bg-background text-foreground" dir="rtl">
      <Header />

      {/* Added Toast Notification */}
      {addedToast && (
        <div className="fixed bottom-6 left-1/2 -translate-x-1/2 z-50 bg-[#5B1657] text-white px-5 py-3 rounded-full shadow-2xl flex items-center gap-3 animate-blur-in text-sm font-arabic border border-white/20">
          <Check className="w-4 h-4 text-[#EFD9E8]" />
          <span>تمت إضافة <strong>{addedToast}</strong> إلى سلتك بكل حب!</span>
        </div>
      )}

      {/* Top Banner / Breadcrumb & Header */}
      <section className="pt-32 pb-8 bg-[#FBF6F4] border-b border-border/60">
        <div className="max-w-7xl mx-auto px-6 lg:px-8">
          {/* Breadcrumb */}
          <nav className="flex items-center gap-2 text-xs text-muted-foreground mb-4 font-arabic">
            <Link href="/" className="hover:text-primary transition-colors">الرئيسية</Link>
            <span>/</span>
            <span className="text-primary font-medium">متجر باقات نسمة</span>
          </nav>

          <div className="flex flex-col md:flex-row md:items-end justify-between gap-6">
            <div>
              <div className="inline-flex items-center gap-2 px-3.5 py-1 rounded-full bg-white/80 border border-[#F0E4EC] text-primary text-xs font-semibold mb-3">
                <Sparkles className="w-3.5 h-3.5 text-primary" />
                <span className="font-arabic">زهور مخملية أصلية · خيوط الغليون</span>
              </div>
              <h1 className="font-arabic text-3xl sm:text-4xl lg:text-5xl text-foreground font-bold leading-tight">
                مـتـجـر بـاقـات نَـسْـمَـة
              </h1>
              <p className="text-sm sm:text-base text-muted-foreground mt-2 max-w-xl font-light font-arabic leading-relaxed">
                كل وردة منسوجة بيدينا حبة حبة، عشان تعيش سنين وتظل شاهدة على أصدق مشاعرك وأجمل أوقاتك.
              </p>
            </div>

            {/* Quick Search */}
            <div className="relative w-full md:w-72">
              <input
                type="text"
                placeholder="ابحث عن باقة، لون، أو مناسبة..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full bg-white pl-4 pr-10 py-2.5 rounded-full text-xs text-foreground placeholder:text-muted-foreground border border-border/70 focus:outline-none focus:border-primary/50 focus:ring-2 focus:ring-primary/10 transition-all font-arabic"
              />
              <Search className="w-4 h-4 text-muted-foreground absolute right-3.5 top-1/2 -translate-y-1/2" />
              {searchQuery && (
                <button
                  type="button"
                  onClick={() => setSearchQuery("")}
                  className="absolute left-3.5 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground"
                >
                  <X className="w-3.5 h-3.5" />
                </button>
              )}
            </div>
          </div>
        </div>
      </section>

      {/* Main Content Area */}
      <div className="max-w-7xl mx-auto px-6 lg:px-8 py-8">
        
        {/* Controls Bar: Category Pills, Sort, Product Count, View Switcher */}
        <div className="flex flex-col gap-4 mb-8 pb-6 border-b border-border/50">
          
          {/* Top Row: Categories & Mobile Filter Button */}
          <div className="flex items-center justify-between gap-4">
            {/* Desktop Category Chips */}
            <div className="hidden md:flex items-center gap-2 overflow-x-auto pb-1 scrollbar-none">
              {categories.map((cat) => (
                <button
                  key={cat.id}
                  type="button"
                  onClick={() => setSelectedCategory(cat.id)}
                  className={`px-4 py-2 rounded-full text-xs font-semibold whitespace-nowrap transition-all duration-300 font-arabic ${
                    selectedCategory === cat.id
                      ? "bg-primary text-white shadow-md shadow-primary/20 scale-105"
                      : "bg-[#FBF6F4] text-foreground/75 hover:bg-white hover:text-foreground border border-[#F0E4EC]"
                  }`}
                >
                  {cat.label}
                </button>
              ))}
            </div>

            {/* Mobile Filter Button */}
            <button
              type="button"
              onClick={() => setShowFilters(true)}
              className="md:hidden inline-flex items-center gap-2 bg-[#FBF6F4] border border-[#F0E4EC] text-foreground text-xs font-semibold px-4 py-2.5 rounded-full font-arabic"
            >
              <SlidersHorizontal className="w-4 h-4 text-primary" />
              <span>تصفية الباقات ({filteredProducts.length})</span>
            </button>

            {/* Product Count & Sort Dropdown */}
            <div className="flex items-center gap-3">
              <span className="hidden sm:inline-block text-xs font-medium text-muted-foreground font-arabic">
                {filteredProducts.length} {filteredProducts.length === 1 ? "باقة متوفرة" : "باقات متوفرة"}
              </span>

              {/* Sort selector */}
              <div className="relative inline-flex items-center">
                <ArrowUpDown className="w-3.5 h-3.5 text-muted-foreground absolute right-3 pointer-events-none" />
                <select
                  value={sortOption}
                  onChange={(e) => setSortOption(e.target.value as SortOption)}
                  className="bg-[#FBF6F4] text-xs font-semibold text-foreground py-2 pr-8 pl-3 rounded-full border border-border/70 focus:outline-none focus:border-primary/50 cursor-pointer font-arabic appearance-none"
                >
                  <option value="popular">الأكثر طلباً</option>
                  <option value="newest">الأحدث وصولاً</option>
                  <option value="price-asc">السعر: من الأقل للأعلى</option>
                  <option value="price-desc">السعر: من الأعلى للأقل</option>
                </select>
              </div>

              {/* Grid Column Switcher (Desktop) */}
              <div className="hidden lg:flex items-center gap-1 bg-[#FBF6F4] p-1 rounded-full border border-border/70">
                <button
                  type="button"
                  onClick={() => setGridColumns(3)}
                  className={`p-1.5 rounded-full transition-colors ${
                    gridColumns === 3 ? "bg-white text-primary shadow-sm" : "text-muted-foreground hover:text-foreground"
                  }`}
                  aria-label="3 أعمدة"
                >
                  <Grid3X3 className="w-3.5 h-3.5" />
                </button>
                <button
                  type="button"
                  onClick={() => setGridColumns(4)}
                  className={`p-1.5 rounded-full transition-colors ${
                    gridColumns === 4 ? "bg-white text-primary shadow-sm" : "text-muted-foreground hover:text-foreground"
                  }`}
                  aria-label="4 أعمدة"
                >
                  <LayoutGrid className="w-3.5 h-3.5" />
                </button>
              </div>
            </div>
          </div>

          {/* Desktop Secondary Filters: Price Ranges */}
          <div className="hidden md:flex items-center gap-2 text-xs font-arabic text-muted-foreground">
            <span className="font-semibold text-foreground/80">نطاق السعر:</span>
            <button
              type="button"
              onClick={() => setPriceFilter("all")}
              className={`px-3 py-1 rounded-full border text-[11px] transition-all ${
                priceFilter === "all"
                  ? "bg-[#EFD9E8] text-primary border-primary/30 font-semibold"
                  : "bg-white text-muted-foreground border-border/60 hover:text-foreground"
              }`}
            >
              الكل
            </button>
            <button
              type="button"
              onClick={() => setPriceFilter("under-15")}
              className={`px-3 py-1 rounded-full border text-[11px] transition-all ${
                priceFilter === "under-15"
                  ? "bg-[#EFD9E8] text-primary border-primary/30 font-semibold"
                  : "bg-white text-muted-foreground border-border/60 hover:text-foreground"
              }`}
            >
              أقل من 15 ر.ع
            </button>
            <button
              type="button"
              onClick={() => setPriceFilter("15-20")}
              className={`px-3 py-1 rounded-full border text-[11px] transition-all ${
                priceFilter === "15-20"
                  ? "bg-[#EFD9E8] text-primary border-primary/30 font-semibold"
                  : "bg-white text-muted-foreground border-border/60 hover:text-foreground"
              }`}
            >
              15 - 20 ر.ع
            </button>
            <button
              type="button"
              onClick={() => setPriceFilter("over-20")}
              className={`px-3 py-1 rounded-full border text-[11px] transition-all ${
                priceFilter === "over-20"
                  ? "bg-[#EFD9E8] text-primary border-primary/30 font-semibold"
                  : "bg-white text-muted-foreground border-border/60 hover:text-foreground"
              }`}
            >
              أكثر من 20 ر.ع
            </button>
          </div>
        </div>

        {/* Mobile Filters Drawer Modal */}
        {showFilters && (
          <div className="md:hidden fixed inset-0 z-50 bg-black/60 backdrop-blur-sm flex justify-end">
            <div className="w-full max-w-sm bg-background h-full p-6 overflow-y-auto flex flex-col justify-between animate-scale-fade-in text-right">
              <div>
                <div className="flex items-center justify-between pb-4 border-b border-border/60 mb-6">
                  <h2 className="font-arabic text-xl font-bold text-foreground">تصفية الباقات</h2>
                  <button
                    type="button"
                    onClick={() => setShowFilters(false)}
                    className="p-2 text-foreground/70 hover:text-foreground"
                  >
                    <X className="w-5 h-5" />
                  </button>
                </div>

                {/* Categories */}
                <div className="mb-6">
                  <h3 className="font-arabic text-sm font-semibold text-primary mb-3">التصنيف والنوع</h3>
                  <div className="flex flex-col gap-2">
                    {categories.map((cat) => (
                      <button
                        key={cat.id}
                        type="button"
                        onClick={() => setSelectedCategory(cat.id)}
                        className={`w-full text-right px-4 py-3 rounded-xl text-xs font-semibold transition-all font-arabic flex items-center justify-between ${
                          selectedCategory === cat.id
                            ? "bg-primary text-white shadow-sm"
                            : "bg-[#FBF6F4] text-foreground border border-border/50"
                        }`}
                      >
                        <span>{cat.label}</span>
                        {selectedCategory === cat.id && <Check className="w-4 h-4 text-white" />}
                      </button>
                    ))}
                  </div>
                </div>

                {/* Price Filter */}
                <div className="mb-6">
                  <h3 className="font-arabic text-sm font-semibold text-primary mb-3">نطاق السعر</h3>
                  <div className="grid grid-cols-2 gap-2">
                    {[
                      { id: "all", label: "كل الأسعار" },
                      { id: "under-15", label: "أقل من 15 ر.ع" },
                      { id: "15-20", label: "15 - 20 ر.ع" },
                      { id: "over-20", label: "أكثر من 20 ر.ع" },
                    ].map((p) => (
                      <button
                        key={p.id}
                        type="button"
                        onClick={() => setPriceFilter(p.id as PriceFilter)}
                        className={`p-3 rounded-xl text-xs font-semibold text-center transition-all font-arabic ${
                          priceFilter === p.id
                            ? "bg-primary text-white"
                            : "bg-[#FBF6F4] text-foreground/80 border border-border/50"
                        }`}
                      >
                        {p.label}
                      </button>
                    ))}
                  </div>
                </div>
              </div>

              <button
                type="button"
                onClick={() => setShowFilters(false)}
                className="w-full bg-primary text-white py-3.5 rounded-full text-sm font-bold font-arabic shadow-md"
              >
                تطبيق ({filteredProducts.length} باقة)
              </button>
            </div>
          </div>
        )}

        {/* Product Grid */}
        {filteredProducts.length === 0 ? (
          <div className="text-center py-24 bg-[#FBF6F4] rounded-3xl p-8 border border-border/60">
            <div className="w-16 h-16 rounded-full bg-[#EFD9E8] flex items-center justify-center mx-auto mb-4 text-primary">
              <ShoppingBag className="w-8 h-8" />
            </div>
            <h3 className="font-arabic text-xl font-bold text-foreground mb-2">ما لقينا باقة بهالمواصفات</h3>
            <p className="text-sm text-muted-foreground mb-6 font-arabic">جرب غير خيارات الفلتر أو ابحث بكلمة ثانية</p>
            <button
              type="button"
              onClick={() => {
                setSelectedCategory("all")
                setPriceFilter("all")
                setSearchQuery("")
              }}
              className="bg-primary text-white text-xs font-semibold px-6 py-3 rounded-full font-arabic hover:bg-primary/90 transition-all shadow-md"
            >
              عرض جميع الباقات
            </button>
          </div>
        ) : (
          <div
            ref={gridRef}
            className={`grid grid-cols-2 ${
              gridColumns === 3 ? "md:grid-cols-3" : "md:grid-cols-3 lg:grid-cols-4"
            } gap-4 sm:gap-6`}
          >
            {filteredProducts.map((product, index) => (
              <ShopProductCard
                key={product.id}
                product={product}
                index={index}
                isVisible={isVisible}
                onQuickAdd={(name) => {
                  setAddedToast(name)
                  setTimeout(() => setAddedToast(null), 3000)
                }}
              />
            ))}
          </div>
        )}

        {/* Bottom Trust & Reassurance Banner (Inspired by Bloomthis & Nasmma Values) */}
        <div className="mt-20 pt-12 border-t border-border/60">
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 text-center">
            
            <div className="bg-[#FBF6F4] p-6 rounded-2xl border border-[#F0E4EC] flex flex-col items-center">
              <div className="w-12 h-12 rounded-full bg-[#EFD9E8] text-primary flex items-center justify-center mb-3">
                <Truck className="w-5 h-5" />
              </div>
              <h4 className="font-arabic text-base font-bold text-foreground mb-1">توصيل سريع ومضمون</h4>
              <p className="text-xs text-muted-foreground font-light font-arabic leading-relaxed">
                تغليف حماية متين يضمن وصول الوردة بنفس هيئتها وجمالها للباب.
              </p>
            </div>

            <div className="bg-[#FBF6F4] p-6 rounded-2xl border border-[#F0E4EC] flex flex-col items-center">
              <div className="w-12 h-12 rounded-full bg-[#EFD9E8] text-primary flex items-center justify-center mb-3">
                <Gift className="w-5 h-5" />
              </div>
              <h4 className="font-arabic text-base font-bold text-foreground mb-1">تغليف إهداء فاخر مجاني</h4>
              <p className="text-xs text-muted-foreground font-light font-arabic leading-relaxed">
                كل باقة تجي مع كرت نسمة الأنيق جاهز لكتابة رسالتك الخاصة للغالي.
              </p>
            </div>

            <div className="bg-[#FBF6F4] p-6 rounded-2xl border border-[#F0E4EC] flex flex-col items-center">
              <div className="w-12 h-12 rounded-full bg-[#EFD9E8] text-primary flex items-center justify-center mb-3">
                <ShieldCheck className="w-5 h-5" />
              </div>
              <h4 className="font-arabic text-base font-bold text-foreground mb-1">ورد مخملي لا يذبل</h4>
              <p className="text-xs text-muted-foreground font-light font-arabic leading-relaxed">
                صنع يدوي متقن من خيوط الغليون الفاخرة ليدوم سنين طويلة ويشهد على الذكرى.
              </p>
            </div>

            <div className="bg-[#FBF6F4] p-6 rounded-2xl border border-[#F0E4EC] flex flex-col items-center">
              <div className="w-12 h-12 rounded-full bg-[#EFD9E8] text-primary flex items-center justify-center mb-3">
                <CreditCard className="w-5 h-5" />
              </div>
              <h4 className="font-arabic text-base font-bold text-foreground mb-1">دفع آمن وتقسيط ميسر</h4>
              <p className="text-xs text-muted-foreground font-light font-arabic leading-relaxed">
                مدى، أبل باي، فيزا، مع إمكانية التقسيط المريح عبر تابي وتمارا.
              </p>
            </div>

          </div>
        </div>

      </div>

      <Footer />
    </main>
  )
}

function ShopProductCard({
  product,
  index,
  isVisible,
  onQuickAdd
}: {
  product: Product
  index: number
  isVisible: boolean
  onQuickAdd: (name: string) => void
}) {
  const [imageLoaded, setImageLoaded] = useState(false)
  const [activeImageIndex, setActiveImageIndex] = useState(0)
  const { addItem, setIsOpen, isPending } = useCart()

  const allImages = useMemo(() => {
    if (product.images && product.images.length > 0) return product.images
    return [product.image || "/placeholder.svg"]
  }, [product])

  const currentImage = allImages[activeImageIndex] || product.image || "/placeholder.svg"

  const handleQuickAdd = (e: React.MouseEvent) => {
    e.preventDefault()
    e.stopPropagation()
    if (product.variantId) {
      addItem(product.variantId, 1)
      setIsOpen(true)
      onQuickAdd(product.name)
    }
  }

  return (
    <div
      className={`group flex flex-col bg-card rounded-2xl sm:rounded-3xl overflow-hidden nasmma-card-shadow border border-border/50 hover:border-primary/30 transition-all duration-500 ${
        isVisible ? "opacity-100 translate-y-0" : "opacity-0 translate-y-4"
      }`}
      style={{ transitionDelay: `${index * 40}ms` }}
    >
      {/* Image Container */}
      <div className="relative aspect-[4/5] bg-[#FBF6F4] overflow-hidden">
        <Link href={`/product/${product.id}`} className="block w-full h-full">
          <Image
            src={currentImage}
            alt={product.name}
            fill
            sizes="(max-width: 640px) 50vw, (max-width: 1024px) 33vw, 25vw"
            className={`object-cover transition-transform duration-700 group-hover:scale-105 ${
              imageLoaded ? "opacity-100" : "opacity-0"
            }`}
            onLoad={() => setImageLoaded(true)}
          />
        </Link>

        {/* Badge */}
        {product.badge && (
          <div className="absolute top-2.5 right-2.5 sm:top-3.5 sm:right-3.5 z-10">
            <span
              className={`px-2.5 py-1 rounded-full text-[10px] sm:text-xs font-bold tracking-wide shadow-sm font-arabic ${
                product.badge === "Sale"
                  ? "bg-destructive text-white"
                  : product.badge === "New"
                  ? "bg-[#EFD9E8] text-primary border border-primary/20"
                  : "bg-primary text-white"
              }`}
            >
              {product.badge === "Sale" && "خصم خاص"}
              {product.badge === "New" && "جديد نسمة"}
              {product.badge === "Bestseller" && "الأكثر طلباً"}
            </span>
          </div>
        )}

        {/* Quick Add Floating Button (Bottom Left in RTL, Bloomthis Style) */}
        <button
          type="button"
          onClick={handleQuickAdd}
          disabled={isPending || !product.availableForSale}
          className="absolute bottom-2.5 left-2.5 sm:bottom-3.5 sm:left-3.5 z-10 w-9 h-9 sm:w-11 sm:h-11 rounded-full bg-white text-primary shadow-lg flex items-center justify-center transition-all duration-300 hover:bg-primary hover:text-white active:scale-90 border border-[#F0E4EC]"
          aria-label="إضافة سريعة للسلة"
          title="إضافة سريعة للسلة"
        >
          <Plus className="w-4 h-4 sm:w-5 sm:h-5 transition-transform group-hover:rotate-90" />
        </button>

        {/* Mobile / Desktop Thumbnail Swatches if product has multiple images */}
        {allImages.length > 1 && (
          <div className="absolute bottom-2.5 right-2.5 sm:bottom-3.5 sm:right-3.5 flex items-center gap-1 bg-black/40 backdrop-blur-md px-1.5 py-1 rounded-full z-10">
            {allImages.map((img, i) => (
              <button
                key={img}
                type="button"
                onClick={(e) => {
                  e.preventDefault()
                  e.stopPropagation()
                  setActiveImageIndex(i)
                }}
                className={`w-2 h-2 sm:w-2.5 sm:h-2.5 rounded-full transition-all ${
                  activeImageIndex === i ? "bg-white scale-125" : "bg-white/50 hover:bg-white/80"
                }`}
                aria-label={`عرض الصورة ${i + 1}`}
              />
            ))}
          </div>
        )}
      </div>

      {/* Info Section */}
      <div className="p-3.5 sm:p-5 flex flex-col flex-1 justify-between text-right">
        <div>
          {/* Star Ratings (Bloomthis style) */}
          <div className="flex items-center gap-1 mb-1.5">
            <div className="flex items-center text-amber-500">
              {[...Array(5)].map((_, i) => (
                <Star key={i} className="w-3 h-3 fill-amber-400 text-amber-400" />
              ))}
            </div>
            <span className="text-[10px] text-muted-foreground font-arabic">
              5.0 ({80 + (index * 13) % 45} تقييم)
            </span>
          </div>

          {/* Product Name */}
          <Link href={`/product/${product.id}`}>
            <h3 className="font-arabic text-sm sm:text-base text-foreground font-bold mb-1 group-hover:text-primary transition-colors line-clamp-1">
              {product.name}
            </h3>
          </Link>

          {/* Description */}
          <p className="text-[11px] sm:text-xs text-muted-foreground mb-3 line-clamp-2 leading-relaxed font-light font-arabic">
            {product.description}
          </p>
        </div>

        {/* Price & Action */}
        <div className="pt-2 border-t border-border/40 flex items-center justify-between">
          <div className="flex items-center gap-1.5">
            <span className="text-sm sm:text-base font-bold text-primary">
              {product.price} ر.ع
            </span>
            {product.originalPrice && (
              <span className="text-[10px] sm:text-xs text-muted-foreground line-through">
                {product.originalPrice} ر.ع
              </span>
            )}
          </div>

          <Link
            href={`/product/${product.id}`}
            className="text-[11px] font-semibold text-primary/80 hover:text-primary font-arabic flex items-center gap-0.5"
          >
            <span>التفاصيل</span>
            <ArrowLeft className="w-3 h-3" />
          </Link>
        </div>
      </div>
    </div>
  )
}
