<!-- src/views/BerryFormView.vue -->
<template>
  <div class="p-6">
    <div class="flex justify-between items-center mb-6">
      <h1 class="text-2xl font-bold">{{ isEditMode ? 'Edit' : 'Add' }} Product</h1>
      <router-link
        :to="{ name: 'berries' }"
        class="bg-gray-200 hover:bg-gray-300 text-gray-700 px-4 py-2 rounded-md flex items-center"
      >
        <BaseIcon name="mdi:arrow-left" size="20" class="mr-1" />
        Back to List
      </router-link>
    </div>

    <div class="bg-white rounded-md shadow p-6">
      <SkeletonLoader v-if="loading" type="form" :fields="7" />

      <form v-else @submit.prevent="handleSubmit" class="space-y-6">
        <!-- Title -->
        <div>
          <label for="title" class="block text-sm font-medium text-gray-700 mb-1"
            >Title</label
          >
          <input
            id="title"
            v-model="form.title"
            type="text"
            required
            class="w-full border rounded-md p-2 focus:outline-none focus:ring-2 focus:ring-primary-orange"
            placeholder="Product title"
          />
        </div>

        <!-- Price -->
        <div>
          <label for="price" class="block text-sm font-medium text-gray-700 mb-1"
            >Price</label
          >
          <input
            id="price"
            v-model.number="form.price"
            type="number"
            step="0.01"
            required
            class="w-full border rounded-md p-2 focus:outline-none focus:ring-2 focus:ring-primary-orange"
            placeholder="0.00"
          />
        </div>

        <!-- Description -->
        <div>
          <label for="description" class="block text-sm font-medium text-gray-700 mb-1"
            >Description</label
          >
          <textarea
            id="description"
            v-model="form.description"
            rows="4"
            required
            class="w-full border rounded-md p-2 focus:outline-none focus:ring-2 focus:ring-primary-orange"
            placeholder="Product description"
          ></textarea>
        </div>

        <!-- Category -->
        <div>
          <label for="category" class="block text-sm font-medium text-gray-700 mb-1"
            >Category</label
          >
          <select
            id="category"
            v-model="form.category"
            required
            class="w-full border rounded-md p-2 focus:outline-none focus:ring-2 focus:ring-primary-orange"
          >
            <option value="" disabled>Select category</option>
            <option value="electronics">Electronics</option>
            <option value="jewelery">Jewelery</option>
            <option value="men's clothing">Men's Clothing</option>
            <option value="women's clothing">Women's Clothing</option>
          </select>
        </div>

        <!-- Image URL -->
        <div>
          <label for="image" class="block text-sm font-medium text-gray-700 mb-1"
            >Image URL</label
          >
          <input
            id="image"
            v-model="form.image"
            type="url"
            required
            class="w-full border rounded-md p-2 focus:outline-none focus:ring-2 focus:ring-primary-orange"
            placeholder="https://example.com/image.jpg"
          />
        </div>

        <!-- Image Preview -->
        <div v-if="form.image" class="border rounded-md p-4">
          <label class="block text-sm font-medium text-gray-700 mb-2"
            >Image Preview</label
          >
          <img
            :src="form.image"
            alt="Product preview"
            class="max-h-60 mx-auto object-contain"
          />
        </div>

        <!-- Submit Button -->
        <div>
          <button
            type="submit"
            :disabled="submitting"
            class="w-full bg-primary-orange hover:bg-orange-600 text-white px-4 py-2 rounded-md flex items-center justify-center"
          >
            <BaseIcon
              v-if="submitting"
              name="mdi:loading"
              size="20"
              class="mr-2 animate-spin"
            />
            {{ isEditMode ? 'Update Product' : 'Add Product' }}
          </button>
        </div>
      </form>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, reactive, computed, onMounted } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import BaseIcon from '@/components/BaseIcon.vue'
import SkeletonLoader from '@/components/SkeletonLoader.vue'
import { useBerryStore } from '@/stores/berryStore'
import type { Product } from '@/services/api'

const route = useRoute()
const router = useRouter()
const berryStore = useBerryStore()
const { loading, addProduct, updateProduct, getProduct } = berryStore

const submitting = ref(false)
const form = reactive<Product>({
  title: '',
  price: 0,
  description: '',
  category: '',
  image: '',
})

// Check if we're in edit mode
const isEditMode = computed(() => route.name === 'berry-edit')
const productId = computed(() =>
  route.params.id ? parseInt(route.params.id as string) : null
)

// Load product data if in edit mode
onMounted(async () => {
  if (isEditMode.value && productId.value) {
    try {
      const product = await getProduct(productId.value)

      // Populate form with product data
      form.title = product.title
      form.price = product.price
      form.description = product.description
      form.category = product.category
      form.image = product.image
    } catch (error) {
      console.error('Failed to load product:', error)
      alert('Failed to load product data. Please try again.')
    }
  }
})

// Handle form submission
async function handleSubmit() {
  submitting.value = true

  try {
    if (isEditMode.value && productId.value) {
      // Update existing product
      await updateProduct(productId.value, form)
      alert('Product updated successfully!')
    } else {
      // Add new product
      await addProduct(form)
      alert('Product added successfully!')
    }

    // Navigate back to the berry list
    router.push({ name: 'berries' })
  } catch (error) {
    console.error('Failed to save product:', error)
    alert('Failed to save product. Please try again.')
  } finally {
    submitting.value = false
  }
}
</script>
