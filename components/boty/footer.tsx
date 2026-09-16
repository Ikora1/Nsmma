"use client"

import Link from "next/link"
import Image from "next/image"
import { Instagram, MessageCircle } from "lucide-react"

const footerLinks = {
  shop: [
    { name: "متجر جميع الباقات", href: "/shop" },
    { name: "باقات الحب والعهود", href: "/shop" },
    { name: "مزهريات الدوام والمكتب", href: "/shop" },
    { name: "مسكات ليلة العمر", href: "/shop" }
  ],
  about: [
    { name: "ليه نسمة؟", href: "/#why-nasmma" },
    { name: "كيف تطلب في 3 خطوات", href: "/#how-to-order" },
    { name: "من الخيط للمزهرية", href: "/#sourcing" },
    { name: "أثر نسمة في بيوتكم", href: "/#impact" },
    { name: "تجارب وقصص الحبايب", href: "/#reviews" }
  ],
  support: [
    { name: "📦 تـتـبـع حـالـة طـلـبـك", href: "/track" },
    { name: "الأسئلة الشائعة وإجاباتها", href: "/#faq" },
    { name: "ضمان نسمة والتوصيل بالخليج", href: "/#faq" },
    { name: "الطلبات الخاصة والمخصصة", href: "https://wa.me" },
    { name: "تواصل مع نسمة عبر واتساب", href: "https://wa.me" }
  ]
}

export function Footer() {
  return (
    <footer className="bg-card pt-20 pb-10 relative overflow-hidden border-t border-border/50" dir="rtl">
      {/* Giant Background Watermark */}
      <div className="absolute bottom-0 left-1/2 -translate-x-1/2 pointer-events-none select-none z-0">
        <span className="font-arabic text-[180px] sm:text-[280px] md:text-[380px] font-bold text-primary/[0.04] whitespace-nowrap leading-none block">
          نَــــسْــــمَــــة
        </span>
      </div>
      
      <div className="max-w-7xl mx-auto px-6 lg:px-8 relative z-10">
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-10 mb-16 text-right">
          {/* Brand */}
          <div className="col-span-1 sm:col-span-2 md:col-span-1">
            <Link href="/" className="inline-block mb-4">
              <Image
                src="/images/logo/nasmma-logo.png"
                alt="نسمة"
                width={130}
                height={46}
                className="h-11 w-auto object-contain"
              />
            </Link>
            <p className="font-arabic text-primary text-sm font-bold mb-2">
              نَـسْـمَـة · وردة مـا تـمـوت، وذكـرى مـا تـروح
            </p>
            <p className="text-xs text-muted-foreground leading-relaxed mb-6 font-light">
              متجر متخصص في صناعة باقات الزهور المخملية يدوياً من خيوط الغليون الفاخرة. نصنع أوعية للذكريات، لتبقى هديتك شاهدة على مشاعرك طول العمر.
            </p>
            <div className="flex gap-3 justify-start">
              <a
                href="https://instagram.com"
                target="_blank"
                rel="noopener noreferrer"
                className="w-10 h-10 rounded-full bg-white flex items-center justify-center text-foreground/70 hover:text-primary hover:scale-105 boty-transition border border-border shadow-sm"
                aria-label="Instagram"
              >
                <Instagram className="w-4 h-4" />
              </a>
              <a
                href="https://wa.me"
                target="_blank"
                rel="noopener noreferrer"
                className="w-10 h-10 rounded-full bg-white flex items-center justify-center text-foreground/70 hover:text-primary hover:scale-105 boty-transition border border-border shadow-sm"
                aria-label="WhatsApp"
              >
                <MessageCircle className="w-4 h-4" />
              </a>
            </div>
          </div>

          {/* Shop Links */}
          <div>
            <h3 className="font-arabic font-bold text-foreground text-sm uppercase tracking-wider mb-4">باقاتنا</h3>
            <ul className="space-y-2.5">
              {footerLinks.shop.map((link) => (
                <li key={link.name}>
                  <a
                    href={link.href}
                    className="text-xs text-muted-foreground hover:text-primary boty-transition font-light"
                  >
                    {link.name}
                  </a>
                </li>
              ))}
            </ul>
          </div>

          {/* About Links */}
          <div>
            <h3 className="font-arabic font-bold text-foreground text-sm uppercase tracking-wider mb-4">قصتنا</h3>
            <ul className="space-y-2.5">
              {footerLinks.about.map((link) => (
                <li key={link.name}>
                  <a
                    href={link.href}
                    className="text-xs text-muted-foreground hover:text-primary boty-transition font-light"
                  >
                    {link.name}
                  </a>
                </li>
              ))}
            </ul>
          </div>

          {/* Support Links */}
          <div>
            <h3 className="font-arabic font-bold text-foreground text-sm uppercase tracking-wider mb-4">خدمة العملاء</h3>
            <ul className="space-y-2.5">
              {footerLinks.support.map((link) => (
                <li key={link.name}>
                  <a
                    href={link.href}
                    className="text-xs text-muted-foreground hover:text-primary boty-transition font-light"
                  >
                    {link.name}
                  </a>
                </li>
              ))}
            </ul>
          </div>
        </div>

        {/* Bottom Bar */}
        <div className="pt-8 border-t border-border/60">
          <div className="flex flex-col md:flex-row items-center justify-between gap-4 text-xs text-muted-foreground">
            <p className="font-light">
              © {new Date().getFullYear()} نسمة (NASMMA). جميع الحقوق محفوظة. صُنعت بكل حب لتبقى ذكراكم حية للأبد.
            </p>
            <div className="flex gap-6 font-light">
              <Link href="/" className="hover:text-primary boty-transition">
                سياسة الخصوصية
              </Link>
              <Link href="/" className="hover:text-primary boty-transition">
                شروط الإهداء والتوصيل
              </Link>
              <Link href="/" className="hover:text-primary boty-transition">
                الأسئلة الشائعة
              </Link>
            </div>
          </div>
        </div>
      </div>
    </footer>
  )
}
