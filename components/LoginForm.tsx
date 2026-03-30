"use client"

import { useActionState } from "react"
import { login } from "@/app/actions/auth"

export function LoginForm() {
  const [state, action, pending] = useActionState(login, undefined)

  return (
    <form action={action} className="space-y-4">
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-1.5">
          Email
        </label>
        <input
          type="email"
          name="email"
          required
          autoComplete="email"
          className="w-full px-4 py-2.5 rounded-xl border border-gray-200 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent text-sm"
          placeholder="votre@email.com"
        />
      </div>
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-1.5">
          Mot de passe
        </label>
        <input
          type="password"
          name="password"
          required
          autoComplete="current-password"
          className="w-full px-4 py-2.5 rounded-xl border border-gray-200 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent text-sm"
          placeholder="••••••••"
        />
      </div>
      {state?.error && (
        <div className="text-sm text-red-600 bg-red-50 px-4 py-3 rounded-xl">
          {state.error}
        </div>
      )}
      <button
        type="submit"
        disabled={pending}
        className="w-full bg-indigo-600 text-white py-2.5 rounded-xl font-medium hover:bg-indigo-700 transition-colors disabled:opacity-60 disabled:cursor-not-allowed text-sm"
      >
        {pending ? "Connexion..." : "Se connecter"}
      </button>
    </form>
  )
}
