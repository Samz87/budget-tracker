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
  return (
    <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
      <div className="bg-white rounded-2xl p-5 border border-gray-100 shadow-sm">
        <div className="flex items-center justify-between mb-3">
          <span className="text-sm font-medium text-gray-500">Revenus</span>
          <div className="w-8 h-8 rounded-full bg-green-100 flex items-center justify-center">
            <span className="text-base">↑</span>
          </div>
        </div>
        <p className="text-2xl font-bold text-green-600">{formatAmount(income)}</p>
      </div>

      <div className="bg-white rounded-2xl p-5 border border-gray-100 shadow-sm">
        <div className="flex items-center justify-between mb-3">
          <span className="text-sm font-medium text-gray-500">Dépenses</span>
          <div className="w-8 h-8 rounded-full bg-red-100 flex items-center justify-center">
            <span className="text-base">↓</span>
          </div>
        </div>
        <p className="text-2xl font-bold text-red-500">{formatAmount(expense)}</p>
      </div>

      <div
        className={`rounded-2xl p-5 border shadow-sm ${
          balance >= 0
            ? "bg-indigo-600 border-indigo-600"
            : "bg-red-600 border-red-600"
        }`}
      >
        <div className="flex items-center justify-between mb-3">
          <span className="text-sm font-medium text-indigo-100">Solde</span>
          <span className="text-xs text-indigo-200">{count} opération{count !== 1 ? "s" : ""}</span>
        </div>
        <p className="text-2xl font-bold text-white">{formatAmount(balance)}</p>
      </div>
    </div>
  )
}
