import { auth } from "@/auth"
import { db } from "@/lib/db"
import { redirect } from "next/navigation"
import { SummaryCards } from "@/components/SummaryCards"
import { TransactionList } from "@/components/TransactionList"
import { MonthNav } from "@/components/MonthNav"
import { AddTransactionButton } from "@/components/AddTransactionButton"

export default async function DashboardPage(props: {
  searchParams: Promise<{ month?: string }>
}) {
  const session = await auth()
  if (!session?.user?.id) redirect("/login")

  const { month } = await props.searchParams
  const now = new Date()
  const currentMonth = month || `${now.getFullYear()}-${String(now.getMonth() + 1).padStart(2, "0")}`

  const [year, monthNum] = currentMonth.split("-").map(Number)
  const startDate = new Date(year, monthNum - 1, 1)
  const endDate = new Date(year, monthNum, 0, 23, 59, 59, 999)

  const [transactions, categories] = await Promise.all([
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

  const totalIncome = transactions
    .filter((t) => t.type === "income")
    .reduce((sum, t) => sum + t.amount, 0)

  const totalExpense = transactions
    .filter((t) => t.type === "expense")
    .reduce((sum, t) => sum + t.amount, 0)

  const balance = totalIncome - totalExpense

  return (
    <div className="space-y-6">
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

      <TransactionList
        transactions={transactions}
        categories={categories}
      />
    </div>
  )
}
