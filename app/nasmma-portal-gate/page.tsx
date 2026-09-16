import { redirect } from "next/navigation"
import { isAuthenticatedAdmin } from "@/lib/auth"
import { GateLoginForm } from "@/components/admin/gate-login-form"

export default async function PortalGatePage({
  searchParams,
}: {
  searchParams: Promise<{ error?: string; email?: string }>
}) {
  const isAuth = await isAuthenticatedAdmin()
  if (isAuth) {
    redirect("/admin")
  }

  const { error, email } = await searchParams

  return (
    <main className="min-h-screen bg-[#FBF6F4] flex items-center justify-center p-4" dir="rtl">
      <GateLoginForm initialError={error} attemptedEmail={email} />
    </main>
  )
}
