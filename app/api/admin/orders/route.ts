import { NextResponse } from "next/server"
import { isAuthenticatedAdmin } from "@/lib/auth"
import { getStoreOrdersAsync, updateOrderStatusAsync } from "@/lib/orders-db"

export async function GET() {
  const isAuth = await isAuthenticatedAdmin()
  if (!isAuth) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
  }

  try {
    const orders = await getStoreOrdersAsync()
    return NextResponse.json({ orders })
  } catch (err) {
    console.error("[Get Orders Error]:", err)
    return NextResponse.json({ error: "فشل جلب الطلبات" }, { status: 500 })
  }
}

export async function PATCH(request: Request) {
  const isAuth = await isAuthenticatedAdmin()
  if (!isAuth) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
  }

  try {
    const body = await request.json()
    const { orderId, deliveryStatus, paymentStatus } = body

    if (!orderId || !deliveryStatus) {
      return NextResponse.json({ error: "بيانات غير مكتملة" }, { status: 400 })
    }

    const success = await updateOrderStatusAsync(orderId, deliveryStatus, paymentStatus)
    if (!success) {
      return NextResponse.json({ error: "لم يتم العثور على الطلب" }, { status: 404 })
    }

    return NextResponse.json({ success: true })
  } catch (err) {
    console.error("[Update Order Error]:", err)
    return NextResponse.json({ error: "فشل تحديث حالة الطلب" }, { status: 500 })
  }
}
