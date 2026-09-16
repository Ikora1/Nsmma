import fs from "fs"
import path from "path"
import { getSupabaseAdmin, isSupabaseConfigured } from "./supabase"

export type OrderItem = {
  name: string
  price: number
  quantity: number
  image?: string
}

export type StoreOrder = {
  id: string
  orderId: string
  stripeSessionId?: string
  amountOmr: number
  currency: string
  customerName: string
  customerPhone: string
  customerEmail?: string
  governorate: string
  deliveryAddress: string
  giftMessage?: string
  discountCode?: string
  paymentStatus: "paid" | "pending" | "failed"
  deliveryStatus: "processing" | "shipped" | "delivered" | "cancelled"
  items: OrderItem[]
  createdAt: string
}

const DATA_DIR = path.join(process.cwd(), "data")
const ORDERS_FILE = path.join(DATA_DIR, "orders-data.json")

function ensureDataFile(): StoreOrder[] {
  try {
    if (!fs.existsSync(DATA_DIR)) {
      fs.mkdirSync(DATA_DIR, { recursive: true })
    }
    if (!fs.existsSync(ORDERS_FILE)) {
      // Seed with initial demo order in Oman for instant admin visualization
      const sampleOrders: StoreOrder[] = [
        {
          id: "seed-ord-1",
          orderId: "NASMMA-OM-DEMO01",
          stripeSessionId: "cs_test_sample_1",
          amountOmr: 20.5,
          currency: "OMR",
          customerName: "فاطمة بنت هيثم",
          customerPhone: "+968 92345678",
          customerEmail: "fatma.oman@example.com",
          governorate: "مسقط",
          deliveryAddress: "ولاية السيب، الحيل الجنوبية، فيلا 12 قرب مدرسة النجاح",
          giftMessage: "كل عام وأنتِ نسمة حياتنا ووردتها التي لا تذبل أبداً. دمتِ لنا يا أمي الغالية ❤️",
          discountCode: "NASMMA10",
          paymentStatus: "paid",
          deliveryStatus: "processing",
          items: [
            {
              name: "بـاقـة فـجـر الـمـحـبـة",
              price: 18.5,
              quantity: 1,
              image: "/images/products/product-1.jpg",
            },
          ],
          createdAt: new Date(Date.now() - 1000 * 60 * 45).toISOString(), // 45 minutes ago
        },
        {
          id: "seed-ord-2",
          orderId: "NASMMA-OM-DEMO02",
          stripeSessionId: "cs_test_sample_2",
          amountOmr: 27.5,
          currency: "OMR",
          customerName: "سالم بن حمد الشامسي",
          customerPhone: "+968 97890123",
          customerEmail: "salem.alshamsi@example.com",
          governorate: "البريمي",
          deliveryAddress: "البريمي، منطقة الخضراء الجديدة، بجانب حديقة الصعراء",
          giftMessage: "ألف مبروك التخرج والتفوق، وعقبال أعلى المراتب بإذن الله.",
          paymentStatus: "paid",
          deliveryStatus: "shipped",
          items: [
            {
              name: "مـسـكـة هـمـس الـمـخـمـل",
              price: 24.0,
              quantity: 1,
              image: "/images/products/product-2.jpg",
            },
          ],
          createdAt: new Date(Date.now() - 1000 * 60 * 180).toISOString(), // 3 hours ago
        },
      ]
      fs.writeFileSync(ORDERS_FILE, JSON.stringify(sampleOrders, null, 2), "utf-8")
      return sampleOrders
    }
    const content = fs.readFileSync(ORDERS_FILE, "utf-8")
    return JSON.parse(content)
  } catch (err) {
    console.error("Error reading orders file:", err)
    return []
  }
}

function writeOrdersFile(orders: StoreOrder[]): void {
  try {
    if (!fs.existsSync(DATA_DIR)) {
      fs.mkdirSync(DATA_DIR, { recursive: true })
    }
    fs.writeFileSync(ORDERS_FILE, JSON.stringify(orders, null, 2), "utf-8")
  } catch (err) {
    console.error("Error writing orders file:", err)
  }
}

export async function getStoreOrdersAsync(): Promise<StoreOrder[]> {
  // 1. Try Supabase first if configured
  if (isSupabaseConfigured()) {
    const supabaseAdmin = getSupabaseAdmin()
    if (supabaseAdmin) {
      try {
        const { data, error } = await supabaseAdmin
          .from("nasmma_orders")
          .select("*")
          .order("created_at", { ascending: false })

        if (!error && data && data.length > 0) {
          return data.map((row) => ({
            id: row.id || row.order_id,
            orderId: row.order_id,
            stripeSessionId: row.stripe_session_id,
            amountOmr: Number(row.amount_omr),
            currency: row.currency || "OMR",
            customerName: row.customer_name,
            customerPhone: row.customer_phone,
            customerEmail: row.customer_email || undefined,
            governorate: row.governorate,
            deliveryAddress: row.delivery_address || "",
            giftMessage: row.gift_message || "",
            discountCode: row.discount_code || undefined,
            paymentStatus: row.payment_status || "paid",
            deliveryStatus: row.delivery_status || "processing",
            items: row.items || [],
            createdAt: row.created_at,
          }))
        }
      } catch (dbErr) {
        console.warn("Supabase orders fetch fallback to local file:", dbErr)
      }
    }
  }

  // 2. Fallback to local JSON file
  return ensureDataFile().sort(
    (a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
  )
}

export async function saveStoreOrderAsync(order: StoreOrder): Promise<void> {
  // 1. Always save to local JSON file for instant reliability
  const currentOrders = ensureDataFile()
  const existingIdx = currentOrders.findIndex((o) => o.orderId === order.orderId)
  if (existingIdx >= 0) {
    currentOrders[existingIdx] = { ...currentOrders[existingIdx], ...order }
  } else {
    currentOrders.unshift(order)
  }
  writeOrdersFile(currentOrders)

  // 2. Sync to Supabase if available
  if (isSupabaseConfigured()) {
    const supabaseAdmin = getSupabaseAdmin()
    if (supabaseAdmin) {
      try {
        await supabaseAdmin.from("nasmma_orders").upsert(
          {
            order_id: order.orderId,
            stripe_session_id: order.stripeSessionId,
            amount_omr: order.amountOmr,
            currency: order.currency,
            customer_name: order.customerName,
            customer_phone: order.customerPhone,
            customer_email: order.customerEmail,
            governorate: order.governorate,
            delivery_address: order.deliveryAddress,
            gift_message: order.giftMessage,
            discount_code: order.discountCode,
            payment_status: order.paymentStatus,
            delivery_status: order.deliveryStatus,
            items: order.items,
            created_at: order.createdAt,
          },
          { onConflict: "order_id" }
        )
      } catch (dbErr) {
        console.error("Failed to upsert order into Supabase:", dbErr)
      }
    }
  }
}

export async function updateOrderStatusAsync(
  orderId: string,
  deliveryStatus: StoreOrder["deliveryStatus"],
  paymentStatus?: StoreOrder["paymentStatus"]
): Promise<boolean> {
  const currentOrders = ensureDataFile()
  const order = currentOrders.find((o) => o.orderId === orderId || o.id === orderId)
  if (!order) return false

  order.deliveryStatus = deliveryStatus
  if (paymentStatus) {
    order.paymentStatus = paymentStatus
  }
  writeOrdersFile(currentOrders)

  if (isSupabaseConfigured()) {
    const supabaseAdmin = getSupabaseAdmin()
    if (supabaseAdmin) {
      try {
        await supabaseAdmin
          .from("nasmma_orders")
          .update({
            delivery_status: deliveryStatus,
            ...(paymentStatus ? { payment_status: paymentStatus } : {}),
          })
          .eq("order_id", orderId)
      } catch (dbErr) {
        console.error("Failed to update status in Supabase:", dbErr)
      }
    }
  }

  return true
}
