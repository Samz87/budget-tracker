"use client"

import { useEffect, useRef, useTransition } from "react"
import { createTransaction, updateTransaction } from "@/app/actions/transactions"

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
  isRecurring: boolean
  recurringInterval: string | null
}

interface TransactionDialogProps {
  categories: Category[]
  transaction?: Transaction
  onClose: () => void
}

const RECURRING_OPTIONS = [
  { value: "daily", label: "Quotidien" },
  { value: "weekly", label: "Hebdomadaire" },
  { value: "monthly", label: "Mensuel" },
  { value: "yearly", label: "Annuel" },
]

export function TransactionDialog({ categories, transaction, onClose }: TransactionDialogProps) {
  const [isPending, startTransition] = useTransition()
  const formRef = useRef<HTMLFormElement>(null)
  const isEdit = !!transaction

  // Close on backdrop click
  function handleBackdrop(e: React.MouseEvent) {
    if (e.target === e.currentTarget) onClose()
  }

  // Close on Escape
  useEffect(() => {
    function onKey(e: KeyboardEvent) {
      if (e.key === "Escape") onClose()
    }
    window.addEventListener("keydown", onKey)
    return () => window.removeEventListener("keydown", onKey)
  }, [onClose])

  const defaultDate = transaction
    ? new Date(transaction.date).toISOString().split("T")[0]
    : new Date().toISOString().split("T")[0]

  const incomeCategories = categories.filter((c) => c.type === "income")
  const expenseCategories = categories.filter((c) => c.type === "expense")

  function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault()
    const formData = new FormData(e.currentTarget)

    startTransition(async () => {
      if (isEdit) {
        await updateTransaction(transaction.id, formData)
      } else {
        await createTransaction(formData)
      }
      onClose()
    })
  }

  return (
    <div
      className="fixed inset-0 bg-black/40 z-50 flex items-end sm:items-center justify-center p-4"
      onClick={handleBackdrop}
    >
      <div className="bg-white rounded-2xl w-full max-w-md max-h-[90vh] overflow-y-auto">
        <div className="flex items-center justify-between p-5 border-b border-gray-100">
          <h2 className="font-semibold text-gray-900">
            {isEdit ? "Modifier la transaction" : "Nouvelle transaction"}
          </h2>
          <button
            onClick={onClose}
            className="text-gray-400 hover:text-gray-600 w-8 h-8 flex items-center justify-center rounded-lg hover:bg-gray-100"
          >
            ✕
          </button>
        </div>

        <form ref={formRef} onSubmit={handleSubmit} className="p-5 space-y-4">
          {/* Type */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Type</label>
            <div className="grid grid-cols-2 gap-2">
              {(["income", "expense"] as const).map((t) => (
                <label
                  key={t}
                  className="flex items-center justify-center gap-2 p-2.5 rounded-xl border-2 cursor-pointer transition-all has-[:checked]:border-indigo-500 has-[:checked]:bg-indigo-50 border-gray-200"
                >
                  <input
                    type="radio"
                    name="type"
                    value={t}
                    defaultChecked={transaction ? transaction.type === t : t === "expense"}
                    className="sr-only"
                  />
                  <span>{t === "income" ? "💰 Revenu" : "💸 Dépense"}</span>
                </label>
              ))}
            </div>
          </div>

          {/* Amount */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1.5">
              Montant (€)
            </label>
            <input
              type="number"
              name="amount"
              step="0.01"
              min="0.01"
              required
              defaultValue={transaction?.amount}
              className="w-full px-4 py-2.5 rounded-xl border border-gray-200 focus:outline-none focus:ring-2 focus:ring-indigo-500 text-sm text-gray-900 bg-white placeholder:text-gray-400"
              placeholder="0.00"
            />
          </div>

          {/* Category */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1.5">
              Catégorie
            </label>
            <select
              name="categoryId"
              required
              defaultValue={transaction?.categoryId}
              className="w-full px-4 py-2.5 rounded-xl border border-gray-200 focus:outline-none focus:ring-2 focus:ring-indigo-500 text-sm bg-white text-gray-900"
            >
              <option value="">Sélectionner une catégorie</option>
              {incomeCategories.length > 0 && (
                <optgroup label="Revenus">
                  {incomeCategories.map((c) => (
                    <option key={c.id} value={c.id}>
                      {c.icon} {c.name}
                    </option>
                  ))}
                </optgroup>
              )}
              {expenseCategories.length > 0 && (
                <optgroup label="Dépenses">
                  {expenseCategories.map((c) => (
                    <option key={c.id} value={c.id}>
                      {c.icon} {c.name}
                    </option>
                  ))}
                </optgroup>
              )}
            </select>
          </div>

          {/* Date */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1.5">Date</label>
            <input
              type="date"
              name="date"
              required
              defaultValue={defaultDate}
              className="w-full px-4 py-2.5 rounded-xl border border-gray-200 focus:outline-none focus:ring-2 focus:ring-indigo-500 text-sm text-gray-900 bg-white placeholder:text-gray-400"
            />
          </div>

          {/* Description */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1.5">
              Description (optionnel)
            </label>
            <input
              type="text"
              name="description"
              defaultValue={transaction?.description || ""}
              className="w-full px-4 py-2.5 rounded-xl border border-gray-200 focus:outline-none focus:ring-2 focus:ring-indigo-500 text-sm text-gray-900 bg-white placeholder:text-gray-400"
              placeholder="Ex: Supermarché Carrefour"
            />
          </div>

          {/* Recurring */}
          <div className="bg-gray-50 rounded-xl p-4 space-y-3">
            <label className="flex items-center gap-3 cursor-pointer">
              <input
                type="checkbox"
                name="isRecurring"
                value="true"
                defaultChecked={transaction?.isRecurring}
                className="w-4 h-4 rounded text-indigo-600"
                id="isRecurring"
                onChange={(e) => {
                  const select = formRef.current?.querySelector("#recurringInterval") as HTMLSelectElement
                  if (select) select.disabled = !e.target.checked
                }}
              />
              <span className="text-sm font-medium text-gray-700">Transaction récurrente</span>
            </label>
            <select
              name="recurringInterval"
              id="recurringInterval"
              defaultValue={transaction?.recurringInterval || "monthly"}
              disabled={!transaction?.isRecurring}
              className="w-full px-4 py-2 rounded-xl border border-gray-200 focus:outline-none focus:ring-2 focus:ring-indigo-500 text-sm bg-white text-gray-900 disabled:opacity-40"
            >
              {RECURRING_OPTIONS.map((o) => (
                <option key={o.value} value={o.value}>
                  {o.label}
                </option>
              ))}
            </select>
          </div>

          {/* Actions */}
          <div className="flex gap-3 pt-2">
            <button
              type="button"
              onClick={onClose}
              className="flex-1 py-2.5 rounded-xl border border-gray-200 text-sm font-medium text-gray-600 hover:bg-gray-50 transition-colors"
            >
              Annuler
            </button>
            <button
              type="submit"
              disabled={isPending}
              className="flex-1 py-2.5 rounded-xl bg-indigo-600 text-white text-sm font-medium hover:bg-indigo-700 transition-colors disabled:opacity-60"
            >
              {isPending ? "Enregistrement..." : isEdit ? "Modifier" : "Ajouter"}
            </button>
          </div>
        </form>
      </div>
    </div>
  )
}
