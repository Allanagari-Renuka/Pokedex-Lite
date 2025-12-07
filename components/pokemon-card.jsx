"use client"

import { useState, useEffect } from "react"
import { Heart } from "lucide-react"
import { pokemonService } from "../services/pokemonService"

export function PokemonCard({ pokemon, onDetailClick, isFavorite, onFavoriteToggle }) {
  const [isLoading, setIsLoading] = useState(false)
  const [details, setDetails] = useState(null)

  // Fetch Pokémon details when pokemon changes
  useEffect(() => {
    const fetchDetails = async () => {
      if (!pokemon || details) return

      setIsLoading(true)
      try {
        const detail = await pokemonService.getPokemonDetail(pokemon.id)
        setDetails({
          image: detail.sprites?.other?.["official-artwork"]?.front_default || detail.sprites?.front_default,
          types: detail.types?.map((t) => t.type.name) || [],
        })
      } catch (error) {
        console.error(`Failed to fetch details for ${pokemon.name}:`, error)
        setDetails({
          image: null,
          types: [],
        })
      } finally {
        setIsLoading(false)
      }
    }

    fetchDetails()
  }, [pokemon, details])

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

  return (
    <div
      className="group cursor-pointer relative bg-gray-800 border border-gray-600 rounded-lg overflow-hidden hover:shadow-2xl hover:shadow-blue-500/50 transition-all duration-300 hover:scale-105 hover:rotate-1 active:animate-pulse"
      onClick={() => onDetailClick(pokemon)}
    >
      {/* Card image container */}
      <div className="bg-gradient-to-b from-gray-700 to-gray-800 p-4 relative h-40 flex items-center justify-center">
        <img
          src={details?.image || `/placeholder.svg?height=160&width=160&query=pokemon`}
          alt={pokemon.name}
          className="h-32 w-32 object-contain group-hover:scale-110 transition-transform duration-300"
          onError={(e) => {
            e.target.src = `/placeholder.svg?height=160&width=160&query=pokemon`
          }}
        />
      </div>

      {/* Card content */}
      <div className="p-4">
        <div className="flex items-start justify-between gap-2 mb-2">
          <div className="flex-1">
            <h3 className="font-semibold text-sm capitalize text-white line-clamp-1">{pokemon.name}</h3>
            <p className="text-xs text-gray-400">#{pokemon.id.toString().padStart(3, "0")}</p>
          </div>
          <button
            onClick={(e) => {
              e.stopPropagation()
              onFavoriteToggle(pokemon.id)
            }}
            className="flex-shrink-0 p-1.5 rounded-lg hover:bg-gray-700 transition-colors"
          >
            <Heart size={18} className={isFavorite ? "fill-red-500 text-red-500" : "text-gray-400"} />
          </button>
        </div>

        {/* Type badges */}
        {pokemon.types && pokemon.types.length > 0 && (
          <div className="flex gap-1 flex-wrap">
            {pokemon.types.map((type) => (
              <span key={type} className={`text-xs font-medium text-white px-2 py-1 rounded ${getTypeColor(type)}`}>
                {type}
              </span>
            ))}
          </div>
        )}
      </div>
    </div>
  )
}
