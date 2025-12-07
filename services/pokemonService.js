// PokéAPI service for fetching Pokémon data
const API_BASE = "https://pokeapi.co/api/v2"

export const pokemonService = {
  // Fetch paginated Pokémon list
  async getPokemonList(limit = 20, offset = 0) {
    const response = await fetch(`${API_BASE}/pokemon?limit=${limit}&offset=${offset}`)
    if (!response.ok) throw new Error("Failed to fetch Pokémon list")
    return response.json()
  },

  // Fetch all types
  async getAllTypes() {
    const response = await fetch(`${API_BASE}/type`)
    if (!response.ok) throw new Error("Failed to fetch types")
    return response.json()
  },

  // Fetch Pokémon by type
  async getPokemonByType(typeName) {
    const response = await fetch(`${API_BASE}/type/${typeName}`)
    if (!response.ok) throw new Error("Failed to fetch Pokémon by type")
    return response.json()
  },

  // Fetch detailed Pokémon info
  async getPokemonDetail(nameOrId) {
    const response = await fetch(`${API_BASE}/pokemon/${nameOrId}`)
    if (!response.ok) throw new Error("Failed to fetch Pokémon detail")
    return response.json()
  },

  // Search Pokémon by name (from list)
  async searchPokemon(query, allPokemon) {
    return allPokemon.filter((p) => p.name.toLowerCase().includes(query.toLowerCase()))
  },
}
