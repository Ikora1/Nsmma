import fs from "fs"
import path from "path"
import type { Product } from "./shopify"
import { getSupabaseAdmin, isSupabaseConfigured } from "./supabase"

export type StoreOffer = {
  id: string
  enabled: boolean
  title: string
  subtitle: string
  discountPercentage: number
  couponCode: string
  badgeText: string
  buttonText: string
  imageUrl: string
  createdAt: string
}

export type StoreData = {
  products: Product[]
  offer: StoreOffer
  categories?: string[]
}

const DATA_DIR = path.join(process.cwd(), "data")
const DATA_FILE = path.join(DATA_DIR, "store-data.json")

export const DEFAULT_CATEGORIES: string[] = [
  "باقات الحب والعهود",
  "مسكات ليلة العمر",
  "مزهريات الدوام والمكتب",
  "توزيعات وبوكسات هدايا",
]

const INITIAL_OFFER: StoreOffer = {
  id: "welcome-offer-10",
  enabled: true,
  title: "هـديـة نَـسْـمَـة لـك · خـصـم 10% عـلـى أول طـلـب",
  subtitle: "اصنع ذكرى لا تُنسى مع أحبابك بوردة مخملية تدوم لسنوات. استخدم الكود واحصل على خصم فوري 10% على جميع الباقات.",
  discountPercentage: 10,
  couponCode: "NASMMA10",
  badgeText: "عـرض مـحـدود",
  buttonText: "تـفـعـيـل الـخـصـم واسـتـكـشـاف الـبـاقـات",
  imageUrl: "/images/products/product-1.jpg",
  createdAt: new Date().toISOString()
}

const INITIAL_PRODUCTS: Product[] = [
  {
    id: "dawn-serenade",
    shopifyId: "gid://shopify/Product/nasmma-1",
    variantId: "gid://shopify/ProductVariant/nasmma-v1",
    name: "بـاقـة فـجـر الـمـحـبـة",
    description: "باقة ورد مخملي وردي مشغول يدوياً حبة حبة، مربوطة بشريط حرير ناعم مع كرت نسمة البنفسجي.",
    descriptionHtml: "<p>وردة ناعمة ودافئة مثل الصباحات الهادية. نسجناها بيدينا من خيوط الغليون المخملية عشان تظل في غرفته سنين، وكل ما طالع فيها تذكر ضحكتك وكلامك الطيب. تشمل كرت نسمة البنفسجي الأنيق لكتابة رسالتك الخاصة.</p>",
    price: 18.5,
    originalPrice: 22,
    currencyCode: "OMR",
    image: "/images/products/product-1.jpg",
    images: ["/images/products/product-1.jpg", "/images/products/product-1-alt.jpg"],
    badge: "Sale",
    category: "cream",
    productType: "باقات الحب والعهود",
    availableForSale: true,
    occasions: ["عيد ميلاد", "حب وذكرى سنوية", "شكر وامتنان", "اعتذار"],
    colors: ["وردي", "أبيض"],
    salesCount: 487,
    rating: 4.9,
    reviewsCount: 68,
    createdAt: "2026-02-15T10:00:00.000Z"
  },
  {
    id: "velvet-whisper",
    shopifyId: "gid://shopify/Product/nasmma-2",
    variantId: "gid://shopify/ProductVariant/nasmma-v2",
    name: "مـسـكـة هـمـس الـمـخـمـل",
    description: "مسكة عروس مخملية بلون التوت الملكي مع مقبض مطرّز بحبات اللؤلؤ الفاخر، صُنعت لتدوم كل العمر.",
    descriptionHtml: "<p>ليلة عرسك تستاهل مسكة تعيش معك ولا تذبل بعد ليلة الفرح. صممناها ببتلات مخملية قرمزية مطعمة باللؤلؤ، عشان تحطينها في بيتك الجديد وتظل شاهدة على أصدق عهد بينكم.</p>",
    price: 24,
    originalPrice: 28,
    currencyCode: "OMR",
    image: "/images/products/product-2.jpg",
    images: ["/images/products/product-2.jpg", "/images/products/product-2-alt.jpg"],
    badge: "Bestseller",
    category: "cream",
    productType: "مسكات ليلة العمر",
    availableForSale: true,
    occasions: ["زفاف", "مسكة عروس", "ملكة وعقد قران"],
    colors: ["أحمر", "أبيض"],
    salesCount: 394,
    rating: 5.0,
    reviewsCount: 52,
    createdAt: "2026-03-01T12:00:00.000Z"
  },
  {
    id: "garden-lily-symphony",
    shopifyId: "gid://shopify/Product/nasmma-3",
    variantId: "gid://shopify/ProductVariant/nasmma-v3",
    name: "مـزهـريـة سـحـر الـبـسـتـان",
    description: "مزهرية خزفية منقطة تضم زنابق مخملية ملونة مشغولة بحرفية يدوية عالية لتجميل صدر بيتك.",
    descriptionHtml: "<p>قطعة فنية تجيب ربيع الطبيعة لوسط صالتك بدون أي تعب سقاية أو ذبول. ألوان هادئة تنبض بالحياة والدفء، مصنوعة لتبقى سنين بنفس الرونق والجمال.</p>",
    price: 16.5,
    originalPrice: null,
    currencyCode: "OMR",
    image: "/images/products/product-3.jpg",
    images: ["/images/products/product-3.jpg", "/images/products/product-3-alt.jpg"],
    badge: "New",
    category: "cream",
    productType: "مزهريات الدوام والمكتب",
    availableForSale: true,
    occasions: ["منزل جديد", "شكر وامتنان", "عيد ميلاد"],
    colors: ["وردي", "أبيض", "أصفر"],
    salesCount: 285,
    rating: 4.8,
    reviewsCount: 39,
    createdAt: "2026-03-10T14:00:00.000Z"
  },
  {
    id: "golden-solstice",
    shopifyId: "gid://shopify/Product/nasmma-4",
    variantId: "gid://shopify/ProductVariant/nasmma-v4",
    name: "بـاقـة شـمـس الـضـحـى",
    description: "أزهار دوار شمس مخملية مبهجة تبث الأمل والنور في يوم من تحب، وتبقى زاهية للأبد.",
    descriptionHtml: "<p>شمس ما تغيب... تهديها لشخص يمر بأيام صعبة أو خريج يحتفل بإنجازه، عشان كل ما شافها على مكتبه يتذكر إنك نوره وسنده الدائم.</p>",
    price: 14,
    originalPrice: 17,
    currencyCode: "OMR",
    image: "/images/products/product-4.jpg",
    images: ["/images/products/product-4.jpg", "/images/products/product-4-alt.jpg"],
    badge: "Sale",
    category: "cream",
    productType: "باقات الحب والعهود",
    availableForSale: true,
    occasions: ["تخرج ونجاح", "عيد ميلاد", "شكر وامتنان"],
    colors: ["أصفر", "أبيض"],
    salesCount: 341,
    rating: 4.9,
    reviewsCount: 47,
    createdAt: "2026-01-20T08:00:00.000Z"
  },
  {
    id: "breeze-of-jasmine",
    shopifyId: "gid://shopify/Product/nasmma-5",
    variantId: "gid://shopify/ProductVariant/nasmma-v5",
    name: "بـاقـة فـجـر الـيـاسـمـيـن",
    description: "زنابق بيضاء نقية من خيوط الغليون الفاخرة تعكس الهدوء والامتنان العظيم لأغلى الناس.",
    descriptionHtml: "<p>بيضاء وصافية كقلب الوالدة. هدية مثالية للأم أو للاعتذار الصادق لشخص غالي، تذكره دائماً بصفاء نيتك ومكانته الأزلية بقلبك.</p>",
    price: 15.5,
    originalPrice: null,
    currencyCode: "OMR",
    image: "/images/products/product-5.jpg",
    images: ["/images/products/product-5.jpg", "/images/products/product-5-alt.jpg"],
    badge: "Bestseller",
    category: "cream",
    productType: "باقات الحب والعهود",
    availableForSale: true,
    occasions: ["حب وذكرى سنوية", "اعتذار", "شكر وامتنان"],
    colors: ["أبيض"],
    salesCount: 412,
    rating: 5.0,
    reviewsCount: 63,
    createdAt: "2026-02-28T09:00:00.000Z"
  },
  {
    id: "blushing-twilight",
    shopifyId: "gid://shopify/Product/nasmma-6",
    variantId: "gid://shopify/ProductVariant/nasmma-v6",
    name: "ثـنـائـيـة بـتـلات الـشـفـق",
    description: "مزهريتان زجاجيتان مضلعتان بأغصان زهرية ناعمة تخطف الضوء وتهدي المكان لمسة سكينة.",
    descriptionHtml: "<p>تنسيق عصري راقي يوضع على طاولة السرير أو زاوية القراءة. ملمس ناعم وألوان باستيلية تهدئ النفس وتعطيك نسمة راحة بعد يوم عمل طويل.</p>",
    price: 19,
    originalPrice: null,
    currencyCode: "OMR",
    image: "/images/products/product-6.jpg",
    images: ["/images/products/product-6.jpg", "/images/products/product-6-alt.jpg"],
    badge: "New",
    category: "cream",
    productType: "مزهريات الدوام والمكتب",
    availableForSale: true,
    occasions: ["منزل جديد", "عيد ميلاد", "حب وذكرى سنوية"],
    colors: ["وردي", "بنفسجي"],
    salesCount: 220,
    rating: 4.8,
    reviewsCount: 31,
    createdAt: "2026-03-05T11:00:00.000Z"
  },
  {
    id: "elysian-blue-bell",
    shopifyId: "gid://shopify/Product/nasmma-7",
    variantId: "gid://shopify/ProductVariant/nasmma-v7",
    name: "بـاقـة روضـة الأقـحـوان",
    description: "أزهار برية بدرجات الأزرق واللافندر السماوي، صُممت لتكون سلاماً وذكراً لا يغيب عن البال.",
    descriptionHtml: "<p>مستوحاة من أزهار البراري الحرة. تهديها لشخص مسافر أو صديق بعيد عن العين، وتقول له: 'أنا مو جنبك اليوم، بس وردتي بتظل عندك تذكرك بضحكاتنا سوا'.</p>",
    price: 12.5,
    originalPrice: 15,
    currencyCode: "OMR",
    image: "/images/products/product-7.jpg",
    images: ["/images/products/product-7.jpg", "/images/products/product-7-alt.jpg"],
    badge: "Sale",
    category: "cream",
    productType: "باقات الحب والعهود",
    availableForSale: true,
    occasions: ["تخرج ونجاح", "شكر وامتنان", "حب وذكرى سنوية"],
    colors: ["أزرق", "بنفسجي"],
    salesCount: 308,
    rating: 4.9,
    reviewsCount: 44,
    createdAt: "2026-01-15T15:00:00.000Z"
  },
  {
    id: "lavender-twilight",
    shopifyId: "gid://shopify/Product/nasmma-8",
    variantId: "gid://shopify/ProductVariant/nasmma-v8",
    name: "بـاقـة نـسـمـة الـورد",
    description: "باقة نسمة المميزة بدرجات الوردي واللافندر الفاخر مع بطاقة الإهداء الفاخرة وشريط الأورجانزا.",
    descriptionHtml: "<p>الباقة الأيقونية التي تحمل اسم 'نسمة'. تم نسج كل بتلة فيها بعناية فائقة لتكون الهدية الأصدق لكل مناسبة مفاجئة تعبر فيها عن حبك بدون أي سبب مسبق.</p>",
    price: 21,
    originalPrice: null,
    currencyCode: "OMR",
    image: "/images/products/product-8.jpg",
    images: ["/images/products/product-8.jpg", "/images/products/product-8-alt.jpg"],
    badge: "Bestseller",
    category: "cream",
    productType: "باقات الحب والعهود",
    availableForSale: true,
    occasions: ["عيد ميلاد", "حب وذكرى سنوية", "زفاف", "شكر وامتنان"],
    colors: ["بنفسجي", "وردي"],
    salesCount: 512,
    rating: 5.0,
    reviewsCount: 89,
    createdAt: "2026-02-01T16:00:00.000Z"
  },
]

function ensureLocalDataFile(): StoreData {
  try {
    if (!fs.existsSync(DATA_DIR)) {
      fs.mkdirSync(DATA_DIR, { recursive: true })
    }
    if (!fs.existsSync(DATA_FILE)) {
      const initialData: StoreData = {
        products: INITIAL_PRODUCTS,
        offer: INITIAL_OFFER,
        categories: DEFAULT_CATEGORIES,
      }
      fs.writeFileSync(DATA_FILE, JSON.stringify(initialData, null, 2), "utf8")
      return initialData
    }
    const raw = fs.readFileSync(DATA_FILE, "utf8")
    const parsed = JSON.parse(raw) as StoreData
    if (!parsed.products || !Array.isArray(parsed.products)) {
      parsed.products = INITIAL_PRODUCTS
    }
    if (!parsed.offer) {
      parsed.offer = INITIAL_OFFER
    }
    if (!parsed.categories || !Array.isArray(parsed.categories) || parsed.categories.length === 0) {
      parsed.categories = DEFAULT_CATEGORIES
    }
    return parsed
  } catch (err) {
    console.error("[Nasmma DB] Error reading local store-data.json:", err)
    return {
      products: INITIAL_PRODUCTS,
      offer: INITIAL_OFFER,
      categories: DEFAULT_CATEGORIES,
    }
  }
}

function writeLocalDataFile(data: StoreData): void {
  try {
    if (!fs.existsSync(DATA_DIR)) {
      fs.mkdirSync(DATA_DIR, { recursive: true })
    }
    fs.writeFileSync(DATA_FILE, JSON.stringify(data, null, 2), "utf8")
  } catch (err) {
    console.error("[Nasmma DB] Error writing local store-data.json:", err)
  }
}

// -------------------------------------------------------------
// Core Database Accessors with Supabase Sync & Local Fallback
// -------------------------------------------------------------

export function getStoreProducts(): Product[] {
  const data = ensureLocalDataFile()
  return data.products
}

export async function getStoreProductsAsync(): Promise<Product[]> {
  if (isSupabaseConfigured()) {
    try {
      const supabase = getSupabaseAdmin()
      if (supabase) {
        const { data, error } = await supabase
          .from("nasmma_products")
          .select("*")
          .order("created_at", { ascending: false })

        if (!error && data && data.length > 0) {
          return data.map((item: any) => ({
            id: item.id,
            shopifyId: item.shopify_id || `gid://shopify/Product/${item.id}`,
            variantId: item.variant_id || `gid://shopify/ProductVariant/${item.id}`,
            name: item.name,
            description: item.description || "",
            descriptionHtml: item.description_html || `<p>${item.description || ""}</p>`,
            price: Number(item.price),
            originalPrice: item.original_price ? Number(item.original_price) : null,
            currencyCode: item.currency_code || "OMR",
            image: item.image,
            images: Array.isArray(item.images) && item.images.length > 0 ? item.images : [item.image],
            badge: item.badge || null,
            category: (item.category || "cream") as Product["category"],
            productType: item.product_type || "باقات الحب والعهود",
            availableForSale: item.available_for_sale !== false,
            occasions: item.occasions || [],
            colors: item.colors || [],
            salesCount: item.sales_count || 300,
            rating: item.rating || 4.9,
            reviewsCount: item.reviews_count || 45,
            createdAt: item.created_at || new Date().toISOString(),
          }))
        }
      }
    } catch (err) {
      console.error("[Supabase Fetch Error, falling back to local]:", err)
    }
  }
  return getStoreProducts()
}

export function getStoreProduct(id: string): Product | null {
  const data = ensureLocalDataFile()
  return data.products.find((p) => p.id === id) ?? null
}

export async function getStoreProductAsync(id: string): Promise<Product | null> {
  if (isSupabaseConfigured()) {
    try {
      const supabase = getSupabaseAdmin()
      if (supabase) {
        const { data, error } = await supabase
          .from("nasmma_products")
          .select("*")
          .eq("id", id)
          .maybeSingle()

        if (!error && data) {
          return {
            id: data.id,
            shopifyId: data.shopify_id || `gid://shopify/Product/${data.id}`,
            variantId: data.variant_id || `gid://shopify/ProductVariant/${data.id}`,
            name: data.name,
            description: data.description || "",
            descriptionHtml: data.description_html || `<p>${data.description || ""}</p>`,
            price: Number(data.price),
            originalPrice: data.original_price ? Number(data.original_price) : null,
            currencyCode: data.currency_code || "OMR",
            image: data.image,
            images: Array.isArray(data.images) && data.images.length > 0 ? data.images : [data.image],
            badge: data.badge || null,
            category: (data.category || "cream") as Product["category"],
            productType: data.product_type || "باقات الحب والعهود",
            availableForSale: data.available_for_sale !== false,
            occasions: data.occasions || [],
            colors: data.colors || [],
            salesCount: data.sales_count || 300,
            rating: data.rating || 4.9,
            reviewsCount: data.reviews_count || 45,
            createdAt: data.created_at || new Date().toISOString(),
          }
        }
      }
    } catch (err) {
      console.error("[Supabase Single Product Fetch Error]:", err)
    }
  }
  return getStoreProduct(id)
}

export function saveStoreProduct(product: Product): Product {
  const data = ensureLocalDataFile()
  const existingIdx = data.products.findIndex((p) => p.id === product.id)
  if (existingIdx >= 0) {
    data.products[existingIdx] = {
      ...data.products[existingIdx],
      ...product,
    }
  } else {
    data.products.unshift(product)
  }
  writeLocalDataFile(data)

  // Async sync to Supabase if configured
  if (isSupabaseConfigured()) {
    const supabase = getSupabaseAdmin()
    if (supabase) {
      supabase
        .from("nasmma_products")
        .upsert({
          id: product.id,
          shopify_id: product.shopifyId,
          variant_id: product.variantId,
          name: product.name,
          description: product.description,
          description_html: product.descriptionHtml,
          price: product.price,
          original_price: product.originalPrice,
          currency_code: product.currencyCode || "OMR",
          image: product.image,
          images: product.images,
          badge: product.badge,
          category: product.category,
          product_type: product.productType,
          available_for_sale: product.availableForSale,
          occasions: product.occasions || [],
          colors: product.colors || [],
          sales_count: product.salesCount || 300,
          rating: product.rating || 4.9,
          reviews_count: product.reviewsCount || 45,
        })
        .then(({ error }) => {
          if (error) console.error("[Supabase Sync Error]:", error)
        }, console.error)
    }
  }

  return product
}

export function deleteStoreProduct(id: string): boolean {
  const data = ensureLocalDataFile()
  const initialLen = data.products.length
  data.products = data.products.filter((p) => p.id !== id)
  if (data.products.length !== initialLen) {
    writeLocalDataFile(data)

    if (isSupabaseConfigured()) {
      const supabase = getSupabaseAdmin()
      if (supabase) {
        supabase
          .from("nasmma_products")
          .delete()
          .eq("id", id)
          .then(({ error }) => {
            if (error) console.error("[Supabase Delete Product Error]:", error)
          }, console.error)
      }
    }
    return true
  }
  return false
}

// -------------------------------------------------------------
// Product Categories / Types Management
// -------------------------------------------------------------

export function getStoreCategories(): string[] {
  const data = ensureLocalDataFile()
  const categoriesSet = new Set<string>(data.categories || DEFAULT_CATEGORIES)
  // Also include any types from existing products
  data.products.forEach((p) => {
    if (p.productType) categoriesSet.add(p.productType)
  })
  return Array.from(categoriesSet).filter(Boolean)
}

export async function getStoreCategoriesAsync(): Promise<string[]> {
  if (isSupabaseConfigured()) {
    try {
      const supabase = getSupabaseAdmin()
      if (supabase) {
        const { data, error } = await supabase
          .from("nasmma_categories")
          .select("name")
          .order("name")

        if (!error && data && data.length > 0) {
          const list = data.map((d: any) => d.name).filter(Boolean)
          return Array.from(new Set([...DEFAULT_CATEGORIES, ...list]))
        }
      }
    } catch (err) {
      console.warn("[Supabase Categories Fetch fallback]:", err)
    }
  }
  return getStoreCategories()
}

export async function saveStoreCategoriesAsync(categories: string[]): Promise<string[]> {
  const data = ensureLocalDataFile()
  const cleanList = Array.from(new Set(categories.map((c) => c.trim()).filter(Boolean)))
  data.categories = cleanList
  writeLocalDataFile(data)

  if (isSupabaseConfigured()) {
    const supabase = getSupabaseAdmin()
    if (supabase) {
      try {
        const rows = cleanList.map((name) => ({ name }))
        await supabase.from("nasmma_categories").upsert(rows, { onConflict: "name" })
      } catch (err) {
        console.error("[Supabase Categories Save Error]:", err)
      }
    }
  }

  return cleanList
}

export async function addStoreCategoryAsync(category: string): Promise<string[]> {
  const trimmed = category.trim()
  if (!trimmed) return getStoreCategories()
  const current = getStoreCategories()
  if (!current.includes(trimmed)) {
    current.push(trimmed)
    return await saveStoreCategoriesAsync(current)
  }
  return current
}

export async function deleteStoreCategoryAsync(category: string): Promise<string[]> {
  const trimmed = category.trim()
  const current = getStoreCategories().filter((c) => c !== trimmed)
  return await saveStoreCategoriesAsync(current)
}

// -------------------------------------------------------------
// Store Offer Accessors
// -------------------------------------------------------------

export function getStoreOffer(): StoreOffer {
  const data = ensureLocalDataFile()
  return data.offer
}

export async function getStoreOfferAsync(): Promise<StoreOffer> {
  if (isSupabaseConfigured()) {
    try {
      const supabase = getSupabaseAdmin()
      if (supabase) {
        const { data, error } = await supabase
          .from("nasmma_offers")
          .select("*")
          .eq("id", "welcome-offer-10")
          .maybeSingle()

        if (!error && data) {
          return {
            id: data.id,
            enabled: data.enabled !== false,
            title: data.title || INITIAL_OFFER.title,
            subtitle: data.subtitle || INITIAL_OFFER.subtitle,
            discountPercentage: Number(data.discount_percentage) || INITIAL_OFFER.discountPercentage,
            couponCode: data.coupon_code || INITIAL_OFFER.couponCode,
            badgeText: data.badge_text || INITIAL_OFFER.badgeText,
            buttonText: data.button_text || INITIAL_OFFER.buttonText,
            imageUrl: data.image_url || INITIAL_OFFER.imageUrl,
            createdAt: data.created_at || INITIAL_OFFER.createdAt,
          }
        }
      }
    } catch (err) {
      console.error("[Supabase Offer Fetch Error, falling back to local]:", err)
    }
  }
  return getStoreOffer()
}

export function saveStoreOffer(offer: StoreOffer): StoreOffer {
  const data = ensureLocalDataFile()
  data.offer = offer
  writeLocalDataFile(data)

  if (isSupabaseConfigured()) {
    const supabase = getSupabaseAdmin()
    if (supabase) {
      supabase
        .from("nasmma_offers")
        .upsert({
          id: offer.id,
          enabled: offer.enabled,
          title: offer.title,
          subtitle: offer.subtitle,
          discount_percentage: offer.discountPercentage,
          coupon_code: offer.couponCode,
          badge_text: offer.badgeText,
          button_text: offer.buttonText,
          image_url: offer.imageUrl,
        })
        .then(({ error }) => {
          if (error) console.error("[Supabase Offer Sync Error]:", error)
        }, console.error)
    }
  }

  return data.offer
}

export async function isAuthorizedAdminEmail(email?: string | null): Promise<boolean> {
  if (!email) return false
  const cleanEmail = email.trim().toLowerCase()

  // 1. Check environment variable ADMIN_EMAILS or ADMIN_EMAIL (comma-separated or single)
  const envEmails = (process.env.ADMIN_EMAILS || process.env.ADMIN_EMAIL || "")
    .split(",")
    .map((e) => e.trim().toLowerCase())
    .filter(Boolean)

  if (envEmails.includes(cleanEmail)) {
    return true
  }

  // 2. Check Supabase nasmma_admin_users whitelist table if configured
  if (isSupabaseConfigured()) {
    try {
      const supabase = getSupabaseAdmin()
      if (supabase) {
        const { data } = await supabase
          .from("nasmma_admin_users")
          .select("email")
          .eq("email", cleanEmail)
          .maybeSingle()

        if (data?.email) {
          return true
        }
      }
    } catch (err) {
      console.error("[Admin Whitelist Check Error]:", err)
    }
  }

  return false
}
