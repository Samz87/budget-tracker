"use client"

import { useState } from "react"
import { TransactionDialog } from "./TransactionDialog"

interface Category {
  id: string
  name: string
  type: "income" | "expense"
  color: string
  icon: string
}

export function AddTransactionButton({ categories }: { categories: Category[] }) {
  const [open, setOpen] = useState(false)

  return (
    <>
      <button
        onClick={() => setOpen(true)}
        className="flex items-center gap-2 bg-indigo-600 text-white px-4 py-2 rounded-xl text-sm font-medium hover:bg-indigo-700 transition-colors shadow-sm"
      >
        <span className="text-lg leading-none">+</span>
        Ajouter
      </button>
      {open && (
        <TransactionDialog
          categories={categories}
          onClose={() => setOpen(false)}
        />
      )}
    </>
  )
}
