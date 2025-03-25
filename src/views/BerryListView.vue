<!-- src/views/BerryListView.vue -->
<template>
  <div class="p-6">
    <div class="flex justify-between items-center mb-6">
      <h1 class="text-2xl font-bold">Berry List</h1>
      <router-link
        :to="{ name: 'berry-add' }"
        class="bg-primary-orange hover:bg-orange-600 text-white px-4 py-2 rounded-md flex items-center"
      >
        <BaseIcon name="mdi:plus" size="20" class="mr-1" />
        Add Berry
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
            placeholder="Search berries..."
            class="w-full pl-10 pr-4 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-primary-orange"
          />
        </div>
      </div>

      <div class="flex items-center space-x-4">
        <label class="flex items-center">
          <span class="mr-2 text-gray-700">Items per page:</span>
          <select
            v-model="itemsPerPage"
            class="border rounded-md px-2 py-1 focus:outline-none focus:ring-2 focus:ring-primary-orange mr-8"
          >
            <option :value="10">10</option>
            <option :value="30">30</option>
            <option :value="50">50</option>
          </select>
        </label>
      </div>
    </div>

    <!-- Berries Table -->
    <div class="bg-white rounded-md shadow overflow-x-auto">
      <SkeletonLoader v-if="loading" type="table" :rows="itemsPerPage" />

      <table v-else class="min-w-full divide-y divide-gray-200">
        <thead class="bg-gray-50">
          <tr>
            <th
              class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider w-16"
            >
              No
            </th>
            <th
              class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
            >
              Name
            </th>
            <th
              class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider w-32"
            >
              Actions
            </th>
          </tr>
        </thead>
        <tbody class="bg-white divide-y divide-gray-200">
          <tr v-if="filteredBerries.length === 0">
            <td colspan="3" class="px-6 py-4 text-center text-gray-500">
              No berries found. Try adjusting your search.
            </td>
          </tr>
          <tr
            v-for="(berry, index) in filteredBerries"
            :key="berry.name"
            class="hover:bg-gray-50"
          >
            <td class="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
              {{ (currentPage - 1) * itemsPerPage + index + 1 }}
            </td>
            <td class="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
              <router-link
                :to="{ name: 'berry-detail', params: { id: getBerryId(berry.url) } }"
                class="text-primary-navy hover:text-primary-orange hover:underline"
              >
                {{ formatBerryName(berry.name) }}
              </router-link>
            </td>
            <td class="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
              <div class="flex space-x-2">
                <router-link
                  :to="{ name: 'berry-edit', params: { id: getBerryId(berry.url) } }"
                  class="text-blue-600 hover:text-blue-800"
                >
                  <BaseIcon name="mdi:pencil" size="20" />
                </router-link>
                <button
                  @click="handleDelete(getBerryId(berry.url))"
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
        Showing {{ (currentPage - 1) * itemsPerPage + 1 }}-{{
          Math.min(currentPage * itemsPerPage, totalCount)
        }}
        of {{ totalCount }} items
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
import { ref, onMounted, watch, computed } from 'vue'
import BaseIcon from '@/components/BaseIcon.vue'
import SkeletonLoader from '@/components/SkeletonLoader.vue'
import { useBerryStore } from '@/stores/berryStore'
import { storeToRefs } from 'pinia'

const berryStore = useBerryStore()
const {
  fetchBerries,
  setSearchQuery,
  setCurrentPage,
  setItemsPerPage,
  initFromStorage,
} = berryStore

const {
  loading,
  berries,
  filteredBerries,
  currentPage,
  itemsPerPage,
  totalCount,
  pageCount,
} = storeToRefs(berryStore)

// Initialize from localStorage and set up watchers
onMounted(async () => {
  // initFromStorage()
  await fetchBerries()
})

// Helper function to get berry ID from URL
function getBerryId(url: string): string {
  const parts = url.split('/')
  return parts[parts.length - 2]
}

// Helper function to format berry name (capitalize first letter)
function formatBerryName(name: string): string {
  return name.charAt(0).toUpperCase() + name.slice(1)
}

// Handle delete button click
function handleDelete(id: string): void {
  if (confirm('Are you sure you want to delete this berry?')) {
    // In a real app, you would call the API to delete the item
    alert(`Berry with ID ${id} would be deleted (this is just a simulation)`)
  }
}

// Create computed properties for the component
const searchQuery = computed({
  get: () => berryStore.searchQuery,
  set: (value) => setSearchQuery(value),
})

// Watch for changes in pagination to trigger data fetch
watch([currentPage, itemsPerPage], () => {
  fetchBerries()
})
</script>
