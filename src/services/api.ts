import axios from 'axios'

// Types
export interface Berry {
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
  item: {
    name: string
    url: string
  }
  natural_gift_type: {
    name: string
    url: string
  }
}

export interface BerryListItem {
  name: string
  url: string
}

export interface BerryListResponse {
  count: number
  next: string | null
  previous: string | null
  results: BerryListItem[]
}

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

const apiService = {
  // Get berry list with pagination
  async getBerries(offset = 0, limit = 20): Promise<BerryListResponse> {
    const response = await axios.get(`https://pokeapi.co/api/v2/berry/?offset=${offset}&limit=${limit}`)
    return response.data
  },

  // Get detailed berry information
  async getBerryDetail(id: string | number): Promise<Berry> {
    const response = await axios.get(`https://pokeapi.co/api/v2/berry/${id}/`)
    return response.data
  },

  // Get berry by name
  async getBerryByName(name: string): Promise<Berry> {
    const response = await axios.get(`https://pokeapi.co/api/v2/berry/${name}/`)
    return response.data
  },

  // Add a new product (using FakeStore API)
  async addProduct(product: Product): Promise<Product> {
    const response = await axios.post('https://fakestoreapi.com/products', product)
    return response.data
  },

  // Update a product (using FakeStore API)
  async updateProduct(id: number, product: Product): Promise<Product> {
    const response = await axios.put(`https://fakestoreapi.com/products/${id}`, product)
    return response.data
  },

  // Get product by ID (for editing)
  async getProduct(id: number): Promise<Product> {
    const response = await axios.get(`https://fakestoreapi.com/products/${id}`)
    return response.data
  }
}

export default apiService