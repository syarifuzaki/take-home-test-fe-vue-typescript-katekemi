<template>
  <div class="p-6">
    <!-- Header Section -->
    <div
      class="flex flex-col md:flex-row justify-between items-start md:items-center mb-6 gap-4"
    >
      <div>
        <h1 class="text-2xl font-bold text-primary-navy">
          {{ t('products.list.title') }}
        </h1>
        <p class="text-gray-600 mt-1">{{ t('products.list.subtitle') }}</p>
      </div>

      <router-link
        :to="{ name: 'product-add' }"
        class="bg-primary-orange hover:bg-orange-600 text-white px-4 py-2 rounded-md flex items-center"
      >
        <BaseIcon name="mdi:plus" size="20" class="mr-1" />
        {{ t('products.list.addButton') }}
      </router-link>
    </div>

    <!-- Search and Pagination Controls -->
    <div class="flex flex-col md:flex-row justify-between mb-6 gap-4">
      <div class="w-full md:w-1/3">
        <div class="relative">
          <BaseIcon
            name="mdi:magnify"
            size="20"
            class="absolute left-3 top-3 text-gray-500"
          />
          <input
            v-model="searchQuery"
            type="text"
            :placeholder="t('products.list.searchPlaceholder')"
            class="w-full pl-10 pr-4 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-primary-orange"
          />
        </div>
      </div>

      <div class="flex items-center space-x-4">
        <label class="flex items-center">
          <span class="mr-2 text-gray-700">{{ t('products.list.itemsPerPage') }}:</span>
          <select
            v-model="itemsPerPage"
            class="border rounded-md px-2 py-1 focus:outline-none focus:ring-2 focus:ring-primary-orange pr-8"
          >
            <option :value="5">5</option>
            <option :value="10">10</option>
            <option :value="20">20</option>
          </select>
        </label>
      </div>
    </div>

    <!-- Products Table -->
    <div class="bg-white rounded-md shadow overflow-x-auto">
      <SkeletonLoader v-if="loading" type="table" :rows="itemsPerPage" />

      <table v-else class="min-w-full divide-y divide-gray-200">
        <thead class="bg-gray-50">
          <tr>
            <th
              class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider w-16"
            >
              {{ t('products.list.tableHeaders.number') }}
            </th>
            <th
              class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider w-24"
            >
              {{ t('products.list.tableHeaders.image') }}
            </th>
            <th
              @click="toggleSort('title')"
              class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider cursor-pointer hover:bg-gray-100"
            >
              <div class="flex items-center">
                {{ t('products.list.tableHeaders.name') }}
                <span class="ml-1">
                  <BaseIcon
                    v-if="sortField === 'title' && sortOrder === 'asc'"
                    name="mdi:arrow-up"
                    size="16"
                    class="text-primary-orange"
                  />
                  <BaseIcon
                    v-else-if="sortField === 'title' && sortOrder === 'desc'"
                    name="mdi:arrow-down"
                    size="16"
                    class="text-primary-orange"
                  />
                  <BaseIcon
                    v-else
                    name="mdi:unfold-more-horizontal"
                    size="16"
                    class="text-gray-400"
                  />
                </span>
              </div>
            </th>
            <th
              @click="toggleSort('category')"
              class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider cursor-pointer hover:bg-gray-100"
            >
              <div class="flex items-center">
                {{ t('products.list.tableHeaders.category') }}
                <span class="ml-1">
                  <BaseIcon
                    v-if="sortField === 'category' && sortOrder === 'asc'"
                    name="mdi:arrow-up"
                    size="16"
                    class="text-primary-orange"
                  />
                  <BaseIcon
                    v-else-if="sortField === 'category' && sortOrder === 'desc'"
                    name="mdi:arrow-down"
                    size="16"
                    class="text-primary-orange"
                  />
                  <BaseIcon
                    v-else
                    name="mdi:unfold-more-horizontal"
                    size="16"
                    class="text-gray-400"
                  />
                </span>
              </div>
            </th>
            <th
              @click="toggleSort('price')"
              class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider cursor-pointer hover:bg-gray-100"
            >
              <div class="flex items-center">
                {{ t('products.list.tableHeaders.price') }}
                <span class="ml-1">
                  <BaseIcon
                    v-if="sortField === 'price' && sortOrder === 'asc'"
                    name="mdi:arrow-up"
                    size="16"
                    class="text-primary-orange"
                  />
                  <BaseIcon
                    v-else-if="sortField === 'price' && sortOrder === 'desc'"
                    name="mdi:arrow-down"
                    size="16"
                    class="text-primary-orange"
                  />
                  <BaseIcon
                    v-else
                    name="mdi:unfold-more-horizontal"
                    size="16"
                    class="text-gray-400"
                  />
                </span>
              </div>
            </th>
            <th
              class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider w-32"
            >
              {{ t('products.list.tableHeaders.actions') }}
            </th>
          </tr>
        </thead>
        <tbody class="bg-white divide-y divide-gray-200">
          <tr v-if="paginatedProducts.length === 0">
            <td colspan="6" class="px-6 py-4 text-center text-gray-500">
              {{ t('products.list.noProducts') }}
            </td>
          </tr>
          <tr
            v-for="(product, index) in paginatedProducts"
            :key="product.id"
            class="hover:bg-gray-50"
          >
            <td class="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
              {{ (currentPage - 1) * itemsPerPage + index + 1 }}
            </td>
            <td class="px-6 py-4 whitespace-nowrap">
              <img
                :src="product.image"
                :alt="product.title"
                class="h-12 w-12 object-contain"
              />
            </td>
            <td
              class="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900 max-w-[400px] truncate"
            >
              <router-link
                :to="{ name: 'product-detail', params: { id: product.id } }"
                class="text-primary-navy hover:text-primary-orange hover:underline"
              >
                {{ product.title }}
              </router-link>
            </td>
            <td class="px-6 py-4 whitespace-nowrap text-sm text-gray-500 capitalize">
              {{ product.category }}
            </td>
            <td class="px-6 py-4 whitespace-nowrap text-sm text-gray-900 font-medium">
              ${{ product.price.toFixed(2) }}
            </td>
            <td class="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
              <div class="flex space-x-2">
                <router-link
                  :to="{ name: 'product-edit', params: { id: product.id } }"
                  class="text-blue-600 hover:text-blue-800"
                >
                  <BaseIcon name="mdi:pencil" size="20" />
                </router-link>
                <button
                  @click="handleDelete(product?.id)"
                  class="text-red-600 hover:text-red-800"
                >
                  <BaseIcon name="mdi:delete" size="20" />
                </button>
              </div>
            </td>
          </tr>
        </tbody>
      </table>
    </div>

    <!-- Pagination -->
    <div class="flex justify-between items-center mt-6">
      <div class="text-sm text-gray-700">
        {{ t('products.list.pagination.showing') }}
        {{ (currentPage - 1) * itemsPerPage + 1 }} {{ t('products.list.pagination.to') }}
        {{ Math.min(currentPage * itemsPerPage, totalCount) }}
        {{ t('products.list.pagination.of') }} {{ totalCount }}
        {{ t('products.list.pagination.items') }}
      </div>

      <div class="flex space-x-1">
        <button
          @click="currentPage > 1 && setCurrentPage(currentPage - 1)"
          :disabled="currentPage <= 1"
          :class="[
            'px-3 py-1 rounded-md',
            currentPage <= 1
              ? 'bg-gray-200 text-gray-500 cursor-not-allowed'
              : 'bg-gray-200 hover:bg-gray-300 text-gray-700',
          ]"
        >
          <BaseIcon name="mdi:chevron-left" size="20" />
        </button>

        <template v-if="pageCount <= 7">
          <button
            v-for="page in pageCount"
            :key="page"
            @click="setCurrentPage(page)"
            :class="[
              'px-3 py-1 rounded-md',
              currentPage === page
                ? 'bg-primary-orange text-white'
                : 'bg-gray-200 hover:bg-gray-300 text-gray-700',
            ]"
          >
            {{ page }}
          </button>
        </template>

        <template v-else>
          <!-- First page -->
          <button
            @click="setCurrentPage(1)"
            :class="[
              'px-3 py-1 rounded-md',
              currentPage === 1
                ? 'bg-primary-orange text-white'
                : 'bg-gray-200 hover:bg-gray-300 text-gray-700',
            ]"
          >
            1
          </button>

          <!-- Ellipsis if needed -->
          <span v-if="currentPage > 3" class="px-3 py-1">...</span>

          <!-- Pages around current page -->
          <template v-for="page in pageCount" :key="page">
            <button
              v-if="page !== 1 && page !== pageCount && Math.abs(page - currentPage) <= 1"
              @click="setCurrentPage(page)"
              :class="[
                'px-3 py-1 rounded-md',
                currentPage === page
                  ? 'bg-primary-orange text-white'
                  : 'bg-gray-200 hover:bg-gray-300 text-gray-700',
              ]"
            >
              {{ page }}
            </button>
          </template>

          <!-- Ellipsis if needed -->
          <span v-if="currentPage < pageCount - 2" class="px-3 py-1">...</span>

          <!-- Last page -->
          <button
            @click="setCurrentPage(pageCount)"
            :class="[
              'px-3 py-1 rounded-md',
              currentPage === pageCount
                ? 'bg-primary-orange text-white'
                : 'bg-gray-200 hover:bg-gray-300 text-gray-700',
            ]"
          >
            {{ pageCount }}
          </button>
        </template>

        <button
          @click="currentPage < pageCount && setCurrentPage(currentPage + 1)"
          :disabled="currentPage >= pageCount"
          :class="[
            'px-3 py-1 rounded-md',
            currentPage >= pageCount
              ? 'bg-gray-200 text-gray-500 cursor-not-allowed'
              : 'bg-gray-200 hover:bg-gray-300 text-gray-700',
          ]"
        >
          <BaseIcon name="mdi:chevron-right" size="20" />
        </button>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { onMounted, watch, computed } from 'vue'
import BaseIcon from '../components/BaseIcon.vue'
import SkeletonLoader from '../components/SkeletonLoader.vue'
import { useProductStore } from '../stores/productStore'
import { storeToRefs } from 'pinia'
import { toast } from 'vue3-toastify'
import 'vue3-toastify/dist/index.css'
import { useI18n } from 'vue-i18n'

const { t } = useI18n()
const productStore = useProductStore()
const {
  fetchProducts,
  setSearchQuery,
  setCurrentPage,
  deleteProduct,
  setSorting,
  initFromStorage,
} = productStore

const {
  loading,
  paginatedProducts,
  totalCount,
  currentPage,
  itemsPerPage,
  pageCount,
  sortField,
  sortOrder,
} = storeToRefs(productStore)

// Initialize from localStorage and fetch products
onMounted(async () => {
  initFromStorage()
  await fetchProducts()
})

// Handle delete button click
async function handleDelete(id: number): Promise<void> {
  if (confirm(t('products.list.deleteConfirmation'))) {
    try {
      await deleteProduct(id)
      toast(t('products.list.deleteSuccess'), {
        theme: 'dark',
        type: 'success',
        dangerouslyHTMLString: true,
      })
    } catch (error) {
      toast(t('products.list.deleteError'), {
        theme: 'dark',
        type: 'error',
        dangerouslyHTMLString: true,
      })
    }
  }
}

// Create computed properties for the component
const searchQuery = computed({
  get: () => productStore.searchQuery,
  set: (value) => setSearchQuery(value),
})

// Function to toggle sorting
function toggleSort(field: string) {
  if (field === sortField.value) {
    // Toggle between ascending, descending
    const newOrder = sortOrder.value === 'asc' ? 'desc' : 'asc'
    setSorting(field, newOrder)
  } else {
    // Default to ascending for a new field
    setSorting(field, 'asc')
  }
}

// Watch for changes in pagination to trigger data refresh
watch([itemsPerPage], () => {
  setCurrentPage(1)
})
</script>
