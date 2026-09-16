"use client"

import { createContext, useContext, useState, useEffect, useCallback, useRef, type ReactNode } from "react"
import {
  getCartAction,
  addToCartAction,
  updateCartLineAction,
  removeCartLineAction,
} from "@/app/actions/cart"
import type { Cart } from "@/lib/shopify"

export type AppliedDiscount = {
  code: string
  percentage: number
}

interface CartContextType {
  cart: Cart | null
  addItem: (variantId: string, quantity?: number) => Promise<void>
  updateQuantity: (lineId: string, quantity: number) => Promise<void>
  removeItem: (lineId: string) => Promise<void>
  isOpen: boolean
  setIsOpen: (open: boolean) => void
  itemCount: number
  subtotal: number
  discountAmount: number
  finalTotal: number
  appliedDiscount: AppliedDiscount | null
  applyDiscount: (code: string, percentage: number) => void
  removeDiscount: () => void
  clearCart: () => void
  isPending: boolean
}

const CartContext = createContext<CartContextType | undefined>(undefined)

const DISCOUNT_STORAGE_KEY = "nasmma_applied_discount"

export function CartProvider({ children }: { children: ReactNode }) {
  const [cart, setCart] = useState<Cart | null>(null)
  const [isOpen, setIsOpen] = useState(false)
  const [isPending, setIsPending] = useState(false)
  const [appliedDiscount, setAppliedDiscount] = useState<AppliedDiscount | null>(null)
  const cartIdRef = useRef<string | undefined>(undefined)

  useEffect(() => {
    // Load persisted discount if any
    try {
      const saved = localStorage.getItem(DISCOUNT_STORAGE_KEY)
      if (saved) {
        setAppliedDiscount(JSON.parse(saved))
      }
    } catch {}

    getCartAction()
      .then((c) => {
        if (c) cartIdRef.current = c.id
        setCart(c)
      })
      .catch((err) => console.log("[v0] Failed to load cart:", err))
  }, [])

  const applyDiscount = useCallback((code: string, percentage: number) => {
    const discount = { code, percentage }
    setAppliedDiscount(discount)
    try {
      localStorage.setItem(DISCOUNT_STORAGE_KEY, JSON.stringify(discount))
    } catch {}
  }, [])

  const removeDiscount = useCallback(() => {
    setAppliedDiscount(null)
    try {
      localStorage.removeItem(DISCOUNT_STORAGE_KEY)
    } catch {}
  }, [])

  const addItem = useCallback(async (variantId: string, quantity = 1) => {
    setIsOpen(true)
    setIsPending(true)
    try {
      const updated = await addToCartAction(variantId, quantity, cartIdRef.current)
      cartIdRef.current = updated.id
      setCart(updated)
    } catch (err) {
      console.log("[v0] Failed to add item:", err)
    } finally {
      setIsPending(false)
    }
  }, [])

  const updateQuantity = useCallback(async (lineId: string, quantity: number) => {
    setIsPending(true)
    try {
      const updated = await updateCartLineAction(lineId, quantity, cartIdRef.current)
      cartIdRef.current = updated.id
      setCart(updated)
    } catch (err) {
      console.log("[v0] Failed to update quantity:", err)
    } finally {
      setIsPending(false)
    }
  }, [])

  const removeItem = useCallback(async (lineId: string) => {
    setIsPending(true)
    try {
      const updated = await removeCartLineAction(lineId, cartIdRef.current)
      cartIdRef.current = updated.id
      setCart(updated)
    } catch (err) {
      console.log("[v0] Failed to remove item:", err)
    } finally {
      setIsPending(false)
    }
  }, [])

  const clearCart = useCallback(() => {
    setCart(null)
    cartIdRef.current = undefined
    setAppliedDiscount(null)
    try {
      localStorage.removeItem(DISCOUNT_STORAGE_KEY)
    } catch {}
  }, [])

  const itemCount = cart?.totalQuantity ?? 0
  const subtotal = cart ? Number.parseFloat(cart.cost.subtotalAmount.amount) : 0
  const discountAmount = appliedDiscount ? Math.round(subtotal * (appliedDiscount.percentage / 100)) : 0
  const finalTotal = Math.max(0, subtotal - discountAmount)

  return (
    <CartContext.Provider
      value={{
        cart,
        addItem,
        updateQuantity,
        removeItem,
        isOpen,
        setIsOpen,
        itemCount,
        subtotal,
        discountAmount,
        finalTotal,
        appliedDiscount,
        applyDiscount,
        removeDiscount,
        clearCart,
        isPending,
      }}
    >
      {children}
    </CartContext.Provider>
  )
}

export function useCart() {
  const context = useContext(CartContext)
  if (context === undefined) {
    throw new Error("useCart must be used within a CartProvider")
  }
  return context
}
