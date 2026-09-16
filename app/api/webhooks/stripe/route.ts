import { NextRequest, NextResponse } from 'next/server'
import { stripe, fromStripeOmrAmount } from '@/lib/stripe'
import { getSupabaseAdmin } from '@/lib/supabase'

export async function POST(req: NextRequest) {
  const body = await req.text()
  const signature = req.headers.get('stripe-signature')
  const webhookSecret = process.env.STRIPE_WEBHOOK_SECRET

  if (!signature || !webhookSecret) {
    console.warn('Stripe webhook received without signature or webhook secret is unconfigured.')
    return NextResponse.json({ error: 'Missing webhook signature or secret' }, { status: 400 })
  }

  let event

  try {
    event = stripe.webhooks.constructEvent(body, signature, webhookSecret)
  } catch (err: any) {
    console.error(`⚠️ Webhook signature verification failed: ${err.message}`)
    return NextResponse.json({ error: `Webhook Error: ${err.message}` }, { status: 400 })
  }

  // Handle successful payments according to Stripe Best Practices
  if (
    event.type === 'checkout.session.completed' ||
    event.type === 'checkout.session.async_payment_succeeded'
  ) {
    const session = event.data.object as any

    // Ensure payment status is paid (not unpaid / pending failure)
    if (session.payment_status === 'paid') {
      const orderId = session.metadata?.order_id || `NASMMA-OM-${session.id.slice(-6)}`
      const totalAmountOmr = session.amount_total ? fromStripeOmrAmount(session.amount_total) : 0

      console.log(`✅ Order paid: ${orderId} | Amount: ${totalAmountOmr} OMR`)

      // Fulfill in Supabase if configured
      const supabaseAdmin = getSupabaseAdmin()
      if (supabaseAdmin) {
        try {
          await supabaseAdmin.from('nasmma_orders').insert({
            order_id: orderId,
            stripe_session_id: session.id,
            amount_omr: totalAmountOmr,
            customer_name: session.metadata?.customer_name || session.customer_details?.name || 'زائر',
            customer_phone: session.metadata?.customer_phone || session.customer_details?.phone || '',
            governorate: session.metadata?.governorate || 'عُمان',
            delivery_address: session.metadata?.delivery_address || '',
            gift_message: session.metadata?.gift_message || '',
            payment_status: 'paid',
            created_at: new Date().toISOString(),
          })
        } catch (dbError) {
          console.error('Failed to insert order into Supabase:', dbError)
        }
      }
    }
  }

  return NextResponse.json({ received: true })
}
