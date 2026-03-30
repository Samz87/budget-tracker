"use client"

import { useState, useTransition, useRef, useEffect } from "react"
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
  const [menuStyle, setMenuStyle] = useState<React.CSSProperties>({})
  const [isPending, startTransition] = useTransition()
  const buttonRef = useRef<HTMLButtonElement>(null)

  const isIncome = transaction.type === "income"

  // Close menu on scroll or resize
  useEffect(() => {
    if (!menuOpen) return
    const close = () => setMenuOpen(false)
    window.addEventListener("scroll", close, { passive: true })
    window.addEventListener("resize", close)
    return () => {
      window.removeEventListener("scroll", close)
      window.removeEventListener("resize", close)
    }
  }, [menuOpen])

  function handleMenuToggle() {
    if (!menuOpen && buttonRef.current) {
      const rect = buttonRef.current.getBoundingClientRect()
      setMenuStyle({
        top: rect.bottom + 4,
        right: window.innerWidth - rect.right,
      })
    }
    setMenuOpen((v) => !v)
  }

  function handleDelete() {
    if (!confirm("Supprimer cette transaction ?")) return
    setMenuOpen(false)
    startTransition(() => deleteTransaction(transaction.id))
  }

  function handleDuplicate() {
    setMenuOpen(false)
    startTransition(() => duplicateTransaction(transaction.id))
  }

  return (
    <>
      <div
        className={`flex items-center gap-3 px-4 py-3.5 hover:bg-gray-50/80 transition-colors ${
          isPending ? "opacity-40 pointer-events-none" : ""
        }`}
      >
        {/* Category icon */}
        <div
          className="w-9 h-9 rounded-xl flex items-center justify-center flex-shrink-0 text-base"
          style={{ backgroundColor: transaction.category.color + "18" }}
        >
          {transaction.category.icon}
        </div>

        {/* Info */}
        <div className="flex-1 min-w-0">
          <div className="flex items-center gap-2">
            <span className="text-sm font-semibold text-gray-800 truncate">
              {transaction.description || transaction.category.name}
            </span>
            {transaction.isRecurring && transaction.recurringInterval && (
              <span className="text-[10px] bg-indigo-50 text-indigo-500 px-1.5 py-0.5 rounded-md font-semibold flex-shrink-0 tracking-wide">
                🔁 {RECURRING_LABELS[transaction.recurringInterval]}
              </span>
            )}
          </div>
          <div className="flex items-center gap-1.5 mt-0.5">
            <span className="text-xs text-gray-400">{formatDate(transaction.date)}</span>
            <span className="text-gray-200 text-xs">·</span>
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
          className={`text-sm font-bold flex-shrink-0 tabular-nums ${
            isIncome ? "text-emerald-600" : "text-gray-700"
          }`}
        >
          {isIncome ? "+" : "−"}
          {formatAmount(transaction.amount)}
        </span>

        {/* Menu button */}
        <button
          ref={buttonRef}
          onClick={handleMenuToggle}
          className="w-7 h-7 flex items-center justify-center text-gray-300 hover:text-gray-500 rounded-lg hover:bg-gray-100 transition-colors flex-shrink-0"
        >
          <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 24 24">
            <circle cx="5" cy="12" r="2" />
            <circle cx="12" cy="12" r="2" />
            <circle cx="19" cy="12" r="2" />
          </svg>
        </button>
      </div>

      {/* Fixed-position dropdown — escapes overflow:hidden parent */}
      {menuOpen && (
        <>
          <div className="fixed inset-0 z-[100]" onClick={() => setMenuOpen(false)} />
          <div
            className="fixed z-[101] bg-white border border-gray-100 rounded-2xl shadow-xl py-1.5 w-44"
            style={menuStyle}
          >
            <button
              onClick={() => { setEditOpen(true); setMenuOpen(false) }}
              className="w-full text-left px-4 py-2.5 text-sm text-gray-700 hover:bg-gray-50 flex items-center gap-2.5 font-medium"
            >
              <span className="text-base">✏️</span> Modifier
            </button>
            <button
              onClick={handleDuplicate}
              className="w-full text-left px-4 py-2.5 text-sm text-gray-700 hover:bg-gray-50 flex items-center gap-2.5 font-medium"
            >
              <span className="text-base">📋</span> Dupliquer
            </button>
            <div className="h-px bg-gray-100 mx-2 my-1" />
            <button
              onClick={handleDelete}
              className="w-full text-left px-4 py-2.5 text-sm text-red-500 hover:bg-red-50 flex items-center gap-2.5 font-medium"
            >
              <span className="text-base">🗑️</span> Supprimer
            </button>
          </div>
        </>
      )}

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
