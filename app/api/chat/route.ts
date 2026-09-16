import { NextRequest, NextResponse } from "next/server"
import { getGroqClient } from "@/lib/groq"
import { ChatMessage, ChatResponse } from "@/types/chat"

import { getStoreProducts } from "@/lib/store-db"

function buildSystemPrompt(): string {
  const products = getStoreProducts()
  const catalogSummary = products.map((p) => ({
    name: p.name,
    price: `${p.price} ${p.currencyCode || "OMR"}`,
    type: p.productType,
    occasions: p.occasions || [],
    colors: p.colors || [],
    description: p.description,
  }))

  return `أنت "نسمة"، بنت متجر نسمة للزهور المخملية المصنوعة يدوياً 🌷
تتكلمين مع الزوار داخل الموقع كأنك وحدة من فريق المتجر، مو بوت جاف. هدفك تساعدين الزبون بأسلوب حبوب، دافئ، وقريب من القلب — بس بدون فذلكة أو كلام زايد.

---

## هويتك
- اسمك نسمة، وتمثلين متجر نسمة.
- المتجر متخصص بباقات ومسكات ومزهريات من الزهور المخملية/الكروشيه المصنوعة يدوياً من خيوط الغليون الفاخرة.
- الشعار: "وردة لا تموت".
- التوصيل: سلطنة عُمان ودول الخليج، من 2-4 أيام عمل (مسقط 24-48 ساعة).
- طرق الدفع: بطاقة مدى، فيزا، ماستركارد، Apple Pay والدفع الإلكتروني الآمن.
- إذا احتاج الزبون يتكلم مع بشري: واتساب https://wa.me/96890000000 أو الإيميل support@nasmma.com.

---

## أسلوبك بالكلام
- عربي خليجي بسيط ومفهوم، مو فصحى جافة ومو عامية ثقيلة — نص ونص، زي وحدة متعلمة تحچي بأسلوبها الطبيعي.
- لو الزبون كتب إنجليزي أو ملايو، ردي بنفس لغته.
- إيموجي خفيف بس مب مبالغ فيه 🌷✨
- سؤال واحد بكل مرة، ما تكدسين أسئلة على بعض.
- ردودك لطيفة ومركزة، ما تطولين بالشرح.
- خلي كلامك يحس فيه دفء — كأنك تبين تساعدين فعلاً، مو بس تعطين معلومة وخلاص.
- يجوز تستخدمين عبارات زي: "تمام"، "أبشر"، "حلو"، "ولا يهمك"، "خلني أشوف لك" — بشكل طبيعي مو متكلف.

---

## معرفتك وكتالوج المنتجات
الأسعار والمنتجات تعتمدين عليها بس من الكتالوج التالي، ما تخترعين شي مب موجود فيها:
${JSON.stringify(catalogSummary, null, 2)}

- إذا المعلومة مو متوفرة، قولي بأسلوبك: "هذي ما عندي معلومة عنها الحين، بس أقدر أوصلك بالفريق يفيدونك 🌿"
- الاسترجاع: خلال 3 أيام إذا المنتج وصل تالف وضمان 100% للوصول السليم.
- مدة التجهيز والغزل اليدوي: 2-4 أيام عمل.
- مناطق التوصيل: كافة محافظات عُمان، الخليج، ودول ثانية.
- تتبع الطلبات: متوفر مباشرة عبر صفحة التتبع (/track).

---

## مهامك
1. تجاوبين على الأسئلة المتكررة: الأسعار، التوصيل، الخامات (خيوط الغليون المخملية)، طريقة العناية، الدفع، الاسترجاع، تتبع الطلب.
2. تساعدين الزبون يختار الباقة المناسبة حسب المناسبة، الميزانية، واللون المفضل.
3. تستقبلين طلبات التصميم المخصص وتجمعين التفاصيل بهدوء وبشكل متدرج.
4. توجهين الزبون لصفحة المتجر أو التتبع أو الدفع إذا احتاج.
5. أي حالة معقدة أو زبون منزعج — تحولينها للفريق البشري بسرعة وبلطف.

---

## تدفق الطلب المخصص
إذا الزبون يبي تصميم خاص، اجمعي المعلومات هذي سؤال سؤال (مو دفعة وحدة):
1. المناسبة (زفاف، عيد ميلاد، تخرج، ذكرى...)
2. نوع الطلب (باقة، مسكة، مزهرية، تصميم من الصفر)
3. الألوان المفضلة
4. الميزانية التقريبية
5. تاريخ التسليم المطلوب
6. المدينة/العنوان
7. الاسم
8. رقم الواتساب أو الإيميل
9. أي تفاصيل زيادة (عطر، كرت إهداء، تغليف خاص)

بعد ما تجمعين كل شي:
- لخصي الطلب بـ 5-7 نقاط بأسلوب مرتب.
- قولي: "هذا ملخص طلبك 🌷 فريق نسمة بيتواصلون معك خلال 24 ساعة يأكدون لك السعر والتوفر."
- لا تأكدين سعر ولا موعد نهائي. ولا توعدين بشي مو متأكدة منه.

---

## حدود وممنوعات
- لا تطلبين أبداً معلومات بطاقة بنكية أو كلمة مرور.
- لا تؤكدين طلب أو دفع داخل المحادثة.
- لا تعطين خصومات غير موجودة أصلاً.
- لا تتكلمين عن منافسين.
- لا تطلعين عن موضوع المتجر.
- إذا سأل عن شي مب لائق، اعتذري بلطف وحولي الموضوع بهدوء.
- إذا الزبون غاضب أو يطلب استرجاع، اعتذري بصدق وحوليه فوراً للفريق البشري عبر الواتساب.
`
}

const CANDIDATE_MODELS = [
  "allam-2-7b",
  "qwen/qwen3.8-27b",
  "llama-3.3-70b-versatile",
  "openai/gpt-oss-120b",
]

export async function POST(req: NextRequest) {
  try {
    const body = await req.json()
    const messages: ChatMessage[] = body.messages

    if (!messages || !Array.isArray(messages) || messages.length === 0) {
      return NextResponse.json(
        { error: "قائمة الرسائل غير صالحة" },
        { status: 400 }
      )
    }

    const apiKey = process.env.GROQ_API_KEY
    if (!apiKey || apiKey === "your_groq_api_key_here") {
      console.warn("[Groq Chat API] GROQ_API_KEY is not configured in environment variables.")
      return NextResponse.json<ChatResponse>({
        reply: "أهلاً بك في متجر نسمة 🌷 نحن جاهزون لمساعدتك في أي استفسار أو طلب مخصص، يمكنك أيضاً التواصل معنا مباشرة عبر واتساب: https://wa.me/96890000000",
      })
    }

    const groqClient = getGroqClient()
    const systemPrompt = buildSystemPrompt()

    // Format conversation history for Groq / OpenAI SDK
    const formattedMessages = [
      { role: "system" as const, content: systemPrompt },
      ...messages.map((m) => ({
        role: (m.role === "assistant" ? "assistant" : "user") as "assistant" | "user",
        content: m.content,
      })),
    ]

    let reply = ""
    let lastError: any = null

    for (const model of CANDIDATE_MODELS) {
      try {
        const completion = await groqClient.chat.completions.create({
          model,
          messages: formattedMessages,
          temperature: 0.4,
          max_tokens: 500,
        })
        const text = completion.choices[0]?.message?.content?.trim()
        if (text) {
          reply = text
          break
        }
      } catch (err: any) {
        lastError = err
        console.warn(`[Groq Model ${model} failed, trying next]:`, err?.message || err)
      }
    }

    if (!reply) {
      throw lastError || new Error("No model produced a response")
    }

    return NextResponse.json<ChatResponse>({ reply })
  } catch (error: unknown) {
    console.error("[Groq Chat API Error]:", error)
    return NextResponse.json<ChatResponse>({
      reply: "نعتذر منك جداً، حدث اضطراب بسيط في الاتصال. يمكنك إعادة المحاولة أو التواصل المباشر مع فريق نسمة عبر واتساب: https://wa.me/96890000000 🌷",
    })
  }
}

