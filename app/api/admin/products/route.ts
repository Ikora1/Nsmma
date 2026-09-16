import { NextResponse } from "next/server"
import { isAuthenticatedAdmin } from "@/lib/auth"
import { getStoreProductsAsync, saveStoreProduct } from "@/lib/store-db"
import type { Product } from "@/lib/shopify"

export async function GET() {
  const isAuth = await isAuthenticatedAdmin()
  if (!isAuth) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
  }
  const products = await getStoreProductsAsync()
  return NextResponse.json({ products })
}

export async function POST(request: Request) {
  const isAuth = await isAuthenticatedAdmin()
  if (!isAuth) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
  }

  try {
    const body = await request.json()
    const {
      name,
      id,
      description,
      price,
      originalPrice,
      productType,
      image,
      images,
      badge,
      availableForSale,
    } = body

    if (!name || !price) {
      return NextResponse.json({ error: "اسم الباقة وسعرها مطلوبان" }, { status: 400 })
    }

    const slug = id?.trim() || `nasmma-${Date.now()}`

    const newProduct: Product = {
      id: slug,
      shopifyId: `gid://shopify/Product/custom-${Date.now()}`,
      variantId: `gid://shopify/ProductVariant/custom-${Date.now()}`,
      name,
      description: description || "باقة ورد مخملي مشغول يدوياً من خيوط الغليون الفاخرة لتدوم لسنوات.",
      descriptionHtml: `<p>${description || "باقة ورد مخملي مشغول يدوياً من خيوط الغليون الفاخرة لتدوم لسنوات."}</p>`,
      price: Number(price),
      originalPrice: originalPrice ? Number(originalPrice) : null,
      currencyCode: "OMR",
      image: image || "/images/products/product-1.jpg",
      images: images && images.length > 0 ? images : [image || "/images/products/product-1.jpg"],
      badge: badge || null,
      category: "cream",
      productType: productType || "باقات الحب والعهود",
      availableForSale: availableForSale !== false,
      occasions: Array.isArray(body.occasions) ? body.occasions : [],
      colors: Array.isArray(body.colors) ? body.colors : [],
      salesCount: body.salesCount ? Number(body.salesCount) : Math.floor(Math.random() * 200) + 150,
      rating: body.rating ? Number(body.rating) : 5.0,
      reviewsCount: body.reviewsCount ? Number(body.reviewsCount) : Math.floor(Math.random() * 50) + 20,
      createdAt: new Date().toISOString(),
    }

    const saved = saveStoreProduct(newProduct)
    return NextResponse.json({ success: true, product: saved })
  } catch (err) {
    console.error("[Create Product Error]:", err)
    return NextResponse.json({ error: "فشل حفظ الباقة الجديدة" }, { status: 500 })
  }
}
