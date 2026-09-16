import React from "react"
import type { Metadata, Viewport } from 'next'
import { Cairo, Playfair_Display } from 'next/font/google'
import localFont from 'next/font/local'
import { Analytics } from '@vercel/analytics/next'
import { CartProvider } from '@/components/boty/cart-context'
import { OfferPopup } from '@/components/boty/offer-popup'
import { NasmmaChatbot } from '@/components/NasmmaChatbot'
import './globals.css'

const cairo = Cairo({
  subsets: ["arabic", "latin"],
  variable: '--font-cairo',
  weight: ['300', '400', '500', '600', '700']
});

const playfairDisplay = Playfair_Display({
  subsets: ["latin"],
  variable: '--font-playfair',
  weight: ['400', '500', '600', '700']
});

const guesswhat = localFont({
  src: '../public/fonts/Guesswhat-Exceptional.otf',
  variable: '--font-guesswhat',
  display: 'swap',
});

export const metadata: Metadata = {
  title: 'نسمة (Nasmma) — استوديو الزهور الحرفية | اصنع ذكرى لا تُنسى بوردة لا تموت',
  description: 'اصنع ذكرى لا تُنسى بوردة لا تموت. باقات زهور مصنوعة يدوياً بحب من خيوط الغليون المخملية الفاخرة، تبقى نضرة العمر كله.',
  keywords: ['نسمة', 'ورد لا يذبل', 'خيوط الغليون', 'زهور مخملية', 'هدايا السعودية', 'باقات ورد', 'تنسيق زهور', 'Nasmma'],
  icons: {
    icon: [
      {
        url: '/images/logo/nasmma-logo.png',
        type: 'image/png',
      },
      {
        url: '/icon.svg',
        type: 'image/svg+xml',
      },
    ],
    apple: '/apple-icon.png',
  },
}

export const viewport: Viewport = {
  themeColor: '#5B1657',
}

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  return (
    <html lang="ar" dir="rtl" className="scroll-smooth">
      <body className={`${cairo.variable} ${playfairDisplay.variable} ${guesswhat.variable} font-sans antialiased bg-background text-foreground`}>
        <CartProvider>
          {children}
          <OfferPopup />
          <NasmmaChatbot />
        </CartProvider>
        <Analytics />
      </body>
    </html>
  )
}
