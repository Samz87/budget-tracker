"use client"

import { useActionState, useState } from "react"
import { createCategory } from "@/app/actions/categories"

const PRESET_COLORS = [
  "#ef4444", "#f97316", "#eab308", "#22c55e", "#10b981",
  "#14b8a6", "#3b82f6", "#6366f1", "#8b5cf6", "#a855f7",
  "#ec4899", "#6b7280",
]

const PRESET_ICONS = ["💼", "🏠", "🛒", "🚗", "🍽️", "🏥", "🎮", "📱", "💻", "📈", "💰", "🎁", "🎰", "✈️", "🎓", "💪", "🐾", "🎵", "📚", "🌱"]

export function CreateCategoryForm() {
  const [state, action, pending] = useActionState(createCategory, undefined)
  const [selectedColor, setSelectedColor] = useState("#6366f1")
  const [selectedIcon, setSelectedIcon] = useState("💰")
  const [type, setType] = useState<"income" | "expense">("expense")

  return (
    <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-5">
      <h3 className="text-sm font-semibold text-gray-800 mb-4">Nouvelle catégorie</h3>

      <form action={action} className="space-y-4">
        <input type="hidden" name="color" value={selectedColor} />
        <input type="hidden" name="icon" value={selectedIcon} />
        <input type="hidden" name="type" value={type} />

        {/* Type */}
        <div>
          <label className="block text-xs font-medium text-gray-500 mb-1.5">Type</label>
          <div className="grid grid-cols-2 gap-2">
            {(["income", "expense"] as const).map((t) => (
              <button
                key={t}
                type="button"
                onClick={() => setType(t)}
                className={`py-2 rounded-xl text-sm font-medium border-2 transition-all ${
                  type === t
                    ? t === "income"
                      ? "border-emerald-500 bg-emerald-50 text-emerald-700"
                      : "border-red-400 bg-red-50 text-red-600"
                    : "border-gray-200 text-gray-500 hover:border-gray-300"
                }`}
              >
                {t === "income" ? "💰 Revenu" : "💸 Dépense"}
              </button>
            ))}
          </div>
        </div>

        {/* Name */}
        <div>
          <label className="block text-xs font-medium text-gray-500 mb-1.5">Nom</label>
          <input
            type="text"
            name="name"
            required
            placeholder="Ex: Vacances"
            className="w-full px-4 py-2.5 rounded-xl border border-gray-200 focus:outline-none focus:ring-2 focus:ring-indigo-500 text-sm text-gray-900 bg-white placeholder:text-gray-400"
          />
        </div>

        {/* Icon picker */}
        <div>
          <label className="block text-xs font-medium text-gray-500 mb-1.5">Icône</label>
          <div className="flex flex-wrap gap-1.5">
            {PRESET_ICONS.map((icon) => (
              <button
                key={icon}
                type="button"
                onClick={() => setSelectedIcon(icon)}
                className={`w-9 h-9 rounded-xl text-lg flex items-center justify-center transition-all ${
                  selectedIcon === icon
                    ? "ring-2 ring-indigo-500 bg-indigo-50 scale-110"
                    : "bg-gray-50 hover:bg-gray-100"
                }`}
              >
                {icon}
              </button>
            ))}
          </div>
        </div>

        {/* Color picker */}
        <div>
          <label className="block text-xs font-medium text-gray-500 mb-1.5">Couleur</label>
          <div className="flex flex-wrap gap-2">
            {PRESET_COLORS.map((color) => (
              <button
                key={color}
                type="button"
                onClick={() => setSelectedColor(color)}
                className={`w-7 h-7 rounded-full transition-all ${
                  selectedColor === color ? "scale-125 ring-2 ring-offset-1 ring-gray-400" : "hover:scale-110"
                }`}
                style={{ backgroundColor: color }}
              />
            ))}
          </div>
        </div>

        {/* Preview */}
        <div className="flex items-center gap-3 p-3 bg-gray-50 rounded-xl">
          <div
            className="w-9 h-9 rounded-xl flex items-center justify-center text-lg"
            style={{ backgroundColor: selectedColor + "20" }}
          >
            {selectedIcon}
          </div>
          <div>
            <p className="text-sm font-semibold text-gray-800">Aperçu</p>
            <p className="text-xs font-medium" style={{ color: selectedColor }}>
              {type === "income" ? "Revenu" : "Dépense"}
            </p>
          </div>
        </div>

        {(state as { error?: string } | undefined)?.error && (
          <p className="text-sm text-red-500 bg-red-50 px-3 py-2 rounded-xl">
            {(state as { error?: string }).error}
          </p>
        )}

        <button
          type="submit"
          disabled={pending}
          className="w-full py-2.5 rounded-xl bg-indigo-600 text-white text-sm font-semibold hover:bg-indigo-700 transition-colors disabled:opacity-60"
        >
          {pending ? "Création..." : "Créer la catégorie"}
        </button>
      </form>
    </div>
  )
}
