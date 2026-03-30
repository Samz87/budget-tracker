"use client"

import Link from "next/link"
import { usePathname } from "next/navigation"

const TABS = [
  { href: "/dashboard", label: "Tableau de bord", icon: "📊" },
  { href: "/dashboard/prelevements", label: "Prélèvements", icon: "🔁" },
  { href: "/dashboard/categories", label: "Catégories", icon: "🏷️" },
]

export function NavTabs() {
  const pathname = usePathname()

  return (
    <div className="flex gap-0.5">
      {TABS.map((tab) => {
        const isActive = pathname === tab.href
        return (
          <Link
            key={tab.href}
            href={tab.href}
            className={`flex items-center gap-1.5 px-4 py-2.5 text-sm font-medium rounded-t-xl transition-all ${
              isActive
                ? "bg-white text-indigo-700 shadow-sm"
                : "text-white/60 hover:text-white hover:bg-white/10"
            }`}
          >
            <span className="text-sm">{tab.icon}</span>
            <span className="hidden sm:inline">{tab.label}</span>
          </Link>
        )
      })}
    </div>
  )
}
