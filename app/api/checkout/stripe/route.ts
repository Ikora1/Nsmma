import { NextRequest, NextResponse } from 'next/server'
import { stripe, calculateStripeSubunit, OMAN_GOVERNORATES } from '@/lib/stripe'
import { saveStoreOrderAsync } from '@/lib/orders-db'

export async function POST(req: NextRequest) {
  try {
    if (!process.env.STRIPE_SECRET_KEY) {
      return NextResponse.json(
        {
          error: 'Stripe API key is not configured. Please add STRIPE_SECRET_KEY to your .env.local',
        },
        { status: 500 }
      )
    }

    const body = await req.json()
    const {
      items,
      customerName,
      customerPhone,
      customerEmail,
      governorateId,
      deliveryAddress,
      giftMessage,
      discountCode,
    } = body

    if (!items || !Array.isArray(items) || items.length === 0) {
      return NextResponse.json({ error: 'سلة المشتريات فارغة' }, { status: 400 })
    }

    if (!customerName || !customerPhone) {
      return NextResponse.json(
        { error: 'الاسم ورقم هاتف المستلم في عُمان مطلوبان' },
        { status: 400 }
      )
    }

    // Determine host / origin for redirects
    const origin = req.headers.get('origin') || process.env.NEXT_PUBLIC_APP_URL || 'http://localhost:3000'

    // Find governorate delivery fee
    const selectedGov = OMAN_GOVERNORATES.find((g) => g.id === governorateId) || OMAN_GOVERNORATES[0]
    const deliveryFeeOmr = selectedGov.deliveryFeeOmr

    // Build Stripe Line Items dynamically based on active account currency
    const line_items = items.map((item: { name: string; price: number; quantity: number; image?: string }) => {
      const calculation = calculateStripeSubunit(item.price)
      return {
        price_data: {
          currency: calculation.currency,
          product_data: {
            name: `${item.name} (${item.price} ر.ع)`,
            ...(item.image ? { images: [item.image.startsWith('http') ? item.image : `${origin}${item.image}`] } : {}),
          },
          unit_amount: calculation.subunitAmount,
        },
        quantity: item.quantity || 1,
      }
    })

    // Add Delivery Fee Line Item
    if (deliveryFeeOmr > 0) {
      const deliveryCalc = calculateStripeSubunit(deliveryFeeOmr)
      line_items.push({
        price_data: {
          currency: deliveryCalc.currency,
          product_data: {
            name: `رسوم التوصيل (${selectedGov.nameAr} - عُمان)`,
          },
          unit_amount: deliveryCalc.subunitAmount,
        },
        quantity: 1,
      })
    }

    // Order reference ID
    const orderId = `NASMMA-OM-${Date.now().toString(36).toUpperCase()}`

    // Create Checkout Session using Dynamic Payment Methods (no hardcoded payment_method_types)
    const session = await stripe.checkout.sessions.create({
      mode: 'payment',
      customer_email: customerEmail || undefined,
      line_items,
      success_url: `${origin}/checkout/success?session_id={CHECKOUT_SESSION_ID}`,
      cancel_url: `${origin}/checkout?canceled=true`,
      metadata: {
        order_id: orderId,
        customer_name: customerName,
        customer_phone: customerPhone,
        governorate: selectedGov.nameAr,
        delivery_address: deliveryAddress || '',
        gift_message: giftMessage || '',
        discount_code: discountCode || '',
      },
      locale: 'auto',
    })

    // Calculate total in OMR
    const itemsTotalOmr = items.reduce((acc: number, it: any) => acc + (it.price * (it.quantity || 1)), 0)
    const grandTotalOmr = itemsTotalOmr + deliveryFeeOmr

    await saveStoreOrderAsync({
      id: orderId,
      orderId,
      stripeSessionId: session.id,
      amountOmr: grandTotalOmr,
      currency: 'OMR',
      customerName,
      customerPhone,
      customerEmail: customerEmail || undefined,
      governorate: selectedGov.nameAr,
      deliveryAddress: deliveryAddress || '',
      giftMessage: giftMessage || '',
      discountCode: discountCode || undefined,
      paymentStatus: 'pending',
      deliveryStatus: 'processing',
      items: items.map((it: any) => ({
        name: it.name,
        price: it.price,
        quantity: it.quantity || 1,
        image: it.image,
      })),
      createdAt: new Date().toISOString(),
    }).catch((err) => console.error('Failed to save order record:', err))

    return NextResponse.json({
      url: session.url,
      sessionId: session.id,
      orderId,
    })
  } catch (error: any) {
    console.error('Stripe Checkout Session Error:', error)
    return NextResponse.json(
      { error: error?.message || 'حدث خطأ أثناء إنشاء جلسة الدفع' },
      { status: 500 }
    )
  }
}
