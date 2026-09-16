"use client"

import { useRouter } from "next/navigation"
import { Minus, Plus, Trash2, ShoppingBag } from "lucide-react"
import Image from "next/image"
import {
  Drawer,
  DrawerClose,
  DrawerContent,
  DrawerDescription,
  DrawerFooter,
  DrawerHeader,
  DrawerTitle,
} from "@/components/ui/drawer"
import { useCart } from "./cart-context"

export function CartDrawer() {
  const router = useRouter()
  const { 
    cart, 
    removeItem, 
    updateQuantity, 
    isOpen, 
    setIsOpen, 
    itemCount, 
    subtotal, 
    discountAmount, 
    finalTotal, 
    appliedDiscount, 
    removeDiscount, 
    isPending 
  } = useCart()

  const lines = cart?.lines ?? []
  const shipping = 0
  const total = (finalTotal || subtotal) + shipping

  const formatPrice = (amount: number) => `${amount % 1 === 0 ? amount : amount.toFixed(1)} ر.ع`

  const handleCheckout = () => {
    setIsOpen(false)
    router.push("/checkout")
  }

  return (
    <Drawer open={isOpen} onOpenChange={setIsOpen} direction="right">
      <DrawerContent className="h-full w-full sm:max-w-[440px] bg-background text-right" dir="rtl">
        <DrawerHeader className="border-b border-border/50 p-6 py-4">
          <div className="flex items-center justify-between">
            <div>
              <DrawerTitle className="font-arabic text-2xl text-foreground">سـلـة ذكـريـاتـك</DrawerTitle>
              <span className="text-xs text-primary block mt-0.5 font-arabic">نَـسْـمَـة · ورد مـخـمـلـي يـدوم الـعـمـر كـلـه</span>
            </div>
            <DrawerDescription className="text-xs">
              {itemCount} {itemCount === 1 ? 'باقة' : 'باقات'}
            </DrawerDescription>
          </div>
        </DrawerHeader>

        {/* Cart Items */}
        <div className="flex-1 overflow-y-auto p-6">
          {lines.length === 0 ? (
            <div className="flex flex-col items-center justify-center h-full text-center py-12">
              <div className="w-16 h-16 rounded-full bg-primary/10 flex items-center justify-center text-primary mb-4">
                <ShoppingBag className="w-8 h-8" strokeWidth={1.5} />
              </div>
              <p className="text-foreground font-medium text-lg mb-1">سلتك لسه تنتظر باقة حب</p>
              <p className="text-sm text-muted-foreground mb-4">ما اخترت وردتك للحين؟ ترى الذكريات الحلوة ما تنتظر، اختر باقة وخلّ أثرك معهم العمر كله.</p>
              <DrawerClose asChild>
                <button
                  type="button"
                  className="mt-2 bg-primary text-white px-6 py-2.5 rounded-full text-xs font-semibold hover:bg-primary/90 boty-transition"
                >
                  استكشف الباقات الحين
                </button>
              </DrawerClose>
            </div>
          ) : (
            <div className="space-y-6">
              {lines.map((item) => (
                <div key={item.id} className="flex gap-4 pb-4 border-b border-border/40">
                  {/* Product Image */}
                  <div className="relative w-20 h-24 flex-shrink-0 rounded-2xl overflow-hidden bg-card border border-border/50">
                    <Image
                      src={item.image || "/placeholder.svg"}
                      alt={item.title}
                      fill
                      className="object-cover"
                    />
                  </div>

                  {/* Product Details */}
                  <div className="flex-1 min-w-0">
                    <h3 className="font-serif text-sm text-foreground mb-1 font-semibold line-clamp-1">{item.title}</h3>
                    <p className="text-primary font-semibold mb-3 text-sm">{formatPrice(item.price)}</p>
                    
                    {/* Quantity Controls */}
                    <div className="flex items-center gap-3">
                      <div className="flex items-center border border-border rounded-full bg-card">
                        <button
                          type="button"
                          onClick={() => updateQuantity(item.id, item.quantity - 1)}
                          disabled={isPending}
                          className="p-1.5 hover:bg-white boty-transition rounded-r-full disabled:opacity-50 text-foreground/70"
                          aria-label="تقليل العدد"
                        >
                          <Minus className="w-3 h-3" />
                        </button>
                        <span className="px-2.5 text-xs font-semibold text-foreground">{item.quantity}</span>
                        <button
                          type="button"
                          onClick={() => updateQuantity(item.id, item.quantity + 1)}
                          disabled={isPending}
                          className="p-1.5 hover:bg-white boty-transition rounded-l-full disabled:opacity-50 text-foreground/70"
                          aria-label="زيادة العدد"
                        >
                          <Plus className="w-3 h-3" />
                        </button>
                      </div>

                      <button
                        type="button"
                        onClick={() => removeItem(item.id)}
                        disabled={isPending}
                        className="p-1.5 text-muted-foreground hover:text-destructive boty-transition disabled:opacity-50"
                        aria-label="حذف الباقة"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </div>
                  </div>

                  {/* Price */}
                  <div className="text-left">
                    <p className="font-semibold text-foreground text-sm">{formatPrice(item.price * item.quantity)}</p>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>

        {lines.length > 0 && (
          <DrawerFooter className="border-t border-border/50 p-6 gap-3">
            {/* Summary */}
            <div className="space-y-2 text-sm">
              <div className="flex justify-between text-muted-foreground text-xs">
                <span>المجموع الفرعي</span>
                <span className="font-medium text-foreground">{formatPrice(subtotal)}</span>
              </div>

              {appliedDiscount && (
                <div className="flex items-center justify-between text-xs bg-[#EFD9E8]/60 px-3 py-1.5 rounded-xl border border-primary/20 text-primary">
                  <div className="flex items-center gap-1.5">
                    <span className="font-semibold">خصم {appliedDiscount.percentage}% ({appliedDiscount.code})</span>
                    <button
                      type="button"
                      onClick={removeDiscount}
                      className="text-primary/70 hover:text-destructive font-bold text-xs"
                      title="إزالة الخصم"
                    >
                      ✕
                    </button>
                  </div>
                  <span className="font-bold text-primary">-{formatPrice(discountAmount)}</span>
                </div>
              )}

              <div className="flex justify-between text-muted-foreground text-xs">
                <span>توصيل مغلّف ومحمي للباب</span>
                <span className="text-[#7C8B65] font-medium">{shipping === 0 ? 'مجاناً (هدية نسمة)' : formatPrice(shipping)}</span>
              </div>
              <div className="flex justify-between text-base font-semibold text-foreground pt-2 border-t border-border/50">
                <span>الإجمالي النهائي</span>
                <span className="text-primary font-bold">{formatPrice(total)}</span>
              </div>
            </div>

            {/* Checkout Button */}
            <button
              type="button"
              onClick={handleCheckout}
              disabled={isPending}
              className="w-full bg-primary text-primary-foreground py-3.5 rounded-full text-sm font-semibold tracking-wide hover:bg-primary/90 boty-transition shadow-md disabled:opacity-50"
            >
              كمّل طلبك وخلّ الهدية توصل للغالي
            </button>

            <DrawerClose asChild>
              <button
                type="button"
                className="w-full border border-border text-foreground/80 py-3 rounded-full text-xs font-medium hover:bg-card boty-transition"
              >
                تصفح باقات أكثر
              </button>
            </DrawerClose>
          </DrawerFooter>
        )}
      </DrawerContent>
    </Drawer>
  )
}
