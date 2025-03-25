import { defineStore } from 'pinia'
import { ref, computed } from 'vue'
import axios from 'axios'

// Product types
export interface Product {
  id?: number
  title: string
  price: number
  description: string
  category: string
  image: string
  rating?: {
    rate: number
    count: number
  }
}

// API service
const API_URL = 'https://fakestoreapi.com'

const apiService = {
  // Get all products
  async getProducts(): Promise<Product[]> {
    const response = await axios.get(`${API_URL}/products?limit=50`)
    return response.data
  },

  // Get a specific product
  async getProductDetail(id: string | number): Promise<Product> {
    const response = await axios.get(`${API_URL}/products/${id}`)
    return response.data
  },

  // Add a new product
  async addProduct(product: Product): Promise<Product> {
    const response = await axios.post(`${API_URL}/products`, product)
    return response.data
  },

  // Update a product
  async updateProduct(id: number, product: Product): Promise<Product> {
    const response = await axios.put(`${API_URL}/products/${id}`, product)
    return response.data
  },

  // Delete a product
  async deleteProduct(id: number): Promise<any> {
    const response = await axios.delete(`${API_URL}/products/${id}`)
    return response.data
  }
}

export const useProductStore = defineStore('product', 
  () => {
    // State
    const products = ref<Product[]>([])
    const hasInitiallyFetched = ref(false)
    const totalCount = ref(0)
    const currentPage = ref(1)
    const itemsPerPage = ref(10)
    const searchQuery = ref('')
    const sortField = ref('title')
    const sortOrder = ref<'asc' | 'desc'>('asc')
    const loading = ref(false)
    const selectedProduct = ref<Product | null>(null)
  
  const filteredProducts = computed(() => {
    // First filter by search query
    let result = products.value
    
    if (searchQuery.value) {
      result = result.filter((product: any) => 
        product.title.toLowerCase().includes(searchQuery.value.toLowerCase())
      )
    }
    
    // Then sort based on current sort settings
    if (sortField.value) {
      result = [...result].sort((a: any, b: any) => {
        let valueA = a[sortField.value]
        let valueB = b[sortField.value]
        
        // Handle string comparisons (case-insensitive)
        if (typeof valueA === 'string') {
          valueA = valueA.toLowerCase()
          valueB = valueB.toLowerCase()
        }
        
        if (valueA < valueB) return sortOrder.value === 'asc' ? -1 : 1
        if (valueA > valueB) return sortOrder.value === 'asc' ? 1 : -1
        return 0
      })
    }
    
    return result
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

  // Fetch products
  const fetchProducts = async () => {
    // Check if we already have products and have initially fetched
    if (products.value.length > 0 && hasInitiallyFetched.value) {
      return // Skip fetching if we already have data
    }
    
    loading.value = true
    try {
      const data = await apiService.getProducts()
      products.value = data
      totalCount.value = data.length
      hasInitiallyFetched.value = true
    } catch (error) {
      console.error('Error fetching products:', error)
    } finally {
      loading.value = false
    }
  }

  // Get paginated products
  const paginatedProducts = computed(() => {
    const startIndex = (currentPage.value - 1) * itemsPerPage.value
    const endIndex = startIndex + itemsPerPage.value
    return filteredProducts.value.slice(startIndex, endIndex)
  })

  // Fetch product details by ID
  const fetchProductDetail = async (id: string | number) => {
    loading.value = true
    try {
      selectedProduct.value = await apiService.getProductDetail(id)
    } catch (error) {
      console.error('Error fetching product details:', error)
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

  // Delete a product
  const deleteProduct = async (id: number) => {
    loading.value = true
    try {
      await apiService.deleteProduct(id)
      // Remove from local state after successful deletion
      products.value = products.value.filter(product => product.id !== id)
    } catch (error) {
      console.error('Error deleting product:', error)
      throw error
    } finally {
      loading.value = false
    }
  }

  // Set search query
  const setSearchQuery = (query: string) => {
    searchQuery.value = query
    currentPage.value = 1 // Reset to first page when searching
  }

  // Set current page
  const setCurrentPage = (page: number) => {
    currentPage.value = page
  }

  // Set items per page
  const setItemsPerPage = (items: number) => {
    itemsPerPage.value = items
    currentPage.value = 1 // Reset to first page when changing items per page
  }
  
  // Set sort field and order
  const setSorting = (field: string, order?: 'asc' | 'desc') => {
    // If clicking on the same field, toggle the sort order
    if (field === sortField.value && !order) {
      // Toggle order: asc -> desc -> none -> asc
      if (sortOrder.value === 'asc') {
        sortOrder.value = 'desc'
      } else if (sortOrder.value === 'desc') {
        sortField.value = '' // No sorting
      } else {
        sortField.value = field
        sortOrder.value = 'asc'
      }
    } else {
      // New field or explicit order
      sortField.value = field
      sortOrder.value = order || 'asc'
    }
    
    // Reset to first page when sorting
    currentPage.value = 1
  }

  return {
    products,
    paginatedProducts,
    filteredProducts,
    totalCount,
    currentPage,
    itemsPerPage,
    searchQuery,
    sortField,
    sortOrder,
    loading,
    selectedProduct,
    pageCount,
    hasInitiallyFetched,
    fetchProducts,
    fetchProductDetail,
    addProduct,
    updateProduct,
    deleteProduct,
    setSearchQuery,
    setCurrentPage,
    setItemsPerPage,
    setSorting,
    initFromStorage
  }
}, {
  persist: {
    paths: [
      'products', 
      'hasInitiallyFetched', 
      'totalCount', 
      'currentPage', 
      'itemsPerPage', 
      'searchQuery', 
      'sortField', 
      'sortOrder'
    ],
  },
})