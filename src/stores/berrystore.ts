// src/stores/berryStore.ts
import { defineStore } from 'pinia'
import { ref, computed } from 'vue'
import apiService, { BerryListItem, Berry, Product } from '@/services/api'

export const useBerryStore = defineStore('berry', () => {
  // State
  const berries = ref<BerryListItem[]>([])
  const totalCount = ref(0)
  const currentPage = ref(1)
  const itemsPerPage = ref(10)
  const searchQuery = ref('')
  const loading = ref(false)
  const selectedBerry = ref<Berry | null>(null)
  const filteredBerries = computed(() => {
    if (!searchQuery.value) return berries.value
    
    return berries.value.filter((berry: any) => 
      berry.name.toLowerCase().includes(searchQuery.value.toLowerCase())
    )
  })

  // Get the page count based on total items and items per page
  const pageCount = computed(() => Math.ceil(totalCount.value / itemsPerPage.value))

  // Initialize from localStorage
  const initFromStorage = () => {
    const storedPage = localStorage.getItem('currentPage')
    const storedItemsPerPage = localStorage.getItem('itemsPerPage')
    const storedSearchQuery = localStorage.getItem('searchQuery')
    
    if (storedPage) currentPage.value = parseInt(storedPage)
    if (storedItemsPerPage) itemsPerPage.value = parseInt(storedItemsPerPage)
    if (storedSearchQuery) searchQuery.value = storedSearchQuery
  }

  // Save to localStorage
  const saveToStorage = () => {
    localStorage.setItem('currentPage', currentPage.value.toString())
    localStorage.setItem('itemsPerPage', itemsPerPage.value.toString())
    localStorage.setItem('searchQuery', searchQuery.value)
  }

  // Fetch berries with pagination
  const fetchBerries = async () => {
    loading.value = true
    try {
      const offset = (currentPage.value - 1) * itemsPerPage.value
      const response = await apiService.getBerries(offset, itemsPerPage.value)
      berries.value = response.results
      totalCount.value = response.count
      
      // Sort berries by name in ascending order
      berries.value.sort((a: any, b: any) => a.name.localeCompare(b.name))
      
      saveToStorage()
    } catch (error) {
      console.error('Error fetching berries:', error)
    } finally {
      loading.value = false
    }
  }

  // Fetch berry details by ID
  const fetchBerryDetail = async (id: string | number) => {
    loading.value = true
    try {
      selectedBerry.value = await apiService.getBerryDetail(id)
    } catch (error) {
      console.error('Error fetching berry details:', error)
    } finally {
      loading.value = false
    }
  }

  // Fetch berry details by name
  const fetchBerryByName = async (name: string) => {
    loading.value = true
    try {
      selectedBerry.value = await apiService.getBerryByName(name)
    } catch (error) {
      console.error('Error fetching berry by name:', error)
    } finally {
      loading.value = false
    }
  }

  // Add a new product
  const addProduct = async (product: Product) => {
    loading.value = true
    try {
      const newProduct = await apiService.addProduct(product)
      return newProduct
    } catch (error) {
      console.error('Error adding product:', error)
      throw error
    } finally {
      loading.value = false
    }
  }

  // Update a product
  const updateProduct = async (id: number, product: Product) => {
    loading.value = true
    try {
      const updatedProduct = await apiService.updateProduct(id, product)
      return updatedProduct
    } catch (error) {
      console.error('Error updating product:', error)
      throw error
    } finally {
      loading.value = false
    }
  }

  // Get product by ID (for editing)
  const getProduct = async (id: number) => {
    loading.value = true
    try {
      return await apiService.getProduct(id)
    } catch (error) {
      console.error('Error getting product:', error)
      throw error
    } finally {
      loading.value = false
    }
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

  return {
    berries,
    filteredBerries,
    totalCount,
    currentPage,
    itemsPerPage,
    searchQuery,
    loading,
    selectedBerry,
    pageCount,
    fetchBerries,
    fetchBerryDetail,
    fetchBerryByName,
    addProduct,
    updateProduct,
    getProduct,
    setSearchQuery,
    setCurrentPage,
    setItemsPerPage,
    initFromStorage
  }
})