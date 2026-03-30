import { auth } from "@/auth"
import { db } from "@/lib/db"
import { redirect } from "next/navigation"
import { PrelevementsSection } from "@/components/PrelevementsSection"

export default async function PrelevementsPage() {
  const session = await auth()
  if (!session?.user?.id) redirect("/login")

  const prelevements = await db.transaction.findMany({
    where: {
      userId: session.user.id,
      isRecurring: true,
      recurringInterval: "monthly",
      type: "expense",
    },
    include: { category: true },
    orderBy: { date: "asc" },
  })

  return (
    <div className="space-y-5">
      <div>
        <h1 className="text-xl font-bold text-gray-900">Prélèvements mensuels</h1>
        <p className="text-sm text-gray-500 mt-1">
          Suivez vos débits récurrents et anticipez les prochains prélèvements selon leur date initiale.
        </p>
      </div>

      <PrelevementsSection prelevements={prelevements} />
    </div>
  )
}
