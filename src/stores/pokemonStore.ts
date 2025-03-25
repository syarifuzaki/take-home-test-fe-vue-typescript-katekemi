// src/stores/pokemonStore.ts
import { defineStore } from 'pinia'
import { ref, computed } from 'vue'
import axios from 'axios'

export interface PokemonItem {
  name: string
  url: string
}

export interface PokemonListResponse {
  count: number
  next: string | null
  previous: string | null
  results: PokemonItem[]
}

export interface PokemonDetail {
  id: number
  name: string
  height: number
  weight: number
  sprites: {
    front_default: string
    back_default: string
    front_shiny: string
    back_shiny: string
    other: {
      'official-artwork': {
        front_default: string
      }
      home: {
        front_default: string
      }
    }
  }
  types: Array<{
    slot: number
    type: {
      name: string
      url: string
    }
  }>
  abilities: Array<{
    ability: {
      name: string
      url: string
    }
    is_hidden: boolean
  }>
  stats: Array<{
    base_stat: number
    effort: number
    stat: {
      name: string
      url: string
    }
  }>
  moves: Array<{
    move: {
      name: string
      url: string
    }
  }>
  species: {
    name: string
    url: string
  }
}

export interface PokemonSpecies {
  flavor_text_entries: Array<{
    flavor_text: string
    language: {
      name: string
    }
    version: {
      name: string
    }
  }>
  genera: Array<{
    genus: string
    language: {
      name: string
    }
  }>
  evolution_chain: {
    url: string
  }
}

export interface EvolutionChain {
  chain: {
    species: {
      name: string
      url: string
    }
    evolves_to: Array<{
      species: {
        name: string
        url: string
      }
      evolution_details: Array<{
        min_level: number
        item: {
          name: string
        } | null
      }>
      evolves_to: Array<{
        species: {
          name: string
          url: string
        }
        evolution_details: Array<{
          min_level: number
          item: {
            name: string
          } | null
        }>
      }>
    }>
  }
}

export interface Pokemon {
  id: number
  name: string
  image: string
  types: string[]
  favorite: boolean
}

export const usePokemonStore = defineStore('pokemon', () => {
  // State
  const pokemon = ref<PokemonItem[]>([])
  const totalCount = ref(0)
  const currentPage = ref(1)
  const itemsPerPage = ref(10)
  const searchQuery = ref('')
  const loading = ref(false)
  const detailLoading = ref(false)
  const selectedPokemon = ref<PokemonDetail | null>(null)
  const selectedSpecies = ref<PokemonSpecies | null>(null)
  const evolutionChain = ref<EvolutionChain | null>(null)
  const modalOpen = ref(false)
  const activeTab = ref('about')
  const favorites = ref<{[key: string]: boolean}>({})
  const filterType = ref('')
  const sortOrder = ref('asc')
  
  // Load favorites from localStorage
  const loadFavorites = () => {
    const storedFavorites = localStorage.getItem('pokemonFavorites')
    if (storedFavorites) {
      favorites.value = JSON.parse(storedFavorites)
    }
  }
  
  // Save favorites to localStorage
  const saveFavorites = () => {
    localStorage.setItem('pokemonFavorites', JSON.stringify(favorites.value))
  }
  
  // Toggle favorite status
  const toggleFavorite = (name: string) => {
    favorites.value[name] = !favorites.value[name]
    saveFavorites()
  }
  
  // Computed
  const filteredPokemon = computed(() => {
    let result = pokemon.value
    
    // Filter by search query
    if (searchQuery.value) {
      result = result.filter(p => 
        p.name.toLowerCase().includes(searchQuery.value.toLowerCase())
      )
    }
    
    // Sort by name
    result = [...result].sort((a, b) => {
      return sortOrder.value === 'asc' 
        ? a.name.localeCompare(b.name) 
        : b.name.localeCompare(a.name)
    })
    
    return result
  })

  // Get the page count based on total items and items per page
  const pageCount = computed(() => Math.ceil(totalCount.value / itemsPerPage.value))

  // Get English flavor text from species data
  const englishFlavorText = computed(() => {
    if (!selectedSpecies.value) return ''
    
    const entry = selectedSpecies.value.flavor_text_entries.find(
      entry => entry.language.name === 'en'
    )
    
    return entry ? entry.flavor_text.replace(/\f/g, ' ') : ''
  })
  
  // Get Pokemon genus (category)
  const pokemonGenus = computed(() => {
    if (!selectedSpecies.value) return ''
    
    const entry = selectedSpecies.value.genera.find(
      entry => entry.language.name === 'en'
    )
    
    return entry ? entry.genus : ''
  })

  // Initialize from localStorage
  const initFromStorage = () => {
    const storedPage = localStorage.getItem('pokemonCurrentPage')
    const storedItemsPerPage = localStorage.getItem('pokemonItemsPerPage')
    const storedSearchQuery = localStorage.getItem('pokemonSearchQuery')
    const storedSortOrder = localStorage.getItem('pokemonSortOrder')
    const storedFilterType = localStorage.getItem('pokemonFilterType')
    
    if (storedPage) currentPage.value = parseInt(storedPage)
    if (storedItemsPerPage) itemsPerPage.value = parseInt(storedItemsPerPage)
    if (storedSearchQuery) searchQuery.value = storedSearchQuery
    if (storedSortOrder) sortOrder.value = storedSortOrder
    if (storedFilterType) filterType.value = storedFilterType
    
    loadFavorites()
  }

  // Save to localStorage
  const saveToStorage = () => {
    localStorage.setItem('pokemonCurrentPage', currentPage.value.toString())
    localStorage.setItem('pokemonItemsPerPage', itemsPerPage.value.toString())
    localStorage.setItem('pokemonSearchQuery', searchQuery.value)
    localStorage.setItem('pokemonSortOrder', sortOrder.value)
    localStorage.setItem('pokemonFilterType', filterType.value)
  }

  // Fetch pokemon with pagination
  const fetchPokemon = async () => {
    loading.value = true
    try {
      const offset = (currentPage.value - 1) * itemsPerPage.value
      const response = await axios.get<PokemonListResponse>(
        `https://pokeapi.co/api/v2/pokemon?offset=${offset}&limit=${itemsPerPage.value}`
      )
      pokemon.value = response.data.results
      totalCount.value = response.data.count
      
      saveToStorage()
    } catch (error) {
      console.error('Error fetching pokemon:', error)
    } finally {
      loading.value = false
    }
  }

  // Fetch pokemon details by URL or ID
  const fetchPokemonDetail = async (urlOrId: string) => {
    detailLoading.value = true
    activeTab.value = 'about'
    modalOpen.value = true
    
    try {
      let url = urlOrId
      
      // If it's not a full URL, construct it
      if (!url.startsWith('http')) {
        url = `https://pokeapi.co/api/v2/pokemon/${urlOrId}/`
      }
      
      const response = await axios.get<PokemonDetail>(url)
      selectedPokemon.value = response.data
      
      // Fetch species data to get flavor text and evolution chain
      await fetchSpeciesData(response.data.species.url)
    } catch (error) {
      console.error('Error fetching pokemon details:', error)
    } finally {
      detailLoading.value = false
    }
  }
  
  // Fetch species data
  const fetchSpeciesData = async (url: string) => {
    try {
      const response = await axios.get<PokemonSpecies>(url)
      selectedSpecies.value = response.data
      
      // Fetch evolution chain
      if (response.data.evolution_chain) {
        await fetchEvolutionChain(response.data.evolution_chain.url)
      }
    } catch (error) {
      console.error('Error fetching species data:', error)
    }
  }
  
  // Fetch evolution chain
  const fetchEvolutionChain = async (url: string) => {
    try {
      const response = await axios.get<EvolutionChain>(url)
      evolutionChain.value = response.data
    } catch (error) {
      console.error('Error fetching evolution chain:', error)
    }
  }
  
  // Get random Pokemon
  const getRandomPokemon = async () => {
    const randomId = Math.floor(Math.random() * 898) + 1 // Gen 1-8 Pokemon
    await fetchPokemonDetail(randomId.toString())
  }

  // Set search query
  const setSearchQuery = (query: string) => {
    searchQuery.value = query
    saveToStorage()
  }

  // Set current page
  const setCurrentPage = (page: number) => {
    currentPage.value = page
    saveToStorage()
  }

  // Set items per page
  const setItemsPerPage = (items: number) => {
    itemsPerPage.value = items
    currentPage.value = 1 // Reset to first page when changing items per page
    saveToStorage()
  }
  
  // Set filter type
  const setFilterType = (type: string) => {
    filterType.value = type
    saveToStorage()
  }
  
  // Set sort order
  const setSortOrder = (order: 'asc' | 'desc') => {
    sortOrder.value = order
    saveToStorage()
  }

  // Set active tab
  const setActiveTab = (tab: string) => {
    activeTab.value = tab
  }

  // Close modal
  const closeModal = () => {
    modalOpen.value = false
    selectedPokemon.value = null
    selectedSpecies.value = null
    evolutionChain.value = null
  }

  return {
    pokemon,
    filteredPokemon,
    totalCount,
    currentPage,
    itemsPerPage,
    searchQuery,
    loading,
    detailLoading,
    selectedPokemon,
    selectedSpecies,
    evolutionChain,
    modalOpen,
    activeTab,
    favorites,
    filterType,
    sortOrder,
    pageCount,
    englishFlavorText,
    pokemonGenus,
    fetchPokemon,
    fetchPokemonDetail,
    setSearchQuery,
    setCurrentPage,
    setItemsPerPage,
    closeModal,
    initFromStorage,
    toggleFavorite,
    getRandomPokemon,
    setFilterType,
    setSortOrder,
    setActiveTab
  }
})