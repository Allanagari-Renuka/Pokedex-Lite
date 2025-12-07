"use client"

import { X, Heart } from "lucide-react"
import { useEffect, useState } from "react"
import { pokemonService } from "../services/pokemonService"

export function PokemonDetailModal({ pokemon, onClose, isFavorite, onFavoriteToggle }) {
  const [detail, setDetail] = useState(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const fetchDetail = async () => {
      try {
        const data = await pokemonService.getPokemonDetail(pokemon.id)
        setDetail(data)
      } catch (error) {
        console.error("Failed to fetch detail:", error)
      } finally {
        setLoading(false)
      }
    }

    if (pokemon) {
      fetchDetail()
    }
  }, [pokemon])

  const getTypeColor = (type) => {
    const colors = {
      fire: "bg-red-500",
      water: "bg-blue-500",
      grass: "bg-green-500",
      electric: "bg-yellow-500",
      psychic: "bg-purple-500",
      ice: "bg-cyan-500",
      dragon: "bg-indigo-500",
      dark: "bg-gray-700",
      fairy: "bg-pink-500",
      fighting: "bg-orange-700",
      flying: "bg-sky-400",
      poison: "bg-violet-500",
      ground: "bg-yellow-600",
      rock: "bg-gray-600",
      bug: "bg-lime-600",
      ghost: "bg-purple-700",
      steel: "bg-slate-500",
      normal: "bg-gray-500",
    }
    return colors[type] || "bg-gray-500"
  }

  const handleBackdropClick = (e) => {
    if (e.target === e.currentTarget) {
      onClose()
    }
  }

  return (
    <div className="fixed inset-0 bg-black/70 z-50 flex items-center justify-center p-4 animate-in fade-in duration-200" onClick={handleBackdropClick}>
      <div className="bg-gray-800 border border-gray-600 rounded-lg max-w-md w-full max-h-96 overflow-y-auto animate-in slide-in-from-bottom-4 duration-300">
        {/* Header */}
        <div className="flex items-start justify-between gap-4 p-6 border-b border-gray-600 sticky top-0 bg-gray-800">
          <div>
            <h2 className="text-2xl font-bold capitalize text-white">{pokemon.name}</h2>
            <p className="text-sm text-gray-400">#{pokemon.id.toString().padStart(3, "0")}</p>
          </div>
          <button onClick={onClose} className="flex-shrink-0 p-2 hover:bg-gray-700 rounded-lg transition-colors text-white">
            <X size={24} />
          </button>
        </div>

        {loading ? (
          <div className="p-6 text-center text-muted-foreground">Loading details...</div>
        ) : detail ? (
          <div className="p-6 space-y-6">
            {/* Image */}
            <div className="flex justify-center bg-gradient-to-b from-muted to-muted/50 p-4 rounded-lg">
              <img
                src={detail.sprites?.other?.["official-artwork"]?.front_default || pokemon.image}
                alt={pokemon.name}
                className="h-40 w-40 object-contain"
              />
            </div>

            {/* Basic Info */}
            <div className="grid grid-cols-2 gap-4">
              <div className="bg-gray-700 p-3 rounded-lg">
                <p className="text-xs text-gray-400 mb-1">Height</p>
                <p className="font-semibold text-white">{detail.height / 10} m</p>
              </div>
              <div className="bg-gray-700 p-3 rounded-lg">
                <p className="text-xs text-gray-400 mb-1">Weight</p>
                <p className="font-semibold text-white">{detail.weight / 10} kg</p>
              </div>
            </div>

            {/* Types */}
            <div>
              <p className="text-xs font-semibold text-gray-400 mb-2">Types</p>
              <div className="flex gap-2 flex-wrap">
                {detail.types?.map((t) => (
                  <span
                    key={t.type.name}
                    className={`text-xs font-medium text-white px-3 py-1 rounded ${getTypeColor(t.type.name)}`}
                  >
                    {t.type.name}
                  </span>
                ))}
              </div>
            </div>

            {/* Stats */}
            {detail.stats && detail.stats.length > 0 && (
              <div>
                <p className="text-xs font-semibold text-gray-400 mb-3">Base Stats</p>
                <div className="space-y-2">
                  {detail.stats.map((stat) => (
                    <div key={stat.stat.name}>
                      <div className="flex justify-between items-center mb-1">
                        <span className="text-xs capitalize text-white">{stat.stat.name}</span>
                        <span className="text-xs font-semibold text-gray-400">{stat.base_stat}</span>
                      </div>
                      <div className="w-full bg-gray-700 rounded-full h-2">
                        <div
                          className="bg-blue-500 h-2 rounded-full transition-all"
                          style={{ width: `${Math.min((stat.base_stat / 150) * 100, 100)}%` }}
                        />
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* Abilities */}
            {detail.abilities && detail.abilities.length > 0 && (
              <div>
                <p className="text-xs font-semibold text-gray-400 mb-2">Abilities</p>
                <div className="space-y-1">
                  {detail.abilities.map((ability) => (
                    <p key={ability.ability.name} className="text-sm capitalize text-white">
                      {ability.ability.name.replace("-", " ")}
                      {ability.is_hidden && <span className="text-xs text-gray-400 ml-2">(Hidden)</span>}
                    </p>
                  ))}
                </div>
              </div>
            )}

            {/* Favorite button */}
            <button
              onClick={() => onFavoriteToggle(pokemon.id)}
              className="w-full py-2 px-4 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors flex items-center justify-center gap-2 font-medium"
            >
              <Heart size={20} className={isFavorite ? "fill-current" : ""} />
              {isFavorite ? "Remove from Favorites" : "Add to Favorites"}
            </button>
          </div>
        ) : (
          <div className="p-6 text-center text-destructive">Failed to load details</div>
        )}
      </div>
    </div>
  )
}
