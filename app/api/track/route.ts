import { NextResponse } from "next/server"
import { findOrderByQueryAsync } from "@/lib/orders-db"

export async function POST(request: Request) {
  try {
    const body = await request.json()
    const { query } = body

    if (!query || typeof query !== "string" || !query.trim()) {
      return NextResponse.json({ error: "يرجى إدخال رقم الطلب أو رقم الهاتف المسجل" }, { status: 400 })
    }

    const order = await findOrderByQueryAsync(query.trim())

    if (!order) {
      return NextResponse.json({ 
        error: "لم نتمكن من العثور على أي طلب يطابق هذا الرقم. يرجى التأكد من رقم الطلب (مثال: NASMMA-OM-DEMO01) أو رقم هاتفك." 
      }, { status: 404 })
    }

    // Return sanitized tracking payload
    return NextResponse.json({
      success: true,
      order: {
        orderId: order.orderId,
        customerName: order.customerName,
        customerPhone: order.customerPhone.replace(/(\d{3})\d{4}(\d{2})/, "$1****$2"), // privacy mask
        governorate: order.governorate,
        deliveryAddress: order.deliveryAddress,
        deliveryStatus: order.deliveryStatus,
        paymentStatus: order.paymentStatus,
        amountOmr: order.amountOmr,
        currency: order.currency,
        items: order.items,
        giftMessage: order.giftMessage,
        createdAt: order.createdAt,
      }
    })
  } catch (err: any) {
    console.error("[Track API Error]:", err)
    return NextResponse.json({ error: "حدث خطأ أثناء البحث عن الطلب" }, { status: 500 })
  }
}
