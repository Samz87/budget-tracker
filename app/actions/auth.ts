"use server"

import { db } from "@/lib/db"
import bcrypt from "bcryptjs"
import { signIn, signOut } from "@/auth"
import { AuthError } from "next-auth"
import { redirect } from "next/navigation"

export async function login(prevState: { error?: string } | undefined, formData: FormData) {
  try {
    await signIn("credentials", {
      email: formData.get("email"),
      password: formData.get("password"),
      redirectTo: "/",
    })
  } catch (error) {
    if (error instanceof AuthError) {
      return { error: "Email ou mot de passe incorrect" }
    }
    throw error
  }
}

export async function register(prevState: { error?: string } | undefined, formData: FormData) {
  const name = formData.get("name") as string
  const email = formData.get("email") as string
  const password = formData.get("password") as string

  if (!email || !password) {
    return { error: "Email et mot de passe requis" }
  }

  if (password.length < 6) {
    return { error: "Le mot de passe doit contenir au moins 6 caractères" }
  }

  const existing = await db.user.findUnique({ where: { email } })
  if (existing) {
    return { error: "Un compte existe déjà avec cet email" }
  }

  const hashed = await bcrypt.hash(password, 12)

  const user = await db.user.create({
    data: { name: name || undefined, email, password: hashed },
  })

  await createDefaultCategories(user.id)

  try {
    await signIn("credentials", {
      email,
      password,
      redirectTo: "/",
    })
  } catch (error) {
    throw error
  }
}

export async function logout() {
  await signOut({ redirectTo: "/login" })
}

export const DEFAULT_CATEGORIES = [
  { name: "Salaire", type: "income" as const, color: "#10b981", icon: "💼" },
  { name: "Freelance", type: "income" as const, color: "#3b82f6", icon: "💻" },
  { name: "Investissements", type: "income" as const, color: "#8b5cf6", icon: "📈" },
  { name: "Autres revenus", type: "income" as const, color: "#f59e0b", icon: "💰" },
  { name: "Dons", type: "income" as const, color: "#f472b6", icon: "🎁" },
  { name: "Paris", type: "income" as const, color: "#22c55e", icon: "🎰" },
  { name: "Loyer", type: "expense" as const, color: "#ef4444", icon: "🏠" },
  { name: "Courses", type: "expense" as const, color: "#f97316", icon: "🛒" },
  { name: "Transport", type: "expense" as const, color: "#eab308", icon: "🚗" },
  { name: "Restauration", type: "expense" as const, color: "#ec4899", icon: "🍽️" },
  { name: "Santé", type: "expense" as const, color: "#14b8a6", icon: "🏥" },
  { name: "Loisirs", type: "expense" as const, color: "#6366f1", icon: "🎮" },
  { name: "Abonnements", type: "expense" as const, color: "#a855f7", icon: "📱" },
  { name: "Autres dépenses", type: "expense" as const, color: "#6b7280", icon: "💸" },
]

async function createDefaultCategories(userId: string) {
  await db.category.createMany({
    data: DEFAULT_CATEGORIES.map((c) => ({ ...c, userId })),
    skipDuplicates: true,
  })
}

export async function seedMissingCategories() {
  "use server"
  const session = await (await import("@/auth")).auth()
  if (!session?.user?.id) return
  await createDefaultCategories(session.user.id)
}
