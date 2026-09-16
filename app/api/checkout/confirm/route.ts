import { NextRequest, NextResponse } from "next/server"
import { stripe } from "@/lib/stripe"
import { updateOrderStatusAsync, getStoreOrdersAsync } from "@/lib/orders-db"

export async function POST(req: NextRequest) {
  try {
    const { sessionId } = await req.json()
    if (!sessionId) {
      return NextResponse.json({ error: "Session ID required" }, { status: 400 })
    }

    // Retrieve the session from Stripe to verify status
    const session = await stripe.checkout.sessions.retrieve(sessionId)
    if (session.payment_status === "paid") {
      const orderId = session.metadata?.order_id
      if (orderId) {
        await updateOrderStatusAsync(orderId, "processing", "paid")
      }
      return NextResponse.json({ success: true, status: "paid", orderId })
    }

    return NextResponse.json({ success: true, status: session.payment_status })
  } catch (err: any) {
    console.error("Order confirmation error:", err)
    return NextResponse.json({ error: err.message || "Verification failed" }, { status: 500 })
  }
}
