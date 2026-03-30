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

import { DEFAULT_CATEGORIES } from "@/lib/defaultCategories"

async function createDefaultCategories(userId: string) {
  await db.category.createMany({
    data: DEFAULT_CATEGORIES.map((c) => ({ ...c, userId })),
    skipDuplicates: true,
  })
}

