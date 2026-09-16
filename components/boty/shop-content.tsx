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
  ArrowLeft,
  Flame,
  RotateCcw,
  Tag
} from "lucide-react"
import { Header } from "@/components/boty/header"
import { Footer } from "@/components/boty/footer"
import { useCart } from "@/components/boty/cart-context"
import type { Product } from "@/lib/shopify"

type SortOption = "popular" | "newest" | "price-asc" | "price-desc" | "rating-desc"
type PriceFilter = "all" | "under-15" | "15-20" | "over-20"

const OCCASION_FILTERS = [
  { id: "all", label: "جميع المناسبات" },
  { id: "عيد ميلاد", label: "عيد ميلاد 🎂" },
  { id: "زفاف", label: "زفاف وملكة 💍" },
  { id: "تخرج ونجاح", label: "تخرج ونجاح 🎓" },
  { id: "مسكة عروس", label: "مسكة عروس 👰" },
  { id: "حب وذكرى سنوية", label: "حب وذكرى سنوية ❤️" },
  { id: "شكر وامتنان", label: "شكر وامتنان 🌸" },
  { id: "اعتذار", label: "اعتذار وتقدير 🕊️" },
  { id: "منزل جديد", label: "منزل ومكتب جديد 🏡" },
]

const COLOR_FILTERS = [
  { id: "all", label: "جميع الألوان", hex: "transparent", border: "transparent" },
  { id: "وردي", label: "وردي", hex: "#F4A6C5", border: "#E285AA" },
  { id: "أبيض", label: "أبيض", hex: "#FFFFFF", border: "#D1D5DB" },
  { id: "بنفسجي", label: "بنفسجي", hex: "#8A2BE2", border: "#6A1BB2" },
  { id: "أزرق", label: "أزرق", hex: "#4A90E2", border: "#2E75C7" },
  { id: "أصفر", label: "أصفر", hex: "#F5A623", border: "#D68D14" },
  { id: "أحمر", label: "أحمر / توتي", hex: "#D0021B", border: "#A50013" },
]

export function ShopContent({ products }: { products: Product[] }) {
  const { addItem, setIsOpen: openCartDrawer } = useCart()

  // Filter States
  const [selectedCategory, setSelectedCategory] = useState("all")
  const [selectedOccasion, setSelectedOccasion] = useState("all")
  const [selectedColor, setSelectedColor] = useState("all")
  const [priceFilter, setPriceFilter] = useState<PriceFilter>("all")
  const [sortOption, setSortOption] = useState<SortOption>("popular")
  const [searchQuery, setSearchQuery] = useState("")
  const [gridColumns, setGridColumns] = useState<3 | 4>(4)
  const [showMobileFilters, setShowMobileFilters] = useState(false)
  const [isVisible, setIsVisible] = useState(true)
  const [addedToast, setAddedToast] = useState<string | null>(null)

  // Categories list extracted from products
  const categories = useMemo(() => {
    const types = Array.from(new Set(products.map((p) => p.productType).filter(Boolean)))
    return [
      { id: "all", label: "جميع الباقات والأنواع" },
      ...types.map((type) => ({ id: type, label: type }))
    ]
  }, [products])

  // Active filters count
  const activeFiltersCount = useMemo(() => {
    let count = 0
    if (selectedCategory !== "all") count++
    if (selectedOccasion !== "all") count++
    if (selectedColor !== "all") count++
    if (priceFilter !== "all") count++
    if (searchQuery.trim()) count++
    return count
  }, [selectedCategory, selectedOccasion, selectedColor, priceFilter, searchQuery])

  const handleResetFilters = () => {
    setSelectedCategory("all")
    setSelectedOccasion("all")
    setSelectedColor("all")
    setPriceFilter("all")
    setSearchQuery("")
  }

  // Filtered and sorted products
  const filteredProducts = useMemo(() => {
    return products
      .filter((product) => {
        // 1. Category / Product Type Filter
        if (selectedCategory !== "all" && product.productType !== selectedCategory) {
          return false
        }

        // 2. Occasion Filter
        if (selectedOccasion !== "all") {
          const occs = product.occasions || []
          const matchesOccasion = occs.some((o) => o.includes(selectedOccasion) || selectedOccasion.includes(o))
          const matchesNameOrDesc = (product.name + " " + product.description).includes(selectedOccasion)
          if (!matchesOccasion && !matchesNameOrDesc) {
            return false
          }
        }

        // 3. Color Filter
        if (selectedColor !== "all") {
          const cols = product.colors || []
          const matchesColor = cols.some((c) => c.includes(selectedColor) || selectedColor.includes(c))
          const matchesNameOrDesc = (product.name + " " + product.description).includes(selectedColor)
          if (!matchesColor && !matchesNameOrDesc) {
            return false
          }
        }

        // 4. Price Filter (OMR)
        if (priceFilter === "under-15" && product.price >= 15) return false
        if (priceFilter === "15-20" && (product.price < 15 || product.price > 20)) return false
        if (priceFilter === "over-20" && product.price <= 20) return false

        // 5. Search Query
        if (searchQuery.trim()) {
          const q = searchQuery.toLowerCase().trim()
          const matchName = product.name.toLowerCase().includes(q)
          const matchDesc = product.description.toLowerCase().includes(q)
          const matchType = product.productType?.toLowerCase().includes(q)
          const matchOcc = product.occasions?.some((o) => o.toLowerCase().includes(q))
          const matchCol = product.colors?.some((c) => c.toLowerCase().includes(q))
          if (!matchName && !matchDesc && !matchType && !matchOcc && !matchCol) return false
        }

        return true
      })
      .sort((a, b) => {
        if (sortOption === "price-asc") return a.price - b.price
        if (sortOption === "price-desc") return b.price - a.price
        if (sortOption === "newest") {
          if (a.createdAt && b.createdAt) {
            return new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
          }
          return (b.badge === "New" ? 1 : 0) - (a.badge === "New" ? 1 : 0)
        }
        if (sortOption === "rating-desc") {
          return (b.rating || 4.9) - (a.rating || 4.9)
        }
        // Default: Popular / Best Seller
        const aScore = (b.salesCount || 300) + (b.badge === "Bestseller" ? 200 : 0)
        const bScore = (a.salesCount || 300) + (a.badge === "Bestseller" ? 200 : 0)
        return aScore - bScore
      })
  }, [products, selectedCategory, selectedOccasion, selectedColor, priceFilter, sortOption, searchQuery])

  useEffect(() => {
    setIsVisible(false)
    const timer = setTimeout(() => setIsVisible(true), 50)
    return () => clearTimeout(timer)
  }, [selectedCategory, selectedOccasion, selectedColor, priceFilter, sortOption, searchQuery])

  const handleQuickAdd = (e: React.MouseEvent, product: Product) => {
    e.preventDefault()
    e.stopPropagation()
    addItem({
      id: product.id,
      handle: product.id,
      variantId: product.variantId,
      name: product.name,
      price: product.price,
      currencyCode: product.currencyCode || "OMR",
      image: product.image,
      quantity: 1,
    })
    setAddedToast(product.name)
    setTimeout(() => setAddedToast(null), 3000)
    openCartDrawer(true)
  }

  return (
    <main className="min-h-screen bg-[#FBF6F4] text-foreground" dir="rtl">
      <Header />

      {/* Added Toast Notification */}
      {addedToast && (
        <div className="fixed bottom-6 left-1/2 -translate-x-1/2 z-50 bg-[#5B1657] text-white px-5 py-3 rounded-full shadow-2xl flex items-center gap-3 animate-blur-in text-sm font-arabic border border-white/20">
          <Check className="w-4 h-4 text-[#EFD9E8]" />
          <span>تمت إضافة <strong>{addedToast}</strong> إلى سلتك بكل حب!</span>
        </div>
      )}

      {/* Top Banner / Breadcrumb & Header */}
      <section className="pt-32 pb-8 bg-white border-b border-[#F0E4EC]">
        <div className="max-w-7xl mx-auto px-6 lg:px-8">
          {/* Breadcrumb */}
          <nav className="flex items-center gap-2 text-xs text-muted-foreground mb-4 font-arabic">
            <Link href="/" className="hover:text-primary transition-colors">الرئيسية</Link>
            <span>/</span>
            <span className="text-primary font-bold">متجر باقات نسمة</span>
          </nav>

          <div className="flex flex-col md:flex-row md:items-end justify-between gap-6">
            <div>
              <div className="inline-flex items-center gap-2 px-3.5 py-1 rounded-full bg-[#EFD9E8]/40 border border-[#F0E4EC] text-primary text-xs font-semibold mb-3">
                <Sparkles className="w-3.5 h-3.5 text-primary" />
                <span className="font-arabic">ورد مخملي أصلي يدوم لسنوات · خيوط الغليون الفاخرة</span>
              </div>
              <h1 className="font-arabic text-3xl sm:text-4xl lg:text-5xl text-foreground font-bold leading-tight">
                مـتـجـر بـاقـات نَـسْـمَـة
              </h1>
              <p className="text-xs sm:text-sm text-muted-foreground mt-2 font-arabic max-w-2xl font-light leading-relaxed">
                اكتشف تشكيلة أزهار مخملية فريدة منسوجة يدوياً حبة حبة، مصممة لتحفظ أصدق المشاعر وتخلد أجمل الذكريات في كل مناسبة.
              </p>
            </div>

            {/* Quick Stats Badges */}
            <div className="flex items-center gap-3 flex-wrap">
              <div className="bg-[#FBF6F4] px-4 py-2 rounded-2xl border border-border/80 flex items-center gap-2 text-xs font-arabic">
                <Flame className="w-4 h-4 text-amber-500" />
                <span>أكثر من <strong>2,400+</strong> باقة أُهديت بالخليج</span>
              </div>
              <div className="bg-[#FBF6F4] px-4 py-2 rounded-2xl border border-border/80 flex items-center gap-2 text-xs font-arabic">
                <Star className="w-4 h-4 fill-amber-400 text-amber-400" />
                <span>تقييم <strong>4.9 / 5</strong> من العملاء</span>
              </div>
            </div>
          </div>

          {/* Quick Mobile / Horizontal Occasion Chips */}
          <div className="mt-8 pt-6 border-t border-[#F0E4EC] overflow-x-auto scrollbar-none flex items-center gap-2 pb-2">
            <span className="text-xs font-bold text-foreground font-arabic shrink-0 ml-2">
              المناسبة:
            </span>
            {OCCASION_FILTERS.map((occ) => {
              const active = selectedOccasion === occ.id
              return (
                <button
                  type="button"
                  key={occ.id}
                  onClick={() => setSelectedOccasion(occ.id)}
                  className={`px-4 py-2 rounded-full text-xs font-arabic whitespace-nowrap transition-all cursor-pointer ${
                    active
                      ? "bg-primary text-white font-bold shadow-md shadow-primary/20 scale-105"
                      : "bg-[#FBF6F4] text-foreground/80 hover:bg-white border border-border hover:border-primary/40"
                  }`}
                >
                  {occ.label}
                </button>
              )
            })}
          </div>
        </div>
      </section>

      {/* Main Content Area */}
      <section className="py-10 max-w-7xl mx-auto px-6 lg:px-8">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
          
          {/* DESKTOP SIDEBAR FILTERS (4 Cols on lg) */}
          <aside className="hidden lg:block lg:col-span-3 bg-white rounded-3xl p-6 border border-[#F0E4EC] shadow-sm sticky top-24 space-y-6">
            <div className="flex items-center justify-between pb-4 border-b border-[#F0E4EC]">
              <div className="flex items-center gap-2 text-foreground font-bold text-sm font-arabic">
                <SlidersHorizontal className="w-4 h-4 text-primary" />
                <span>فلترة المنتجات</span>
              </div>
              {activeFiltersCount > 0 && (
                <button
                  type="button"
                  onClick={handleResetFilters}
                  className="text-xs text-primary hover:underline font-arabic flex items-center gap-1 cursor-pointer"
                >
                  <RotateCcw className="w-3 h-3" />
                  <span>مسح الكل ({activeFiltersCount})</span>
                </button>
              )}
            </div>

            {/* 1. Search Filter */}
            <div>
              <label className="block text-xs font-bold text-foreground mb-2 font-arabic">
                بحث بالاسم أو الكلمات:
              </label>
              <div className="relative">
                <input
                  type="text"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  placeholder="ابحث عن باقة، لون، وردة..."
                  className="w-full bg-[#FBF6F4] pr-9 pl-4 py-2.5 rounded-2xl text-xs border border-border focus:outline-none focus:border-primary font-arabic"
                />
                <Search className="w-4 h-4 text-muted-foreground absolute right-3 top-1/2 -translate-y-1/2" />
                {searchQuery && (
                  <button
                    type="button"
                    onClick={() => setSearchQuery("")}
                    className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground"
                  >
                    <X className="w-3.5 h-3.5" />
                  </button>
                )}
              </div>
            </div>

            {/* 2. Product Type / Category Filter */}
            <div>
              <label className="block text-xs font-bold text-foreground mb-2 font-arabic">
                النوع / التصنيف:
              </label>
              <div className="space-y-1.5">
                {categories.map((cat) => {
                  const isChecked = selectedCategory === cat.id
                  const count = cat.id === "all" ? products.length : products.filter((p) => p.productType === cat.id).length
                  return (
                    <button
                      type="button"
                      key={cat.id}
                      onClick={() => setSelectedCategory(cat.id)}
                      className={`w-full text-right px-3 py-2 rounded-xl text-xs font-arabic transition-all flex items-center justify-between cursor-pointer ${
                        isChecked
                          ? "bg-[#EFD9E8]/50 text-primary font-bold border border-primary/20"
                          : "text-foreground/80 hover:bg-[#FBF6F4]"
                      }`}
                    >
                      <span>{cat.label}</span>
                      <span className="text-[10px] bg-neutral-100 text-neutral-600 px-2 py-0.5 rounded-full font-mono">
                        {count}
                      </span>
                    </button>
                  )
                })}
              </div>
            </div>

            {/* 3. Color Filter */}
            <div>
              <label className="block text-xs font-bold text-foreground mb-2 font-arabic">
                اللون الأساسي:
              </label>
              <div className="flex flex-wrap gap-2">
                {COLOR_FILTERS.map((col) => {
                  const isChecked = selectedColor === col.id
                  return (
                    <button
                      type="button"
                      key={col.id}
                      onClick={() => setSelectedColor(col.id)}
                      className={`px-3 py-1.5 rounded-full text-xs font-arabic transition-all flex items-center gap-1.5 border cursor-pointer ${
                        isChecked
                          ? "bg-[#5B1657] text-white border-[#5B1657] font-bold shadow-xs scale-105"
                          : "bg-[#FBF6F4] text-foreground/80 border-border hover:border-primary/40"
                      }`}
                    >
                      {col.id !== "all" && (
                        <span
                          className="w-3 h-3 rounded-full border border-black/10 inline-block shrink-0"
                          style={{ backgroundColor: col.hex }}
                        />
                      )}
                      <span>{col.label}</span>
                    </button>
                  )
                })}
              </div>
            </div>

            {/* 4. Price / Budget Range Filter */}
            <div>
              <label className="block text-xs font-bold text-foreground mb-2 font-arabic">
                الميزانية والنطاق السعري:
              </label>
              <div className="space-y-1.5">
                {[
                  { id: "all", label: "جميع الأسعار" },
                  { id: "under-15", label: "أقل من 15 ر.ع (اقتصادي)" },
                  { id: "15-20", label: "من 15 إلى 20 ر.ع (الأكثر طلباً)" },
                  { id: "over-20", label: "أكثر من 20 ر.ع (فاخر وملكي)" },
                ].map((item) => {
                  const isChecked = priceFilter === item.id
                  return (
                    <button
                      type="button"
                      key={item.id}
                      onClick={() => setPriceFilter(item.id as PriceFilter)}
                      className={`w-full text-right px-3 py-2 rounded-xl text-xs font-arabic transition-all flex items-center justify-between cursor-pointer ${
                        isChecked
                          ? "bg-[#EFD9E8]/50 text-primary font-bold border border-primary/20"
                          : "text-foreground/80 hover:bg-[#FBF6F4]"
                      }`}
                    >
                      <span>{item.label}</span>
                      {isChecked && <Check className="w-3.5 h-3.5 text-primary" />}
                    </button>
                  )
                })}
              </div>
            </div>

            {/* Guarantee Box in Sidebar */}
            <div className="pt-4 border-t border-[#F0E4EC] text-center bg-[#FBF6F4] p-4 rounded-2xl">
              <ShieldCheck className="w-6 h-6 text-primary mx-auto mb-1.5" />
              <h5 className="text-xs font-bold text-foreground font-arabic">ضمان نسمة الذهبي</h5>
              <p className="text-[11px] text-muted-foreground font-arabic font-light mt-1">
                تغليف صلب مقاوم للصدمات + كرت إهداء مجاني بختم الشمع مع كل باقة.
              </p>
            </div>
          </aside>

          {/* MAIN PRODUCTS GRID AREA (9 Cols on lg) */}
          <div className="lg:col-span-9 space-y-6">
            
            {/* Top Controls Bar (Sort, Search on Mobile, Count, Grid toggle) */}
            <div className="bg-white rounded-3xl p-4 sm:p-5 border border-[#F0E4EC] shadow-sm flex flex-col sm:flex-row items-center justify-between gap-4">
              
              {/* Results Count & Filter Toggle Button on Mobile */}
              <div className="flex items-center gap-3 w-full sm:w-auto justify-between sm:justify-start">
                <button
                  type="button"
                  onClick={() => setShowMobileFilters(true)}
                  className="lg:hidden bg-[#EFD9E8]/40 hover:bg-[#EFD9E8] text-primary border border-[#F0E4EC] px-4 py-2 rounded-2xl text-xs font-bold font-arabic flex items-center gap-2 transition-all cursor-pointer"
                >
                  <SlidersHorizontal className="w-3.5 h-3.5" />
                  <span>الفلاتر ({activeFiltersCount})</span>
                </button>

                <div className="text-xs text-foreground/80 font-arabic">
                  عرض <strong className="text-primary font-bold font-mono">{filteredProducts.length}</strong> من أصل <span className="font-mono">{products.length}</span> باقة
                </div>
              </div>

              {/* Sort Selector & Grid Toggle */}
              <div className="flex items-center gap-3 w-full sm:w-auto justify-end">
                <div className="flex items-center gap-2">
                  <span className="text-xs text-muted-foreground font-arabic hidden sm:inline">الترتيب حسب:</span>
                  <div className="relative">
                    <select
                      value={sortOption}
                      onChange={(e) => setSortOption(e.target.value as SortOption)}
                      className="bg-[#FBF6F4] text-foreground text-xs font-arabic font-bold py-2.5 pr-8 pl-4 rounded-2xl border border-border focus:outline-none focus:border-primary cursor-pointer"
                    >
                      <option value="popular">🔥 الأكثر مبيعاً والأعلى طلباً</option>
                      <option value="newest">✨ الأحدث إضافـة</option>
                      <option value="price-asc">💰 السعر: من الأقل للأعلى</option>
                      <option value="price-desc">💎 السعر: من الأعلى للأقل</option>
                      <option value="rating-desc">⭐ الأعلى تقييماً (4.9+)</option>
                    </select>
                    <ArrowUpDown className="w-3.5 h-3.5 text-muted-foreground absolute right-2.5 top-1/2 -translate-y-1/2 pointer-events-none" />
                  </div>
                </div>

                {/* Grid View Toggles (Desktop only) */}
                <div className="hidden md:flex items-center gap-1 border border-border p-1 rounded-2xl bg-[#FBF6F4]">
                  <button
                    type="button"
                    onClick={() => setGridColumns(3)}
                    className={`p-1.5 rounded-xl transition-all ${
                      gridColumns === 3 ? "bg-white text-primary shadow-xs" : "text-muted-foreground hover:text-foreground"
                    }`}
                    title="عرض 3 أعمدة"
                  >
                    <LayoutGrid className="w-4 h-4" />
                  </button>
                  <button
                    type="button"
                    onClick={() => setGridColumns(4)}
                    className={`p-1.5 rounded-xl transition-all ${
                      gridColumns === 4 ? "bg-white text-primary shadow-xs" : "text-muted-foreground hover:text-foreground"
                    }`}
                    title="عرض 4 أعمدة"
                  >
                    <Grid3X3 className="w-4 h-4" />
                  </button>
                </div>
              </div>
            </div>

            {/* Active Filters Pill Bar */}
            {activeFiltersCount > 0 && (
              <div className="flex items-center gap-2 flex-wrap text-xs font-arabic">
                <span className="text-muted-foreground font-light">الفلاتر المطبقة:</span>
                {selectedCategory !== "all" && (
                  <span className="bg-white border border-[#F0E4EC] px-3 py-1 rounded-full flex items-center gap-1.5 text-primary font-semibold">
                    <span>{selectedCategory}</span>
                    <button type="button" onClick={() => setSelectedCategory("all")}><X className="w-3 h-3" /></button>
                  </span>
                )}
                {selectedOccasion !== "all" && (
                  <span className="bg-white border border-[#F0E4EC] px-3 py-1 rounded-full flex items-center gap-1.5 text-primary font-semibold">
                    <span>{selectedOccasion}</span>
                    <button type="button" onClick={() => setSelectedOccasion("all")}><X className="w-3 h-3" /></button>
                  </span>
                )}
                {selectedColor !== "all" && (
                  <span className="bg-white border border-[#F0E4EC] px-3 py-1 rounded-full flex items-center gap-1.5 text-primary font-semibold">
                    <span>لون: {selectedColor}</span>
                    <button type="button" onClick={() => setSelectedColor("all")}><X className="w-3 h-3" /></button>
                  </span>
                )}
                {priceFilter !== "all" && (
                  <span className="bg-white border border-[#F0E4EC] px-3 py-1 rounded-full flex items-center gap-1.5 text-primary font-semibold">
                    <span>
                      {priceFilter === "under-15" ? "أقل من 15 ر.ع" : priceFilter === "15-20" ? "15 - 20 ر.ع" : "أكثر من 20 ر.ع"}
                    </span>
                    <button type="button" onClick={() => setPriceFilter("all")}><X className="w-3 h-3" /></button>
                  </span>
                )}
                {searchQuery && (
                  <span className="bg-white border border-[#F0E4EC] px-3 py-1 rounded-full flex items-center gap-1.5 text-primary font-semibold">
                    <span>بحث: "{searchQuery}"</span>
                    <button type="button" onClick={() => setSearchQuery("")}><X className="w-3 h-3" /></button>
                  </span>
                )}
                <button
                  type="button"
                  onClick={handleResetFilters}
                  className="text-primary hover:underline mr-2 text-[11px] font-bold cursor-pointer"
                >
                  مسح جميع الفلاتر
                </button>
              </div>
            )}

            {/* Products Grid */}
            {filteredProducts.length === 0 ? (
              <div className="bg-white rounded-3xl p-12 text-center border border-[#F0E4EC] shadow-sm space-y-4 my-8">
                <div className="w-16 h-16 rounded-full bg-[#EFD9E8]/50 text-primary flex items-center justify-center mx-auto">
                  <Search className="w-7 h-7" />
                </div>
                <h3 className="font-arabic text-lg font-bold text-foreground">
                  لم نجد باقات تطابق خيارات البحث الحالية
                </h3>
                <p className="text-xs text-muted-foreground font-arabic max-w-md mx-auto font-light">
                  جرب تغيير خيارات المناسبة، الميزانية أو مسح الفلاتر لاستعراض جميع تشكيلات الورود المخملية المتاحة.
                </p>
                <button
                  type="button"
                  onClick={handleResetFilters}
                  className="bg-primary text-white text-xs font-bold font-arabic px-6 py-2.5 rounded-full hover:bg-primary/90 transition-all cursor-pointer shadow-sm"
                >
                  عرض جميع الباقات
                </button>
              </div>
            ) : (
              <div 
                className={`grid grid-cols-2 ${
                  gridColumns === 3 ? "md:grid-cols-3" : "md:grid-cols-3 xl:grid-cols-4"
                } gap-4 sm:gap-6 transition-opacity duration-300 ${isVisible ? "opacity-100" : "opacity-0"}`}
              >
                {filteredProducts.map((product) => {
                  const rating = product.rating || 4.9
                  const reviewsCount = product.reviewsCount || 45
                  const salesCount = product.salesCount || 380

                  return (
                    <div
                      key={product.id}
                      className="group bg-white rounded-3xl overflow-hidden border border-[#F0E4EC] hover:border-primary/40 transition-all duration-300 nasmma-card-shadow flex flex-col justify-between"
                    >
                      <div>
                        {/* Image Container */}
                        <div className="relative aspect-square overflow-hidden bg-[#FBF6F4]">
                          <Link href={`/product/${product.id}`} className="block w-full h-full">
                            <Image
                              src={product.image}
                              alt={product.name}
                              fill
                              sizes="(max-width: 640px) 50vw, (max-width: 1024px) 33vw, 25vw"
                              className="object-cover transition-transform duration-500 group-hover:scale-105"
                            />
                          </Link>

                          {/* Top Badges */}
                          <div className="absolute top-2.5 right-2.5 flex flex-col gap-1 z-10 pointer-events-none">
                            {product.badge === "Bestseller" && (
                              <span className="bg-[#5B1657] text-white text-[10px] font-bold px-2.5 py-0.5 rounded-full font-arabic shadow-sm">
                                الأكثر مبيعاً 🔥
                              </span>
                            )}
                            {product.badge === "New" && (
                              <span className="bg-emerald-600 text-white text-[10px] font-bold px-2.5 py-0.5 rounded-full font-arabic shadow-sm">
                                جديد نسمة ✨
                              </span>
                            )}
                            {product.badge === "Sale" && (
                              <span className="bg-rose-600 text-white text-[10px] font-bold px-2.5 py-0.5 rounded-full font-arabic shadow-sm">
                                عرض خاص 🏷️
                              </span>
                            )}
                          </div>

                          {/* Sales Count Pill */}
                          <div className="absolute bottom-2.5 right-2.5 bg-black/60 backdrop-blur-md text-white text-[9px] sm:text-[10px] px-2 py-0.5 rounded-full font-arabic flex items-center gap-1">
                            <Flame className="w-3 h-3 text-amber-400" />
                            <span>بيع {salesCount} هذا الشهر</span>
                          </div>

                          {/* Quick Add Button on Hover */}
                          <button
                            type="button"
                            onClick={(e) => handleQuickAdd(e, product)}
                            className="absolute bottom-2.5 left-2.5 w-8 h-8 sm:w-9 sm:h-9 bg-white/95 hover:bg-primary text-foreground hover:text-white rounded-full shadow-md flex items-center justify-center transition-all cursor-pointer opacity-90 hover:opacity-100 hover:scale-110"
                            title="إضافة سريعة للسلة"
                          >
                            <Plus className="w-4 h-4" />
                          </button>
                        </div>

                        {/* Product Info */}
                        <div className="p-4 sm:p-5 text-right">
                          {/* Rating & Product Type */}
                          <div className="flex items-center justify-between text-[11px] text-muted-foreground mb-1 font-arabic">
                            <span className="truncate max-w-[120px] font-medium text-primary">
                              {product.productType || "باقات الحب"}
                            </span>
                            <div className="flex items-center gap-1 font-bold text-foreground shrink-0">
                              <Star className="w-3 h-3 fill-amber-400 text-amber-400" />
                              <span className="font-mono">{rating}</span>
                              <span className="text-[10px] text-muted-foreground font-light">({reviewsCount})</span>
                            </div>
                          </div>

                          {/* Name */}
                          <Link href={`/product/${product.id}`} className="block">
                            <h3 className="font-arabic font-bold text-sm sm:text-base text-foreground group-hover:text-primary transition-colors line-clamp-1 mb-1.5">
                              {product.name}
                            </h3>
                          </Link>

                          {/* Short Description */}
                          <p className="text-[11px] sm:text-xs text-muted-foreground font-arabic font-light line-clamp-2 leading-relaxed mb-3">
                            {product.description}
                          </p>
                        </div>
                      </div>

                      {/* Card Footer: Price & Action */}
                      <div className="p-4 sm:p-5 pt-0 border-t border-border/40 mt-auto">
                        <div className="flex items-center justify-between pt-3">
                          <div>
                            <div className="flex items-baseline gap-1.5">
                              <span className="text-base sm:text-lg font-bold text-primary font-mono">
                                {product.price.toFixed(1)}
                              </span>
                              <span className="text-[11px] font-arabic text-foreground font-bold">
                                {product.currencyCode || "OMR"}
                              </span>
                            </div>
                            {product.originalPrice && product.originalPrice > product.price && (
                              <span className="text-[11px] text-muted-foreground line-through font-mono">
                                {product.originalPrice.toFixed(1)} ر.ع
                              </span>
                            )}
                          </div>

                          <Link
                            href={`/product/${product.id}`}
                            className="inline-flex items-center gap-1 bg-[#FBF6F4] hover:bg-primary text-primary hover:text-white px-3 py-1.5 rounded-full text-xs font-bold font-arabic transition-all border border-[#F0E4EC]"
                          >
                            <span>تفاصيل</span>
                            <ArrowLeft className="w-3 h-3" />
                          </Link>
                        </div>
                      </div>
                    </div>
                  )
                })}
              </div>
            )}
          </div>
        </div>
      </section>

      {/* MOBILE FILTERS DRAWER / MODAL */}
      {showMobileFilters && (
        <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-sm lg:hidden flex justify-end">
          <div className="w-full max-w-md bg-white h-full p-6 overflow-y-auto animate-scale-fade-in flex flex-col justify-between text-right">
            <div>
              <div className="flex items-center justify-between pb-4 border-b border-[#F0E4EC] mb-6">
                <div className="flex items-center gap-2 text-foreground font-bold text-base font-arabic">
                  <SlidersHorizontal className="w-4 h-4 text-primary" />
                  <span>فلترة وترتيب الباقات</span>
                </div>
                <button
                  type="button"
                  onClick={() => setShowMobileFilters(false)}
                  className="p-2 text-muted-foreground hover:text-foreground rounded-full"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>

              {/* Mobile Occasions */}
              <div className="mb-6">
                <label className="block text-xs font-bold text-foreground mb-2 font-arabic">
                  المناسبة:
                </label>
                <div className="flex flex-wrap gap-1.5">
                  {OCCASION_FILTERS.map((occ) => (
                    <button
                      type="button"
                      key={occ.id}
                      onClick={() => setSelectedOccasion(occ.id)}
                      className={`px-3 py-1.5 rounded-full text-xs font-arabic transition-all ${
                        selectedOccasion === occ.id
                          ? "bg-primary text-white font-bold"
                          : "bg-[#FBF6F4] text-foreground border border-border"
                      }`}
                    >
                      {occ.label}
                    </button>
                  ))}
                </div>
              </div>

              {/* Mobile Categories */}
              <div className="mb-6">
                <label className="block text-xs font-bold text-foreground mb-2 font-arabic">
                  التصنيف / النوع:
                </label>
                <div className="space-y-1.5">
                  {categories.map((cat) => (
                    <button
                      type="button"
                      key={cat.id}
                      onClick={() => setSelectedCategory(cat.id)}
                      className={`w-full text-right px-3 py-2 rounded-xl text-xs font-arabic transition-all flex items-center justify-between ${
                        selectedCategory === cat.id
                          ? "bg-[#EFD9E8]/50 text-primary font-bold border border-primary/20"
                          : "text-foreground/80 hover:bg-[#FBF6F4]"
                      }`}
                    >
                      <span>{cat.label}</span>
                      {selectedCategory === cat.id && <Check className="w-4 h-4 text-primary" />}
                    </button>
                  ))}
                </div>
              </div>

              {/* Mobile Colors */}
              <div className="mb-6">
                <label className="block text-xs font-bold text-foreground mb-2 font-arabic">
                  اللون:
                </label>
                <div className="flex flex-wrap gap-2">
                  {COLOR_FILTERS.map((col) => (
                    <button
                      type="button"
                      key={col.id}
                      onClick={() => setSelectedColor(col.id)}
                      className={`px-3 py-1.5 rounded-full text-xs font-arabic transition-all flex items-center gap-1.5 border ${
                        selectedColor === col.id
                          ? "bg-[#5B1657] text-white border-[#5B1657] font-bold"
                          : "bg-[#FBF6F4] text-foreground border-border"
                      }`}
                    >
                      {col.id !== "all" && (
                        <span
                          className="w-2.5 h-2.5 rounded-full border border-black/10 inline-block"
                          style={{ backgroundColor: col.hex }}
                        />
                      )}
                      <span>{col.label}</span>
                    </button>
                  ))}
                </div>
              </div>

              {/* Mobile Price */}
              <div className="mb-6">
                <label className="block text-xs font-bold text-foreground mb-2 font-arabic">
                  الميزانية:
                </label>
                <div className="space-y-1.5">
                  {[
                    { id: "all", label: "جميع الأسعار" },
                    { id: "under-15", label: "أقل من 15 ر.ع" },
                    { id: "15-20", label: "15 - 20 ر.ع" },
                    { id: "over-20", label: "أكثر من 20 ر.ع" },
                  ].map((item) => (
                    <button
                      type="button"
                      key={item.id}
                      onClick={() => setPriceFilter(item.id as PriceFilter)}
                      className={`w-full text-right px-3 py-2 rounded-xl text-xs font-arabic flex items-center justify-between ${
                        priceFilter === item.id ? "bg-[#EFD9E8]/50 text-primary font-bold" : "text-foreground/80 hover:bg-[#FBF6F4]"
                      }`}
                    >
                      <span>{item.label}</span>
                      {priceFilter === item.id && <Check className="w-3.5 h-3.5 text-primary" />}
                    </button>
                  ))}
                </div>
              </div>
            </div>

            {/* Bottom Actions */}
            <div className="pt-4 border-t border-[#F0E4EC] space-y-2">
              <button
                type="button"
                onClick={() => setShowMobileFilters(false)}
                className="w-full bg-primary text-white py-3 rounded-2xl text-xs font-bold font-arabic shadow-md"
              >
                تطبيق الفلاتر (عرض {filteredProducts.length} باقة)
              </button>
              <button
                type="button"
                onClick={handleResetFilters}
                className="w-full bg-[#FBF6F4] text-muted-foreground py-2.5 rounded-2xl text-xs font-arabic"
              >
                مسح جميع الفلاتر
              </button>
            </div>
          </div>
        </div>
      )}

      <Footer />
    </main>
  )
}
