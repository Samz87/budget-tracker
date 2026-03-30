import { auth } from "@/auth"
import { redirect } from "next/navigation"
import { logout } from "@/app/actions/auth"
import { NavTabs } from "@/components/NavTabs"

export default async function DashboardLayout({
  children,
}: {
  children: React.ReactNode
}) {
  const session = await auth()
  if (!session?.user) redirect("/login")

  const initials = ((session.user.name || session.user.email || "?")[0]).toUpperCase()

  return (
    <div className="min-h-screen" style={{ background: "linear-gradient(180deg, #eef2ff 0%, #f8fafc 120px)" }}>
      {/* Header */}
      <header
        className="sticky top-0 z-40"
        style={{ background: "linear-gradient(135deg, #1e1b4b 0%, #4338ca 100%)" }}
      >
        <div className="max-w-5xl mx-auto px-4">
          {/* Top bar */}
          <div className="h-14 flex items-center justify-between">
            <div className="flex items-center gap-2.5">
              <div className="w-8 h-8 rounded-xl bg-white/15 flex items-center justify-center backdrop-blur-sm">
                <span className="text-base">💳</span>
              </div>
              <span className="font-bold text-white text-[15px] tracking-tight">Budget Tracker</span>
            </div>

            <div className="flex items-center gap-2">
              <div className="hidden sm:flex items-center gap-2 bg-white/10 rounded-xl px-3 py-1.5">
                <div className="w-5 h-5 rounded-full bg-indigo-400 flex items-center justify-center text-[10px] text-white font-bold">
                  {initials}
                </div>
                <span className="text-sm text-white/80 font-medium max-w-[160px] truncate">
                  {session.user.name || session.user.email}
                </span>
              </div>
              <form action={logout}>
                <button
                  type="submit"
                  className="text-sm text-white/50 hover:text-white/90 transition-colors px-3 py-1.5 rounded-xl hover:bg-white/10"
                >
                  Déconnexion
                </button>
              </form>
            </div>
          </div>

          {/* Navigation tabs */}
          <NavTabs />
        </div>
      </header>

      <main className="max-w-5xl mx-auto px-4 py-6">{children}</main>
    </div>
  )
}
