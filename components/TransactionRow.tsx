"use client"

import { useState, useTransition } from "react"
import { deleteTransaction, duplicateTransaction } from "@/app/actions/transactions"
import { TransactionDialog } from "./TransactionDialog"

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

const RECURRING_LABELS: Record<string, string> = {
  daily: "quotidien",
  weekly: "hebdo",
  monthly: "mensuel",
  yearly: "annuel",
}

function formatAmount(amount: number) {
  return new Intl.NumberFormat("fr-FR", {
    style: "currency",
    currency: "EUR",
  }).format(amount)
}

function formatDate(date: Date) {
  return new Date(date).toLocaleDateString("fr-FR", {
    day: "numeric",
    month: "short",
  })
}

export function TransactionRow({
  transaction,
  categories,
}: {
  transaction: Transaction
  categories: Category[]
}) {
  const [editOpen, setEditOpen] = useState(false)
  const [menuOpen, setMenuOpen] = useState(false)
  const [isPending, startTransition] = useTransition()

  const isIncome = transaction.type === "income"

  function handleDelete() {
    if (!confirm("Supprimer cette transaction ?")) return
    startTransition(() => deleteTransaction(transaction.id))
  }

  function handleDuplicate() {
    startTransition(() => duplicateTransaction(transaction.id))
    setMenuOpen(false)
  }

  return (
    <>
      <div className={`flex items-center gap-3 px-5 py-3.5 hover:bg-gray-50 transition-colors ${isPending ? "opacity-50" : ""}`}>
        {/* Icon */}
        <div
          className="w-9 h-9 rounded-full flex items-center justify-center flex-shrink-0 text-base"
          style={{ backgroundColor: transaction.category.color + "20" }}
        >
          <span>{transaction.category.icon}</span>
        </div>

        {/* Info */}
        <div className="flex-1 min-w-0">
          <div className="flex items-center gap-2">
            <span className="text-sm font-medium text-gray-800 truncate">
              {transaction.description || transaction.category.name}
            </span>
            {transaction.isRecurring && transaction.recurringInterval && (
              <span className="text-xs bg-indigo-50 text-indigo-600 px-1.5 py-0.5 rounded-md font-medium flex-shrink-0">
                🔁 {RECURRING_LABELS[transaction.recurringInterval]}
              </span>
            )}
          </div>
          <div className="flex items-center gap-2 mt-0.5">
            <span className="text-xs text-gray-400">{formatDate(transaction.date)}</span>
            <span className="text-xs text-gray-300">·</span>
            <span
              className="text-xs font-medium"
              style={{ color: transaction.category.color }}
            >
              {transaction.category.name}
            </span>
          </div>
        </div>

        {/* Amount */}
        <span
          className={`text-sm font-semibold flex-shrink-0 ${
            isIncome ? "text-green-600" : "text-red-500"
          }`}
        >
          {isIncome ? "+" : "-"}
          {formatAmount(transaction.amount)}
        </span>

        {/* Menu */}
        <div className="relative">
          <button
            onClick={() => setMenuOpen(!menuOpen)}
            className="w-7 h-7 flex items-center justify-center text-gray-400 hover:text-gray-600 rounded-lg hover:bg-gray-100 transition-colors text-lg"
          >
            ⋯
          </button>
          {menuOpen && (
            <>
              <div className="fixed inset-0 z-10" onClick={() => setMenuOpen(false)} />
              <div className="absolute right-0 top-8 bg-white border border-gray-100 rounded-xl shadow-lg z-20 py-1 w-40">
                <button
                  onClick={() => { setEditOpen(true); setMenuOpen(false) }}
                  className="w-full text-left px-4 py-2 text-sm text-gray-700 hover:bg-gray-50 flex items-center gap-2"
                >
                  ✏️ Modifier
                </button>
                <button
                  onClick={handleDuplicate}
                  className="w-full text-left px-4 py-2 text-sm text-gray-700 hover:bg-gray-50 flex items-center gap-2"
                >
                  📋 Dupliquer
                </button>
                <div className="border-t border-gray-100 my-1" />
                <button
                  onClick={handleDelete}
                  className="w-full text-left px-4 py-2 text-sm text-red-500 hover:bg-red-50 flex items-center gap-2"
                >
                  🗑️ Supprimer
                </button>
              </div>
            </>
          )}
        </div>
      </div>

      {editOpen && (
        <TransactionDialog
          categories={categories}
          transaction={transaction}
          onClose={() => setEditOpen(false)}
        />
      )}
    </>
  )
}
