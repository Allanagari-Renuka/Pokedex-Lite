"use client"

import { useState, useEffect } from "react"
import { ChevronLeft, ChevronRight } from "lucide-react"
import { pokemonService } from "../services/pokemonService"
import { PokemonCard } from "../components/pokemon-card"
import { SearchBar } from "../components/search-bar"
import { TypeFilter } from "../components/type-filter"
import { PokemonDetailModal } from "../components/pokemon-detail-modal"
import { PokemonHeader } from "../components/pokemon-header"

const ITEMS_PER_PAGE = 20

export default function Home() {
  // State
  const [allPokemon, setAllPokemon] = useState([])
  const [displayedPokemon, setDisplayedPokemon] = useState([])
  const [types, setTypes] = useState([])
  const [favorites, setFavorites] = useState([])
  const [showingFavorites, setShowingFavorites] = useState(false)

  // Filters
  const [searchQuery, setSearchQuery] = useState("")
  const [selectedType, setSelectedType] = useState("")

  // Pagination
  const [currentPage, setCurrentPage] = useState(1)
  const [totalItems, setTotalItems] = useState(0)

  // UI states
  const [selectedPokemon, setSelectedPokemon] = useState(null)
  const [isLoadingMore, setIsLoadingMore] = useState(false)
  const [typesLoading, setTypesLoading] = useState(true)
  const [error, setError] = useState(null)

  // Load favorites from localStorage
  useEffect(() => {
    const saved = localStorage.getItem("pokemonFavorites")
    if (saved) {
      setFavorites(JSON.parse(saved))
    }
  }, [])

  // Save favorites to localStorage
  useEffect(() => {
    localStorage.setItem("pokemonFavorites", JSON.stringify(favorites))
  }, [favorites])

  // Load all Pokémon and types on mount
  useEffect(() => {
    const loadInitialData = async () => {
      try {
        setTypesLoading(true)

        // Fetch first batch of Pokémon
        const pokemonData = await pokemonService.getPokemonList(50, 0)
        const pokemonList = pokemonData.results.map((p, index) => ({
          id: index + 1,
          name: p.name,
          url: p.url,
        }))

        // Fetch full details for each Pokémon (images and types)
        const enriched = await Promise.all(
          pokemonList.map(async (p) => {
            try {
              const detail = await pokemonService.getPokemonDetail(p.id)
              return {
                ...p,
                image: detail.sprites?.other?.["official-artwork"]?.front_default || detail.sprites?.front_default,
                types: detail.types?.map((t) => t.type.name) || [],
              }
            } catch (error) {
              console.error(`Failed to fetch details for ${p.name}:`, error)
              return {
                ...p,
                image: `/placeholder.svg?height=160&width=160&query=pokemon`,
                types: [],
              }
            }
          })
        )

        setAllPokemon(enriched)
        setDisplayedPokemon(enriched.slice(0, ITEMS_PER_PAGE))
        setTotalItems(enriched.length)

        // Fetch types
        const typesData = await pokemonService.getAllTypes()
        setTypes(typesData.results.map((t) => t.name))
      } catch (error) {
        console.error("Failed to load initial data:", error)
        setError("Failed to load Pokémon data. Please try again.")
      } finally {
        setTypesLoading(false)
      }
    }

    loadInitialData()
  }, [])

  // Filter Pokémon
  useEffect(() => {
    let filtered = allPokemon

    // Apply search filter
    if (searchQuery) {
      filtered = filtered.filter((p) => p.name.toLowerCase().includes(searchQuery.toLowerCase()))
    }

    // Apply type filter
    if (selectedType) {
      filtered = filtered.filter((p) => p.types.includes(selectedType))
    }

    // Apply favorites filter
    if (showingFavorites) {
      filtered = filtered.filter((p) => favorites.includes(p.id))
    }

    setTotalItems(filtered.length)
    setCurrentPage(1) // Reset to first page when filters change
  }, [allPokemon, searchQuery, selectedType, showingFavorites, favorites])

  // Update displayed Pokemon when page changes
  useEffect(() => {
    const filtered = allPokemon.filter((p) => {
      if (searchQuery && !p.name.toLowerCase().includes(searchQuery.toLowerCase())) return false
      if (selectedType && !p.types.includes(selectedType)) return false
      if (showingFavorites && !favorites.includes(p.id)) return false
      return true
    })
    setDisplayedPokemon(filtered.slice((currentPage - 1) * ITEMS_PER_PAGE, currentPage * ITEMS_PER_PAGE))
  }, [allPokemon, searchQuery, selectedType, showingFavorites, favorites, currentPage])

  // Handlers
  const toggleFavorite = (pokemonId) => {
    setFavorites((prev) =>
      prev.includes(pokemonId) ? prev.filter((id) => id !== pokemonId) : [...prev, pokemonId]
    )
  }

  const handleHomeClick = () => {
    window.location.reload()
  }

  const handlePrevPage = () => {
    if (currentPage > 1) {
      setCurrentPage(currentPage - 1)
    }
  }

  const handleNextPage = () => {
    const maxPage = Math.ceil(totalItems / ITEMS_PER_PAGE)
    if (currentPage < maxPage) {
      setCurrentPage(currentPage + 1)
    }
  }

  const maxPage = Math.ceil(totalItems / ITEMS_PER_PAGE)

  return (
    <main className="min-h-screen bg-black text-white">
      <div className="container mx-auto px-4 py-8">
        {console.log('App component rendering:', { totalItems, ITEMS_PER_PAGE, displayedPokemonLength: displayedPokemon.length })}
        {/* Header */}
        <PokemonHeader
          favoritesCount={favorites.length}
          showingFavorites={showingFavorites}
          onToggleFavorites={() => setShowingFavorites(!showingFavorites)}
          onHomeClick={handleHomeClick}
        />

        {/* Filters */}
        <div className="flex flex-col sm:flex-row gap-4 mb-6 mt-6">
          <div className="flex-1">
            <SearchBar value={searchQuery} onChange={setSearchQuery} onClear={() => setSearchQuery("")} />
          </div>
          <TypeFilter
            types={types}
            selectedType={selectedType}
            onTypeChange={setSelectedType}
            loading={typesLoading}
          />
        </div>

        {/* Loading/Error States */}
        {typesLoading ? (
          <div className="text-center py-12">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-500 mx-auto mb-4"></div>
            <p className="text-gray-400">Loading Pokémon...</p>
          </div>
        ) : error ? (
          <div className="text-center py-12">
            <p className="text-red-400 mb-4">{error}</p>
            <button
              onClick={() => window.location.reload()}
              className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
            >
              Try Again
            </button>
          </div>
        ) : (
          <>
            {/* Pokémon Grid */}
            {displayedPokemon.length === 0 && !typesLoading ? (
              <div className="text-center py-12">
                <div className="text-6xl mb-4">🔍</div>
                <h3 className="text-xl font-semibold text-white mb-2">No Pokémon Found</h3>
                <p className="text-gray-400">
                  {searchQuery && selectedType
                    ? `No Pokémon found matching "${searchQuery}" with type "${selectedType}"`
                    : searchQuery
                    ? `No Pokémon found matching "${searchQuery}"`
                    : selectedType
                    ? `No Pokémon found with type "${selectedType}"`
                    : showingFavorites
                    ? "No favorite Pokémon yet"
                    : "No Pokémon available"}
                </p>
                {(searchQuery || selectedType || showingFavorites) && (
                  <button
                    onClick={() => {
                      setSearchQuery("")
                      setSelectedType("")
                      setShowingFavorites(false)
                      setCurrentPage(1)
                    }}
                    className="mt-4 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
                  >
                    Clear Filters
                  </button>
                )}
              </div>
            ) : (
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
                {displayedPokemon.map((pokemon) => (
                  <PokemonCard
                    key={pokemon.id}
                    pokemon={pokemon}
                    onDetailClick={setSelectedPokemon}
                    isFavorite={favorites.includes(pokemon.id)}
                    onFavoriteToggle={toggleFavorite}
                  />
                ))}
              </div>
            )}

            {/* Pagination Controls */}
            {(() => {
              console.log('Checking pagination condition in src/App.jsx:', { totalItems, ITEMS_PER_PAGE, condition: totalItems > ITEMS_PER_PAGE, maxPage })
              return totalItems > ITEMS_PER_PAGE
            })() && (
              <div className="flex items-center justify-between">
                <button
                  onClick={handlePrevPage}
                  disabled={currentPage === 1}
                  className="flex items-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed transition-all"
                >
                  <ChevronLeft size={20} />
                  Previous
                </button>

                <div className="text-center">
                  <p className="text-sm text-gray-400">
                    Page <span className="font-semibold text-white">{currentPage}</span> of{" "}
                    <span className="font-semibold text-white">{maxPage}</span>
                  </p>
                  <p className="text-xs text-gray-400 mt-1">
                    {(currentPage - 1) * ITEMS_PER_PAGE + 1} - {Math.min(currentPage * ITEMS_PER_PAGE, totalItems)} of{" "}
                    {totalItems}
                  </p>
                </div>

                <button
                  onClick={handleNextPage}
                  disabled={currentPage >= maxPage}
                  className="flex items-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed transition-all"
                >
                  Next
                  <ChevronRight size={20} />
                </button>
              </div>
            )}
          </>
        )}
      </div>

      {/* Detail Modal */}
      {selectedPokemon && (
        <PokemonDetailModal
          pokemon={selectedPokemon}
          onClose={() => setSelectedPokemon(null)}
          isFavorite={favorites.includes(selectedPokemon.id)}
          onFavoriteToggle={toggleFavorite}
        />
      )}
    </main>
  )
}
