"use client"

import { useEffect, useRef, useState } from "react"
import Image from "next/image"
import { Heart, Sparkles, Smile, ShieldCheck } from "lucide-react"

const features = [
  {
    icon: Heart,
    title: "أوعـيـة لـلـذكـريـات",
    description: "مو مجرد وردة... هذي تذكار لحب ما ينتهي، وشاهدة على مشاعر صادقة ما تموت."
  },
  {
    icon: Sparkles,
    title: "خـيـوط تـحـتـفـظ بـريـحـتـك",
    description: "رش عليها قطرات من عطرك الخاص، وتظل شايلة ريحتك في غرفتهم لأشهر وسنين."
  },
  {
    icon: Smile,
    title: "جـمـال دائـم بـدون تـعـب",
    description: "بدون عناء سقاية ولا خوف من جفاف أو تعفن... تظل زاهية وناضرة كأنها انصنعت أمس."
  },
  {
    icon: ShieldCheck,
    title: "هـديـة مـا تـروح هـدر",
    description: "ما بتلقى مصيرها في سلة المهملات بعد 3 أيام... تدفع في شي يعيش كل العمر."
  }
]

export function FeatureSection() {
  const [isVisible, setIsVisible] = useState(false)
  const [isVideoVisible, setIsVideoVisible] = useState(false)
  const [headerVisible, setHeaderVisible] = useState(false)
  const bentoRef = useRef<HTMLDivElement>(null)
  const videoSectionRef = useRef<HTMLDivElement>(null)
  const headerRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) setIsVisible(true)
      },
      { threshold: 0.1 }
    )

    const videoObserver = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) setIsVideoVisible(true)
      },
      { threshold: 0.1 }
    )

    const headerObserver = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) setHeaderVisible(true)
      },
      { threshold: 0.1 }
    )

    if (bentoRef.current) observer.observe(bentoRef.current)
    if (videoSectionRef.current) videoObserver.observe(videoSectionRef.current)
    if (headerRef.current) headerObserver.observe(headerRef.current)

    return () => {
      if (bentoRef.current) observer.unobserve(bentoRef.current)
      if (videoSectionRef.current) videoObserver.unobserve(videoSectionRef.current)
      if (headerRef.current) headerObserver.unobserve(headerRef.current)
    }
  }, [])

  return (
    <section className="py-24 bg-background" dir="rtl">
      <div className="max-w-7xl mx-auto px-6 lg:px-8">
        {/* Bento Grid - Lifestyle Image Gallery */}
        <div 
          ref={bentoRef}
          className="grid md:grid-cols-4 mb-20 md:grid-rows-[300px_300px] gap-6"
        >
          {/* Left Large Block */}
          <div 
            className={`relative rounded-3xl overflow-hidden h-[500px] md:h-auto md:col-span-2 md:row-span-2 transition-all duration-700 ease-out border border-border/50 ${
              isVisible ? 'opacity-100 scale-100' : 'opacity-0 scale-[0.85]'
            }`}
            style={{ transitionDelay: '0ms' }}
          >
            <Image
              src="/images/lifestyle/crafting-artisan.jpg"
              alt="صناعة الورد المخملي يدوياً"
              fill
              className="object-cover hover:scale-105 transition-transform duration-700"
            />
            {/* Overlay Card */}
            <div className="absolute bottom-8 right-8 left-8 bg-white/95 backdrop-blur-md p-6 shadow-xl rounded-2xl border border-[#F0E4EC] text-right">
              <span className="font-arabic text-primary text-sm font-bold block mb-1">
                فن نسج الورد بخيوط الغليون
              </span>
              <h3 className="text-xl text-foreground mb-1 font-arabic font-bold">
                نسكب قلوبنا ووقتنا في كل بتلة
              </h3>
              <p className="text-xs text-muted-foreground leading-relaxed font-light">
                كل وردة نشتغلها حبة حبة، مو بس عشان تعجبك أول ما تفتح الصندوق، بل عشان تعيش معك ومع من تحب كأنها تحفة أثرية تحفظ حكايتكم.
              </p>
            </div>
          </div>

          {/* Top Right Block */}
          <div 
            className={`rounded-3xl p-6 md:p-8 flex flex-col justify-center md:col-span-2 relative overflow-hidden transition-all duration-700 ease-out border border-border/50 ${
              isVisible ? 'opacity-100 scale-100' : 'opacity-0 scale-[0.85]'
            }`}
            style={{ transitionDelay: '100ms' }}
          >
            <Image
              src="/images/lifestyle/lifestyle-2.jpg"
              alt="مزهريات زهور مخملية في المنزل"
              fill
              className="object-cover hover:scale-105 transition-transform duration-700"
            />
            <div className="absolute bottom-4 right-4 bg-white/90 backdrop-blur-sm px-4 py-2 rounded-xl text-xs font-semibold text-foreground font-arabic">
              سكينة للبيت · لمسة دفء لا تزول
            </div>
          </div>

          {/* Bottom Right Block */}
          <div 
            className={`rounded-3xl p-6 md:p-8 flex flex-col justify-center relative overflow-hidden md:col-span-2 transition-all duration-700 ease-out border border-border/50 ${
              isVisible ? 'opacity-100 scale-100' : 'opacity-0 scale-[0.85]'
            }`}
            style={{ transitionDelay: '200ms' }}
          >
            <Image
              src="/images/lifestyle/lifestyle-4.jpg"
              alt="تفاصيل خيوط الغليون والمخمل"
              fill
              className="object-cover hover:scale-105 transition-transform duration-700"
            />
            <div className="absolute bottom-4 right-4 bg-white/90 backdrop-blur-sm px-4 py-2 rounded-xl text-xs font-semibold text-foreground font-arabic">
              ملمس مخملي ناعم · ألوان زاهية أبدية
            </div>
          </div>
        </div>

        {/* Header Section */}
        <div 
          ref={headerRef}
          className="text-center mb-16 max-w-3xl mx-auto"
        >
          <span className={`text-xs font-semibold tracking-wider uppercase text-primary mb-3 block font-arabic ${headerVisible ? 'animate-blur-in opacity-0' : 'opacity-0'}`} style={headerVisible ? { animationDelay: '0.2s', animationFillMode: 'forwards' } : {}}>
            فـلـسـفـة نَـسْـمَـة · لـيـه الـورد اللـي مـا يـمـوت أصـدق؟
          </span>
          <h2 className={`text-foreground mb-4 text-balance ${headerVisible ? 'animate-blur-in opacity-0' : 'opacity-0'}`} style={headerVisible ? { animationDelay: '0.35s', animationFillMode: 'forwards' } : {}}>
            <span className="font-arabic text-3xl sm:text-5xl md:text-6xl text-primary font-bold block mb-2 leading-tight">
              الـوردة تـذبـل... بـس مـشـاعـرك تـسـتـاهـل الأبـديـة.
            </span>
          </h2>
          <p className={`text-base sm:text-lg text-muted-foreground leading-relaxed font-light ${headerVisible ? 'animate-blur-in opacity-0' : 'opacity-0'}`} style={headerVisible ? { animationDelay: '0.5s', animationFillMode: 'forwards' } : {}}>
            كثير يقولون: الورد الطبيعي له هيبته... صحيح، بس الورد الطبيعي عمره أسبوع، ويموت في سلة المهملات. هل حبك لأمك بينتهي بأسبوع؟ هل عهدك لشريكة حياتك يذبل لما تجف أوراقه؟ في نسمة، نآمن إن الهدية الأصدق هي اللي تروي قصة ما تنتهي.
          </p>
        </div>

        {/* Two Videos Side by Side */}
        <div 
          ref={videoSectionRef}
          className="grid lg:grid-cols-2 gap-8 mb-10"
        >
          {/* Video 1 */}
          <div 
            className={`relative aspect-[4/5] rounded-3xl overflow-hidden nasmma-card-shadow transition-all duration-700 ease-out border border-border/50 ${
              isVideoVisible ? 'opacity-100 scale-100' : 'opacity-0 scale-[0.9]'
            }`}
          >
            <video
              autoPlay
              muted
              loop
              playsInline
              className="absolute inset-0 w-full h-full object-cover"
              src="/videos/testimonial-1.mp4"
            />
            {/* Person Info with Progressive Blur */}
            <div className="absolute bottom-0 left-0 right-0 p-8 text-right">
              <div 
                className="absolute inset-0 backdrop-blur-[10px] bg-black/50" 
                style={{ maskImage: 'linear-gradient(to top, black 0%, black 50%, transparent 100%)', WebkitMaskImage: 'linear-gradient(to top, black 0%, black 50%, transparent 100%)' }} 
              />
              <div className="relative z-10 text-white">
                <div className="flex items-center gap-2 mb-1">
                  <h3 className="font-arabic text-xl sm:text-2xl text-white font-bold">ليلى المنصور</h3>
                  <span className="text-xs text-[#EFD9E8] font-light">الرياض</span>
                </div>
                <p className="text-white/95 text-xs font-semibold mb-2 bg-white/20 backdrop-blur-sm inline-block px-3 py-0.5 rounded-full font-arabic">
                  باقة فجر المحبة (هدية لوالدتها)
                </p>
                <p className="text-white/90 text-xs sm:text-sm leading-relaxed font-light">
                  "أهديتها لأمي، للحين حاطتها جنب سريرها وكل ما دخلت عليها مسحت عليها وقالت: هذي وردة بنيتي اللي ما تموت."
                </p>
              </div>
            </div>
          </div>

          {/* Video 2 */}
          <div 
            className={`relative aspect-[4/5] rounded-3xl overflow-hidden nasmma-card-shadow transition-all duration-700 ease-out border border-border/50 ${
              isVideoVisible ? 'opacity-100 scale-100' : 'opacity-0 scale-[0.9]'
            }`}
            style={{ transitionDelay: '100ms' }}
          >
            <video
              autoPlay
              muted
              loop
              playsInline
              className="absolute inset-0 w-full h-full object-cover"
              src="/videos/testimonial-2.mp4"
            />
            {/* Person Info with Progressive Blur */}
            <div className="absolute bottom-0 left-0 right-0 p-8 text-right">
              <div 
                className="absolute inset-0 backdrop-blur-[10px] bg-black/50" 
                style={{ maskImage: 'linear-gradient(to top, black 0%, black 50%, transparent 100%)', WebkitMaskImage: 'linear-gradient(to top, black 0%, black 50%, transparent 100%)' }} 
              />
              <div className="relative z-10 text-white">
                <div className="flex items-center gap-2 mb-1">
                  <h3 className="font-arabic text-xl sm:text-2xl text-white font-bold">نادية رزاق</h3>
                  <span className="text-xs text-[#EFD9E8] font-light">جدة</span>
                </div>
                <p className="text-white/95 text-xs font-semibold mb-2 bg-white/20 backdrop-blur-sm inline-block px-3 py-0.5 rounded-full font-arabic">
                  مسكة همس المخمل (ذكرى زواج)
                </p>
                <p className="text-white/90 text-xs sm:text-sm leading-relaxed font-light">
                  "كنت شايلة هم مسكة عروستي تذبل بالحر، مسكة نسمة باللؤلؤ طلعت بالصور خيال، والحين محطوطة في صالتنا صار لها سنة كأنها انصنعت أمس."
                </p>
              </div>
            </div>
          </div>
        </div>

        {/* Feature Cards Below Videos */}
        <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-5">
          {features.map((feature, index) => (
            <div
              key={feature.title}
              className={`group p-6 boty-transition hover:scale-[1.02] rounded-2xl bg-card border border-border/60 transition-all duration-700 ease-out hover:border-primary/20 text-right ${
                isVideoVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-8'
              }`}
              style={{ transitionDelay: `${200 + index * 80}ms` }}
            >
              <div className="inline-flex items-center justify-center w-12 h-12 rounded-xl mb-4 group-hover:bg-primary/15 boty-transition bg-primary/10 text-primary">
                <feature.icon className="w-6 h-6 text-primary" strokeWidth={1.5} />
              </div>
              <h3 className="font-arabic font-bold text-foreground mb-2 text-base">{feature.title}</h3>
              <p className="text-xs text-muted-foreground leading-relaxed font-light">{feature.description}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}
