"use client"

import { useRouter } from "next/navigation"

const MONTHS_FR = [
  "Janvier", "Février", "Mars", "Avril", "Mai", "Juin",
  "Juillet", "Août", "Septembre", "Octobre", "Novembre", "Décembre",
]

interface MonthNavProps {
  currentMonth: string // "2026-03"
}

export function MonthNav({ currentMonth }: MonthNavProps) {
  const router = useRouter()
  const [year, month] = currentMonth.split("-").map(Number)

  const label = `${MONTHS_FR[month - 1]} ${year}`

  function navigate(delta: number) {
    const d = new Date(year, month - 1 + delta, 1)
    const newMonth = `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, "0")}`
    router.push(`/dashboard?month=${newMonth}`)
  }

  return (
    <div className="flex items-center gap-2">
      <button
        onClick={() => navigate(-1)}
        className="w-8 h-8 flex items-center justify-center rounded-xl bg-white border border-gray-200 hover:bg-gray-50 transition-colors text-gray-600 font-medium"
      >
        ‹
      </button>
      <span className="text-sm font-semibold text-gray-800 w-36 text-center capitalize">
        {label}
      </span>
      <button
        onClick={() => navigate(1)}
        className="w-8 h-8 flex items-center justify-center rounded-xl bg-white border border-gray-200 hover:bg-gray-50 transition-colors text-gray-600 font-medium"
      >
        ›
      </button>
    </div>
  )
}
