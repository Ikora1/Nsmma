import { NextRequest, NextResponse } from "next/server"
import {
  getCustomRequestsAsync,
  updateCustomRequestStatusAsync,
  deleteCustomRequestAsync,
  CustomRequestStatus,
} from "@/lib/custom-requests-db"

export async function GET() {
  try {
    const requests = await getCustomRequestsAsync()
    return NextResponse.json({ success: true, requests })
  } catch (error: any) {
    console.error("Fetch custom requests error:", error)
    return NextResponse.json(
      { error: error?.message || "فشل جلب الطلبات المخصصة" },
      { status: 500 }
    )
  }
}

export async function PATCH(req: NextRequest) {
  try {
    const { id, status } = await req.json()
    if (!id || !status) {
      return NextResponse.json({ error: "معرف الطلب والحالة مطلوبان" }, { status: 400 })
    }

    const updated = await updateCustomRequestStatusAsync(id, status as CustomRequestStatus)
    if (!updated) {
      return NextResponse.json({ error: "لم يتم العثور على الطلب" }, { status: 404 })
    }

    const requests = await getCustomRequestsAsync()
    return NextResponse.json({ success: true, requests })
  } catch (error: any) {
    console.error("Update custom request status error:", error)
    return NextResponse.json(
      { error: error?.message || "فشل تحديث حالة الطلب" },
      { status: 500 }
    )
  }
}

export async function DELETE(req: NextRequest) {
  try {
    const { searchParams } = new URL(req.url)
    const id = searchParams.get("id")
    if (!id) {
      return NextResponse.json({ error: "معرف الطلب مطلوب" }, { status: 400 })
    }

    const deleted = await deleteCustomRequestAsync(id)
    if (!deleted) {
      return NextResponse.json({ error: "تعذر الحذف" }, { status: 404 })
    }

    const requests = await getCustomRequestsAsync()
    return NextResponse.json({ success: true, requests })
  } catch (error: any) {
    console.error("Delete custom request error:", error)
    return NextResponse.json(
      { error: error?.message || "فشل حذف الطلب" },
      { status: 500 }
    )
  }
}
