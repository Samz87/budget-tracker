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
}

export function TransactionList({ transactions, categories }: TransactionListProps) {
  if (transactions.length === 0) {
    return (
      <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-12 text-center">
        <div className="text-4xl mb-3">📭</div>
        <p className="text-gray-500 font-medium">Aucune transaction ce mois-ci</p>
        <p className="text-gray-400 text-sm mt-1">Cliquez sur &quot;Ajouter&quot; pour commencer</p>
      </div>
    )
  }

  return (
    <div className="bg-white rounded-2xl border border-gray-100 shadow-sm overflow-hidden">
      <div className="px-5 py-3 border-b border-gray-50 flex items-center justify-between">
        <h2 className="font-semibold text-gray-800 text-sm">Transactions</h2>
        <span className="text-xs text-gray-400">{transactions.length} au total</span>
      </div>
      <div className="divide-y divide-gray-50">
        {transactions.map((t) => (
          <TransactionRow key={t.id} transaction={t} categories={categories} />
        ))}
      </div>
    </div>
  )
}
