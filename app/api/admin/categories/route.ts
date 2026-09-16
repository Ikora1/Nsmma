import { NextResponse } from "next/server"
import { isAuthenticatedAdmin } from "@/lib/auth"
import { 
  getStoreCategoriesAsync, 
  addStoreCategoryAsync, 
  deleteStoreCategoryAsync, 
  saveStoreCategoriesAsync 
} from "@/lib/store-db"

export async function GET() {
  const isAuth = await isAuthenticatedAdmin()
  if (!isAuth) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
  }
  const categories = await getStoreCategoriesAsync()
  return NextResponse.json({ categories })
}

export async function POST(request: Request) {
  const isAuth = await isAuthenticatedAdmin()
  if (!isAuth) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
  }

  try {
    const body = await request.json()
    const { category, categories } = body

    if (categories && Array.isArray(categories)) {
      const updated = await saveStoreCategoriesAsync(categories)
      return NextResponse.json({ success: true, categories: updated })
    }

    if (!category || !category.trim()) {
      return NextResponse.json({ error: "اسم التصنيف / النوع مطلوب" }, { status: 400 })
    }

    const updated = await addStoreCategoryAsync(category.trim())
    return NextResponse.json({ success: true, categories: updated })
  } catch (err: any) {
    console.error("[Categories API POST Error]:", err)
    return NextResponse.json({ error: err?.message || "فشل حفظ التصنيف" }, { status: 500 })
  }
}

export async function DELETE(request: Request) {
  const isAuth = await isAuthenticatedAdmin()
  if (!isAuth) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
  }

  try {
    const { searchParams } = new URL(request.url)
    const category = searchParams.get("name")

    if (!category) {
      return NextResponse.json({ error: "اسم التصنيف مطلوب" }, { status: 400 })
    }

    const updated = await deleteStoreCategoryAsync(category)
    return NextResponse.json({ success: true, categories: updated })
  } catch (err: any) {
    console.error("[Categories API DELETE Error]:", err)
    return NextResponse.json({ error: err?.message || "فشل حذف التصنيف" }, { status: 500 })
  }
}
