"use client"

import { Star } from "lucide-react"

export function PokemonHeader({ favoritesCount, showingFavorites, onToggleFavorites, onHomeClick }) {
  return (
    <header className="bg-gray-900 border-b border-gray-700 sticky top-0 z-40">
      <div className="w-full py-4 px-4">
        <div className="flex items-center justify-between gap-4">
          <div className="flex-1">
            <h1 className="text-3xl sm:text-4xl font-bold text-white cursor-pointer hover:text-blue-400 transition-colors" onClick={onHomeClick}>Pokedex Lite</h1>
            <p className="text-sm text-gray-400 mt-1">Explore and collect your favorite Pokémon</p>
          </div>
          <button
            onClick={onToggleFavorites}
            className={`px-4 py-2 rounded-lg font-medium transition-all flex items-center gap-2 ${
              showingFavorites ? "bg-blue-600 text-white" : "bg-gray-700 text-white hover:bg-gray-600"
            }`}
          >
            <Star size={20} className={showingFavorites ? "fill-current" : ""} />
            <span className="inline">Favorites</span>
            <span className="text-xs font-semibold ml-1">{favoritesCount}</span>
          </button>
        </div>
      </div>
    </header>
  )
}
