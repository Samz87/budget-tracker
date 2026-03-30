import { auth } from "@/auth"
import { db } from "@/lib/db"
import { redirect } from "next/navigation"
import { CategoryDeleteButton } from "@/components/CategoryDeleteButton"
import { CreateCategoryForm } from "@/components/CreateCategoryForm"

export default async function CategoriesPage() {
  const session = await auth()
  if (!session?.user?.id) redirect("/login")

  const categories = await db.category.findMany({
    where: { userId: session.user.id },
    include: {
      _count: { select: { transactions: true } },
    },
    orderBy: [{ type: "asc" }, { name: "asc" }],
  })

  const incomeCategories = categories.filter((c) => c.type === "income")
  const expenseCategories = categories.filter((c) => c.type === "expense")

  function CategoryGroup({
    title,
    items,
    accent,
  }: {
    title: string
    items: typeof categories
    accent: string
  }) {
    return (
      <div className="bg-white rounded-2xl border border-gray-100 shadow-sm overflow-hidden">
        <div className="px-5 py-3.5 border-b border-gray-50 flex items-center gap-2">
          <span className={`text-xs font-bold uppercase tracking-wider ${accent}`}>{title}</span>
          <span className="text-xs text-gray-400">({items.length})</span>
        </div>
        {items.length === 0 ? (
          <p className="px-5 py-4 text-sm text-gray-400">Aucune catégorie</p>
        ) : (
          <div className="divide-y divide-gray-50">
            {items.map((cat) => (
              <div key={cat.id} className="flex items-center gap-3 px-5 py-3.5">
                <div
                  className="w-9 h-9 rounded-xl flex items-center justify-center text-base flex-shrink-0"
                  style={{ backgroundColor: cat.color + "18" }}
                >
                  {cat.icon}
                </div>
                <div className="flex-1 min-w-0">
                  <p className="text-sm font-semibold text-gray-800">{cat.name}</p>
                  <p className="text-xs text-gray-400 mt-0.5">
                    {cat._count.transactions} transaction{cat._count.transactions !== 1 ? "s" : ""}
                  </p>
                </div>
                <div
                  className="w-2.5 h-2.5 rounded-full flex-shrink-0"
                  style={{ backgroundColor: cat.color }}
                />
                <CategoryDeleteButton id={cat.id} />
              </div>
            ))}
          </div>
        )}
      </div>
    )
  }

  return (
    <div className="space-y-5">
      <div>
        <h1 className="text-xl font-bold text-gray-900">Catégories</h1>
        <p className="text-sm text-gray-500 mt-1">
          Gérez vos catégories de revenus et dépenses.
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-5">
        {/* Left: category lists */}
        <div className="space-y-4">
          <CategoryGroup
            title="Revenus"
            items={incomeCategories}
            accent="text-emerald-600"
          />
          <CategoryGroup
            title="Dépenses"
            items={expenseCategories}
            accent="text-red-500"
          />
        </div>

        {/* Right: create form */}
        <div>
          <CreateCategoryForm />
        </div>
      </div>
    </div>
  )
}
