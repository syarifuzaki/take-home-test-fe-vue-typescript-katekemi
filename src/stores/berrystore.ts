import { defineStore } from 'pinia'
import { ref, computed } from 'vue'
import axios from 'axios'

export interface BerryItem {
  name: string
  url: string
}

export interface BerryListResponse {
  count: number
  next: string | null
  previous: string | null
  results: BerryItem[]
}

export interface BerryDetail {
  id: number
  name: string
  growth_time: number
  max_harvest: number
  natural_gift_power: number
  size: number
  smoothness: number
  soil_dryness: number
  firmness: {
    name: string
    url: string
  }
  flavors: Array<{
    potency: number
    flavor: {
      name: string
      url: string
    }
  }>
}

export const useBerryStore = defineStore('berry', () => {
  // State
  const berries = ref<BerryItem[]>([])
  const rawBerries = ref<BerryItem[]>([])
  const totalCount = ref(0)
  const currentPage = ref(1)
  const itemsPerPage = ref(10)
  const searchQuery = ref('')
  const loading = ref(false)
  const detailLoading = ref(false)
  const selectedBerry = ref<BerryDetail | null>(null)
  const modalOpen = ref(false)
  const sortOrder = ref('asc')
  const initialized = ref(false)

  // Process raw data - apply filtering and sorting
  const processData = () => {
    if (!rawBerries.value.length) return
    
    let result = [...rawBerries.value]
    
    // Filter by search query
    if (searchQuery.value) {
      result = result.filter(b => 
        b.name.toLowerCase().includes(searchQuery.value.toLowerCase())
      )
    }
    
    // Sort by name
    result = result.sort((a, b) => {
      return sortOrder.value === 'asc' 
        ? a.name.localeCompare(b.name) 
        : b.name.localeCompare(a.name)
    })
    
    berries.value = result
  }
  
  // Computed
  const filteredBerries = computed(() => {
    return berries.value
  })

  // Get the page count based on total items and items per page
  const pageCount = computed(() => Math.ceil(totalCount.value / itemsPerPage.value))

  // Initialize from localStorage
  const initFromStorage = () => {
    const storedPage = localStorage.getItem('berryCurrentPage')
    const storedItemsPerPage = localStorage.getItem('berryItemsPerPage')
    const storedSearchQuery = localStorage.getItem('berrySearchQuery')
    const storedSortOrder = localStorage.getItem('berrySortOrder')
    
    if (storedPage) currentPage.value = parseInt(storedPage)
    if (storedItemsPerPage) itemsPerPage.value = parseInt(storedItemsPerPage)
    if (storedSearchQuery) searchQuery.value = storedSearchQuery
    if (storedSortOrder) sortOrder.value = storedSortOrder
    
    initialized.value = true
  }

  // Save to localStorage
  const saveToStorage = () => {
    localStorage.setItem('berryCurrentPage', currentPage.value.toString())
    localStorage.setItem('berryItemsPerPage', itemsPerPage.value.toString())
    localStorage.setItem('berrySearchQuery', searchQuery.value)
    localStorage.setItem('berrySortOrder', sortOrder.value)
  }

  // Fetch berries with pagination
  const fetchBerries = async () => {
    loading.value = true
    try {
      // Make sure we've initialized from localStorage before fetching
      if (!initialized.value) {
        initFromStorage()
      }
      
      const offset = (currentPage.value - 1) * itemsPerPage.value
      const response = await axios.get<BerryListResponse>(
        `https://pokeapi.co/api/v2/berry?offset=${offset}&limit=${itemsPerPage.value}`
      )
      
      rawBerries.value = response.data.results
      totalCount.value = response.data.count
      
      // Process the data
      processData()
      saveToStorage()
    } catch (error) {
      console.error('Error fetching berries:', error)
    } finally {
      loading.value = false
    }
  }

  // Fetch berry details by URL or ID
  const fetchBerryDetail = async (urlOrId: string) => {
    detailLoading.value = true
    
    try {
      let url = urlOrId
      
      // If it's not a full URL, construct it
      if (!url.startsWith('http')) {
        url = `https://pokeapi.co/api/v2/berry/${urlOrId}/`
      }
      
      const response = await axios.get<BerryDetail>(url)
      selectedBerry.value = response.data
    } catch (error) {
      console.error('Error fetching berry details:', error)
    } finally {
      detailLoading.value = false
    }
  }

  // Show Berry detail modal
  const showBerryDetail = (urlOrId: string) => {
    modalOpen.value = true
    fetchBerryDetail(urlOrId)
  }
  
  // Set search query
  const setSearchQuery = (query: string) => {
    searchQuery.value = query
    processData()
    saveToStorage()
  }

  // Set current page
  const setCurrentPage = (page: number) => {
    currentPage.value = page
    saveToStorage()
    fetchBerries()
  }

  // Set items per page
  const setItemsPerPage = (items: number) => {
    itemsPerPage.value = items
    currentPage.value = 1 // Reset to first page when changing items per page
    saveToStorage()
    fetchBerries()
  }
  
  // Set sort order
  const setSortOrder = (order: 'asc' | 'desc') => {
    sortOrder.value = order
    processData()
    saveToStorage()
  }

  // Close modal
  const closeModal = () => {
    modalOpen.value = false
  }

  return {
    berries,
    filteredBerries,
    totalCount,
    currentPage,
    itemsPerPage,
    searchQuery,
    loading,
    detailLoading,
    selectedBerry,
    modalOpen,
    sortOrder,
    pageCount,
    fetchBerries,
    fetchBerryDetail,
    showBerryDetail,
    setSearchQuery,
    setCurrentPage,
    setItemsPerPage,
    closeModal,
    initFromStorage,
    setSortOrder,
    processData
  }
})