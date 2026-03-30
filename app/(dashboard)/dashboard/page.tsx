import { auth } from "@/auth"
import { db } from "@/lib/db"
import { redirect } from "next/navigation"
import { SummaryCards } from "@/components/SummaryCards"
import { TransactionList } from "@/components/TransactionList"
import { MonthNav } from "@/components/MonthNav"
import { AddTransactionButton } from "@/components/AddTransactionButton"
import { CategoryFilter } from "@/components/CategoryFilter"
import { DEFAULT_CATEGORIES } from "@/app/actions/auth"

export default async function DashboardPage(props: {
  searchParams: Promise<{ month?: string; category?: string }>
}) {
  const session = await auth()
  if (!session?.user?.id) redirect("/login")

  const { month, category } = await props.searchParams

  const now = new Date()
  const currentMonth =
    month || `${now.getFullYear()}-${String(now.getMonth() + 1).padStart(2, "0")}`

  const [year, monthNum] = currentMonth.split("-").map(Number)
  const startDate = new Date(year, monthNum - 1, 1)
  const endDate = new Date(year, monthNum, 0, 23, 59, 59, 999)

  // Seed any missing default categories (idempotent, skipDuplicates)
  await db.category.createMany({
    data: DEFAULT_CATEGORIES.map((c) => ({ ...c, userId: session.user.id! })),
    skipDuplicates: true,
  })

  const [allMonthTransactions, categories] = await Promise.all([
    db.transaction.findMany({
      where: {
        userId: session.user.id,
        date: { gte: startDate, lte: endDate },
      },
      include: { category: true },
      orderBy: { date: "desc" },
    }),
    db.category.findMany({
      where: { userId: session.user.id },
      orderBy: [{ type: "asc" }, { name: "asc" }],
    }),
  ])

  // Apply category filter in memory (avoids second DB round-trip)
  const transactions = category
    ? allMonthTransactions.filter((t) => t.categoryId === category)
    : allMonthTransactions

  const totalIncome = transactions
    .filter((t) => t.type === "income")
    .reduce((sum, t) => sum + t.amount, 0)

  const totalExpense = transactions
    .filter((t) => t.type === "expense")
    .reduce((sum, t) => sum + t.amount, 0)

  const balance = totalIncome - totalExpense

  // Per-category totals for the filter pills (always from full month)
  const categoryTotals = allMonthTransactions.reduce<Record<string, number>>(
    (acc, t) => {
      acc[t.categoryId] = (acc[t.categoryId] || 0) + t.amount
      return acc
    },
    {}
  )

  const activeCategory = category
    ? categories.find((c) => c.id === category)
    : undefined

  return (
    <div className="space-y-5">
      <div className="flex items-center justify-between">
        <MonthNav currentMonth={currentMonth} />
        <AddTransactionButton categories={categories} />
      </div>

      <SummaryCards
        income={totalIncome}
        expense={totalExpense}
        balance={balance}
        count={transactions.length}
      />

      <CategoryFilter
        categories={categories}
        categoryTotals={categoryTotals}
        currentMonth={currentMonth}
        activeCategory={category}
      />

      <TransactionList
        transactions={transactions}
        categories={categories}
        activeCategory={activeCategory}
        currentMonth={currentMonth}
      />
    </div>
  )
}
