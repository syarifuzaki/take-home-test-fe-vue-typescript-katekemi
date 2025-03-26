<template>
  <div class="p-6">
    <div class="flex justify-between items-center mb-6">
      <h1 class="text-2xl font-bold">{{ t('products.detail.title') }}</h1>
      <router-link
        :to="{ name: 'products' }"
        class="bg-gray-200 hover:bg-gray-300 text-gray-700 px-4 py-2 rounded-md flex items-center"
      >
        <BaseIcon name="mdi:arrow-left" size="20" class="mr-1" />
        {{ t('products.form.back') }}
      </router-link>
    </div>

    <!-- Product Selection Navigation -->
    <div class="bg-white rounded-md shadow p-6 mb-6">
      <div class="flex flex-col md:flex-row items-start md:items-center gap-4">
        <div class="w-full md:w-2/3">
          <label class="block text-sm font-medium text-gray-700 mb-1">{{
            t('products.detail.selectProduct')
          }}</label>
          <select
            v-model="selectedProductId"
            class="w-full border rounded-md p-2 focus:outline-none focus:ring-2 focus:ring-primary-orange"
          >
            <option v-for="product in products" :key="product.id" :value="product.id">
              {{ product.title }}
            </option>
          </select>
        </div>
        <button
          @click="navigateToProduct"
          class="mt-4 md:mt-6 bg-primary-orange hover:bg-orange-600 text-white px-4 py-2 rounded-md"
        >
          {{ t('products.detail.navigateButton') }}
        </button>
      </div>
    </div>

    <!-- Loading State -->
    <div v-if="loading" class="bg-white rounded-md shadow p-6">
      <SkeletonLoader type="detail" />
    </div>

    <!-- Product Details -->
    <div v-else-if="selectedProduct" class="bg-white rounded-md shadow">
      <div class="grid grid-cols-1 md:grid-cols-2 gap-6 p-6">
        <!-- Product Image -->
        <div class="flex justify-center items-center">
          <img
            :src="selectedProduct.image"
            :alt="selectedProduct.title"
            class="max-h-96 object-contain"
          />
        </div>

        <!-- Product Information -->
        <div class="space-y-6">
          <div>
            <h2 class="text-2xl font-bold text-primary-navy mb-2">
              {{ selectedProduct.title }}
            </h2>
            <div class="flex items-center mb-2">
              <span
                class="bg-primary-orange text-white px-3 py-1 rounded-full text-sm capitalize"
              >
                {{ selectedProduct.category }}
              </span>
            </div>
            <div class="flex items-center space-x-4">
              <span class="text-2xl font-bold text-gray-900"
                >${{ selectedProduct.price.toFixed(2) }}</span
              >

              <!-- Rating -->
              <div class="flex items-center" v-if="selectedProduct.rating">
                <div class="flex">
                  <template v-for="star in 5" :key="star">
                    <BaseIcon
                      :name="
                        star <= Math.round(selectedProduct.rating.rate)
                          ? 'mdi:star'
                          : 'mdi:star-outline'
                      "
                      size="20"
                      class="text-yellow-500"
                    />
                  </template>
                </div>
                <span class="ml-2 text-sm text-gray-600">
                  {{ selectedProduct.rating.rate }} ({{ selectedProduct.rating.count }}
                  reviews)
                </span>
              </div>
            </div>
          </div>

          <div>
            <h3 class="text-lg font-medium text-primary-navy mb-2">
              {{ t('products.detail.description') }}
            </h3>
            <p class="text-gray-700">{{ selectedProduct.description }}</p>
          </div>

          <div class="flex space-x-4">
            <button
              class="bg-primary-orange hover:bg-orange-600 text-white px-6 py-2 rounded-md flex items-center"
            >
              <BaseIcon name="mdi:cart" size="20" class="mr-2" />
              {{ t('products.detail.addToCart') }}
            </button>
            <router-link
              :to="{ name: 'product-edit', params: { id: selectedProduct.id } }"
              class="bg-blue-600 hover:bg-blue-700 text-white px-6 py-2 rounded-md flex items-center"
            >
              <BaseIcon name="mdi:pencil" size="20" class="mr-2" />
              {{ t('products.detail.edit') }}
            </router-link>
          </div>
        </div>
      </div>

      <!-- Additional Details -->
      <div class="border-t border-gray-200 p-6">
        <h3 class="text-lg font-medium text-primary-navy mb-4">
          {{ t('products.detail.productDetails') }}
        </h3>
        <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div class="flex flex-col space-y-2">
            <div class="flex justify-between">
              <span class="text-gray-600">{{ t('products.detail.category') }}:</span>
              <span class="font-medium capitalize">{{ selectedProduct.category }}</span>
            </div>
            <div class="flex justify-between">
              <span class="text-gray-600">{{ t('products.detail.productId') }}:</span>
              <span class="font-medium">{{ selectedProduct.id }}</span>
            </div>
          </div>
          <div class="flex flex-col space-y-2" v-if="selectedProduct.rating">
            <div class="flex justify-between">
              <span class="text-gray-600">{{ t('products.detail.rating') }}:</span>
              <span class="font-medium">{{ selectedProduct.rating.rate }}/5</span>
            </div>
            <div class="flex justify-between">
              <span class="text-gray-600">{{ t('products.detail.reviews') }}:</span>
              <span class="font-medium">{{ selectedProduct.rating.count }}</span>
            </div>
          </div>
        </div>
      </div>
    </div>

    <!-- No Product Selected -->
    <div v-else class="bg-white rounded-md shadow p-6 text-center py-10 text-gray-500">
      {{ t('products.detail.noProduct') }}
    </div>
  </div>
</template>

<script setup lang="ts">
import { onMounted, watch, ref } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import BaseIcon from '../components/BaseIcon.vue'
import SkeletonLoader from '../components/SkeletonLoader.vue'
import { useProductStore } from '../stores/productStore'
import { storeToRefs } from 'pinia'
import { useI18n } from 'vue-i18n'

const { t } = useI18n()
const route = useRoute()
const router = useRouter()
const productStore = useProductStore()
const { fetchProductDetail, fetchProducts } = productStore
const { selectedProduct, loading, products } = storeToRefs(productStore)

// For the dropdown selection
const selectedProductId = ref<number | null>(null)

// Load product details and fetch all products for the dropdown when component mounts
onMounted(async () => {
  // Fetch all products for the dropdown
  if (products.value.length === 0) {
    await fetchProducts()
  }

  // Fetch current product details
  if (route.params.id) {
    await fetchProductDetail(route.params.id as string)
    // Set the selectedProductId to the current product id
    selectedProductId.value = parseInt(route.params.id as string)
  }
})

// Navigate to the selected product
function navigateToProduct() {
  if (selectedProductId.value) {
    router.push({
      name: 'product-detail',
      params: { id: selectedProductId.value },
    })
  }
}

// Watch for changes in route and update the product details
watch(
  () => route.params.id,
  async (newId) => {
    if (newId) {
      await fetchProductDetail(newId as string)
      // Update selectedProductId when the route changes
      selectedProductId.value = parseInt(newId as string)
    }
  }
)
</script>
