function formatAmount(amount: number) {
  return new Intl.NumberFormat("fr-FR", {
    style: "currency",
    currency: "EUR",
    minimumFractionDigits: 2,
  }).format(amount)
}

interface SummaryCardsProps {
  income: number
  expense: number
  balance: number
  count: number
}

export function SummaryCards({ income, expense, balance, count }: SummaryCardsProps) {
  const isPositive = balance >= 0

  return (
    <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
      {/* Income */}
      <div className="bg-white rounded-2xl p-5 shadow-sm border border-emerald-50 relative overflow-hidden">
        <div
          className="absolute inset-0 opacity-[0.04]"
          style={{ background: "radial-gradient(ellipse at top right, #10b981 0%, transparent 70%)" }}
        />
        <div className="relative">
          <div className="flex items-center justify-between mb-4">
            <span className="text-xs font-semibold text-gray-400 uppercase tracking-wider">Revenus</span>
            <div className="w-8 h-8 rounded-xl bg-emerald-100 flex items-center justify-center">
              <svg className="w-4 h-4 text-emerald-600" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M4.5 10.5L12 3m0 0l7.5 7.5M12 3v18" />
              </svg>
            </div>
          </div>
          <p className="text-2xl font-bold text-gray-900 tabular-nums">{formatAmount(income)}</p>
          <div className="mt-1.5 h-1 bg-emerald-100 rounded-full overflow-hidden">
            <div
              className="h-full bg-emerald-500 rounded-full transition-all"
              style={{ width: income + expense > 0 ? `${(income / (income + expense)) * 100}%` : "0%" }}
            />
          </div>
        </div>
      </div>

      {/* Expenses */}
      <div className="bg-white rounded-2xl p-5 shadow-sm border border-red-50 relative overflow-hidden">
        <div
          className="absolute inset-0 opacity-[0.04]"
          style={{ background: "radial-gradient(ellipse at top right, #ef4444 0%, transparent 70%)" }}
        />
        <div className="relative">
          <div className="flex items-center justify-between mb-4">
            <span className="text-xs font-semibold text-gray-400 uppercase tracking-wider">Dépenses</span>
            <div className="w-8 h-8 rounded-xl bg-red-100 flex items-center justify-center">
              <svg className="w-4 h-4 text-red-500" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M19.5 13.5L12 21m0 0l-7.5-7.5M12 21V3" />
              </svg>
            </div>
          </div>
          <p className="text-2xl font-bold text-gray-900 tabular-nums">{formatAmount(expense)}</p>
          <div className="mt-1.5 h-1 bg-red-100 rounded-full overflow-hidden">
            <div
              className="h-full bg-red-500 rounded-full transition-all"
              style={{ width: income + expense > 0 ? `${(expense / (income + expense)) * 100}%` : "0%" }}
            />
          </div>
        </div>
      </div>

      {/* Balance */}
      <div
        className="rounded-2xl p-5 shadow-md relative overflow-hidden"
        style={{
          background: isPositive
            ? "linear-gradient(135deg, #4f46e5 0%, #7c3aed 100%)"
            : "linear-gradient(135deg, #dc2626 0%, #b91c1c 100%)",
        }}
      >
        <div className="absolute inset-0 opacity-10" style={{ background: "radial-gradient(ellipse at bottom left, white 0%, transparent 60%)" }} />
        <div className="relative">
          <div className="flex items-center justify-between mb-4">
            <span className="text-xs font-semibold text-white/60 uppercase tracking-wider">Solde</span>
            <span className="text-xs font-medium text-white/50 bg-white/10 px-2 py-0.5 rounded-lg">
              {count} op.
            </span>
          </div>
          <p className="text-2xl font-bold text-white tabular-nums">
            {isPositive ? "+" : ""}{formatAmount(balance)}
          </p>
          <p className="mt-1.5 text-xs text-white/40">
            {isPositive ? "✓ Budget positif" : "⚠ Budget déficitaire"}
          </p>
        </div>
      </div>
    </div>
  )
}
