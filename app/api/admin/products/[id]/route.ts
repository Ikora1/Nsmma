import { NextResponse } from "next/server"
import { isAuthenticatedAdmin } from "@/lib/auth"
import { getStoreProductAsync, saveStoreProduct, deleteStoreProduct } from "@/lib/store-db"
import type { Product } from "@/lib/shopify"

export async function PUT(
  request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  const isAuth = await isAuthenticatedAdmin()
  if (!isAuth) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
  }

  try {
    const { id } = await params
    const existing = await getStoreProductAsync(id)
    if (!existing) {
      return NextResponse.json({ error: "الباقة غير موجودة" }, { status: 404 })
    }

    const body = await request.json()
    const updated: Product = {
      ...existing,
      ...body,
      id: existing.id, // keep immutable ID
      price: body.price !== undefined ? Number(body.price) : existing.price,
      originalPrice: body.originalPrice !== undefined ? (body.originalPrice ? Number(body.originalPrice) : null) : existing.originalPrice,
      descriptionHtml: `<p>${body.description || existing.description}</p>`,
    }

    const saved = saveStoreProduct(updated)
    return NextResponse.json({ success: true, product: saved })
  } catch (err) {
    console.error("[Update Product Error]:", err)
    return NextResponse.json({ error: "فشل تحديث الباقة" }, { status: 500 })
  }
}

export async function DELETE(
  request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  const isAuth = await isAuthenticatedAdmin()
  if (!isAuth) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
  }

  try {
    const { id } = await params
    const deleted = deleteStoreProduct(id)
    if (!deleted) {
      return NextResponse.json({ error: "الباقة غير موجودة" }, { status: 404 })
    }
    return NextResponse.json({ success: true })
  } catch (err) {
    console.error("[Delete Product Error]:", err)
    return NextResponse.json({ error: "فشل حذف الباقة" }, { status: 500 })
  }
}
