import fs from "fs"
import path from "path"
import { getSupabaseAdmin, isSupabaseConfigured } from "./supabase"
import { ChatMessage } from "@/types/chat"

export type CustomRequestStatus = "new" | "contacted" | "completed" | "cancelled"

export type CustomRequest = {
  id: string
  customerName: string
  customerPhone: string
  customerEmail?: string
  occasion: string
  requestType: string
  colors: string
  budget: string
  deliveryDate: string
  city: string
  notes?: string
  status: CustomRequestStatus
  summary: string
  messages: ChatMessage[]
  createdAt: string
  updatedAt?: string
}

const DATA_DIR = path.join(process.cwd(), "data")
const DATA_FILE = path.join(DATA_DIR, "custom-requests.json")

const INITIAL_REQUESTS: CustomRequest[] = [
  {
    id: "REQ-NASMMA-DEMO01",
    customerName: "سارة البلوشي",
    customerPhone: "+96891234567",
    occasion: "تخرج من جامعة السلطان قابوس",
    requestType: "باقة زهور مخملية مع كرت إهداء",
    colors: "بنفسجي ملكي ولؤلؤي أبيض",
    budget: "20 - 25 ر.ع",
    deliveryDate: "خلال 4 أيام",
    city: "مسقط - الخوض",
    notes: "إضافة عبارة 'مبارك التخرج يا سارة' على كرت نسمة المختوم بالشمع",
    status: "new",
    summary: "1. المناسبة: تخرج من الجامعة\n2. نوع الطلب: باقة مخملية مع كرت إهداء\n3. الألوان: بنفسجي ولؤلؤي\n4. الميزانية: 20-25 ر.ع\n5. التاريخ: خلال 4 أيام\n6. المدينة: مسقط - الخوض\n7. الاسم والتواصل: سارة (+96891234567)",
    messages: [
      { role: "user", content: "مرحبا أبي أسوي باقة مخصصة لتخرج أختي" },
      { role: "assistant", content: "أهلاً وسهلاً فيك 🌷 يسعدني أساعدك. شنو المناسبة بالضبط؟" },
      { role: "user", content: "تخرج من جامعة السلطان قابوس، تبي ألوان بنفسجي ولؤلؤي، والميزانية حوالي 22 ر.ع في مسقط الخوض واسمها سارة ورقمي 91234567" },
      { role: "assistant", content: "ما شاء الله ألف مبارك 🎓 تم تسجيل رغباتك وفريق نسمة بيتواصل معك خلال 24 ساعة." },
    ],
    createdAt: new Date(Date.now() - 3600000 * 4).toISOString(),
  },
]

function ensureLocalDataFile(): CustomRequest[] {
  try {
    if (!fs.existsSync(DATA_DIR)) {
      fs.mkdirSync(DATA_DIR, { recursive: true })
    }
    if (!fs.existsSync(DATA_FILE)) {
      fs.writeFileSync(DATA_FILE, JSON.stringify(INITIAL_REQUESTS, null, 2), "utf8")
      return INITIAL_REQUESTS
    }
    const raw = fs.readFileSync(DATA_FILE, "utf8")
    const parsed = JSON.parse(raw)
    if (Array.isArray(parsed)) {
      return parsed
    }
    return INITIAL_REQUESTS
  } catch (err) {
    console.error("[Custom Requests DB] Error reading custom-requests.json:", err)
    return INITIAL_REQUESTS
  }
}

function writeLocalDataFile(data: CustomRequest[]): void {
  try {
    if (!fs.existsSync(DATA_DIR)) {
      fs.mkdirSync(DATA_DIR, { recursive: true })
    }
    fs.writeFileSync(DATA_FILE, JSON.stringify(data, null, 2), "utf8")
  } catch (err) {
    console.error("[Custom Requests DB] Error writing custom-requests.json:", err)
  }
}

export function getCustomRequests(): CustomRequest[] {
  return ensureLocalDataFile()
}

export async function getCustomRequestsAsync(): Promise<CustomRequest[]> {
  if (isSupabaseConfigured()) {
    try {
      const supabase = getSupabaseAdmin()
      if (supabase) {
        const { data, error } = await supabase
          .from("nasmma_custom_requests")
          .select("*")
          .order("created_at", { ascending: false })

        if (!error && data && data.length > 0) {
          return data.map((d: any) => ({
            id: d.id,
            customerName: d.customer_name || "عميل نسمة",
            customerPhone: d.customer_phone || "",
            customerEmail: d.customer_email || undefined,
            occasion: d.occasion || "طلب مخصص",
            requestType: d.request_type || "باقة زهور",
            colors: d.colors || "حسب الاختيار",
            budget: d.budget || "غير محدد",
            deliveryDate: d.delivery_date || "أقرب وقت",
            city: d.city || "سلطنة عُمان",
            notes: d.notes || "",
            status: (d.status || "new") as CustomRequestStatus,
            summary: d.summary || "",
            messages: Array.isArray(d.messages) ? d.messages : [],
            createdAt: d.created_at || new Date().toISOString(),
            updatedAt: d.updated_at,
          }))
        }
      }
    } catch (err) {
      console.warn("[Supabase Custom Requests Fetch Fallback]:", err)
    }
  }
  return getCustomRequests()
}

export async function saveCustomRequestAsync(req: CustomRequest): Promise<CustomRequest> {
  const list = ensureLocalDataFile()
  const existingIdx = list.findIndex((r) => r.id === req.id)

  if (existingIdx >= 0) {
    list[existingIdx] = { ...list[existingIdx], ...req, updatedAt: new Date().toISOString() }
  } else {
    list.unshift(req)
  }
  writeLocalDataFile(list)

  if (isSupabaseConfigured()) {
    const supabase = getSupabaseAdmin()
    if (supabase) {
      try {
        await supabase.from("nasmma_custom_requests").upsert({
          id: req.id,
          customer_name: req.customerName,
          customer_phone: req.customerPhone,
          customer_email: req.customerEmail,
          occasion: req.occasion,
          request_type: req.requestType,
          colors: req.colors,
          budget: req.budget,
          delivery_date: req.deliveryDate,
          city: req.city,
          notes: req.notes,
          status: req.status,
          summary: req.summary,
          messages: req.messages,
          created_at: req.createdAt,
          updated_at: new Date().toISOString(),
        })
      } catch (err) {
        console.error("[Supabase Custom Request Upsert Error]:", err)
      }
    }
  }

  return req
}

export async function updateCustomRequestStatusAsync(
  id: string,
  status: CustomRequestStatus
): Promise<boolean> {
  const list = ensureLocalDataFile()
  const target = list.find((r) => r.id === id)
  if (target) {
    target.status = status
    target.updatedAt = new Date().toISOString()
    writeLocalDataFile(list)

    if (isSupabaseConfigured()) {
      const supabase = getSupabaseAdmin()
      if (supabase) {
        try {
          await supabase
            .from("nasmma_custom_requests")
            .update({ status, updated_at: new Date().toISOString() })
            .eq("id", id)
        } catch (err) {
          console.error("[Supabase Custom Request Status Error]:", err)
        }
      }
    }
    return true
  }
  return false
}

export async function deleteCustomRequestAsync(id: string): Promise<boolean> {
  const list = ensureLocalDataFile()
  const initialLen = list.length
  const filtered = list.filter((r) => r.id !== id)
  if (filtered.length !== initialLen) {
    writeLocalDataFile(filtered)
    if (isSupabaseConfigured()) {
      const supabase = getSupabaseAdmin()
      if (supabase) {
        try {
          await supabase.from("nasmma_custom_requests").delete().eq("id", id)
        } catch (err) {
          console.error("[Supabase Custom Request Delete Error]:", err)
        }
      }
    }
    return true
  }
  return false
}
