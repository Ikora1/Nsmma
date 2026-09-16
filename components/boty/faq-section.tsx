"use client"

import { useState } from "react"
import { ChevronDown, HelpCircle, Sparkles, MessageCircle, ShieldCheck, Heart } from "lucide-react"

const FAQ_ITEMS = [
  {
    question: "هل الوردة المخملية تمسك ريحة العطر وتدوم لسنوات؟",
    answer: "نعم وبكل تأكيد! خيوط الغليون المخملية (Pipe Cleaners) تتميز بألياف كثيفة ناعمة تمتص رذاذ العطر والزيوت العطرية وتحتفظ بجزيئات الرائحة لأسابيع طويلة. يمكنك رش عطرك المفضل أو عطر المهدى إليه على الباقة بين فترة وأخرى لتبقى فواحة دائماً كما لو كانت قطفت للتو.",
    category: "الجودة والتعطير",
  },
  {
    question: "هل أستطيع طلب تصميم مخصص، ألوان معينة أو كتابة اسم؟",
    answer: "نعم! يسر فريق الحرفيين لدينا في استوديو نسمة تلبية الطلبات المخصصة بالكامل (مثل مسكات عرايس بألوان الثيم، بوكسات تخرج بألوان الجامعة، أو إضافة بطاقات وأسماء خاصة). يمكنك التواصل معنا مباشرة عبر واتساب المتجر لتنسيق تفاصيل طلبك الخاص.",
    category: "الطلبات المخصصة",
  },
  {
    question: "كم يستغرق التوصيل داخل سلطنة عُمان ولدول الخليج؟",
    answer: "التوصيل داخل محافظة مسقط يستغرق من 24 إلى 48 ساعة فقط. لباقي محافظات سلطنة عُمان يستغرق من 2 إلى 3 أيام عمل. أما لدول الخليج (السعودية، الإمارات، قطر، الكويت، البحرين) فيستغرق الشحن السريع المحمي من 3 إلى 5 أيام عمل، مع توفير رقم تتبع حي فور خروج الشحنة.",
    category: "الشحن والتوصيل",
  },
  {
    question: "ما هو ضمان نسمة في حال وصول الباقة متضررة أثناء الشحن؟",
    answer: "نحن نقدم 'ضمان نسمة الذهبي 100%': يتم تغليف كل باقة بعناية فائقة وتثبيتها داخل صناديق نسمة الصلبة المقاومة للصدمات. وفي حال حدوث أي ضرر أو تلف أثناء النقل، نقوم باستبدال الباقة فوراً أو إعادة كامل المبلغ بدون أي تعقيد.",
    category: "الضمان والاسترجاع",
  },
  {
    question: "هل كرت الإهداء والتغليف الفاخر مشمول ومجاني مع الباقة؟",
    answer: "نعم، كل باقة من نسمة تأتي مغلفة داخل صندوق الهدايا الفاخر بشريط من الأورجانزا، وتشمل كرت نسمة البنفسجي الأيقوني مع ختم الشمع الفاخر لطباعة رسالتك القلبية مجاناً بالكامل دون أي رسوم إضافية.",
    category: "التغليف والإهداء",
  },
  {
    question: "كيف أعتني بالوردة المخملية حتى تحافظ على رونقها؟",
    answer: "الورد المخملي لا يحتاج لأي سقاية أو عناية معقدة. يكفي حفظه في مكان جاف بعيداً عن الرطوبة المباشرة والشمس الحارقة، ويمكن تنظيف الغبار الخفيف بلمسة هواء ناعمة بواسطة مجفف الشعر على الهواء البارد عند الحاجة.",
    category: "العناية بالورد",
  },
]

export function FAQSection() {
  const [openIndex, setOpenIndex] = useState<number | null>(0)

  const toggleFAQ = (idx: number) => {
    setOpenIndex(openIndex === idx ? null : idx)
  }

  return (
    <section className="py-20 sm:py-28 bg-[#FBF6F4] relative overflow-hidden" dir="rtl" id="faq">
      <div className="max-w-4xl mx-auto px-6 lg:px-8 relative z-10">
        
        {/* Header */}
        <div className="text-center mb-16">
          <div className="inline-flex items-center gap-2 px-3.5 py-1 rounded-full bg-white border border-[#F0E4EC] text-primary text-xs font-semibold mb-3 shadow-xs">
            <HelpCircle className="w-3.5 h-3.5 text-primary" />
            <span className="font-arabic">إجـابـات عـلـى كـل مـا يـدور فـي بـالـك</span>
          </div>
          <h2 className="font-arabic text-3xl sm:text-5xl text-foreground font-bold leading-tight mb-4">
            الأسـئـلـة <span className="text-primary">الـشـائـعـة</span>
          </h2>
          <p className="text-xs sm:text-sm text-muted-foreground font-arabic font-light max-w-xl mx-auto leading-relaxed">
            جمعنا لك أكثر الاستفسارات التي تهم عملاءنا حول جودة الورد المخملي، مدة الشحن، الضمان، وتخصيص الهدايا.
          </p>
        </div>

        {/* FAQ Accordion List */}
        <div className="space-y-4">
          {FAQ_ITEMS.map((item, idx) => {
            const isOpen = openIndex === idx
            return (
              <div
                key={idx}
                className="bg-white rounded-3xl border border-[#F0E4EC] overflow-hidden transition-all duration-300 shadow-xs hover:border-primary/40"
              >
                <button
                  type="button"
                  onClick={() => toggleFAQ(idx)}
                  className="w-full text-right p-6 sm:p-7 flex items-center justify-between gap-4 cursor-pointer focus:outline-none"
                >
                  <div className="flex items-center gap-3">
                    <span className="w-8 h-8 rounded-full bg-[#EFD9E8]/50 text-primary flex items-center justify-center shrink-0 text-xs font-bold font-mono">
                      0{idx + 1}
                    </span>
                    <h3 className="font-arabic text-sm sm:text-base font-bold text-foreground">
                      {item.question}
                    </h3>
                  </div>
                  <div className={`w-8 h-8 rounded-full bg-[#FBF6F4] flex items-center justify-center shrink-0 transition-transform duration-300 ${isOpen ? "rotate-180 bg-primary text-white" : "text-muted-foreground"}`}>
                    <ChevronDown className="w-4 h-4" />
                  </div>
                </button>

                {isOpen && (
                  <div className="px-6 sm:px-7 pb-6 pt-0 text-right animate-scale-fade-in border-t border-[#F0E4EC]/60 mt-1">
                    <p className="text-xs sm:text-sm text-muted-foreground font-arabic font-light leading-relaxed pt-4">
                      {item.answer}
                    </p>
                    <div className="mt-4 pt-3 border-t border-border/30 flex items-center justify-between text-[11px] text-primary font-arabic font-semibold">
                      <span>تصنيف: {item.category}</span>
                      <span className="flex items-center gap-1 text-emerald-600 font-bold">
                        <ShieldCheck className="w-3.5 h-3.5" />
                        ضمان نسمة 100%
                      </span>
                    </div>
                  </div>
                )}
              </div>
            )
          })}
        </div>

        {/* WhatsApp Help Support Card */}
        <div className="mt-12 bg-white p-6 sm:p-8 rounded-3xl border border-[#F0E4EC] text-center flex flex-col sm:flex-row items-center justify-between gap-6 shadow-sm">
          <div className="text-right">
            <h4 className="font-arabic text-base font-bold text-foreground mb-1">
              عندك سؤال خاص أو تبغى تنسيق باقة مخصصة؟
            </h4>
            <p className="text-xs text-muted-foreground font-arabic font-light">
              فريق نسمة جاهز لمساعدتك والرد على استفساراتك على مدار الساعة عبر واتساب.
            </p>
          </div>
          <a
            href="https://wa.me"
            target="_blank"
            rel="noopener noreferrer"
            className="shrink-0 inline-flex items-center gap-2 bg-[#25D366] hover:bg-[#20bd5a] text-white px-6 py-3.5 rounded-full text-xs font-bold font-arabic shadow-md hover:shadow-lg transition-all cursor-pointer"
          >
            <MessageCircle className="w-4 h-4" />
            <span>تواصل مع حرفيي نسمة عبر واتساب</span>
          </a>
        </div>

      </div>
    </section>
  )
}
