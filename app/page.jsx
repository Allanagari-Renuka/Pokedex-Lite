"use client"

import { useState, useEffect, useMemo } from "react"
import { ChevronLeft, ChevronRight } from "lucide-react"
import { pokemonService } from "@/services/pokemonService"
import { PokemonCard } from "@/components/pokemon-card"
import { SearchBar } from "@/components/search-bar"
import { TypeFilter } from "@/components/type-filter"
import { PokemonDetailModal } from "@/components/pokemon-detail-modal"
import { PokemonHeader } from "@/components/pokemon-header"

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
  const [isPaginating, setIsPaginating] = useState(false)

  // Computed values
  const maxPage = Math.ceil(totalItems / ITEMS_PER_PAGE)

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

        // Fetch types for all Pokémon (needed for filtering)
        const enriched = await Promise.all(
          pokemonList.map(async (p) => {
            try {
              const detail = await pokemonService.getPokemonDetail(p.id)
              return {
                ...p,
                types: detail.types?.map((t) => t.type.name) || [],
              }
            } catch (e) {
              return {
                ...p,
                types: [],
              }
            }
          }),
        )

        setAllPokemon(enriched)

        // Fetch types
        const typesData = await pokemonService.getAllTypes()
        setTypes(typesData.results)

        setError(null)
      } catch (err) {
        setError("Failed to load Pokémon data")
        console.error(err)
      } finally {
        setTypesLoading(false)
      }
    }

    loadInitialData()
  }, [])

  // Memoize filtered Pokémon
  const filtered = useMemo(() => {
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

    return filtered
  }, [allPokemon, searchQuery, selectedType, showingFavorites, favorites])

  // Update totalItems when filtered changes
  useEffect(() => {
    setTotalItems(filtered.length)
  }, [filtered])

  // Initialize displayedPokemon when allPokemon is loaded
  useEffect(() => {
    if (allPokemon.length > 0 && displayedPokemon.length === 0) {
      setDisplayedPokemon(filtered.slice(0, ITEMS_PER_PAGE))
    }
  }, [allPokemon, filtered])

  // Handle pagination
  const handleNextPage = () => {
    const nextPage = currentPage + 1

    if (nextPage <= maxPage && !isPaginating) {
      setIsPaginating(true)
      const start = (nextPage - 1) * ITEMS_PER_PAGE
      const end = start + ITEMS_PER_PAGE
      setDisplayedPokemon(filtered.slice(start, end))
      setCurrentPage(nextPage)
      setTimeout(() => setIsPaginating(false), 200) 
    }
  }

  const handlePrevPage = () => {
    if (currentPage > 1 && !isPaginating) {
      setIsPaginating(true)
      const prevPage = currentPage - 1
      const start = (prevPage - 1) * ITEMS_PER_PAGE
      const end = start + ITEMS_PER_PAGE
      setDisplayedPokemon(filtered.slice(start, end))
      setCurrentPage(prevPage)
      setTimeout(() => setIsPaginating(false), 200) 
    }
  }

  // Toggle favorite
  const toggleFavorite = (pokemonId) => {
    setFavorites((prev) => (prev.includes(pokemonId) ? prev.filter((id) => id !== pokemonId) : [...prev, pokemonId]))
  }
  return (
    <main className="min-h-screen bg-background">
      <PokemonHeader
        favoritesCount={favorites.length}
        showingFavorites={showingFavorites}
        onToggleFavorites={() => setShowingFavorites(!showingFavorites)}
      />

      {/* Main content */}
      <div className="max-w-7xl mx-auto px-4 py-8 sm:px-6 lg:px-8">
        {/* Filters */}
        <div className="space-y-4 mb-8">
          <SearchBar value={searchQuery} onChange={setSearchQuery} onClear={() => setSearchQuery("")} />
          <TypeFilter
            types={types}
            selectedType={selectedType}
            onTypeChange={setSelectedType}
            isLoading={typesLoading}
          />
        </div>

        {error ? (
          <div className="text-center py-12">
            <p className="text-destructive font-medium">{error}</p>
          </div>
        ) : displayedPokemon.length === 0 && !typesLoading ? (
          <div className="text-center py-12">
            <p className="text-muted-foreground">
              {searchQuery || selectedType || showingFavorites
                ? "No Pokémon found matching your filters."
                : "Loading Pokémon..."}
            </p>
          </div>
        ) : (
          <>
            {/* Pokémon Grid */}
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

            {/* Pagination Controls */}
            {totalItems > ITEMS_PER_PAGE && (
              <div className="flex items-center justify-between">
                <button
                  onClick={handlePrevPage}
                  disabled={currentPage === 1 || isPaginating}
                  className="flex items-center gap-2 px-4 py-2 bg-primary text-primary-foreground rounded-lg hover:bg-primary/90 disabled:opacity-50 disabled:cursor-not-allowed transition-all"
                >
                  <ChevronLeft size={20} />
                  Previous
                </button>

                <div className="text-center">
                  <p className="text-sm text-muted-foreground">
                    Page <span className="font-semibold text-foreground">{currentPage}</span> of{" "}
                    <span className="font-semibold text-foreground">{maxPage}</span>
                  </p>
                  <p className="text-xs text-muted-foreground mt-1">
                    {(currentPage - 1) * ITEMS_PER_PAGE + 1} - {Math.min(currentPage * ITEMS_PER_PAGE, totalItems)} of{" "}
                    {totalItems}
                  </p>
                </div>

                <button
                  onClick={() => {
                    console.log('Next button clicked')
                    handleNextPage()
                  }}
                  disabled={currentPage >= maxPage || isPaginating}
                  className="flex items-center gap-2 px-4 py-2 bg-primary text-primary-foreground rounded-lg hover:bg-primary/90 disabled:opacity-50 disabled:cursor-not-allowed transition-all"
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
