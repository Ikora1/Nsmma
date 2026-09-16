import Stripe from 'stripe'
export * from './oman-locations'

// Lazy-loaded Stripe server client to ensure safe module evaluation
let _stripeInstance: Stripe | null = null

export function getStripeServerClient(): Stripe {
  if (!_stripeInstance) {
    const secretKey = process.env.STRIPE_SECRET_KEY
    if (!secretKey) {
      throw new Error('STRIPE_SECRET_KEY is not configured in .env.local')
    }
    _stripeInstance = new Stripe(secretKey, {
      typescript: true,
    })
  }
  return _stripeInstance
}

// Export a proxy so existing calls like stripe.checkout.sessions.create continue working seamlessly
export const stripe = new Proxy({} as Stripe, {
  get(_target, prop) {
    const client = getStripeServerClient()
    const val = (client as any)[prop]
    return typeof val === 'function' ? val.bind(client) : val
  },
})

/**
 * Default processing currency.
 * If your Stripe account has activated direct OMR settlement, set STRIPE_CURRENCY=omr in .env.local
 * Otherwise, USD/AED/SAR is supported by all Stripe test & live accounts worldwide.
 */
export const DEFAULT_STRIPE_CURRENCY = (process.env.STRIPE_CURRENCY || 'usd').toLowerCase()

// Fixed exchange rates relative to 1 OMR
export const OMR_EXCHANGE_RATES: Record<string, number> = {
  omr: 1.0,
  usd: 2.60, // 1 OMR = 2.60 USD
  aed: 9.55, // 1 OMR = 9.55 AED
  sar: 9.75, // 1 OMR = 9.75 SAR
}

/**
 * Calculates subunit amount expected by Stripe API:
 * - OMR (3 decimals): amount * 1000 (Baisas)
 * - USD/AED/SAR (2 decimals): amount * 100 (Cents/Fils/Halalas)
 */
export function calculateStripeSubunit(amountInOmr: number, targetCurrency = DEFAULT_STRIPE_CURRENCY): {
  currency: string
  subunitAmount: number
  displayPrice: string
} {
  const currency = targetCurrency.toLowerCase()
  const rate = OMR_EXCHANGE_RATES[currency] || 1.0
  const convertedAmount = amountInOmr * rate

  if (currency === 'omr') {
    return {
      currency: 'omr',
      subunitAmount: Math.round(convertedAmount * 1000),
      displayPrice: `${amountInOmr} ر.ع`,
    }
  }

  // 2 decimal currencies (USD, AED, SAR, EUR, etc.)
  return {
    currency,
    subunitAmount: Math.round(convertedAmount * 100),
    displayPrice: `${amountInOmr} ر.ع (~$${convertedAmount.toFixed(2)})`,
  }
}

export function fromStripeSubunit(subunit: number, currency = DEFAULT_STRIPE_CURRENCY): number {
  if (currency.toLowerCase() === 'omr') {
    return Number((subunit / 1000).toFixed(3))
  }
  const rate = OMR_EXCHANGE_RATES[currency.toLowerCase()] || 2.60
  return Number(((subunit / 100) / rate).toFixed(3))
}

export const fromStripeOmrAmount = fromStripeSubunit
