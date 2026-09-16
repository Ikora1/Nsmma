import { isAuthenticatedAdmin, getAuthenticatedAdminEmail } from "@/lib/auth"
import { notFound } from "next/navigation"
import { getStoreProducts, getStoreOffer, getStoreCategories } from "@/lib/store-db"
import { getStoreOrdersAsync } from "@/lib/orders-db"
import { getCustomRequestsAsync } from "@/lib/custom-requests-db"
import { AdminDashboard } from "@/components/admin/admin-dashboard"

export default async function AdminPage() {
  const isAuth = await isAuthenticatedAdmin()
  if (!isAuth) {
    notFound()
  }

  const products = getStoreProducts()
  const offer = getStoreOffer()
  const categories = getStoreCategories()
  const orders = await getStoreOrdersAsync()
  const customRequests = await getCustomRequestsAsync()
  const adminEmail = await getAuthenticatedAdminEmail()

  return (
    <main className="min-h-screen bg-[#FBF6F4] text-foreground" dir="rtl">
      <AdminDashboard 
        initialProducts={products} 
        initialOffer={offer} 
        initialCategories={categories}
        initialOrders={orders}
        initialCustomRequests={customRequests}
        adminEmail={adminEmail || "مسؤول معتمد"}
      />
    </main>
  )
}
