"use server"

import { auth } from "@/auth"
import { db } from "@/lib/db"
import { revalidatePath } from "next/cache"

async function getUserId() {
  const session = await auth()
  if (!session?.user?.id) throw new Error("Non autorisé")
  return session.user.id
}

export async function createCategory(
  prevState: { error?: string } | undefined,
  formData: FormData
) {
  const userId = await getUserId()

  const name = (formData.get("name") as string)?.trim()
  if (!name) return { error: "Le nom est requis" }

  try {
    await db.category.create({
      data: {
        name,
        type: formData.get("type") as "income" | "expense",
        color: (formData.get("color") as string) || "#6366f1",
        icon: (formData.get("icon") as string) || "💰",
        userId,
      },
    })
  } catch {
    return { error: "Une catégorie avec ce nom existe déjà" }
  }

  revalidatePath("/")
}

export async function deleteCategory(id: string) {
  const userId = await getUserId()
  await db.category.deleteMany({ where: { id, userId } })
  revalidatePath("/")
}
