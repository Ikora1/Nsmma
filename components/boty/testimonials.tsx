"use client"

import { useEffect, useRef, useState } from "react"
import { Star, Quote, Sparkles, Heart } from "lucide-react"

const testimonials = [
  {
    id: 1,
    name: "عائشة المعمرية",
    location: "سلطنة عُمان · مسقط",
    rating: 5,
    occasion: "هدية يوم الأم",
    text: "أهديتها للوالدة في يوم الأم، للحين حاطتها جنب سريرها وكل ما دخلت عليها مسحت على البتلات وقالت: هذي وردة بنيتي اللي ما تموت ولا تذبل أبداً.",
    product: "باقة فجر المحبة"
  },
  {
    id: 2,
    name: "مريم البلوشي",
    location: "سلطنة عُمان · صحار",
    rating: 5,
    occasion: "مسكة ليلة العمر",
    text: "كنت شايلة هم مسكة عرسي تذبل بحر القاعة والتصوير، مسكة نسمة باللؤلؤ والمخمل خطفت الأنظار بالصور، واليوم بصالتنا كأنها انصنعت أمس.",
    product: "مسكة همس المخمل"
  },
  {
    id: 3,
    name: "سارة المنصور",
    location: "السعودية · الرياض",
    rating: 5,
    occasion: "هدية وداع وسفر",
    text: "رشيّت عليها عطري وأهديتها لصديقة عمري قبل تسافر دراسة بالخارج... تقول لي ريحتك فيها وكل ما ضاق صدرها ضمت الباقة وتذكرت لمتنا.",
    product: "باقة فجر الياسمين"
  },
  {
    id: 4,
    name: "سالم بن حمد الشامسي",
    location: "سلطنة عُمان · البريمي",
    rating: 5,
    occasion: "هدية تخرج ونجاح",
    text: "أهديت باقة دوار الشمس لأختي يوم تخرجها من الجامعة. ألوانها تفتح النفس ودفء خيوط الغليون حسسنا إن الهدية مصنوعة بضمير وإتقان عالي.",
    product: "باقة شمس الضحى"
  },
  {
    id: 5,
    name: "نوف الكعبي",
    location: "الإمارات · دبي",
    rating: 5,
    occasion: "ذكرى سنوية",
    text: "تغليف نسمة الفخم والصندوق الصلب والكرت البنفسجي بختم الشمع يحسسك إنك مستلم قطعة مجوهرات ثمينة مو بس باقة ورد عادية.",
    product: "باقة نسمة الورد"
  },
  {
    id: 6,
    name: "حمد الهاجري",
    location: "قطر · الدوحة",
    rating: 5,
    occasion: "تأثيث منزل جديد",
    text: "المزهرية الخزفية مع الزنابق الملونة شي يجمّل طاولة الطعام ويهدي البال، وبدون أي تعب سقاية أو تساقط أوراق. إضافة فخمة جداً للمجلس.",
    product: "مزهرية سحر البستان"
  },
  {
    id: 7,
    name: "ريم الدوسري",
    location: "السعودية · الخبر",
    rating: 5,
    occasion: "شكر وتقدير",
    text: "الدرجات الزرقاء المخملية خياااال! هدية لمعلمتي تقديراً لجهودها، وكتبوا رسالتي بالخط العربي الأنيق داخل الكرت بقمة الذوق.",
    product: "باقة روضة الأقحوان"
  },
  {
    id: 8,
    name: "فاطمة الحارثية",
    location: "سلطنة عُمان · صلالة",
    rating: 5,
    occasion: "هدية ميلاد مفاجئة",
    text: "حطيتها على طاولة السرير، ملمس المخمل هادي ولطيف، وريحة العطر تمسك فيها بشكل عجيب وتفوح في الغرفة لأيام طويلة.",
    product: "ثنائية بتلات الشفق"
  },
  {
    id: 9,
    name: "عبدالله العتيبي",
    location: "الكويت · العاصمة",
    rating: 5,
    occasion: "هدية اعتذار راقية",
    text: "أفضل هدية اعتذار ممكن تقدمها. لما عرفت إنها وردة ما تموت دمعت عيونها، التوصيل كان سريع والتغليف كان محمي 100%.",
    product: "باقة فجر الياسمين"
  },
  {
    id: 10,
    name: "عهود التميمي",
    location: "السعودية · جدة",
    rating: 5,
    occasion: "ملكة وعقد قران",
    text: "طلبتها لأختي في يوم عقد قرانها، الباقة طلعت أحلى من الصور بمراحل! تفاصيل الغزل المتقن واللؤلؤ تعكس الفخامة الحقيقية.",
    product: "مسكة همس المخمل"
  }
]

const TestimonialCard = ({ testimonial }: { testimonial: typeof testimonials[0] }) => (
  <div className="rounded-3xl p-6 mb-4 flex-shrink-0 bg-white border border-[#F0E4EC] nasmma-card-shadow text-right flex flex-col justify-between h-[230px]" dir="rtl">
    <div>
      {/* Stars & Occasion Badge */}
      <div className="flex items-center justify-between gap-2 mb-3">
        <div className="flex gap-1 justify-start">
          {[...Array(testimonial.rating)].map((_, i) => (
            <Star key={i} className="w-3.5 h-3.5 fill-amber-400 text-amber-400" />
          ))}
        </div>
        <span className="text-[10px] font-arabic font-semibold text-primary bg-[#EFD9E8]/50 px-2.5 py-0.5 rounded-full">
          {testimonial.occasion}
        </span>
      </div>

      {/* Quote */}
      <p className="text-foreground/90 leading-relaxed font-light text-xs sm:text-sm line-clamp-4">
        &ldquo;{testimonial.text}&rdquo;
      </p>
    </div>

    {/* Author & Product */}
    <div className="flex items-center justify-between gap-2 pt-3 border-t border-border/40 mt-auto">
      <div>
        <p className="font-arabic text-foreground text-xs font-bold">{testimonial.name}</p>
        <p className="text-[10px] text-muted-foreground font-light">{testimonial.location}</p>
      </div>
      <span className="text-[10px] font-arabic font-semibold text-primary bg-primary/5 px-2.5 py-1 rounded-full whitespace-nowrap border border-[#F0E4EC]">
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
    <section className="py-24 bg-[#FBF6F4] overflow-hidden" dir="rtl">
      <div className="max-w-7xl mx-auto px-6 lg:px-8">
        {/* Header */}
        <div ref={headerRef} className="text-center mb-16 max-w-3xl mx-auto">
          <div className="inline-flex items-center gap-2 px-3.5 py-1 rounded-full bg-white border border-[#F0E4EC] text-primary text-xs font-semibold mb-3">
            <Heart className="w-3.5 h-3.5 text-primary fill-primary" />
            <span className="font-arabic">مـشـاعـر عـمـلاء نَـسْـمَـة · قـصـص مـن واقـع الـبـيـوت</span>
          </div>
          <h2 className={`text-foreground text-balance ${headerVisible ? 'animate-blur-in opacity-0' : 'opacity-0'}`} style={headerVisible ? { animationDelay: '0.35s', animationFillMode: 'forwards' } : {}}>
            <span className="font-arabic text-3xl sm:text-5xl md:text-6xl text-primary font-bold block mb-2 leading-tight">
              أحـلـى شـي بـالـدنـيـا؟ نـظـرة عـيـونـهـم لـمـا يـعـرفـون إنـهـا مـا تـذبـل!
            </span>
          </h2>
          <p className="text-xs sm:text-sm text-muted-foreground font-arabic max-w-xl mx-auto font-light mt-2">
            تجارب حية من أكثر من 2,400 بيت في سلطنة عُمان والخليج وثّقت أصدق لحظات الحب والتخرج وليالي العمر.
          </p>
        </div>

        {/* Scrolling Testimonials Rows */}
        <div className="relative">
          <div className="absolute top-0 bottom-0 right-0 w-24 sm:w-36 bg-gradient-to-l from-[#FBF6F4] to-transparent z-10 pointer-events-none" />
          <div className="absolute top-0 bottom-0 left-0 w-24 sm:w-36 bg-gradient-to-r from-[#FBF6F4] to-transparent z-10 pointer-events-none" />
          
          {/* Row 1 */}
          <div className="relative overflow-hidden mb-4">
            <div className="animate-scroll-left hover:animate-scroll-left-slow flex gap-4 w-max">
              {[...testimonials.slice(0, 5), ...testimonials.slice(0, 5)].map((testimonial, index) => (
                <div key={`row1-${testimonial.id}-${index}`} className="w-[360px] flex-shrink-0">
                  <TestimonialCard testimonial={testimonial} />
                </div>
              ))}
            </div>
          </div>

          {/* Row 2 */}
          <div className="relative overflow-hidden">
            <div className="animate-scroll-right hover:animate-scroll-right-slow flex gap-4 w-max">
              {[...testimonials.slice(5, 10), ...testimonials.slice(5, 10)].map((testimonial, index) => (
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
