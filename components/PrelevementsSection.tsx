function formatAmount(amount: number) {
  return new Intl.NumberFormat("fr-FR", {
    style: "currency",
    currency: "EUR",
  }).format(amount)
}

function getNextDebitDate(firstDate: Date): Date {
  const today = new Date()
  today.setHours(0, 0, 0, 0)
  const dayOfMonth = new Date(firstDate).getDate()

  // Try this month first
  const thisMonth = new Date(today.getFullYear(), today.getMonth(), dayOfMonth)
  if (thisMonth >= today) return thisMonth

  // Otherwise next month
  return new Date(today.getFullYear(), today.getMonth() + 1, dayOfMonth)
}

function daysUntil(date: Date): number {
  const today = new Date()
  today.setHours(0, 0, 0, 0)
  return Math.ceil((date.getTime() - today.getTime()) / (1000 * 60 * 60 * 24))
}

interface Transaction {
  id: string
  amount: number
  description: string | null
  date: Date
  category: {
    name: string
    icon: string
    color: string
  }
}

export function PrelevementsSection({ prelevements }: { prelevements: Transaction[] }) {
  if (prelevements.length === 0) {
    return (
      <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-12 text-center">
        <div className="text-4xl mb-3">🔁</div>
        <p className="text-gray-600 font-semibold">Aucun prélèvement mensuel</p>
        <p className="text-gray-400 text-sm mt-1.5">
          Ajoutez une transaction récurrente mensuelle pour la suivre ici
        </p>
      </div>
    )
  }

  const enriched = prelevements
    .map((t) => {
      const nextDate = getNextDebitDate(t.date)
      return { ...t, nextDate, daysLeft: daysUntil(nextDate) }
    })
    .sort((a, b) => a.daysLeft - b.daysLeft)

  const totalMonthly = prelevements.reduce((sum, t) => sum + t.amount, 0)

  return (
    <div className="space-y-4">
      {/* Summary banner */}
      <div className="bg-white rounded-2xl border border-gray-100 shadow-sm px-5 py-4 flex items-center justify-between">
        <div>
          <p className="text-sm font-semibold text-gray-700">Total mensuel engagé</p>
          <p className="text-xs text-gray-400 mt-0.5">
            {prelevements.length} prélèvement{prelevements.length !== 1 ? "s" : ""} actif{prelevements.length !== 1 ? "s" : ""}
          </p>
        </div>
        <div className="text-right">
          <p className="text-xl font-bold text-red-500">{formatAmount(totalMonthly)}</p>
          <p className="text-xs text-gray-400">/mois</p>
        </div>
      </div>

      {/* Upcoming debits */}
      <div className="bg-white rounded-2xl border border-gray-100 shadow-sm overflow-hidden">
        <div className="px-5 py-3.5 border-b border-gray-50 flex items-center justify-between">
          <h2 className="text-sm font-semibold text-gray-800">Prochains débits</h2>
          <span className="text-xs text-gray-400">par ordre d&apos;échéance</span>
        </div>

        <div className="divide-y divide-gray-50">
          {enriched.map((t) => {
            const isToday = t.daysLeft === 0
            const isTomorrow = t.daysLeft === 1
            const isUrgent = t.daysLeft <= 3
            const isSoon = t.daysLeft <= 7

            const badgeClass = isUrgent
              ? "bg-red-50 text-red-600 border-red-100"
              : isSoon
              ? "bg-orange-50 text-orange-600 border-orange-100"
              : "bg-emerald-50 text-emerald-700 border-emerald-100"

            const dateLabel = isToday
              ? "Aujourd'hui !"
              : isTomorrow
              ? "Demain"
              : `J-${t.daysLeft} · ${t.nextDate.toLocaleDateString("fr-FR", {
                  day: "numeric",
                  month: "short",
                })}`

            // Progress bar: 0 days = full, 30 days = empty
            const urgencyPct = Math.max(0, 100 - (t.daysLeft / 30) * 100)

            return (
              <div key={t.id} className="flex items-center gap-3.5 px-5 py-4">
                {/* Icon */}
                <div
                  className="w-10 h-10 rounded-xl flex items-center justify-center flex-shrink-0 text-lg"
                  style={{ backgroundColor: t.category.color + "18" }}
                >
                  {t.category.icon}
                </div>

                {/* Name + category */}
                <div className="flex-1 min-w-0">
                  <p className="text-sm font-semibold text-gray-800 truncate">
                    {t.description || t.category.name}
                  </p>
                  <div className="flex items-center gap-1.5 mt-0.5">
                    <span
                      className="text-xs font-medium"
                      style={{ color: t.category.color }}
                    >
                      {t.category.name}
                    </span>
                    <span className="text-gray-200 text-xs">·</span>
                    <span className="text-xs text-gray-400">
                      le {new Date(t.date).getDate()} de chaque mois
                    </span>
                  </div>
                  {/* Urgency bar */}
                  <div className="mt-1.5 h-1 bg-gray-100 rounded-full overflow-hidden w-24">
                    <div
                      className={`h-full rounded-full transition-all ${
                        isUrgent ? "bg-red-400" : isSoon ? "bg-orange-400" : "bg-emerald-400"
                      }`}
                      style={{ width: `${urgencyPct}%` }}
                    />
                  </div>
                </div>

                {/* Amount + badge */}
                <div className="text-right flex-shrink-0 space-y-1">
                  <p className="text-sm font-bold text-gray-800">
                    −{formatAmount(t.amount)}
                  </p>
                  <span
                    className={`inline-block text-[10px] font-semibold px-2 py-0.5 rounded-lg border ${badgeClass}`}
                  >
                    {dateLabel}
                  </span>
                </div>
              </div>
            )
          })}
        </div>
      </div>
    </div>
  )
}
