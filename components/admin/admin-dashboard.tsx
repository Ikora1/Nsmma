"use client"

import { useState } from "react"
import { useRouter } from "next/navigation"
import Image from "next/image"
import Link from "next/link"
import { 
  Package, 
  Sparkles, 
  Tag, 
  ShieldCheck, 
  LogOut, 
  Plus, 
  Edit, 
  Trash2, 
  ExternalLink, 
  Check, 
  X, 
  Search, 
  Eye,
  Copy,
  AlertCircle,
  Save,
  Loader2,
  Gift,
  DollarSign,
  TrendingUp,
  Sliders,
  ShoppingBag,
  Phone,
  MapPin,
  Calendar,
  User,
  MessageCircle,
  CheckCircle2,
  Clock,
  Truck,
  RefreshCw,
  Mail,
  FileText
} from "lucide-react"
import type { Product } from "@/lib/shopify"
import type { StoreOffer } from "@/lib/store-db"
import type { StoreOrder } from "@/lib/orders-db"
import type { CustomRequest, CustomRequestStatus } from "@/lib/custom-requests-db"

type TabType = "orders" | "custom_requests" | "products" | "categories" | "offers" | "account"

const PRESET_IMAGES = [
  "/images/products/product-1.jpg",
  "/images/products/product-2.jpg",
  "/images/products/product-3.jpg",
  "/images/products/product-4.jpg",
  "/images/products/product-5.jpg",
  "/images/products/product-6.jpg",
  "/images/products/product-7.jpg",
  "/images/products/product-8.jpg",
]

const ALL_OCCASIONS = [
  "عيد ميلاد",
  "زفاف",
  "تخرج ونجاح",
  "مسكة عروس",
  "ملكة وعقد قران",
  "حب وذكرى سنوية",
  "شكر وامتنان",
  "اعتذار",
  "منزل جديد",
]

const ALL_COLORS = [
  { name: "وردي", bg: "#F4A6C5" },
  { name: "أبيض", bg: "#FFFFFF" },
  { name: "بنفسجي", bg: "#8A2BE2" },
  { name: "أزرق", bg: "#4A90E2" },
  { name: "أصفر", bg: "#F5A623" },
  { name: "أحمر", bg: "#D0021B" },
]

export function AdminDashboard({
  initialProducts,
  initialOffer,
  initialCategories = ["باقات الحب والعهود", "مسكات ليلة العمر", "مزهريات الدوام والمكتب", "توزيعات وبوكسات هدايا"],
  initialOrders = [],
  initialCustomRequests = [],
  adminEmail,
}: {
  initialProducts: Product[]
  initialOffer: StoreOffer
  initialCategories?: string[]
  initialOrders?: StoreOrder[]
  initialCustomRequests?: CustomRequest[]
  adminEmail: string
}) {
  const router = useRouter()
  const [activeTab, setActiveTab] = useState<TabType>("orders")
  const [products, setProducts] = useState<Product[]>(initialProducts)
  const [categories, setCategories] = useState<string[]>(initialCategories)
  const [newCategoryName, setNewCategoryName] = useState("")
  const [isAddingCategory, setIsAddingCategory] = useState(false)
  const [offer, setOffer] = useState<StoreOffer>(initialOffer)
  const [orders, setOrders] = useState<StoreOrder[]>(initialOrders)
  const [orderSearch, setOrderSearch] = useState("")
  const [statusFilter, setStatusFilter] = useState<string>("all")
  const [govFilter, setGovFilter] = useState<string>("all")
  const [isRefreshingOrders, setIsRefreshingOrders] = useState(false)
  const [updatingOrderId, setUpdatingOrderId] = useState<string | null>(null)
  const [toastMessage, setToastMessage] = useState<string | null>(null)

  // Custom Requests State
  const [customRequests, setCustomRequests] = useState<CustomRequest[]>(initialCustomRequests)
  const [customReqSearch, setCustomReqSearch] = useState("")
  const [customReqStatusFilter, setCustomReqStatusFilter] = useState<string>("all")
  const [isRefreshingCustomReqs, setIsRefreshingCustomReqs] = useState(false)
  const [updatingCustomReqId, setUpdatingCustomReqId] = useState<string | null>(null)
  const [selectedTranscriptReq, setSelectedTranscriptReq] = useState<CustomRequest | null>(null)

  const handleRefreshCustomRequests = async () => {
    setIsRefreshingCustomReqs(true)
    try {
      const res = await fetch("/api/admin/custom-requests")
      const data = await res.json()
      if (data.requests) {
        setCustomRequests(data.requests)
        showToast("تم تحديث قائمة الطلبات المخصصة بنجاح")
      }
    } catch {
      showToast("فشل تحديث الطلبات المخصصة")
    } finally {
      setIsRefreshingCustomReqs(false)
    }
  }

  const handleUpdateCustomReqStatus = async (id: string, status: CustomRequestStatus) => {
    setUpdatingCustomReqId(id)
    try {
      const res = await fetch("/api/admin/custom-requests", {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ id, status }),
      })
      const data = await res.json()
      if (data.success && data.requests) {
        setCustomRequests(data.requests)
        showToast("تم تحديث حالة الطلب المخصص بنجاح")
      } else {
        showToast(data.error || "فشل التحديث")
      }
    } catch {
      showToast("حدث خطأ أثناء تحديث الطلب")
    } finally {
      setUpdatingCustomReqId(null)
    }
  }

  const handleDeleteCustomRequest = async (id: string, name: string) => {
    if (!confirm(`هل أنت متأكد من حذف طلب العميل "${name}"؟`)) return
    try {
      const res = await fetch(`/api/admin/custom-requests?id=${encodeURIComponent(id)}`, {
        method: "DELETE",
      })
      const data = await res.json()
      if (data.success && data.requests) {
        setCustomRequests(data.requests)
        showToast("تم حذف الطلب بنجاح")
      } else {
        showToast(data.error || "تعذر الحذف")
      }
    } catch {
      showToast("حدث خطأ أثناء الحذف")
    }
  }

  const handleAddCategory = async (e: React.FormEvent) => {
    e.preventDefault()
    const trimmed = newCategoryName.trim()
    if (!trimmed) return
    if (categories.includes(trimmed)) {
      showToast("هذا النوع / التصنيف موجود بالفعل")
      return
    }

    setIsAddingCategory(true)
    try {
      const res = await fetch("/api/admin/categories", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ category: trimmed }),
      })
      const data = await res.json()
      if (data.success && data.categories) {
        setCategories(data.categories)
        setNewCategoryName("")
        showToast(`تمت إضافة التصنيف "${trimmed}" بنجاح`)
      } else {
        showToast(data.error || "فشل إضافة التصنيف")
      }
    } catch {
      showToast("حدث خطأ أثناء الاتصال بالخادم")
    } finally {
      setIsAddingCategory(false)
    }
  }

  const handleDeleteCategory = async (catName: string) => {
    if (!confirm(`هل أنت متأكد من حذف نوع "${catName}"؟`)) return
    try {
      const res = await fetch(`/api/admin/categories?name=${encodeURIComponent(catName)}`, {
        method: "DELETE",
      })
      const data = await res.json()
      if (data.success && data.categories) {
        setCategories(data.categories)
        showToast(`تم حذف نوع "${catName}"`)
      } else {
        showToast(data.error || "فشل الحذف")
      }
    } catch {
      showToast("حدث خطأ أثناء حذف التصنيف")
    }
  }

  const handleRefreshOrders = async () => {
    setIsRefreshingOrders(true)
    try {
      const res = await fetch("/api/admin/orders")
      const data = await res.json()
      if (data.orders) {
        setOrders(data.orders)
        showToast("تم تحديث قائمة الطلبات بنجاح")
      }
    } catch {
      showToast("فشل تحديث الطلبات")
    } finally {
      setIsRefreshingOrders(false)
    }
  }

  const handleUpdateDeliveryStatus = async (orderId: string, deliveryStatus: StoreOrder["deliveryStatus"]) => {
    setUpdatingOrderId(orderId)
    try {
      const res = await fetch("/api/admin/orders", {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ orderId, deliveryStatus }),
      })
      const data = await res.json()
      if (data.success) {
        setOrders((prev) =>
          prev.map((ord) => (ord.orderId === orderId || ord.id === orderId ? { ...ord, deliveryStatus } : ord))
        )
        showToast("تم تحديث حالة التوصيل بنجاح")
      } else {
        showToast(data.error || "فشل التحديث")
      }
    } catch {
      showToast("حدث خطأ أثناء تحديث حالة الطلب")
    } finally {
      setUpdatingOrderId(null)
    }
  }
  
  // Product Form Modal State
  const [isProductModalOpen, setIsProductModalOpen] = useState(false)
  const [editingProduct, setEditingProduct] = useState<Product | null>(null)
  const [customTypeInput, setCustomTypeInput] = useState("")
  const [showCustomTypeInput, setShowCustomTypeInput] = useState(false)
  const [formData, setFormData] = useState<{
    id: string
    name: string
    description: string
    price: string
    originalPrice: string
    productType: string
    badge: string
    image: string
    images: string[]
    availableForSale: boolean
    occasions: string[]
    colors: string[]
    salesCount?: number
    rating?: number
  }>({
    id: "",
    name: "",
    description: "",
    price: "",
    originalPrice: "",
    productType: categories[0] || "باقات الحب والعهود",
    badge: "New",
    image: PRESET_IMAGES[0],
    images: [PRESET_IMAGES[0]],
    availableForSale: true,
    occasions: ["عيد ميلاد", "حب وذكرى سنوية"],
    colors: ["وردي"],
    salesCount: 350,
    rating: 5.0,
  })
  const [isSavingProduct, setIsSavingProduct] = useState(false)

  // Offer Form State
  const [offerForm, setOfferForm] = useState<StoreOffer>(initialOffer)
  const [isSavingOffer, setIsSavingOffer] = useState(false)

  const showToast = (msg: string) => {
    setToastMessage(msg)
    setTimeout(() => setToastMessage(null), 3500)
  }

  const handleLogout = async () => {
    try {
      await fetch("/api/admin/auth/logout", { method: "POST" })
      router.push("/")
      router.refresh()
    } catch {
      router.push("/")
    }
  }

  const handleOpenNewProduct = () => {
    setEditingProduct(null)
    setShowCustomTypeInput(false)
    setCustomTypeInput("")
    setFormData({
      id: `nasmma-${Date.now()}`,
      name: "",
      description: "باقة ورد مخملي مشغول يدوياً من خيوط الغليون الفاخرة لتدوم لسنوات.",
      price: "18.5",
      originalPrice: "",
      productType: categories[0] || "باقات الحب والعهود",
      badge: "New",
      image: PRESET_IMAGES[0],
      images: [PRESET_IMAGES[0]],
      availableForSale: true,
      occasions: ["عيد ميلاد", "حب وذكرى سنوية"],
      colors: ["وردي"],
      salesCount: 350,
      rating: 5.0,
    })
    setIsProductModalOpen(true)
  }

  const handleOpenEditProduct = (p: Product) => {
    setEditingProduct(p)
    setShowCustomTypeInput(false)
    setCustomTypeInput("")
    setFormData({
      id: p.id,
      name: p.name,
      description: p.description,
      price: p.price.toString(),
      originalPrice: p.originalPrice ? p.originalPrice.toString() : "",
      productType: p.productType || categories[0] || "باقات الحب والعهود",
      badge: p.badge || "",
      image: p.image || PRESET_IMAGES[0],
      images: p.images && p.images.length > 0 ? p.images : [p.image || PRESET_IMAGES[0]],
      availableForSale: p.availableForSale,
      occasions: p.occasions || [],
      colors: p.colors || [],
      salesCount: p.salesCount || 350,
      rating: p.rating || 5.0,
    })
    setIsProductModalOpen(true)
  }

  const handleSaveProduct = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!formData.name || !formData.price) {
      showToast("يرجى ملء اسم الباقة والسعر")
      return
    }

    setIsSavingProduct(true)
    try {
      if (editingProduct) {
        // Update
        const res = await fetch(`/api/admin/products/${editingProduct.id}`, {
          method: "PUT",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(formData),
        })
        const data = await res.json()
        if (data.success) {
          setProducts((prev) => prev.map((item) => (item.id === editingProduct.id ? data.product : item)))
          showToast(`تم تحديث باقة "${formData.name}" بنجاح`)
          setIsProductModalOpen(false)
        } else {
          showToast(data.error || "فشل التحديث")
        }
      } else {
        // Create
        const res = await fetch("/api/admin/products", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(formData),
        })
        const data = await res.json()
        if (data.success) {
          setProducts((prev) => [data.product, ...prev])
          showToast(`تمت إضافة باقة "${formData.name}" بنجاح`)
          setIsProductModalOpen(false)
        } else {
          showToast(data.error || "فشل إنشاء الباقة")
        }
      }
    } catch {
      showToast("حدث خطأ أثناء حفظ الباقة")
    } finally {
      setIsSavingProduct(false)
    }
  }

  const handleDeleteProduct = async (id: string, name: string) => {
    if (!confirm(`هل أنت متأكد من رغبتك في حذف باقة "${name}"؟`)) return
    try {
      const res = await fetch(`/api/admin/products/${id}`, { method: "DELETE" })
      const data = await res.json()
      if (data.success) {
        setProducts((prev) => prev.filter((p) => p.id !== id))
        showToast(`تم حذف باقة "${name}"`)
      } else {
        showToast(data.error || "تعذر الحذف")
      }
    } catch {
      showToast("حدث خطأ أثناء الحذف")
    }
  }

  const handleSaveOffer = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsSavingOffer(true)
    try {
      const res = await fetch("/api/admin/offer", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(offerForm),
      })
      const data = await res.json()
      if (data.success) {
        setOffer(data.offer)
        showToast("تم تحديث إعدادات العرض والخصم بنجاح")
      } else {
        showToast(data.error || "فشل حفظ العرض")
      }
    } catch {
      showToast("حدث خطأ أثناء حفظ العرض")
    } finally {
      setIsSavingOffer(false)
    }
  }

  return (
    <div className="min-h-screen bg-[#FBF6F4]">
      {/* Toast Notification */}
      {toastMessage && (
        <div className="fixed bottom-6 left-1/2 -translate-x-1/2 z-50 bg-[#5B1657] text-white px-6 py-3.5 rounded-full shadow-2xl flex items-center gap-3 animate-blur-in text-sm font-arabic border border-white/20">
          <Check className="w-4 h-4 text-[#EFD9E8]" />
          <span>{toastMessage}</span>
        </div>
      )}

      {/* Top Navbar */}
      <header className="bg-white border-b border-[#F0E4EC] sticky top-0 z-40">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-18 flex items-center justify-between">
          <div className="flex items-center gap-4">
            <Link href="/" target="_blank" className="flex items-center gap-3">
              <Image
                src="/images/logo/nasmma-logo.png"
                alt="Nasmma"
                width={110}
                height={38}
                className="h-9 w-auto object-contain"
              />
            </Link>
            <span className="bg-primary/10 text-primary text-xs font-bold px-3 py-1 rounded-full font-arabic">
              لوحـة تـحـكـم الـمـسـؤول
            </span>
          </div>

          <div className="flex items-center gap-3">
            <Link
              href="/shop"
              target="_blank"
              className="inline-flex items-center gap-1.5 text-xs font-semibold text-foreground/80 hover:text-primary bg-[#FBF6F4] hover:bg-white border border-[#F0E4EC] px-3.5 py-2 rounded-full font-arabic transition-all"
            >
              <span>معاينة المتجر</span>
              <ExternalLink className="w-3.5 h-3.5" />
            </Link>

            <button
              type="button"
              onClick={handleLogout}
              className="inline-flex items-center gap-1.5 text-xs font-semibold text-destructive hover:bg-destructive/10 px-3.5 py-2 rounded-full font-arabic transition-all"
            >
              <LogOut className="w-3.5 h-3.5" />
              <span>تسجيل الخروج</span>
            </button>
          </div>
        </div>
      </header>

      {/* Sub-Header Tabs */}
      <div className="bg-white border-b border-[#F0E4EC] shadow-xs">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <nav className="flex gap-4 sm:gap-8 overflow-x-auto">
            <button
              type="button"
              onClick={() => setActiveTab("orders")}
              className={`py-4 px-2 text-xs sm:text-sm font-semibold font-arabic border-b-2 transition-all flex items-center gap-2 whitespace-nowrap ${
                activeTab === "orders"
                  ? "border-primary text-primary"
                  : "border-transparent text-muted-foreground hover:text-foreground"
              }`}
            >
              <ShoppingBag className="w-4 h-4" />
              <span>طلبات الشراء والعملاء ({orders.length})</span>
              {orders.filter((o) => o.deliveryStatus === "processing").length > 0 && (
                <span className="bg-primary/10 text-primary text-[10px] px-2 py-0.5 rounded-full font-bold">
                  {orders.filter((o) => o.deliveryStatus === "processing").length} قيد التجهيز
                </span>
              )}
            </button>

            <button
              type="button"
              onClick={() => setActiveTab("custom_requests")}
              className={`py-4 px-2 text-xs sm:text-sm font-semibold font-arabic border-b-2 transition-all flex items-center gap-2 whitespace-nowrap ${
                activeTab === "custom_requests"
                  ? "border-primary text-primary"
                  : "border-transparent text-muted-foreground hover:text-foreground"
              }`}
            >
              <MessageCircle className="w-4 h-4" />
              <span>الطلبات المخصصة والمحادثات ({customRequests.length})</span>
              {customRequests.filter((r) => r.status === "new").length > 0 && (
                <span className="bg-amber-100 text-amber-700 text-[10px] px-2 py-0.5 rounded-full font-bold animate-pulse">
                  {customRequests.filter((r) => r.status === "new").length} جديد
                </span>
              )}
            </button>

            <button
              type="button"
              onClick={() => setActiveTab("products")}
              className={`py-4 px-2 text-xs sm:text-sm font-semibold font-arabic border-b-2 transition-all flex items-center gap-2 whitespace-nowrap ${
                activeTab === "products"
                  ? "border-primary text-primary"
                  : "border-transparent text-muted-foreground hover:text-foreground"
              }`}
            >
              <Package className="w-4 h-4" />
              <span>إدارة الباقات والورود ({products.length})</span>
            </button>

            <button
              type="button"
              onClick={() => setActiveTab("categories")}
              className={`py-4 px-2 text-xs sm:text-sm font-semibold font-arabic border-b-2 transition-all flex items-center gap-2 whitespace-nowrap ${
                activeTab === "categories"
                  ? "border-primary text-primary"
                  : "border-transparent text-muted-foreground hover:text-foreground"
              }`}
            >
              <Tag className="w-4 h-4" />
              <span>أنواع وتصنيفات الزهور ({categories.length})</span>
            </button>

            <button
              type="button"
              onClick={() => setActiveTab("offers")}
              className={`py-4 px-2 text-xs sm:text-sm font-semibold font-arabic border-b-2 transition-all flex items-center gap-2 ${
                activeTab === "offers"
                  ? "border-primary text-primary"
                  : "border-transparent text-muted-foreground hover:text-foreground"
              }`}
            >
              <Gift className="w-4 h-4" />
              <span>العروض والخصومات ({offer.enabled ? "نشط" : "معطل"})</span>
            </button>

            <button
              type="button"
              onClick={() => setActiveTab("account")}
              className={`py-4 px-2 text-xs sm:text-sm font-semibold font-arabic border-b-2 transition-all flex items-center gap-2 ${
                activeTab === "account"
                  ? "border-primary text-primary"
                  : "border-transparent text-muted-foreground hover:text-foreground"
              }`}
            >
              <ShieldCheck className="w-4 h-4" />
              <span>حساب المشرف والأمان</span>
            </button>
          </nav>
        </div>
      </div>

      {/* Main Container */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">

        {/* TAB: CUSTOM REQUESTS & AI CHAT LOGS */}
        {activeTab === "custom_requests" && (
          <div className="space-y-6 animate-scale-fade-in">
            {/* Top Stat Cards */}
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
              <div className="bg-white p-5 rounded-3xl border border-[#F0E4EC] shadow-xs">
                <div className="flex items-center justify-between mb-2">
                  <span className="text-xs font-semibold text-muted-foreground font-arabic">إجمالي الطلبات المخصصة</span>
                  <div className="w-8 h-8 rounded-full bg-primary/10 flex items-center justify-center text-primary">
                    <MessageCircle className="w-4 h-4" />
                  </div>
                </div>
                <div className="text-2xl font-bold text-foreground font-arabic">
                  {customRequests.length} <span className="text-sm font-normal text-muted-foreground">طلب</span>
                </div>
                <span className="text-[11px] text-muted-foreground font-arabic mt-1 block">
                  عبر المساعد الذكي نسمة
                </span>
              </div>

              <div className="bg-white p-5 rounded-3xl border border-[#F0E4EC] shadow-xs">
                <div className="flex items-center justify-between mb-2">
                  <span className="text-xs font-semibold text-muted-foreground font-arabic">طلبات جديدة بانتظار التواصل</span>
                  <div className="w-8 h-8 rounded-full bg-amber-100 flex items-center justify-center text-amber-700">
                    <Clock className="w-4 h-4" />
                  </div>
                </div>
                <div className="text-2xl font-bold text-amber-700 font-arabic">
                  {customRequests.filter((r) => r.status === "new").length} <span className="text-sm font-normal text-muted-foreground">طلب جديد</span>
                </div>
                <span className="text-[11px] text-amber-600 font-arabic mt-1 block">
                  تحتاج مراجعة وتأكيد بالواتساب
                </span>
              </div>

              <div className="bg-white p-5 rounded-3xl border border-[#F0E4EC] shadow-xs">
                <div className="flex items-center justify-between mb-2">
                  <span className="text-xs font-semibold text-muted-foreground font-arabic">تم التواصل والتنسيق</span>
                  <div className="w-8 h-8 rounded-full bg-blue-100 flex items-center justify-center text-blue-700">
                    <Phone className="w-4 h-4" />
                  </div>
                </div>
                <div className="text-2xl font-bold text-blue-700 font-arabic">
                  {customRequests.filter((r) => r.status === "contacted").length} <span className="text-sm font-normal text-muted-foreground">طلب</span>
                </div>
                <span className="text-[11px] text-blue-600 font-arabic mt-1 block">
                  قيد تجهيز وتنسيق الباقة
                </span>
              </div>

              <div className="bg-white p-5 rounded-3xl border border-[#F0E4EC] shadow-xs">
                <div className="flex items-center justify-between mb-2">
                  <span className="text-xs font-semibold text-muted-foreground font-arabic">طلبات مكتملة</span>
                  <div className="w-8 h-8 rounded-full bg-emerald-100 flex items-center justify-center text-emerald-700">
                    <CheckCircle2 className="w-4 h-4" />
                  </div>
                </div>
                <div className="text-2xl font-bold text-emerald-700 font-arabic">
                  {customRequests.filter((r) => r.status === "completed").length} <span className="text-sm font-normal text-muted-foreground">طلب مكتمل</span>
                </div>
                <span className="text-[11px] text-emerald-600 font-arabic mt-1 block">
                  تم تأكيدها وتسليمها بنجاح
                </span>
              </div>
            </div>

            {/* Filter & Search Bar */}
            <div className="bg-white p-5 rounded-3xl border border-[#F0E4EC] shadow-xs flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-4">
              <div className="flex-1 relative">
                <Search className="w-4 h-4 absolute right-3.5 top-1/2 -translate-y-1/2 text-muted-foreground" />
                <input
                  type="text"
                  value={customReqSearch}
                  onChange={(e) => setCustomReqSearch(e.target.value)}
                  placeholder="ابحث باسم العميل، رقم الهاتف، المناسبة، أو رمز الطلب..."
                  className="w-full pr-10 pl-4 py-2.5 rounded-full border border-border bg-[#FBF9F5] focus:outline-none focus:ring-2 focus:ring-primary/20 text-xs font-arabic text-right"
                />
              </div>

              <div className="flex items-center gap-2.5">
                <select
                  value={customReqStatusFilter}
                  onChange={(e) => setCustomReqStatusFilter(e.target.value)}
                  className="px-3.5 py-2.5 rounded-full border border-border bg-[#FBF9F5] text-xs font-arabic focus:outline-none"
                >
                  <option value="all">كل الحالات</option>
                  <option value="new">🟡 جديد (بانتظار التواصل)</option>
                  <option value="contacted">🔵 تم التواصل والتنسيق</option>
                  <option value="completed">🟢 مكتمل</option>
                  <option value="cancelled">🔴 ملغي</option>
                </select>

                <button
                  type="button"
                  onClick={handleRefreshCustomRequests}
                  disabled={isRefreshingCustomReqs}
                  className="p-2.5 rounded-full border border-border bg-[#FBF9F5] hover:bg-white text-muted-foreground hover:text-primary transition disabled:opacity-50 cursor-pointer"
                  title="تحديث قائمة الطلبات المخصصة"
                >
                  <RefreshCw className={`w-4 h-4 ${isRefreshingCustomReqs ? "animate-spin" : ""}`} />
                </button>
              </div>
            </div>

            {/* Custom Requests List */}
            {customRequests.filter((req) => {
              const matchesSearch =
                customReqSearch === "" ||
                req.customerName.toLowerCase().includes(customReqSearch.toLowerCase()) ||
                req.customerPhone.includes(customReqSearch) ||
                req.occasion.toLowerCase().includes(customReqSearch.toLowerCase()) ||
                req.id.toLowerCase().includes(customReqSearch.toLowerCase()) ||
                req.city.toLowerCase().includes(customReqSearch.toLowerCase())
              const matchesStatus = customReqStatusFilter === "all" || req.status === customReqStatusFilter
              return matchesSearch && matchesStatus
            }).length === 0 ? (
              <div className="bg-white rounded-3xl p-12 text-center border border-[#F0E4EC] space-y-3">
                <div className="w-16 h-16 rounded-full bg-[#EFD9E8] flex items-center justify-center text-primary mx-auto">
                  <MessageCircle className="w-7 h-7" />
                </div>
                <h3 className="text-base font-bold text-foreground font-arabic">لا توجد طلبات مخصصة مطابقة للبحث</h3>
                <p className="text-xs text-muted-foreground font-arabic">
                  تظهر هنا تلقائياً كافة الطلبات المخصصة وملخصات المحادثات التي يجريها العملاء مع مساعد نسمة الذكي.
                </p>
              </div>
            ) : (
              <div className="space-y-4">
                {customRequests
                  .filter((req) => {
                    const matchesSearch =
                      customReqSearch === "" ||
                      req.customerName.toLowerCase().includes(customReqSearch.toLowerCase()) ||
                      req.customerPhone.includes(customReqSearch) ||
                      req.occasion.toLowerCase().includes(customReqSearch.toLowerCase()) ||
                      req.id.toLowerCase().includes(customReqSearch.toLowerCase()) ||
                      req.city.toLowerCase().includes(customReqSearch.toLowerCase())
                    const matchesStatus = customReqStatusFilter === "all" || req.status === customReqStatusFilter
                    return matchesSearch && matchesStatus
                  })
                  .map((req) => {
                    const phoneClean = req.customerPhone.replace(/\D/g, "")
                    const waLink = `https://wa.me/${phoneClean}?text=${encodeURIComponent(
                      `مرحباً ${req.customerName}، معك فريق متجر نَـسْـمَـة للزهور المخملية 🌷 بخصوص طلبك المخصص رقم (${req.id}) لمناسبة "${req.occasion}". يسعدنا تأكيد التفاصيل والبدء بالتنسيق!`
                    )}`

                    return (
                      <div
                        key={req.id}
                        className="bg-white rounded-3xl border border-[#F0E4EC] shadow-xs overflow-hidden hover:shadow-md transition-shadow"
                      >
                        {/* Header Bar */}
                        <div className="bg-[#FAF6F4] px-6 py-4 border-b border-[#F0E4EC] flex flex-wrap items-center justify-between gap-3">
                          <div className="flex items-center gap-3">
                            <span className="font-mono text-xs font-bold text-primary bg-white px-3 py-1 rounded-full border border-primary/20">
                              {req.id}
                            </span>
                            <span className="text-xs text-muted-foreground font-arabic flex items-center gap-1.5">
                              <Calendar className="w-3.5 h-3.5" />
                              {new Date(req.createdAt).toLocaleDateString("ar-OM", {
                                year: "numeric",
                                month: "short",
                                day: "numeric",
                                hour: "2-digit",
                                minute: "2-digit",
                              })}
                            </span>
                          </div>

                          <div className="flex items-center gap-2.5">
                            {/* Status Selector */}
                            <select
                              value={req.status || "new"}
                              disabled={updatingCustomReqId === req.id}
                              onChange={(e) =>
                                handleUpdateCustomReqStatus(req.id, e.target.value as CustomRequestStatus)
                              }
                              className="text-xs font-semibold px-3 py-1 rounded-full border border-border bg-white text-foreground focus:outline-none cursor-pointer"
                            >
                              <option value="new">🟡 جديد (بانتظار التواصل)</option>
                              <option value="contacted">🔵 تم التواصل والتنسيق</option>
                              <option value="completed">🟢 مكتمل بنجاح</option>
                              <option value="cancelled">🔴 ملغي</option>
                            </select>

                            {/* Delete Button */}
                            <button
                              type="button"
                              onClick={() => handleDeleteCustomRequest(req.id, req.customerName)}
                              className="p-1.5 rounded-full hover:bg-destructive/10 text-muted-foreground hover:text-destructive transition cursor-pointer"
                              title="حذف الطلب"
                            >
                              <Trash2 className="w-4 h-4" />
                            </button>
                          </div>
                        </div>

                        {/* Content Grid */}
                        <div className="p-6 space-y-4">
                          <div className="grid grid-cols-1 md:grid-cols-12 gap-6">
                            {/* Left: Customer Info */}
                            <div className="md:col-span-5 space-y-3 border-l-0 md:border-l border-border/40 pl-0 md:pl-6">
                              <h4 className="text-xs font-bold text-foreground font-arabic flex items-center gap-2">
                                <User className="w-4 h-4 text-primary" />
                                <span>بيانات العميل والتواصل</span>
                              </h4>

                              <div className="space-y-1.5 text-xs">
                                <p className="font-semibold text-foreground text-sm">{req.customerName}</p>
                                
                                <div className="flex items-center gap-2 text-muted-foreground pt-1">
                                  <Phone className="w-3.5 h-3.5 text-primary" />
                                  <span dir="ltr" className="font-medium">{req.customerPhone}</span>
                                </div>

                                <div className="flex items-center gap-2 text-muted-foreground">
                                  <MapPin className="w-3.5 h-3.5 text-primary" />
                                  <span>المدينة / العنوان: <strong className="text-foreground">{req.city}</strong></span>
                                </div>
                              </div>

                              {/* Customer Contact Shortcuts */}
                              <div className="flex items-center gap-2 pt-2">
                                {req.customerPhone && req.customerPhone !== "لم يُسجل رقم" && (
                                  <a
                                    href={waLink}
                                    target="_blank"
                                    rel="noopener noreferrer"
                                    className="inline-flex items-center gap-1.5 px-3.5 py-1.5 rounded-full bg-[#25D366] hover:bg-[#20bd5a] text-white text-[11px] font-semibold transition shadow-xs cursor-pointer"
                                  >
                                    <MessageCircle className="w-3.5 h-3.5" />
                                    <span>مراسلة واتساب</span>
                                  </a>
                                )}

                                {req.customerPhone && req.customerPhone !== "لم يُسجل رقم" && (
                                  <a
                                    href={`tel:${req.customerPhone}`}
                                    className="inline-flex items-center gap-1.5 px-3.5 py-1.5 rounded-full bg-muted/60 text-foreground text-[11px] font-semibold hover:bg-muted transition cursor-pointer"
                                  >
                                    <Phone className="w-3.5 h-3.5" />
                                    <span>اتصال</span>
                                  </a>
                                )}
                              </div>
                            </div>

                            {/* Right: Custom Design Specifications */}
                            <div className="md:col-span-7 space-y-3">
                              <h4 className="text-xs font-bold text-foreground font-arabic flex items-center gap-2">
                                <Sparkles className="w-4 h-4 text-primary" />
                                <span>مواصفات وتفاصيل الباقة المخصصة</span>
                              </h4>

                              <div className="grid grid-cols-2 gap-2 text-xs font-arabic">
                                <div className="bg-[#FBF9F5] p-2.5 rounded-xl border border-border/40">
                                  <span className="text-[11px] text-muted-foreground block">المناسبة:</span>
                                  <span className="font-bold text-foreground">{req.occasion}</span>
                                </div>
                                <div className="bg-[#FBF9F5] p-2.5 rounded-xl border border-border/40">
                                  <span className="text-[11px] text-muted-foreground block">نوع التنسيق:</span>
                                  <span className="font-bold text-primary">{req.requestType}</span>
                                </div>
                                <div className="bg-[#FBF9F5] p-2.5 rounded-xl border border-border/40">
                                  <span className="text-[11px] text-muted-foreground block">الألوان المطلوبة:</span>
                                  <span className="font-bold text-foreground">{req.colors}</span>
                                </div>
                                <div className="bg-[#FBF9F5] p-2.5 rounded-xl border border-border/40">
                                  <span className="text-[11px] text-muted-foreground block">الميزانية المقترحة:</span>
                                  <span className="font-bold text-emerald-700">{req.budget}</span>
                                </div>
                              </div>

                              <div className="bg-[#FAF0F5]/60 p-3 rounded-xl border border-[#EFD9E8] flex items-center justify-between text-xs font-arabic">
                                <div>
                                  <span className="text-[11px] text-muted-foreground block">تاريخ الاستلام المرغوب:</span>
                                  <span className="font-bold text-foreground">{req.deliveryDate}</span>
                                </div>

                                <button
                                  type="button"
                                  onClick={() => setSelectedTranscriptReq(req)}
                                  className="inline-flex items-center gap-1.5 bg-[#5B1657] hover:bg-[#7B2874] text-white px-4 py-2 rounded-xl text-xs font-bold transition shadow-xs cursor-pointer"
                                >
                                  <FileText className="w-3.5 h-3.5" />
                                  <span>عرض نص المحادثة والملخص 📜</span>
                                </button>
                              </div>
                            </div>
                          </div>
                        </div>
                      </div>
                    )
                  })}
              </div>
            )}
          </div>
        )}
        
        {/* TAB 0: ORDERS & CUSTOMER MANAGEMENT */}
        {activeTab === "orders" && (
          <div className="space-y-6">
            {/* Top Stat Cards */}
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
              <div className="bg-white p-5 rounded-3xl border border-[#F0E4EC] shadow-xs">
                <div className="flex items-center justify-between mb-2">
                  <span className="text-xs font-semibold text-muted-foreground font-arabic">إجمالي مبيعات عُمان</span>
                  <div className="w-8 h-8 rounded-full bg-primary/10 flex items-center justify-center text-primary">
                    <DollarSign className="w-4 h-4" />
                  </div>
                </div>
                <div className="text-2xl font-bold text-foreground font-arabic">
                  {orders.reduce((acc, o) => acc + (Number(o.amountOmr) || 0), 0).toFixed(1)} <span className="text-sm font-normal text-primary">ر.ع</span>
                </div>
                <span className="text-[11px] text-[#52796F] font-medium font-arabic mt-1 block">
                  محصلة ومؤكدة عبر Stripe
                </span>
              </div>

              <div className="bg-white p-5 rounded-3xl border border-[#F0E4EC] shadow-xs">
                <div className="flex items-center justify-between mb-2">
                  <span className="text-xs font-semibold text-muted-foreground font-arabic">عدد الطلبات الإجمالي</span>
                  <div className="w-8 h-8 rounded-full bg-[#EFD9E8] flex items-center justify-center text-primary">
                    <ShoppingBag className="w-4 h-4" />
                  </div>
                </div>
                <div className="text-2xl font-bold text-foreground font-arabic">
                  {orders.length} <span className="text-sm font-normal text-muted-foreground">طلب</span>
                </div>
                <span className="text-[11px] text-muted-foreground font-arabic mt-1 block">
                  في مختلف محافظات السلطنة
                </span>
              </div>

              <div className="bg-white p-5 rounded-3xl border border-[#F0E4EC] shadow-xs">
                <div className="flex items-center justify-between mb-2">
                  <span className="text-xs font-semibold text-muted-foreground font-arabic">طلبات قيد التجهيز</span>
                  <div className="w-8 h-8 rounded-full bg-amber-100 flex items-center justify-center text-amber-700">
                    <Clock className="w-4 h-4" />
                  </div>
                </div>
                <div className="text-2xl font-bold text-amber-700 font-arabic">
                  {orders.filter((o) => o.deliveryStatus === "processing").length} <span className="text-sm font-normal text-muted-foreground">طلب</span>
                </div>
                <span className="text-[11px] text-amber-600 font-arabic mt-1 block">
                  بانتظار التنسيق وتجهيز كرت الإهداء
                </span>
              </div>

              <div className="bg-white p-5 rounded-3xl border border-[#F0E4EC] shadow-xs">
                <div className="flex items-center justify-between mb-2">
                  <span className="text-xs font-semibold text-muted-foreground font-arabic">طلبات تم تسليمها</span>
                  <div className="w-8 h-8 rounded-full bg-emerald-100 flex items-center justify-center text-emerald-700">
                    <CheckCircle2 className="w-4 h-4" />
                  </div>
                </div>
                <div className="text-2xl font-bold text-emerald-700 font-arabic">
                  {orders.filter((o) => o.deliveryStatus === "delivered").length} <span className="text-sm font-normal text-muted-foreground">طلب</span>
                </div>
                <span className="text-[11px] text-emerald-600 font-arabic mt-1 block">
                  وصلت بنجاح لأصحابها
                </span>
              </div>
            </div>

            {/* Filter & Search Bar */}
            <div className="bg-white p-5 rounded-3xl border border-[#F0E4EC] shadow-xs flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-4">
              <div className="flex-1 relative">
                <Search className="w-4 h-4 absolute right-3.5 top-1/2 -translate-y-1/2 text-muted-foreground" />
                <input
                  type="text"
                  value={orderSearch}
                  onChange={(e) => setOrderSearch(e.target.value)}
                  placeholder="ابحث باسم العميل، رقم الهاتف (+968)، أو رقم الطلب..."
                  className="w-full pr-10 pl-4 py-2.5 rounded-full border border-border bg-[#FBF9F5] focus:outline-none focus:ring-2 focus:ring-primary/20 text-xs font-arabic"
                />
              </div>

              <div className="flex flex-wrap items-center gap-2.5">
                <select
                  value={govFilter}
                  onChange={(e) => setGovFilter(e.target.value)}
                  className="px-3.5 py-2.5 rounded-full border border-border bg-[#FBF9F5] text-xs font-arabic focus:outline-none"
                >
                  <option value="all">كل المحافظات</option>
                  <option value="مسقط">مسقط</option>
                  <option value="ظفار">ظفار</option>
                  <option value="الداخلية">الداخلية</option>
                  <option value="شمال الباطنة">شمال الباطنة</option>
                  <option value="جنوب الباطنة">جنوب الباطنة</option>
                  <option value="شمال الشرقية">شمال الشرقية</option>
                  <option value="جنوب الشرقية">جنوب الشرقية</option>
                  <option value="الظاهرة">الظاهرة</option>
                  <option value="البريمي">البريمي</option>
                  <option value="الوسطى">الوسطى</option>
                  <option value="مسندم">مسندم</option>
                </select>

                <select
                  value={statusFilter}
                  onChange={(e) => setStatusFilter(e.target.value)}
                  className="px-3.5 py-2.5 rounded-full border border-border bg-[#FBF9F5] text-xs font-arabic focus:outline-none"
                >
                  <option value="all">كل الحالات</option>
                  <option value="processing">قيد التجهيز</option>
                  <option value="shipped">خرج للتوصيل</option>
                  <option value="delivered">تم التسليم</option>
                  <option value="cancelled">ملغي</option>
                </select>

                <button
                  type="button"
                  onClick={handleRefreshOrders}
                  disabled={isRefreshingOrders}
                  className="p-2.5 rounded-full border border-border bg-[#FBF9F5] hover:bg-white text-muted-foreground hover:text-primary transition disabled:opacity-50"
                  title="تحديث قائمة الطلبات"
                >
                  <RefreshCw className={`w-4 h-4 ${isRefreshingOrders ? "animate-spin" : ""}`} />
                </button>
              </div>
            </div>

            {/* Orders List */}
            {orders.filter((order) => {
              const matchesSearch =
                orderSearch === "" ||
                order.customerName.toLowerCase().includes(orderSearch.toLowerCase()) ||
                order.customerPhone.includes(orderSearch) ||
                order.orderId.toLowerCase().includes(orderSearch.toLowerCase())
              const matchesGov = govFilter === "all" || order.governorate === govFilter
              const matchesStatus = statusFilter === "all" || order.deliveryStatus === statusFilter
              return matchesSearch && matchesGov && matchesStatus
            }).length === 0 ? (
              <div className="bg-white rounded-3xl p-12 text-center border border-[#F0E4EC] space-y-3">
                <div className="w-16 h-16 rounded-full bg-primary/10 flex items-center justify-center text-primary mx-auto">
                  <ShoppingBag className="w-7 h-7" />
                </div>
                <h3 className="text-base font-bold text-foreground font-arabic">لا توجد طلبات مطابقة للبحث</h3>
                <p className="text-xs text-muted-foreground font-arabic">
                  جرب تغيير خيارات التصفية أو إفراغ خانة البحث لعرض كافة طلبات المتجر.
                </p>
              </div>
            ) : (
              <div className="space-y-4">
                {orders
                  .filter((order) => {
                    const matchesSearch =
                      orderSearch === "" ||
                      order.customerName.toLowerCase().includes(orderSearch.toLowerCase()) ||
                      order.customerPhone.includes(orderSearch) ||
                      order.orderId.toLowerCase().includes(orderSearch.toLowerCase())
                    const matchesGov = govFilter === "all" || order.governorate === govFilter
                    const matchesStatus = statusFilter === "all" || order.deliveryStatus === statusFilter
                    return matchesSearch && matchesGov && matchesStatus
                  })
                  .map((order) => {
                    const phoneClean = order.customerPhone.replace(/\D/g, "")
                    const waLink = `https://wa.me/${phoneClean}?text=${encodeURIComponent(
                      `مرحباً ${order.customerName}، معك فريق متجر نَـسْـمَـة للزهور المخملية بخصوص طلبك رقم (${order.orderId}). نتشرف بخدمتك!`
                    )}`

                    return (
                      <div
                        key={order.id || order.orderId}
                        className="bg-white rounded-3xl border border-[#F0E4EC] shadow-xs overflow-hidden hover:shadow-md transition-shadow"
                      >
                        {/* Order Header Bar */}
                        <div className="bg-[#FAF6F4] px-6 py-4 border-b border-[#F0E4EC] flex flex-wrap items-center justify-between gap-3">
                          <div className="flex items-center gap-3">
                            <span className="font-mono text-xs font-bold text-primary bg-white px-3 py-1 rounded-full border border-primary/20">
                              {order.orderId}
                            </span>
                            <span className="text-xs text-muted-foreground font-arabic flex items-center gap-1.5">
                              <Calendar className="w-3.5 h-3.5" />
                              {new Date(order.createdAt).toLocaleDateString("ar-OM", {
                                year: "numeric",
                                month: "short",
                                day: "numeric",
                                hour: "2-digit",
                                minute: "2-digit",
                              })}
                            </span>
                          </div>

                          <div className="flex items-center gap-2">
                            {/* Payment Badge */}
                            <span className="inline-flex items-center gap-1 text-[11px] font-bold px-3 py-1 rounded-full bg-emerald-50 text-emerald-700 border border-emerald-200">
                              <ShieldCheck className="w-3.5 h-3.5" />
                              <span>{order.paymentStatus === "paid" ? "مدفوع عبر Stripe" : "بانتظار التأكيد"}</span>
                            </span>

                            {/* Delivery Status Selector */}
                            <select
                              value={order.deliveryStatus || "processing"}
                              disabled={updatingOrderId === order.orderId}
                              onChange={(e) =>
                                handleUpdateDeliveryStatus(order.orderId, e.target.value as StoreOrder["deliveryStatus"])
                              }
                              className="text-xs font-semibold px-3 py-1 rounded-full border border-border bg-white text-foreground focus:outline-none cursor-pointer"
                            >
                              <option value="processing">🟡 قيد التجهيز والتنسيق</option>
                              <option value="shipped">🚚 خرج مع مندوب التوصيل</option>
                              <option value="delivered">🟢 تم التسليم بنجاح</option>
                              <option value="cancelled">🔴 ملغي</option>
                            </select>
                          </div>
                        </div>

                        {/* Order Main Content */}
                        <div className="p-6 space-y-5">
                          <div className="grid grid-cols-1 md:grid-cols-12 gap-6">
                            {/* Customer & Delivery Destination */}
                            <div className="md:col-span-5 space-y-3 border-l-0 md:border-l border-border/40 pl-0 md:pl-6">
                              <h4 className="text-xs font-bold text-foreground font-arabic flex items-center gap-2">
                                <User className="w-4 h-4 text-primary" />
                                <span>بيانات العميل والمستلم</span>
                              </h4>

                              <div className="space-y-1.5 text-xs">
                                <p className="font-semibold text-foreground text-sm">{order.customerName}</p>
                                
                                <div className="flex items-center gap-2 text-muted-foreground pt-1">
                                  <Phone className="w-3.5 h-3.5 text-primary" />
                                  <span dir="ltr" className="font-medium">{order.customerPhone}</span>
                                </div>

                                {order.customerEmail && (
                                  <div className="flex items-center gap-2 text-muted-foreground">
                                    <Mail className="w-3.5 h-3.5 text-primary" />
                                    <span>{order.customerEmail}</span>
                                  </div>
                                )}
                              </div>

                              {/* Customer Contact Shortcuts */}
                              <div className="flex items-center gap-2 pt-2">
                                <a
                                  href={waLink}
                                  target="_blank"
                                  rel="noopener noreferrer"
                                  className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-[#25D366] text-white text-[11px] font-semibold hover:bg-[#20bd5a] transition shadow-xs"
                                >
                                  <MessageCircle className="w-3.5 h-3.5" />
                                  <span>مراسلة واتساب</span>
                                </a>

                                <a
                                  href={`tel:${order.customerPhone}`}
                                  className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-muted/60 text-foreground text-[11px] font-semibold hover:bg-muted transition"
                                >
                                  <Phone className="w-3.5 h-3.5" />
                                  <span>اتصال هاتفي</span>
                                </a>
                              </div>

                              {/* Delivery Destination in Oman */}
                              <div className="pt-3 border-t border-border/40 space-y-1">
                                <div className="flex items-center gap-1.5 text-xs font-bold text-foreground">
                                  <MapPin className="w-3.5 h-3.5 text-primary" />
                                  <span>وجهة التوصيل: محافظة {order.governorate}</span>
                                </div>
                                <p className="text-xs text-muted-foreground leading-relaxed">
                                  {order.deliveryAddress || "لم يُدخل تفاصيل إضافية للعنوان"}
                                </p>
                              </div>
                            </div>

                            {/* Order Items & Velvet Gift Card */}
                            <div className="md:col-span-7 space-y-4">
                              <h4 className="text-xs font-bold text-foreground font-arabic flex items-center gap-2">
                                <Package className="w-4 h-4 text-primary" />
                                <span>الباقات المطلوبة</span>
                              </h4>

                              {/* Items list */}
                              <div className="space-y-2">
                                {order.items && order.items.length > 0 ? (
                                  order.items.map((item, idx) => (
                                    <div
                                      key={idx}
                                      className="flex items-center justify-between p-2.5 rounded-2xl bg-[#FBF9F5] border border-border/40 text-xs"
                                    >
                                      <div className="flex items-center gap-3">
                                        <div className="relative w-11 h-12 rounded-xl overflow-hidden bg-card border border-border/50 flex-shrink-0">
                                          <Image
                                            src={item.image || PRESET_IMAGES[0]}
                                            alt={item.name}
                                            fill
                                            className="object-cover"
                                          />
                                        </div>
                                        <div>
                                          <p className="font-semibold text-foreground">{item.name}</p>
                                          <span className="text-muted-foreground text-[11px]">الكمية: {item.quantity}</span>
                                        </div>
                                      </div>
                                      <span className="font-bold text-primary font-arabic">
                                        {(item.price * (item.quantity || 1)).toFixed(1)} ر.ع
                                      </span>
                                    </div>
                                  ))
                                ) : (
                                  <p className="text-xs text-muted-foreground">باقة ورد نسمة المخملية</p>
                                )}
                              </div>

                              {/* Handwritten Gift Card Note */}
                              {order.giftMessage && (
                                <div className="p-4 rounded-2xl bg-[#EFD9E8]/30 border border-primary/20 space-y-1.5">
                                  <div className="flex items-center gap-2 text-primary text-xs font-bold font-arabic">
                                    <Sparkles className="w-3.5 h-3.5" />
                                    <span>نص كرت الإهداء المخملي (لطباعته مع الباقة):</span>
                                  </div>
                                  <p className="text-xs text-foreground/90 font-serif leading-relaxed italic bg-white/70 p-2.5 rounded-xl border border-primary/10">
                                    &ldquo;{order.giftMessage}&rdquo;
                                  </p>
                                </div>
                              )}

                              {/* Order Total */}
                              <div className="flex items-center justify-between pt-3 border-t border-border/40 text-sm">
                                <span className="font-semibold text-foreground">المبلغ الإجمالي مع التوصيل:</span>
                                <span className="font-bold text-primary text-base font-arabic">
                                  {Number(order.amountOmr).toFixed(1)} ر.ع
                                </span>
                              </div>
                            </div>
                          </div>
                        </div>
                      </div>
                    )
                  })}
              </div>
            )}
          </div>
        )}

        {/* TAB 1: PRODUCTS MANAGEMENT */}
        {activeTab === "products" && (
          <div className="space-y-6">
            {/* Action Bar */}
            <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 bg-white p-5 rounded-2xl border border-[#F0E4EC] shadow-xs">
              <div>
                <h2 className="font-arabic text-xl font-bold text-foreground">باقات نسمة المعروضة</h2>
                <p className="text-xs text-muted-foreground font-arabic font-light mt-0.5">
                  أي باقة تضيفها هنا تظهر فوراً في المتجر والصفحة الرئيسية بنفس التنسيق والألوان.
                </p>
              </div>

              <button
                type="button"
                onClick={handleOpenNewProduct}
                className="bg-primary text-white px-5 py-2.5 rounded-full text-xs font-bold font-arabic hover:bg-primary/90 transition-all shadow-md flex items-center gap-2"
              >
                <Plus className="w-4 h-4" />
                <span>إضافة باقة ورد جديدة</span>
              </button>
            </div>

            {/* Products Grid */}
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
              {products.map((product) => (
                <div
                  key={product.id}
                  className="bg-white rounded-3xl overflow-hidden border border-[#F0E4EC] shadow-sm flex flex-col justify-between hover:shadow-md transition-shadow"
                >
                  <div className="relative aspect-[4/5] bg-[#FBF6F4]">
                    <Image
                      src={product.image || PRESET_IMAGES[0]}
                      alt={product.name}
                      fill
                      className="object-cover"
                    />
                    {product.badge && (
                      <span className="absolute top-3 right-3 bg-primary text-white text-[10px] font-bold px-2.5 py-1 rounded-full font-arabic shadow-xs">
                        {product.badge === "Sale" ? "خصم خاص" : product.badge === "New" ? "جديد نسمة" : "الأكثر طلباً"}
                      </span>
                    )}
                    <span className="absolute bottom-3 right-3 bg-black/60 backdrop-blur-sm text-white text-[10px] px-2.5 py-0.5 rounded-full font-arabic">
                      {product.productType}
                    </span>
                  </div>

                  <div className="p-5 flex flex-col flex-1 justify-between">
                    <div>
                      <h3 className="font-arabic font-bold text-base text-foreground mb-1 line-clamp-1">
                        {product.name}
                      </h3>
                      <p className="text-xs text-muted-foreground line-clamp-2 leading-relaxed font-light mb-3 font-arabic">
                        {product.description}
                      </p>
                    </div>

                    <div className="pt-3 border-t border-[#F0E4EC] flex items-center justify-between">
                      <div className="flex items-center gap-1.5">
                        <span className="font-bold text-primary text-base">{product.price} ر.ع</span>
                        {product.originalPrice && (
                          <span className="text-xs text-muted-foreground line-through">
                            {product.originalPrice} ر.ع
                          </span>
                        )}
                      </div>

                      <div className="flex items-center gap-1">
                        <button
                          type="button"
                          onClick={() => handleOpenEditProduct(product)}
                          className="p-2 text-foreground/70 hover:text-primary hover:bg-[#EFD9E8]/40 rounded-full transition-colors"
                          title="تعديل الباقة"
                        >
                          <Edit className="w-4 h-4" />
                        </button>
                        <button
                          type="button"
                          onClick={() => handleDeleteProduct(product.id, product.name)}
                          className="p-2 text-foreground/70 hover:text-destructive hover:bg-destructive/10 rounded-full transition-colors"
                          title="حذف الباقة"
                        >
                          <Trash2 className="w-4 h-4" />
                        </button>
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* TAB: CATEGORIES & PRODUCT TYPES */}
        {activeTab === "categories" && (
          <div className="space-y-8">
            <div className="bg-white rounded-3xl p-6 sm:p-8 border border-[#F0E4EC] shadow-sm">
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-6 border-b border-[#F0E4EC] mb-6">
                <div>
                  <h2 className="font-arabic text-xl font-bold text-foreground flex items-center gap-2">
                    <Tag className="w-5 h-5 text-primary" />
                    <span>إدارة أنواع وتصنيفات الزهور (Product Types & Collections)</span>
                  </h2>
                  <p className="text-xs text-muted-foreground font-arabic font-light mt-1">
                    أضف أنواعاً وتصنيفات جديدة (مثل: باقات الحب، مسكات ليلة العمر، مزهريات، بوكسات هدايا)، وستظهر تلقائياً في فلاتر المتجر وعند إضافة أي باقة.
                  </p>
                </div>
              </div>

              {/* Add New Category Form */}
              <form onSubmit={handleAddCategory} className="mb-8 p-5 rounded-2xl bg-[#FBF6F4] border border-[#F0E4EC]">
                <label className="block text-xs font-bold text-foreground mb-2 font-arabic">
                  إضافة نوع / تصنيف جديد للمتجر:
                </label>
                <div className="flex flex-col sm:flex-row items-center gap-3">
                  <input
                    type="text"
                    value={newCategoryName}
                    onChange={(e) => setNewCategoryName(e.target.value)}
                    placeholder="مثال: باقات التخرج والنجاح، توزيعات المواليد، بوكسات الهدايا..."
                    className="w-full bg-white px-4 py-3 rounded-2xl text-xs border border-border focus:outline-none focus:border-primary font-arabic"
                  />
                  <button
                    type="submit"
                    disabled={isAddingCategory || !newCategoryName.trim()}
                    className="w-full sm:w-auto shrink-0 bg-primary text-white px-6 py-3 rounded-2xl text-xs font-bold font-arabic hover:bg-primary/90 transition-all shadow-sm disabled:opacity-50 flex items-center justify-center gap-2 cursor-pointer"
                  >
                    {isAddingCategory ? <Loader2 className="w-4 h-4 animate-spin" /> : <Plus className="w-4 h-4" />}
                    <span>إضافة التصنيف</span>
                  </button>
                </div>
              </form>

              {/* Categories Grid */}
              <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4">
                {categories.map((cat) => {
                  const assignedCount = products.filter((p) => p.productType === cat).length
                  return (
                    <div
                      key={cat}
                      className="bg-white p-5 rounded-2xl border border-[#F0E4EC] shadow-xs flex items-center justify-between gap-4 hover:border-primary/40 transition-all"
                    >
                      <div className="flex items-center gap-3">
                        <div className="w-10 h-10 rounded-xl bg-primary/10 text-primary flex items-center justify-center shrink-0">
                          <Tag className="w-5 h-5" />
                        </div>
                        <div>
                          <h4 className="text-xs font-bold text-foreground font-arabic">{cat}</h4>
                          <span className="text-[11px] text-muted-foreground font-arabic font-light">
                            {assignedCount} {assignedCount === 1 ? "باقة مسجلة" : "باقات مسجلة"}
                          </span>
                        </div>
                      </div>

                      <button
                        type="button"
                        onClick={() => handleDeleteCategory(cat)}
                        className="p-2 text-muted-foreground hover:text-destructive hover:bg-destructive/10 rounded-xl transition-colors cursor-pointer"
                        title="حذف هذا النوع"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </div>
                  )
                })}
              </div>
            </div>
          </div>
        )}

        {/* TAB 2: OFFERS & POPUPS */}
        {activeTab === "offers" && (
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
            {/* Offer Form */}
            <div className="lg:col-span-7 bg-white rounded-3xl p-6 sm:p-8 border border-[#F0E4EC] shadow-sm">
              <div className="flex items-center justify-between pb-5 border-b border-[#F0E4EC] mb-6">
                <div>
                  <h2 className="font-arabic text-xl font-bold text-foreground">
                    العرض الترويجي والخصم المنبثق (Popup Modal)
                  </h2>
                  <p className="text-xs text-muted-foreground font-arabic font-light mt-0.5">
                    يظهر تلقائياً للزوار الجدد عند دخول المتجر، وبنقرة واحدة يتم احتساب الخصم في السلة.
                  </p>
                </div>
                
                {/* Enable / Disable Toggle */}
                <label className="relative inline-flex items-center cursor-pointer">
                  <input
                    type="checkbox"
                    checked={offerForm.enabled}
                    onChange={(e) => setOfferForm({ ...offerForm, enabled: e.target.checked })}
                    className="sr-only peer"
                  />
                  <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none rounded-full peer peer-checked:after:-translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:right-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-primary"></div>
                  <span className="mr-3 text-xs font-bold text-foreground font-arabic">
                    {offerForm.enabled ? "العرض نشط" : "العرض معطل"}
                  </span>
                </label>
              </div>

              <form onSubmit={handleSaveOffer} className="space-y-4">
                <div>
                  <label className="block text-xs font-semibold text-foreground mb-1.5 font-arabic">
                    عنوان العرض (Title)
                  </label>
                  <input
                    type="text"
                    value={offerForm.title}
                    onChange={(e) => setOfferForm({ ...offerForm, title: e.target.value })}
                    required
                    className="w-full bg-[#FBF6F4] px-4 py-3 rounded-2xl text-xs border border-border focus:outline-none focus:border-primary font-arabic"
                  />
                </div>

                <div>
                  <label className="block text-xs font-semibold text-foreground mb-1.5 font-arabic">
                    نص ورسالة العرض (Subtitle / Description)
                  </label>
                  <textarea
                    rows={3}
                    value={offerForm.subtitle}
                    onChange={(e) => setOfferForm({ ...offerForm, subtitle: e.target.value })}
                    required
                    className="w-full bg-[#FBF6F4] px-4 py-3 rounded-2xl text-xs border border-border focus:outline-none focus:border-primary font-arabic leading-relaxed"
                  />
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-xs font-semibold text-foreground mb-1.5 font-arabic">
                      نسبة الخصم المئوية (%)
                    </label>
                    <div className="relative">
                      <input
                        type="number"
                        min="1"
                        max="90"
                        value={offerForm.discountPercentage}
                        onChange={(e) => setOfferForm({ ...offerForm, discountPercentage: Number(e.target.value) })}
                        required
                        className="w-full bg-[#FBF6F4] px-4 py-3 rounded-2xl text-xs border border-border focus:outline-none focus:border-primary font-bold text-primary"
                      />
                      <span className="absolute left-4 top-1/2 -translate-y-1/2 text-xs font-bold text-primary">%</span>
                    </div>
                  </div>

                  <div>
                    <label className="block text-xs font-semibold text-foreground mb-1.5 font-arabic">
                      كود الخصم (Coupon Code)
                    </label>
                    <input
                      type="text"
                      value={offerForm.couponCode}
                      onChange={(e) => setOfferForm({ ...offerForm, couponCode: e.target.value.toUpperCase() })}
                      required
                      className="w-full bg-[#FBF6F4] px-4 py-3 rounded-2xl text-xs border border-border focus:outline-none focus:border-primary font-mono font-bold text-left uppercase"
                    />
                  </div>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-xs font-semibold text-foreground mb-1.5 font-arabic">
                      نص الزر (Button CTA)
                    </label>
                    <input
                      type="text"
                      value={offerForm.buttonText}
                      onChange={(e) => setOfferForm({ ...offerForm, buttonText: e.target.value })}
                      required
                      className="w-full bg-[#FBF6F4] px-4 py-3 rounded-2xl text-xs border border-border focus:outline-none focus:border-primary font-arabic"
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-semibold text-foreground mb-1.5 font-arabic">
                      شارة العرض (Badge)
                    </label>
                    <input
                      type="text"
                      value={offerForm.badgeText}
                      onChange={(e) => setOfferForm({ ...offerForm, badgeText: e.target.value })}
                      required
                      className="w-full bg-[#FBF6F4] px-4 py-3 rounded-2xl text-xs border border-border focus:outline-none focus:border-primary font-arabic"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-xs font-semibold text-foreground mb-1.5 font-arabic">
                    صورة العرض المصاحبة
                  </label>
                  <div className="grid grid-cols-4 gap-2">
                    {PRESET_IMAGES.slice(0, 4).map((img) => (
                      <div
                        key={img}
                        onClick={() => setOfferForm({ ...offerForm, imageUrl: img })}
                        className={`relative aspect-square rounded-xl overflow-hidden cursor-pointer border-2 transition-all ${
                          offerForm.imageUrl === img ? "border-primary ring-2 ring-primary/20 scale-105" : "border-transparent opacity-70"
                        }`}
                      >
                        <Image src={img} alt="Offer asset" fill className="object-cover" />
                      </div>
                    ))}
                  </div>
                </div>

                <button
                  type="submit"
                  disabled={isSavingOffer}
                  className="w-full bg-primary text-white py-3.5 rounded-2xl text-xs font-bold font-arabic hover:bg-primary/90 transition-all shadow-md mt-6 flex items-center justify-center gap-2"
                >
                  {isSavingOffer ? <Loader2 className="w-4 h-4 animate-spin" /> : <Save className="w-4 h-4" />}
                  <span>حفظ وتطبيق العرض الترويجي</span>
                </button>
              </form>
            </div>

            {/* Live Interactive Preview */}
            <div className="lg:col-span-5 bg-white rounded-3xl p-6 sm:p-8 border border-[#F0E4EC] shadow-sm flex flex-col justify-between">
              <div>
                <span className="text-xs font-bold text-primary font-arabic mb-3 block">
                  معاينة حية لشكل العرض عند دخول الزائر:
                </span>

                <div className="relative bg-[#FBF6F4] rounded-3xl p-6 border border-[#F0E4EC] overflow-hidden nasmma-card-shadow text-center">
                  <div className="relative w-full h-40 rounded-2xl overflow-hidden mb-4 bg-muted">
                    <Image
                      src={offerForm.imageUrl || PRESET_IMAGES[0]}
                      alt="Preview"
                      fill
                      className="object-cover"
                    />
                    <span className="absolute top-3 right-3 bg-primary text-white text-[10px] font-bold px-3 py-1 rounded-full font-arabic">
                      {offerForm.badgeText}
                    </span>
                  </div>

                  <span className="text-xs font-bold text-primary font-arabic block mb-1">
                    كود الخصم: <span className="font-mono bg-white px-2 py-0.5 rounded border border-primary/20">{offerForm.couponCode}</span>
                  </span>

                  <h3 className="font-arabic text-lg font-bold text-foreground mb-2">
                    {offerForm.title}
                  </h3>
                  <p className="text-xs text-muted-foreground font-arabic font-light leading-relaxed mb-5">
                    {offerForm.subtitle}
                  </p>

                  <div className="w-full bg-primary text-white py-3 rounded-full text-xs font-bold font-arabic shadow-md flex items-center justify-center gap-2">
                    <Sparkles className="w-4 h-4 text-[#EFD9E8]" />
                    <span>{offerForm.buttonText} ({offerForm.discountPercentage}% خصم)</span>
                  </div>
                </div>
              </div>

              <div className="mt-6 p-4 rounded-2xl bg-[#EFD9E8]/40 border border-primary/20 text-xs font-arabic text-primary flex items-start gap-2">
                <AlertCircle className="w-4 h-4 flex-shrink-0 mt-0.5" />
                <span>
                  عندما يضغط الزائر على الزر، يُحسب خصم {offerForm.discountPercentage}% تلقائياً في السلة دون أي جهد منه.
                </span>
              </div>
            </div>
          </div>
        )}

        {/* TAB 3: ACCOUNT & SECURITY OVERVIEW */}
        {activeTab === "account" && (
          <div className="max-w-2xl mx-auto space-y-6">
            <div className="bg-white rounded-3xl p-6 sm:p-8 border border-[#F0E4EC] shadow-sm">
              <div className="flex items-center gap-3 text-primary mb-3">
                <ShieldCheck className="w-6 h-6" />
                <h2 className="font-arabic text-xl font-bold text-foreground">
                  حساب المشرف وتوثيق Supabase & Google
                </h2>
              </div>
              <p className="text-xs text-muted-foreground font-arabic font-light leading-relaxed mb-6">
                تم عزل وتأمين لوحة الإدارة بالكامل وفق معايير الحماية السحابية. التوثيق يعتمد على التحقق المباشر من مزود الهوية (Google OAuth / Supabase Auth) دون تخزين أي كلمات مرور أو مفاتيح حساسة في الكود المصدري.
              </p>

              <div className="space-y-3 bg-[#FBF6F4] p-5 rounded-2xl border border-border text-xs font-arabic">
                <div className="flex items-center justify-between pb-3 border-b border-border/60">
                  <span className="text-muted-foreground">البريد الإلكتروني المعتمد:</span>
                  <span className="font-mono font-bold text-primary text-sm">{adminEmail}</span>
                </div>
                <div className="flex items-center justify-between pb-3 border-b border-border/60">
                  <span className="text-muted-foreground">نظام التوثيق:</span>
                  <span className="font-semibold text-foreground">Supabase Auth & Google OAuth</span>
                </div>
                <div className="flex items-center justify-between pb-3 border-b border-border/60">
                  <span className="text-muted-foreground">حالة الجلسة:</span>
                  <span className="inline-flex items-center gap-1.5 text-emerald-600 font-bold">
                    <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse"></span>
                    جلسة مشفرة ونشطة
                  </span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-muted-foreground">معيار الأمان:</span>
                  <span className="font-semibold text-foreground">قائمة المشرفين المعتمدين (Whitelist)</span>
                </div>
              </div>

              <div className="mt-6 p-4 rounded-2xl bg-amber-500/10 border border-amber-500/20 text-xs font-arabic text-amber-900 space-y-2">
                <div className="font-bold flex items-center gap-1.5">
                  <Sparkles className="w-4 h-4 text-amber-600" />
                  <span>كيف تدير المشرفين المصرح لهم؟</span>
                </div>
                <p className="text-[11px] leading-relaxed text-amber-800">
                  لإضافة بريد مشرف جديد، يكفي إضافته في ملف <code className="font-mono font-bold bg-white/60 px-1 py-0.5 rounded">.env.local</code> تحت متغير <code className="font-mono font-bold bg-white/60 px-1 py-0.5 rounded">ADMIN_EMAILS=email1@gmail.com,email2@gmail.com</code> أو إدراجه في جدول <code className="font-mono font-bold bg-white/60 px-1 py-0.5 rounded">nasmma_admin_users</code> في لوحة Supabase.
                </p>
              </div>

              <div className="mt-8 pt-6 border-t border-[#F0E4EC] flex justify-end">
                <button
                  type="button"
                  onClick={handleLogout}
                  className="bg-destructive/10 text-destructive hover:bg-destructive hover:text-white px-5 py-2.5 rounded-xl text-xs font-bold font-arabic transition-all flex items-center gap-2 cursor-pointer"
                >
                  <LogOut className="w-4 h-4" />
                  <span>تسجيل الخروج من لوحة التحكم</span>
                </button>
              </div>
            </div>
          </div>
        )}

      </div>

      {/* PRODUCT CREATE / EDIT MODAL */}
      {isProductModalOpen && (
        <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="w-full max-w-2xl bg-white rounded-3xl p-6 sm:p-8 max-h-[90vh] overflow-y-auto nasmma-card-shadow animate-scale-fade-in text-right border border-[#F0E4EC]">
            <div className="flex items-center justify-between pb-4 border-b border-[#F0E4EC] mb-6">
              <h2 className="font-arabic text-xl font-bold text-foreground">
                {editingProduct ? `تعديل باقة: ${editingProduct.name}` : "إضافة باقة ورد مخملية جديدة"}
              </h2>
              <button
                type="button"
                onClick={() => setIsProductModalOpen(false)}
                className="p-2 text-muted-foreground hover:text-foreground rounded-full"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleSaveProduct} className="space-y-4">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-semibold text-foreground mb-1.5 font-arabic">
                    اسم الباقة (مثال: باقة عهد الياسمين)
                  </label>
                  <input
                    type="text"
                    value={formData.name}
                    onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                    required
                    placeholder="بـاقـة عـهـد الـيـاسـمـيـن"
                    className="w-full bg-[#FBF6F4] px-4 py-3 rounded-2xl text-xs border border-border focus:outline-none focus:border-primary font-arabic"
                  />
                </div>

                <div>
                  <div className="flex items-center justify-between mb-1.5">
                    <label className="block text-xs font-semibold text-foreground font-arabic">
                      التصنيف / النوع (Collection / Type)
                    </label>
                    <button
                      type="button"
                      onClick={() => setShowCustomTypeInput(!showCustomTypeInput)}
                      className="text-[11px] text-primary hover:underline font-arabic font-bold cursor-pointer"
                    >
                      {showCustomTypeInput ? "اختيار من القائمة" : "+ إضافة نوع جديد"}
                    </button>
                  </div>

                  {showCustomTypeInput ? (
                    <div className="flex gap-2">
                      <input
                        type="text"
                        value={customTypeInput}
                        onChange={(e) => setCustomTypeInput(e.target.value)}
                        placeholder="اكتب اسم النوع الجديد..."
                        className="w-full bg-[#FBF6F4] px-4 py-2.5 rounded-2xl text-xs border border-border focus:outline-none focus:border-primary font-arabic"
                      />
                      <button
                        type="button"
                        onClick={() => {
                          const t = customTypeInput.trim()
                          if (t) {
                            if (!categories.includes(t)) {
                              setCategories((prev) => [...prev, t])
                            }
                            setFormData({ ...formData, productType: t })
                            setShowCustomTypeInput(false)
                          }
                        }}
                        className="bg-primary text-white text-xs px-3 py-2 rounded-2xl font-arabic font-bold shrink-0 cursor-pointer"
                      >
                        تثبيت
                      </button>
                    </div>
                  ) : (
                    <select
                      value={formData.productType}
                      onChange={(e) => setFormData({ ...formData, productType: e.target.value })}
                      className="w-full bg-[#FBF6F4] px-4 py-3 rounded-2xl text-xs border border-border focus:outline-none focus:border-primary font-arabic cursor-pointer"
                    >
                      {categories.map((cat) => (
                        <option key={cat} value={cat}>
                          {cat}
                        </option>
                      ))}
                    </select>
                  )}
                </div>
              </div>

              <div>
                <label className="block text-xs font-semibold text-foreground mb-1.5 font-arabic">
                  الوصف الحكائي للباقة
                </label>
                <textarea
                  rows={3}
                  value={formData.description}
                  onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                  placeholder="وردة ناعمة ودافئة نسجناها بحب من خيوط الغليون المخملية..."
                  className="w-full bg-[#FBF6F4] px-4 py-3 rounded-2xl text-xs border border-border focus:outline-none focus:border-primary font-arabic leading-relaxed"
                />
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                <div>
                  <label className="block text-xs font-semibold text-foreground mb-1.5 font-arabic">
                    السعر الحالي (ر.ع)
                  </label>
                  <input
                    type="number"
                    step="0.5"
                    value={formData.price}
                    onChange={(e) => setFormData({ ...formData, price: e.target.value })}
                    required
                    placeholder="18.5"
                    className="w-full bg-[#FBF6F4] px-4 py-3 rounded-2xl text-xs border border-border focus:outline-none focus:border-primary font-bold text-primary"
                  />
                </div>

                <div>
                  <label className="block text-xs font-semibold text-foreground mb-1.5 font-arabic">
                    السعر قبل الخصم (ر.ع - اختياري)
                  </label>
                  <input
                    type="number"
                    step="0.5"
                    value={formData.originalPrice}
                    onChange={(e) => setFormData({ ...formData, originalPrice: e.target.value })}
                    placeholder="22"
                    className="w-full bg-[#FBF6F4] px-4 py-3 rounded-2xl text-xs border border-border focus:outline-none focus:border-primary font-arabic"
                  />
                </div>

                <div>
                  <label className="block text-xs font-semibold text-foreground mb-1.5 font-arabic">
                    الشارة الترويجية (Badge)
                  </label>
                  <select
                    value={formData.badge}
                    onChange={(e) => setFormData({ ...formData, badge: e.target.value })}
                    className="w-full bg-[#FBF6F4] px-4 py-3 rounded-2xl text-xs border border-border focus:outline-none focus:border-primary font-arabic cursor-pointer"
                  >
                    <option value="">بدون شارة</option>
                    <option value="New">جديد نسمة</option>
                    <option value="Bestseller">الأكثر طلباً</option>
                    <option value="Sale">خصم خاص</option>
                  </select>
                </div>
              </div>

              {/* Occasions Multi-Select */}
              <div>
                <label className="block text-xs font-semibold text-foreground mb-2 font-arabic">
                  المناسبات المناسبة لهذه الباقة (لتفعيل الفلترة بالمتجر):
                </label>
                <div className="flex flex-wrap gap-2">
                  {ALL_OCCASIONS.map((occ) => {
                    const isSelected = formData.occasions.includes(occ)
                    return (
                      <button
                        type="button"
                        key={occ}
                        onClick={() => {
                          if (isSelected) {
                            setFormData({
                              ...formData,
                              occasions: formData.occasions.filter((o) => o !== occ),
                            })
                          } else {
                            setFormData({
                              ...formData,
                              occasions: [...formData.occasions, occ],
                            })
                          }
                        }}
                        className={`text-xs px-3 py-1.5 rounded-full font-arabic border transition-all cursor-pointer ${
                          isSelected
                            ? "bg-primary text-white border-primary shadow-xs font-bold"
                            : "bg-[#FBF6F4] text-foreground/80 border-border hover:border-primary/50"
                        }`}
                      >
                        {occ}
                      </button>
                    )
                  })}
                </div>
              </div>

              {/* Colors Multi-Select */}
              <div>
                <label className="block text-xs font-semibold text-foreground mb-2 font-arabic">
                  الألوان المتوفرة في الباقة:
                </label>
                <div className="flex flex-wrap gap-2">
                  {ALL_COLORS.map((col) => {
                    const isSelected = formData.colors.includes(col.name)
                    return (
                      <button
                        type="button"
                        key={col.name}
                        onClick={() => {
                          if (isSelected) {
                            setFormData({
                              ...formData,
                              colors: formData.colors.filter((c) => c !== col.name),
                            })
                          } else {
                            setFormData({
                              ...formData,
                              colors: [...formData.colors, col.name],
                            })
                          }
                        }}
                        className={`text-xs px-3 py-1.5 rounded-full font-arabic border transition-all flex items-center gap-1.5 cursor-pointer ${
                          isSelected
                            ? "bg-[#5B1657] text-white border-[#5B1657] font-bold shadow-xs"
                            : "bg-[#FBF6F4] text-foreground/80 border-border hover:border-primary/50"
                        }`}
                      >
                        <span
                          className="w-3 h-3 rounded-full border border-black/10 inline-block"
                          style={{ backgroundColor: col.bg }}
                        />
                        <span>{col.name}</span>
                      </button>
                    )
                  })}
                </div>
              </div>

              <div>
                <label className="block text-xs font-semibold text-foreground mb-1.5 font-arabic">
                  اختر صورة الباقة الرئيسية
                </label>
                <div className="grid grid-cols-4 sm:grid-cols-8 gap-2">
                  {PRESET_IMAGES.map((img) => (
                    <div
                      key={img}
                      onClick={() => setFormData({ ...formData, image: img, images: [img] })}
                      className={`relative aspect-square rounded-xl overflow-hidden cursor-pointer border-2 transition-all ${
                        formData.image === img ? "border-primary ring-2 ring-primary/20 scale-105" : "border-transparent opacity-70"
                      }`}
                    >
                      <Image src={img} alt="Preset flower" fill className="object-cover" />
                    </div>
                  ))}
                </div>
              </div>

              <div className="flex items-center gap-2 pt-2">
                <input
                  type="checkbox"
                  id="avail"
                  checked={formData.availableForSale}
                  onChange={(e) => setFormData({ ...formData, availableForSale: e.target.checked })}
                  className="rounded text-primary focus:ring-primary h-4 w-4 cursor-pointer"
                />
                <label htmlFor="avail" className="text-xs font-semibold text-foreground font-arabic cursor-pointer">
                  الباقة متوفرة للبيع الفوري في المتجر
                </label>
              </div>

              <div className="flex items-center justify-end gap-3 pt-6 border-t border-[#F0E4EC]">
                <button
                  type="button"
                  onClick={() => setIsProductModalOpen(false)}
                  className="px-5 py-2.5 rounded-full border border-border text-xs font-semibold text-muted-foreground hover:bg-[#FBF6F4] font-arabic cursor-pointer"
                >
                  إلغاء
                </button>
                <button
                  type="submit"
                  disabled={isSavingProduct}
                  className="bg-primary text-white px-7 py-2.5 rounded-full text-xs font-bold font-arabic hover:bg-primary/90 transition-all shadow-md flex items-center gap-2 cursor-pointer"
                >
                  {isSavingProduct ? <Loader2 className="w-4 h-4 animate-spin" /> : <Save className="w-4 h-4" />}
                  <span>{editingProduct ? "حفظ التعديلات" : "إضافة الباقة للمتجر"}</span>
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Conversation Transcript Modal */}
      {selectedTranscriptReq && (
        <div className="fixed inset-0 z-50 bg-black/50 backdrop-blur-xs flex items-center justify-center p-4">
          <div
            dir="rtl"
            className="bg-white rounded-3xl max-w-2xl w-full max-h-[85vh] flex flex-col shadow-2xl border border-[#F0E4EC] overflow-hidden animate-scale-fade-in"
          >
            {/* Modal Header */}
            <div className="bg-gradient-to-r from-[#5B1657] to-[#7B2874] text-white p-5 flex items-center justify-between shrink-0">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-full bg-white/15 flex items-center justify-center border border-white/20 text-lg">
                  🌷
                </div>
                <div>
                  <h3 className="font-bold text-base font-arabic flex items-center gap-2">
                    <span>سجل محادثة الطلب المخصص</span>
                    <span className="font-mono text-xs bg-white/20 px-2.5 py-0.5 rounded-full">{selectedTranscriptReq.id}</span>
                  </h3>
                  <p className="text-xs text-white/80 font-arabic font-light">
                    العميل: {selectedTranscriptReq.customerName} ({selectedTranscriptReq.customerPhone})
                  </p>
                </div>
              </div>

              <button
                type="button"
                onClick={() => setSelectedTranscriptReq(null)}
                aria-label="إغلاق"
                className="w-8 h-8 rounded-full bg-white/10 hover:bg-white/20 flex items-center justify-center transition-all cursor-pointer"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Modal Body */}
            <div className="flex-1 p-6 overflow-y-auto space-y-4 bg-[#FBF9F5]">
              {/* Summary Box */}
              {selectedTranscriptReq.summary && (
                <div className="bg-white p-4 rounded-2xl border-2 border-[#EFD9E8] shadow-xs space-y-2">
                  <div className="flex items-center gap-2 text-xs font-bold text-[#5B1657] font-arabic">
                    <Sparkles className="w-4 h-4" />
                    <span>ملخص الطلب المعتمد من المساعد الذكي:</span>
                  </div>
                  <div className="whitespace-pre-wrap text-xs font-arabic text-neutral-800 leading-relaxed bg-[#FAF6F4] p-3 rounded-xl border border-border/50">
                    {selectedTranscriptReq.summary}
                  </div>
                </div>
              )}

              {/* Chat Messages */}
              <div className="space-y-3 pt-2">
                <h4 className="text-xs font-bold text-muted-foreground font-arabic flex items-center gap-1.5">
                  <MessageCircle className="w-4 h-4 text-primary" />
                  <span>نص الحوار الكامل بين العميل والمساعد نسمة:</span>
                </h4>

                {selectedTranscriptReq.messages && selectedTranscriptReq.messages.length > 0 ? (
                  selectedTranscriptReq.messages.map((m, idx) => {
                    const isUser = m.role === "user"
                    return (
                      <div
                        key={idx}
                        className={`flex flex-col ${isUser ? "items-end" : "items-start"}`}
                      >
                        <span className="text-[10px] text-muted-foreground px-1 mb-0.5 font-arabic">
                          {isUser ? `👤 ${selectedTranscriptReq.customerName}` : "🌷 نسمة (المساعد الذكي)"}
                        </span>
                        <div
                          className={`max-w-[85%] px-4 py-2.5 rounded-2xl text-xs font-arabic whitespace-pre-wrap break-words leading-relaxed ${
                            isUser
                              ? "bg-[#5B1657] text-white rounded-br-none shadow-xs text-right"
                              : "bg-white text-neutral-800 rounded-bl-none border border-[#F0E4EC] shadow-2xs text-right"
                          }`}
                        >
                          {m.content}
                        </div>
                      </div>
                    )
                  })
                ) : (
                  <p className="text-xs text-muted-foreground text-center py-4">لم يتم حفظ نصوص الرسائل لهذا الطلب.</p>
                )}
              </div>
            </div>

            {/* Modal Footer */}
            <div className="p-4 bg-white border-t border-[#F0E4EC] flex items-center justify-between">
              {selectedTranscriptReq.customerPhone && selectedTranscriptReq.customerPhone !== "لم يُسجل رقم" ? (
                <a
                  href={`https://wa.me/${selectedTranscriptReq.customerPhone.replace(/\D/g, "")}?text=${encodeURIComponent(
                    `مرحباً ${selectedTranscriptReq.customerName}، معك فريق متجر نسمة بخصوص طلبك المخصص رقم (${selectedTranscriptReq.id}). نتشرف بخدمتك!`
                  )}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center gap-2 bg-[#25D366] hover:bg-[#20bd5a] text-white px-5 py-2.5 rounded-full text-xs font-bold font-arabic transition shadow-xs cursor-pointer"
                >
                  <MessageCircle className="w-4 h-4" />
                  <span>متابعة وتأكيد بالواتساب</span>
                </a>
              ) : (
                <div />
              )}

              <button
                type="button"
                onClick={() => setSelectedTranscriptReq(null)}
                className="px-6 py-2.5 rounded-full bg-neutral-100 hover:bg-neutral-200 text-xs font-bold font-arabic text-neutral-700 transition cursor-pointer"
              >
                إغلاق
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}
