"use client"

import { ChevronDown } from "lucide-react"

export function TypeFilter({ types, selectedType, onTypeChange, loading }) {
  return (
    <div className="relative inline-block w-full sm:w-auto">
      <select
        value={selectedType}
        onChange={(e) => onTypeChange(e.target.value)}
        disabled={loading}
        className="w-full px-8 py-2 bg-gray-800 border border-gray-600 rounded-lg appearance-none cursor-pointer focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent disabled:opacity-50 text-white"
      >
        <option value="">All Types</option>
        {types.map((type) => (
          <option key={type} value={type}>
            {type.charAt(0).toUpperCase() + type.slice(1)}
          </option>
        ))}
      </select>
      <ChevronDown
        className="absolute right-3 top-1/2 transform -translate-y-1/2 pointer-events-none text-gray-400"
        size={20}
      />
    </div>
  )
}
