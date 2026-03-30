import Link from "next/link"
import { TransactionRow } from "./TransactionRow"

interface Category {
  id: string
  name: string
  type: "income" | "expense"
  color: string
  icon: string
}

interface Transaction {
  id: string
  amount: number
  type: "income" | "expense"
  description: string | null
  date: Date
  categoryId: string
  category: Category
  isRecurring: boolean
  recurringInterval: string | null
}

interface TransactionListProps {
  transactions: Transaction[]
  categories: Category[]
  activeCategory?: Category
  currentMonth: string
}

function formatAmount(amount: number) {
  return new Intl.NumberFormat("fr-FR", {
    style: "currency",
    currency: "EUR",
    minimumFractionDigits: 2,
  }).format(amount)
}

export function TransactionList({
  transactions,
  categories,
  activeCategory,
  currentMonth,
}: TransactionListProps) {
  if (transactions.length === 0) {
    return (
      <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-12 text-center">
        <div className="text-4xl mb-3">📭</div>
        <p className="text-gray-600 font-semibold">
          {activeCategory
            ? `Aucune transaction dans "${activeCategory.name}"`
            : "Aucune transaction ce mois-ci"}
        </p>
        <p className="text-gray-400 text-sm mt-1">
          {activeCategory ? (
            <Link
              href={`/dashboard?month=${currentMonth}`}
              className="text-indigo-500 hover:underline"
            >
              ← Voir toutes les transactions
            </Link>
          ) : (
            'Cliquez sur "Ajouter" pour commencer'
          )}
        </p>
      </div>
    )
  }

  const totalIncome = transactions.filter((t) => t.type === "income").reduce((s, t) => s + t.amount, 0)
  const totalExpense = transactions.filter((t) => t.type === "expense").reduce((s, t) => s + t.amount, 0)

  return (
    // NOTE: no overflow-hidden — lets the fixed-position dropdown menu escape
    <div className="bg-white rounded-2xl border border-gray-100 shadow-sm">
      {/* Header */}
      <div className="px-5 py-3.5 border-b border-gray-50 flex items-center justify-between">
        <div className="flex items-center gap-2">
          {activeCategory && (
            <div
              className="w-6 h-6 rounded-lg flex items-center justify-center text-sm"
              style={{ backgroundColor: activeCategory.color + "20" }}
            >
              {activeCategory.icon}
            </div>
          )}
          <h2 className="font-semibold text-gray-800 text-sm">
            {activeCategory ? activeCategory.name : "Transactions"}
          </h2>
          <span className="text-xs text-gray-400 bg-gray-50 px-2 py-0.5 rounded-lg">
            {transactions.length}
          </span>
        </div>

        <div className="flex items-center gap-3 text-xs font-semibold">
          {totalIncome > 0 && (
            <span className="text-emerald-600">+{formatAmount(totalIncome)}</span>
          )}
          {totalExpense > 0 && (
            <span className="text-gray-500">−{formatAmount(totalExpense)}</span>
          )}
        </div>
      </div>

      {/* Rows — divide-y ensures separators without overflow-hidden */}
      <div className="divide-y divide-gray-50">
        {transactions.map((t) => (
          <TransactionRow key={t.id} transaction={t} categories={categories} />
        ))}
      </div>
    </div>
  )
}
