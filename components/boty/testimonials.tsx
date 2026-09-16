"use client"

import { useEffect, useRef, useState } from "react"
import { Star } from "lucide-react"

const testimonials = [
  {
    id: 1,
    name: "سارة منصور",
    location: "الرياض",
    rating: 5,
    text: "أهديتها لأمي في يوم الأم، للحين حاطتها جنب سريرها وكل ما دخلت عليها مسحت عليها وقالت: هذي وردة بنيتي اللي ما تموت.",
    product: "باقة فجر المحبة"
  },
  {
    id: 2,
    name: "عبدالله الحربي",
    location: "الدمام",
    rating: 5,
    text: "كنت شايل هم مسكة عروستي تذبل بالحر، مسكة نسمة باللؤلؤ طلعت بالصور خيال، وصار لها سنة بصالتنا كأنها انصنعت أمس.",
    product: "مسكة همس المخمل"
  },
  {
    id: 3,
    name: "نورة القحطاني",
    location: "جدة",
    rating: 5,
    text: "رشيّت عليها عطري وأهديتها لصديقتي قبل تسافر تدرس برا... تقول لي ريحتك فيها وكل ما ضاق صدرها ضمت الوردة.",
    product: "باقة فجر الياسمين"
  },
  {
    id: 4,
    name: "ريم الدوسري",
    location: "الخبر",
    rating: 5,
    text: "دوار الشمس المخملي جاب النور لوسط شقتنا! كل من زارنا سألني من وين هالشغل اليدوي البديع.",
    product: "باقة شمس الضحى"
  },
  {
    id: 5,
    name: "عهود التميمي",
    location: "مكة المكرمة",
    rating: 5,
    text: "تغليف نسمة الفخم والكرت البنفسجي وختم الشمع يحسسك إنك مستلم قطعة مجوهرات مو بس ورد.",
    product: "باقة نسمة الورد"
  },
  {
    id: 6,
    name: "فاطمة الشهري",
    location: "أبها",
    rating: 5,
    text: "المزهرية الخزفية مع الزنابق الملونة شي يجمّل طاولة الطعام ويهدي البال، وبدون أي تعب سقاية أو ذبول.",
    product: "مزهرية سحر البستان"
  },
  {
    id: 7,
    name: "مريم هاشم",
    location: "القصيم",
    rating: 5,
    text: "الدرجات الزرقاء المخملية تجنننن، هدية لصديقة عمري وحبينا فكرة إن الوردة تظل معها سنين تذكرها فيني.",
    product: "باقة روضة الأقحوان"
  },
  {
    id: 8,
    name: "هيا السبيعي",
    location: "الدرعية",
    rating: 5,
    text: "حطيتها على طاولة السرير، ملمس المخمل هادي ولطيف، وأجمل هدية ذكرى سنوية وصلتني من زوجي.",
    product: "ثنائية بتلات الشفق"
  },
  {
    id: 9,
    name: "عائشة الخالدي",
    location: "الجبيل",
    rating: 5,
    text: "توصيل سريع ومحمي للباب، والباقة فتحت نفسنا أول ما فكينا الصندوق. شكراً نسمة على هالفن والإتقان.",
    product: "باقة فجر المحبة"
  }
]

const TestimonialCard = ({ testimonial }: { testimonial: typeof testimonials[0] }) => (
  <div className="rounded-3xl p-6 mb-4 flex-shrink-0 bg-card border border-border/60 nasmma-card-shadow text-right" dir="rtl">
    {/* Stars */}
    <div className="flex gap-1 mb-3 justify-start">
      {[...Array(testimonial.rating)].map((_, i) => (
        <Star key={i} className="w-4 h-4 fill-primary text-primary" />
      ))}
    </div>

    {/* Quote */}
    <p className="text-foreground/90 leading-relaxed mb-4 text-pretty font-light text-sm sm:text-base">
      &ldquo;{testimonial.text}&rdquo;
    </p>

    {/* Author */}
    <div className="flex items-center justify-between gap-2 pt-2 border-t border-border/40">
      <div>
        <p className="font-arabic text-foreground text-sm font-bold">{testimonial.name}</p>
        <p className="text-[11px] text-muted-foreground font-light">{testimonial.location}</p>
      </div>
      <span className="text-[11px] font-arabic font-semibold text-primary bg-primary/10 px-3 py-1 rounded-full whitespace-nowrap">
        {testimonial.product}
      </span>
    </div>
  </div>
)

export function Testimonials() {
  const [headerVisible, setHeaderVisible] = useState(false)
  const headerRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) setHeaderVisible(true)
      },
      { threshold: 0.1 }
    )

    if (headerRef.current) observer.observe(headerRef.current)

    return () => {
      if (headerRef.current) observer.unobserve(headerRef.current)
    }
  }, [])

  return (
    <section className="py-24 bg-background overflow-hidden" dir="rtl">
      <div className="max-w-7xl mx-auto px-6 lg:px-8">
        {/* Header */}
        <div ref={headerRef} className="text-center mb-16 max-w-3xl mx-auto">
          <span className={`text-xs font-semibold tracking-wider uppercase text-primary mb-3 block font-arabic ${headerVisible ? 'animate-blur-in opacity-0' : 'opacity-0'}`} style={headerVisible ? { animationDelay: '0.2s', animationFillMode: 'forwards' } : {}}>
            مـشـاعـر عـمـلاء نَـسْـمَـة · قـصـص مـن واقـع الـبـيـوت
          </span>
          <h2 className={`text-foreground text-balance ${headerVisible ? 'animate-blur-in opacity-0' : 'opacity-0'}`} style={headerVisible ? { animationDelay: '0.35s', animationFillMode: 'forwards' } : {}}>
            <span className="font-arabic text-3xl sm:text-5xl md:text-6xl text-primary font-bold block mb-2 leading-tight">
              أحـلـى شـي بـالـدنـيـا؟ نـظـرة عـيـونـهـم لـمـا يـعـرفـون إنـهـا مـا تـذبـل!
            </span>
          </h2>
        </div>

        {/* Scrolling Testimonials */}
        <div className="relative">
          <div className="absolute top-0 bottom-0 right-0 w-24 sm:w-36 bg-gradient-to-l from-background to-transparent z-10 pointer-events-none" />
          <div className="absolute top-0 bottom-0 left-0 w-24 sm:w-36 bg-gradient-to-r from-background to-transparent z-10 pointer-events-none" />
          
          {/* Row 1 */}
          <div className="relative overflow-hidden mb-4">
            <div className="animate-scroll-left hover:animate-scroll-left-slow flex gap-4 w-max">
              {[...testimonials, ...testimonials].map((testimonial, index) => (
                <div key={`row1-${testimonial.id}-${index}`} className="w-[360px] flex-shrink-0">
                  <TestimonialCard testimonial={testimonial} />
                </div>
              ))}
            </div>
          </div>

          {/* Row 2 */}
          <div className="relative overflow-hidden">
            <div className="animate-scroll-right hover:animate-scroll-right-slow flex gap-4 w-max">
              {[...testimonials.slice().reverse(), ...testimonials.slice().reverse()].map((testimonial, index) => (
                <div key={`row2-${testimonial.id}-${index}`} className="w-[360px] flex-shrink-0">
                  <TestimonialCard testimonial={testimonial} />
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>

      <style jsx>{`
        @keyframes scroll-left {
          0% {
            transform: translateX(0);
          }
          100% {
            transform: translateX(-50%);
          }
        }

        @keyframes scroll-right {
          0% {
            transform: translateX(-50%);
          }
          100% {
            transform: translateX(0);
          }
        }

        .animate-scroll-left {
          animation: scroll-left 45s linear infinite;
        }

        .animate-scroll-right {
          animation: scroll-right 45s linear infinite;
        }

        .animate-scroll-left-slow {
          animation: scroll-left 85s linear infinite;
        }

        .animate-scroll-right-slow {
          animation: scroll-right 85s linear infinite;
        }
      `}</style>
    </section>
  )
}
