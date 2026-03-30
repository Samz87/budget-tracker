import { RegisterForm } from "@/components/RegisterForm"
import Link from "next/link"

export default function RegisterPage() {
  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50 px-4">
      <div className="w-full max-w-md">
        <div className="text-center mb-8">
          <div className="inline-flex items-center justify-center w-14 h-14 rounded-2xl bg-indigo-600 mb-4">
            <span className="text-2xl">💳</span>
          </div>
          <h1 className="text-2xl font-bold text-gray-900">Budget Tracker</h1>
          <p className="text-gray-500 mt-1">Créez votre compte gratuitement</p>
        </div>
        <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-8">
          <RegisterForm />
          <p className="text-center text-sm text-gray-500 mt-6">
            Déjà un compte ?{" "}
            <Link href="/login" className="text-indigo-600 font-medium hover:underline">
              Se connecter
            </Link>
          </p>
        </div>
      </div>
    </div>
  )
}
