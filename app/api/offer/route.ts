import { NextResponse } from "next/server"
import { getStoreOfferAsync } from "@/lib/store-db"

export async function GET() {
  try {
    const offer = await getStoreOfferAsync()
    return NextResponse.json({ offer })
  } catch (err) {
    return NextResponse.json({ offer: null }, { status: 500 })
  }
}
