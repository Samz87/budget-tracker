import Link from "next/link"

interface Category {
  id: string
  name: string
  type: "income" | "expense"
  color: string
  icon: string
}

interface CategoryFilterProps {
  categories: Category[]
  categoryTotals: Record<string, number>
  currentMonth: string
  activeCategory?: string
}

function formatAmountShort(amount: number) {
  if (amount >= 1000) {
    return new Intl.NumberFormat("fr-FR", { maximumFractionDigits: 1 }).format(amount / 1000) + "k€"
  }
  return new Intl.NumberFormat("fr-FR", { maximumFractionDigits: 0 }).format(amount) + " €"
}

export function CategoryFilter({
  categories,
  categoryTotals,
  currentMonth,
  activeCategory,
}: CategoryFilterProps) {
  // Only show categories with transactions this month
  const activeCategories = categories.filter((c) => categoryTotals[c.id] != null)

  if (activeCategories.length === 0) return null

  return (
    <div className="space-y-2">
      <div className="flex items-center gap-2">
        <span className="text-[11px] font-semibold text-gray-400 uppercase tracking-wider">
          Filtrer par catégorie
        </span>
        {activeCategory && (
          <Link
            href={`/dashboard?month=${currentMonth}`}
            className="text-[11px] text-indigo-500 hover:text-indigo-700 font-medium"
          >
            × Tout afficher
          </Link>
        )}
      </div>

      <div className="flex flex-wrap gap-2">
        {activeCategories.map((cat) => {
          const isActive = activeCategory === cat.id
          const total = categoryTotals[cat.id] || 0

          return (
            <Link
              key={cat.id}
              href={
                isActive
                  ? `/dashboard?month=${currentMonth}`
                  : `/dashboard?month=${currentMonth}&category=${cat.id}`
              }
              className={`group flex items-center gap-1.5 px-3 py-2 rounded-xl text-xs font-medium transition-all duration-150 ${
                isActive
                  ? "text-white shadow-md scale-105"
                  : "bg-white text-gray-700 border border-gray-100 shadow-sm hover:shadow-md hover:-translate-y-0.5"
              }`}
              style={isActive ? { backgroundColor: cat.color, borderColor: cat.color } : {}}
            >
              <span className="text-sm leading-none">{cat.icon}</span>
              <span>{cat.name}</span>
              <span
                className={`font-bold ${isActive ? "text-white/80" : ""}`}
                style={!isActive ? { color: cat.color } : {}}
              >
                {formatAmountShort(total)}
              </span>
            </Link>
          )
        })}
      </div>
    </div>
  )
}
