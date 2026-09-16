"use client"

import { useState } from "react"
import Link from "next/link"
import Image from "next/image"
import { Menu, X, ShoppingBag, Search } from "lucide-react"
import { CartDrawer } from "./cart-drawer"
import { useCart } from "./cart-context"

export function Header() {
  const [isMenuOpen, setIsMenuOpen] = useState(false)
  const { setIsOpen, itemCount } = useCart()

  return (
    <header className="fixed top-0 left-0 right-0 z-50 px-4 pt-4 flex justify-center pointer-events-none">
      <nav 
        className="w-full max-w-7xl px-6 lg:px-8 backdrop-blur-md rounded-2xl py-0 my-0 animate-scale-fade-in bg-white/85 border border-[#F0E4EC] pointer-events-auto transition-all" 
        style={{ boxShadow: 'rgba(91, 22, 87, 0.08) 0px 8px 32px' }}
      >
        <div className="flex items-center justify-between gap-8 h-[68px]">
          {/* Mobile menu button */}
          <button
            type="button"
            className="lg:hidden p-2 text-foreground/80 hover:text-primary boty-transition"
            onClick={() => setIsMenuOpen(!isMenuOpen)}
            aria-label="Toggle menu"
          >
            {isMenuOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
          </button>

          {/* Logo */}
          <Link href="/" className="flex items-center gap-3 group">
            <Image
              src="/images/logo/nasmma-logo.png"
              alt="Nasmma نسمة"
              width={130}
              height={46}
              className="h-10 w-auto object-contain transition-transform duration-300 group-hover:scale-105"
              priority
            />
          </Link>

          {/* Desktop Navigation */}
          <div className="hidden lg:flex items-center gap-8">
            <Link
              href="/shop"
              className="text-sm font-semibold tracking-wide text-primary hover:text-primary/80 boty-transition font-arabic flex items-center gap-1.5"
            >
              <span>الـمـتـجـر</span>
              <span className="w-1.5 h-1.5 rounded-full bg-primary animate-pulse" />
            </Link>
            <a
              href="#collection"
              className="text-sm font-medium tracking-wide text-foreground/80 hover:text-primary boty-transition font-arabic"
              onClick={(e) => {
                e.preventDefault()
                document.getElementById('collection')?.scrollIntoView({ behavior: 'smooth' })
              }}
            >
              الـبـاقـات والـذكـريـات
            </a>
            <a
              href="#why-nasmma"
              className="text-sm font-medium tracking-wide text-foreground/80 hover:text-primary boty-transition font-arabic"
              onClick={(e) => {
                e.preventDefault()
                document.getElementById('why-nasmma')?.scrollIntoView({ behavior: 'smooth' })
              }}
            >
              لـيـه نـسـمـة؟
            </a>
            <a
              href="#impact"
              className="text-sm font-medium tracking-wide text-foreground/80 hover:text-primary boty-transition font-arabic"
              onClick={(e) => {
                e.preventDefault()
                document.getElementById('impact')?.scrollIntoView({ behavior: 'smooth' })
              }}
            >
              أثـرنـا
            </a>
            <a
              href="#sourcing"
              className="text-sm font-medium tracking-wide text-foreground/80 hover:text-primary boty-transition font-arabic"
              onClick={(e) => {
                e.preventDefault()
                document.getElementById('sourcing')?.scrollIntoView({ behavior: 'smooth' })
              }}
            >
              حـكـايـة الـصـنـع
            </a>
            <a
              href="#reviews"
              className="text-sm font-medium tracking-wide text-foreground/80 hover:text-primary boty-transition font-arabic"
              onClick={(e) => {
                e.preventDefault()
                document.getElementById('reviews')?.scrollIntoView({ behavior: 'smooth' })
              }}
            >
              تـجـارب الـحـبـايـب
            </a>
          </div>

          {/* Right/End Actions (Top-Left in RTL) */}
          <div className="hidden lg:flex items-center gap-3">
            <Link
              href="/shop"
              className="inline-flex items-center gap-2 bg-primary text-white text-xs font-semibold px-4 py-2 rounded-full hover:bg-primary/90 transition-all shadow-md hover:shadow-lg hover:scale-105 font-arabic group"
            >
              <span>تـسـوق الآن</span>
              <ShoppingBag className="w-3.5 h-3.5 text-[#EFD9E8] group-hover:-translate-y-0.5 transition-transform" />
            </Link>

            <button
              type="button"
              onClick={() => setIsOpen(true)}
              className="relative p-2.5 text-foreground/80 hover:text-primary hover:bg-[#EFD9E8]/40 rounded-full boty-transition"
              aria-label="سلة المشتريات"
            >
              <ShoppingBag className="w-5 h-5" />
              {itemCount > 0 && (
                <span className="absolute -top-0.5 -right-0.5 w-4 h-4 bg-primary text-white text-[10px] font-semibold flex items-center justify-center rounded-full shadow-sm">
                  {itemCount}
                </span>
              )}
            </button>
          </div>

          {/* Mobile Actions */}
          <div className="flex lg:hidden items-center gap-2 mr-auto">
            <Link
              href="/shop"
              className="inline-flex items-center gap-1.5 bg-primary text-white text-xs font-semibold px-3.5 py-1.5 rounded-full hover:bg-primary/90 transition-all shadow-sm font-arabic active:scale-95"
            >
              <span>تـسـوق الآن</span>
            </Link>
            <button
              type="button"
              onClick={() => setIsOpen(true)}
              className="relative p-2 text-foreground/80 hover:text-primary boty-transition"
              aria-label="سلة المشتريات"
            >
              <ShoppingBag className="w-5 h-5" />
              {itemCount > 0 && (
                <span className="absolute -top-0 -right-0 w-4 h-4 bg-primary text-white text-[10px] font-semibold flex items-center justify-center rounded-full shadow-sm">
                  {itemCount}
                </span>
              )}
            </button>
          </div>
        </div>

        <CartDrawer />

        {/* Mobile Navigation */}
        <div
          className={`lg:hidden overflow-hidden boty-transition ${
            isMenuOpen ? "max-h-80 pb-6" : "max-h-0"
          }`}
        >
          <div className="flex flex-col gap-3 pt-4 border-t border-border/50 text-right">
            <Link
              href="/shop"
              onClick={() => setIsMenuOpen(false)}
              className="text-sm font-semibold tracking-wide text-white bg-primary py-2.5 px-4 rounded-xl boty-transition font-arabic flex items-center justify-between shadow-sm"
            >
              <span>تـسـوق جـمـيـع الـبـاقـات والـمـتـجـر</span>
              <ShoppingBag className="w-4 h-4 text-[#EFD9E8]" />
            </Link>
            <a
              href="#collection"
              className="text-sm font-medium tracking-wide text-foreground/80 hover:text-primary boty-transition font-arabic py-1"
              onClick={(e) => {
                e.preventDefault()
                setIsMenuOpen(false)
                document.getElementById('collection')?.scrollIntoView({ behavior: 'smooth' })
              }}
            >
              الـبـاقـات والـذكـريـات
            </a>
            <a
              href="#why-nasmma"
              className="text-sm font-medium tracking-wide text-foreground/80 hover:text-primary boty-transition font-arabic"
              onClick={(e) => {
                e.preventDefault()
                setIsMenuOpen(false)
                document.getElementById('why-nasmma')?.scrollIntoView({ behavior: 'smooth' })
              }}
            >
              لـيـه نـسـمـة؟
            </a>
            <a
              href="#impact"
              className="text-sm font-medium tracking-wide text-foreground/80 hover:text-primary boty-transition font-arabic"
              onClick={(e) => {
                e.preventDefault()
                setIsMenuOpen(false)
                document.getElementById('impact')?.scrollIntoView({ behavior: 'smooth' })
              }}
            >
              أثـرنـا
            </a>
            <a
              href="#sourcing"
              className="text-sm font-medium tracking-wide text-foreground/80 hover:text-primary boty-transition font-arabic"
              onClick={(e) => {
                e.preventDefault()
                setIsMenuOpen(false)
                document.getElementById('sourcing')?.scrollIntoView({ behavior: 'smooth' })
              }}
            >
              حـكـايـة الـصـنـع
            </a>
            <a
              href="#reviews"
              className="text-sm font-medium tracking-wide text-foreground/80 hover:text-primary boty-transition font-arabic"
              onClick={(e) => {
                e.preventDefault()
                setIsMenuOpen(false)
                document.getElementById('reviews')?.scrollIntoView({ behavior: 'smooth' })
              }}
            >
              تـجـارب الـحـبـايـب
            </a>
          </div>
        </div>
      </nav>
    </header>
  )
}
