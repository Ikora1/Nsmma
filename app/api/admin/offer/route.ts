import { NextResponse } from "next/server"
import { isAuthenticatedAdmin } from "@/lib/auth"
import { getStoreOfferAsync, saveStoreOffer } from "@/lib/store-db"
import type { StoreOffer } from "@/lib/store-db"

export async function GET() {
  const isAuth = await isAuthenticatedAdmin()
  if (!isAuth) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
  }
  const offer = await getStoreOfferAsync()
  return NextResponse.json({ offer })
}

export async function POST(request: Request) {
  const isAuth = await isAuthenticatedAdmin()
  if (!isAuth) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
  }

  try {
    const body = await request.json()
    const current = await getStoreOfferAsync()

    const updated: StoreOffer = {
      ...current,
      ...body,
      discountPercentage: Number(body.discountPercentage) || 10,
    }

    const saved = saveStoreOffer(updated)
    return NextResponse.json({ success: true, offer: saved })
  } catch (err) {
    console.error("[Update Offer Error]:", err)
    return NextResponse.json({ error: "فشل تحديث العرض الترويجي" }, { status: 500 })
  }
}
