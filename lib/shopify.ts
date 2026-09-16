import "server-only"

const API_VERSION = "2025-04"

type ShopifyFetchOptions = {
  query: string
  variables?: Record<string, unknown>
  cache?: RequestCache
  tags?: string[]
}

export async function shopifyFetch<T>({ query, variables, cache = "force-cache", tags }: ShopifyFetchOptions): Promise<T> {
  const storeDomain = process.env.SHOPIFY_STORE_DOMAIN
  const accessToken = process.env.SHOPIFY_STOREFRONT_ACCESS_TOKEN

  if (!storeDomain || !accessToken) {
    throw new Error("Missing Shopify environment variables")
  }

  const endpoint = `https://${storeDomain}/api/${API_VERSION}/graphql.json`

  const res = await fetch(endpoint, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      "X-Shopify-Storefront-Access-Token": accessToken,
    },
    body: JSON.stringify({ query, variables }),
    cache,
    ...(tags ? { next: { tags } } : {}),
  })

  if (!res.ok) {
    throw new Error(`Shopify fetch failed: ${res.status} ${res.statusText}`)
  }

  const body = await res.json()

  if (body.errors) {
    console.log("[v0] Shopify GraphQL errors:", JSON.stringify(body.errors))
    throw new Error(body.errors[0]?.message ?? "Shopify GraphQL error")
  }

  return body.data as T
}

// ---- Types ----

export type Product = {
  id: string // handle, used as the route id
  shopifyId: string
  variantId: string
  name: string
  description: string
  descriptionHtml: string
  price: number
  originalPrice: number | null
  currencyCode: string
  image: string
  images: string[]
  badge: string | null
  category: "cream" | "oil" | "serum"
  productType: string
  availableForSale: boolean
}

type ShopifyImage = { url: string; altText: string | null }

type ShopifyProductNode = {
  id: string
  handle: string
  title: string
  description: string
  descriptionHtml: string
  productType: string
  tags: string[]
  featuredImage: ShopifyImage | null
  images: { edges: { node: ShopifyImage }[] }
  priceRange: { minVariantPrice: { amount: string; currencyCode: string } }
  compareAtPriceRange: { minVariantPrice: { amount: string } }
  variants: {
    edges: { node: { id: string; availableForSale: boolean } }[]
  }
}

const PRODUCT_FRAGMENT = `
  fragment ProductFields on Product {
    id
    handle
    title
    description
    descriptionHtml
    productType
    tags
    featuredImage { url altText }
    images(first: 6) { edges { node { url altText } } }
    priceRange { minVariantPrice { amount currencyCode } }
    compareAtPriceRange { minVariantPrice { amount } }
    variants(first: 1) { edges { node { id availableForSale } } }
  }
`

function mapCategory(productType: string): Product["category"] {
  const t = productType.toLowerCase()
  if (t === "oil") return "oil"
  if (t === "serum") return "serum"
  return "cream"
}

function mapBadge(tags: string[]): string | null {
  const lower = tags.map((t) => t.toLowerCase())
  if (lower.includes("sale")) return "Sale"
  if (lower.includes("new")) return "New"
  if (lower.includes("bestseller")) return "Bestseller"
  return null
}

function normalizeProduct(node: ShopifyProductNode): Product {
  const price = Number.parseFloat(node.priceRange.minVariantPrice.amount)
  const compareAt = Number.parseFloat(node.compareAtPriceRange?.minVariantPrice?.amount ?? "0")
  const images = node.images.edges.map((e) => e.node.url)

  return {
    id: node.handle,
    shopifyId: node.id,
    variantId: node.variants.edges[0]?.node.id ?? "",
    name: node.title,
    description: node.description,
    descriptionHtml: node.descriptionHtml,
    price,
    originalPrice: compareAt > price ? compareAt : null,
    currencyCode: node.priceRange.minVariantPrice.currencyCode,
    image: node.featuredImage?.url ?? images[0] ?? "/placeholder.svg",
    images: images.length ? images : node.featuredImage ? [node.featuredImage.url] : [],
    badge: mapBadge(node.tags),
    category: mapCategory(node.productType),
    productType: node.productType,
    availableForSale: node.variants.edges[0]?.node.availableForSale ?? false,
  }
}

export const MOCK_PRODUCTS: Product[] = [
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
  },
]

import { getStoreProductsAsync, getStoreProductAsync } from "./store-db"

export async function getProducts(): Promise<Product[]> {
  try {
    const data = await shopifyFetch<{ products: { edges: { node: ShopifyProductNode }[] } }>({
      query: `
        ${PRODUCT_FRAGMENT}
        query GetProducts {
          products(first: 50, sortKey: CREATED_AT) {
            edges { node { ...ProductFields } }
          }
        }
      `,
      tags: ["products"],
    })
    const fetched = data.products.edges.map((e) => normalizeProduct(e.node))
    return fetched.length > 0 ? fetched : await getStoreProductsAsync()
  } catch {
    return await getStoreProductsAsync()
  }
}

export async function getProduct(handle: string): Promise<Product | null> {
  try {
    const data = await shopifyFetch<{ product: ShopifyProductNode | null }>({
      query: `
        ${PRODUCT_FRAGMENT}
        query GetProduct($handle: String!) {
          product(handle: $handle) { ...ProductFields }
        }
      `,
      variables: { handle },
      tags: ["products"],
    })
    if (data.product) return normalizeProduct(data.product)
  } catch {
    // fallback to dynamic store products
  }
  return await getStoreProductAsync(handle)
}

// ---- Cart ----

export type Cart = {
  id: string
  checkoutUrl: string
  totalQuantity: number
  cost: {
    subtotalAmount: { amount: string; currencyCode: string }
    totalAmount: { amount: string; currencyCode: string }
  }
  lines: CartLine[]
}

export type CartLine = {
  id: string
  quantity: number
  merchandiseId: string
  productHandle: string
  title: string
  image: string
  price: number
  currencyCode: string
}

type ShopifyCart = {
  id: string
  checkoutUrl: string
  totalQuantity: number
  cost: {
    subtotalAmount: { amount: string; currencyCode: string }
    totalAmount: { amount: string; currencyCode: string }
  }
  lines: {
    edges: {
      node: {
        id: string
        quantity: number
        cost: { totalAmount: { amount: string; currencyCode: string } }
        merchandise: {
          id: string
          price: { amount: string; currencyCode: string }
          product: { handle: string; title: string; featuredImage: ShopifyImage | null }
        }
      }
    }[]
  }
}

const CART_FRAGMENT = `
  fragment CartFields on Cart {
    id
    checkoutUrl
    totalQuantity
    cost {
      subtotalAmount { amount currencyCode }
      totalAmount { amount currencyCode }
    }
    lines(first: 100) {
      edges {
        node {
          id
          quantity
          cost { totalAmount { amount currencyCode } }
          merchandise {
            ... on ProductVariant {
              id
              price { amount currencyCode }
              product { handle title featuredImage { url altText } }
            }
          }
        }
      }
    }
  }
`

function normalizeCart(cart: ShopifyCart): Cart {
  return {
    id: cart.id,
    checkoutUrl: cart.checkoutUrl,
    totalQuantity: cart.totalQuantity,
    cost: cart.cost,
    lines: cart.lines.edges.map((e) => ({
      id: e.node.id,
      quantity: e.node.quantity,
      merchandiseId: e.node.merchandise.id,
      productHandle: e.node.merchandise.product.handle,
      title: e.node.merchandise.product.title,
      image: e.node.merchandise.product.featuredImage?.url ?? "/placeholder.svg",
      price: Number.parseFloat(e.node.merchandise.price.amount),
      currencyCode: e.node.merchandise.price.currencyCode,
    })),
  }
}

type CartMutationResult = {
  cart: ShopifyCart | null
  userErrors?: { field: string[] | null; message: string }[]
  warnings?: { code: string; message: string }[]
}

function unwrapCart(result: CartMutationResult, op: string): Cart {
  if (result.userErrors && result.userErrors.length > 0) {
    console.log(`[v0] ${op} userErrors:`, JSON.stringify(result.userErrors))
    throw new Error(result.userErrors[0].message)
  }
  if (result.warnings && result.warnings.length > 0) {
    console.log(`[v0] ${op} warnings:`, JSON.stringify(result.warnings))
  }
  if (!result.cart) {
    throw new Error(`${op} returned no cart`)
  }
  return normalizeCart(result.cart)
}

// In-memory mock cart storage for fallback when Shopify credentials are not provided
const mockCarts = new Map<string, Cart>()

function createMockCart(id = `nasmma-cart-${Date.now()}`): Cart {
  const cart: Cart = {
    id,
    checkoutUrl: "/checkout",
    totalQuantity: 0,
    cost: {
      subtotalAmount: { amount: "0", currencyCode: "OMR" },
      totalAmount: { amount: "0", currencyCode: "OMR" },
    },
    lines: [],
  }
  mockCarts.set(id, cart)
  return cart
}

function recalculateMockCart(cart: Cart) {
  let totalQty = 0
  let subtotal = 0
  for (const line of cart.lines) {
    totalQty += line.quantity
    subtotal += line.price * line.quantity
  }
  cart.totalQuantity = totalQty
  cart.cost.subtotalAmount.amount = subtotal.toFixed(2)
  cart.cost.totalAmount.amount = subtotal.toFixed(2)
}

export async function createCart(): Promise<Cart> {
  try {
    const data = await shopifyFetch<{ cartCreate: CartMutationResult }>({
      query: `
        ${CART_FRAGMENT}
        mutation CreateCart {
          cartCreate {
            cart { ...CartFields }
            userErrors { field message }
          }
        }
      `,
      cache: "no-store",
    })
    return unwrapCart(data.cartCreate, "cartCreate")
  } catch {
    return createMockCart()
  }
}

export async function getCart(cartId: string): Promise<Cart | null> {
  try {
    const data = await shopifyFetch<{ cart: ShopifyCart | null }>({
      query: `
        ${CART_FRAGMENT}
        query GetCart($cartId: ID!) {
          cart(id: $cartId) { ...CartFields }
        }
      `,
      variables: { cartId },
      cache: "no-store",
    })
    return data.cart ? normalizeCart(data.cart) : null
  } catch {
    const cart = mockCarts.get(cartId) ?? createMockCart(cartId)
    // Ensure any existing items in cart are synced to current OMR prices
    const allProducts = await getStoreProductsAsync().catch(() => [])
    for (const line of cart.lines) {
      const prod =
        allProducts.find((p) => p.variantId === line.merchandiseId || p.id === line.productHandle) ||
        MOCK_PRODUCTS.find((p) => p.variantId === line.merchandiseId || p.id === line.productHandle)
      if (prod) {
        line.price = prod.price
        line.currencyCode = "OMR"
      }
    }
    recalculateMockCart(cart)
    return cart
  }
}

export async function addToCart(cartId: string, merchandiseId: string, quantity: number): Promise<Cart> {
  try {
    const data = await shopifyFetch<{ cartLinesAdd: CartMutationResult }>({
      query: `
        ${CART_FRAGMENT}
        mutation AddToCart($cartId: ID!, $lines: [CartLineInput!]!) {
          cartLinesAdd(cartId: $cartId, lines: $lines) {
            cart { ...CartFields }
            userErrors { field message }
            warnings { code message }
          }
        }
      `,
      variables: { cartId, lines: [{ merchandiseId, quantity }] },
      cache: "no-store",
    })
    return unwrapCart(data.cartLinesAdd, "cartLinesAdd")
  } catch {
    let cart = mockCarts.get(cartId)
    if (!cart) cart = createMockCart(cartId)
    
    // Lookup product price from dynamic store database first
    const dynamicProducts = await getStoreProductsAsync().catch(() => [])
    const product = 
      dynamicProducts.find((p) => p.variantId === merchandiseId || p.id === merchandiseId || p.shopifyId === merchandiseId) ||
      MOCK_PRODUCTS.find((p) => p.variantId === merchandiseId || p.id === merchandiseId) || 
      MOCK_PRODUCTS[0]

    const existingIndex = cart.lines.findIndex((l) => l.merchandiseId === merchandiseId)
    if (existingIndex >= 0) {
      cart.lines[existingIndex].quantity += quantity
      // Ensure updated OMR price is applied
      cart.lines[existingIndex].price = product.price
      cart.lines[existingIndex].currencyCode = "OMR"
    } else {
      cart.lines.push({
        id: `line-${Date.now()}-${Math.random().toString(36).substring(2, 6)}`,
        quantity,
        merchandiseId,
        productHandle: product.id,
        title: product.name,
        image: product.image,
        price: product.price,
        currencyCode: "OMR",
      })
    }
    recalculateMockCart(cart)
    return cart
  }
}

export async function updateCartLine(cartId: string, lineId: string, quantity: number): Promise<Cart> {
  try {
    const data = await shopifyFetch<{ cartLinesUpdate: CartMutationResult }>({
      query: `
        ${CART_FRAGMENT}
        mutation UpdateCartLine($cartId: ID!, $lines: [CartLineUpdateInput!]!) {
          cartLinesUpdate(cartId: $cartId, lines: $lines) {
            cart { ...CartFields }
            userErrors { field message }
          }
        }
      `,
      variables: { cartId, lines: [{ id: lineId, quantity }] },
      cache: "no-store",
    })
    return unwrapCart(data.cartLinesUpdate, "cartLinesUpdate")
  } catch {
    const cart = mockCarts.get(cartId)
    if (cart) {
      const idx = cart.lines.findIndex((l) => l.id === lineId)
      if (idx >= 0) {
        if (quantity <= 0) {
          cart.lines.splice(idx, 1)
        } else {
          cart.lines[idx].quantity = quantity
        }
      }
      recalculateMockCart(cart)
      return cart
    }
    return createMockCart(cartId)
  }
}

export async function removeCartLine(cartId: string, lineId: string): Promise<Cart> {
  try {
    const data = await shopifyFetch<{ cartLinesRemove: CartMutationResult }>({
      query: `
        ${CART_FRAGMENT}
        mutation RemoveCartLine($cartId: ID!, $lineIds: [ID!]!) {
          cartLinesRemove(cartId: $cartId, lineIds: $lineIds) {
            cart { ...CartFields }
            userErrors { field message }
          }
        }
      `,
      variables: { cartId, lineIds: [lineId] },
      cache: "no-store",
    })
    return unwrapCart(data.cartLinesRemove, "cartLinesRemove")
  } catch {
    const cart = mockCarts.get(cartId)
    if (cart) {
      cart.lines = cart.lines.filter((l) => l.id !== lineId)
      recalculateMockCart(cart)
      return cart
    }
    return createMockCart(cartId)
  }
}
