"use server"

import { auth } from "@/auth"
import { db } from "@/lib/db"
import { revalidatePath } from "next/cache"

async function getUserId() {
  const session = await auth()
  if (!session?.user?.id) throw new Error("Non autorisé")
  return session.user.id
}

export async function createTransaction(formData: FormData) {
  const userId = await getUserId()

  const amount = parseFloat(formData.get("amount") as string)
  const type = formData.get("type") as "income" | "expense"
  const description = (formData.get("description") as string) || undefined
  const date = new Date(formData.get("date") as string)
  const categoryId = formData.get("categoryId") as string
  const isRecurring = formData.get("isRecurring") === "true"
  const recurringInterval = (formData.get("recurringInterval") as string) || null

  if (!amount || !type || !date || !categoryId) {
    throw new Error("Champs manquants")
  }

  await db.transaction.create({
    data: {
      amount,
      type,
      description,
      date,
      categoryId,
      userId,
      isRecurring,
      recurringInterval: isRecurring ? recurringInterval : null,
    },
  })

  revalidatePath("/")
}

export async function updateTransaction(id: string, formData: FormData) {
  const userId = await getUserId()

  const existing = await db.transaction.findFirst({ where: { id, userId } })
  if (!existing) throw new Error("Transaction introuvable")

  const amount = parseFloat(formData.get("amount") as string)
  const type = formData.get("type") as "income" | "expense"
  const description = (formData.get("description") as string) || undefined
  const date = new Date(formData.get("date") as string)
  const categoryId = formData.get("categoryId") as string
  const isRecurring = formData.get("isRecurring") === "true"
  const recurringInterval = (formData.get("recurringInterval") as string) || null

  await db.transaction.update({
    where: { id },
    data: {
      amount,
      type,
      description,
      date,
      categoryId,
      isRecurring,
      recurringInterval: isRecurring ? recurringInterval : null,
    },
  })

  revalidatePath("/")
}

export async function deleteTransaction(id: string) {
  const userId = await getUserId()
  await db.transaction.deleteMany({ where: { id, userId } })
  revalidatePath("/")
}

export async function duplicateTransaction(id: string) {
  const userId = await getUserId()

  const original = await db.transaction.findFirst({ where: { id, userId } })
  if (!original) throw new Error("Transaction introuvable")

  await db.transaction.create({
    data: {
      amount: original.amount,
      type: original.type,
      description: original.description
        ? `${original.description} (copie)`
        : "Copie",
      date: new Date(),
      categoryId: original.categoryId,
      userId,
      isRecurring: original.isRecurring,
      recurringInterval: original.recurringInterval,
    },
  })

  revalidatePath("/")
}
