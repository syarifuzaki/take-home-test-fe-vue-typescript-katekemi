<template>
  <div class="p-6">
    <!-- Header Section -->
    <div
      class="flex flex-col md:flex-row justify-between items-start md:items-center mb-6 gap-4"
    >
      <div>
        <h1 class="text-2xl font-bold text-primary-navy">Berry Database</h1>
        <p class="text-gray-600 mt-1">Explore the world of Pokémon Berries</p>
      </div>
    </div>

    <!-- Filters Section -->
    <div class="bg-white rounded-lg shadow-md p-4 mb-6">
      <div class="flex flex-col md:flex-row justify-between gap-4">
        <!-- Search -->
        <div class="w-full md:w-1/3">
          <div class="relative">
            <BaseIcon
              name="mdi:magnify"
              size="20"
              class="absolute left-3 top-3 text-gray-500"
            />
            <input
              v-model="localSearchQuery"
              type="text"
              placeholder="Search Berries by name..."
              class="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-primary-orange focus:border-transparent"
              @input="handleSearchInput"
            />
          </div>
        </div>

        <div class="flex flex-wrap gap-3">
          <!-- Sort Order -->
          <div class="flex items-center space-x-2">
            <label class="text-sm text-gray-700">Sort:</label>
            <div class="inline-flex rounded-md shadow-sm">
              <button
                @click="handleSortChange('asc')"
                :class="[
                  'px-3 py-1.5 text-sm border border-gray-300 first:rounded-l-md last:rounded-r-md',
                  localSortOrder === 'asc'
                    ? 'bg-primary-orange text-white border-primary-orange'
                    : 'bg-white text-gray-700 hover:bg-gray-50',
                ]"
              >
                A-Z
              </button>
              <button
                @click="handleSortChange('desc')"
                :class="[
                  'px-3 py-1.5 text-sm border border-gray-300 first:rounded-l-md last:rounded-r-md -ml-px',
                  localSortOrder === 'desc'
                    ? 'bg-primary-orange text-white border-primary-orange'
                    : 'bg-white text-gray-700 hover:bg-gray-50',
                ]"
              >
                Z-A
              </button>
            </div>
          </div>

          <!-- Items Per Page -->
          <div class="flex items-center space-x-2">
            <label class="text-sm text-gray-700">Show:</label>
            <select
              v-model="localItemsPerPage"
              class="border border-gray-300 rounded-md px-3 py-1.5 text-sm focus:outline-none focus:ring-2 focus:ring-primary-orange focus:border-transparent pr-8"
              @change="handleItemsPerPageChange"
            >
              <option :value="10">10</option>
              <option :value="30">30</option>
              <option :value="50">50</option>
            </select>
          </div>
        </div>
      </div>
    </div>

    <!-- Berries Table -->
    <div class="bg-white rounded-lg shadow-md overflow-hidden">
      <SkeletonLoader v-if="loading" type="table" :rows="localItemsPerPage" />

      <div v-else-if="filteredBerries.length === 0" class="py-12 text-center">
        <div class="mx-auto w-24 h-24 text-gray-400 mb-4">
          <BaseIcon name="mdi:grain" size="96" />
        </div>
        <h3 class="text-lg font-medium text-gray-700">No Berries Found</h3>
        <p class="text-gray-500 mt-2">Try adjusting your search criteria</p>
      </div>

      <div v-else class="overflow-x-auto">
        <table class="min-w-full divide-y divide-gray-200">
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
            <tr
              v-for="(berry, index) in filteredBerries"
              :key="berry.name"
              class="hover:bg-gray-50 transition-colors"
            >
              <td class="px-6 py-4 whitespace-nowrap">
                <div class="text-sm font-medium text-gray-500">
                  {{ (currentPage - 1) * localItemsPerPage + index + 1 }}
                </div>
              </td>
              <td class="px-6 py-4 whitespace-nowrap">
                <div
                  class="text-sm font-medium text-gray-900 hover:text-primary-orange cursor-pointer"
                  @click="showDetails(berry.url)"
                >
                  {{ formatBerryName(berry.name) }}
                </div>
              </td>
              <td class="px-6 py-4 whitespace-nowrap">
                <div class="flex space-x-3">
                  <button
                    @click="showDetails(berry.url)"
                    class="text-blue-600 hover:text-blue-800 transition-colors"
                    title="View Details"
                  >
                    <BaseIcon name="mdi:eye" size="20" />
                  </button>
                </div>
              </td>
            </tr>
          </tbody>
        </table>
      </div>
    </div>

    <!-- Pagination -->
    <div class="flex flex-col md:flex-row justify-between items-center mt-6 gap-4">
      <div class="text-sm text-gray-700 order-2 md:order-1">
        Showing
        {{ filteredBerries.length ? (currentPage - 1) * localItemsPerPage + 1 : 0 }}-{{
          Math.min(currentPage * localItemsPerPage, totalCount)
        }}
        of {{ totalCount }} items
      </div>

      <div class="flex space-x-1 order-1 md:order-2">
        <button
          @click="currentPage > 1 && handlePageChange(currentPage - 1)"
          :disabled="currentPage <= 1"
          :class="[
            'px-3 py-1 rounded-md transition-colors',
            currentPage <= 1
              ? 'bg-gray-200 text-gray-500 cursor-not-allowed'
              : 'bg-white hover:bg-gray-100 text-gray-700 border',
          ]"
        >
          <BaseIcon name="mdi:chevron-left" size="20" />
        </button>

        <template v-if="pageCount <= 7">
          <button
            v-for="page in pageCount"
            :key="page"
            @click="handlePageChange(page)"
            :class="[
              'px-3 py-1 rounded-md transition-colors',
              currentPage === page
                ? 'bg-primary-orange text-white'
                : 'bg-white hover:bg-gray-100 text-gray-700 border',
            ]"
          >
            {{ page }}
          </button>
        </template>

        <template v-else>
          <!-- First page -->
          <button
            @click="handlePageChange(1)"
            :class="[
              'px-3 py-1 rounded-md transition-colors',
              currentPage === 1
                ? 'bg-primary-orange text-white'
                : 'bg-white hover:bg-gray-100 text-gray-700 border',
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
              @click="handlePageChange(page)"
              :class="[
                'px-3 py-1 rounded-md transition-colors',
                currentPage === page
                  ? 'bg-primary-orange text-white'
                  : 'bg-white hover:bg-gray-100 text-gray-700 border',
              ]"
            >
              {{ page }}
            </button>
          </template>

          <!-- Ellipsis if needed -->
          <span v-if="currentPage < pageCount - 2" class="px-3 py-1">...</span>

          <!-- Last page -->
          <button
            @click="handlePageChange(pageCount)"
            :class="[
              'px-3 py-1 rounded-md transition-colors',
              currentPage === pageCount
                ? 'bg-primary-orange text-white'
                : 'bg-white hover:bg-gray-100 text-gray-700 border',
            ]"
          >
            {{ pageCount }}
          </button>
        </template>

        <button
          @click="currentPage < pageCount && handlePageChange(currentPage + 1)"
          :disabled="currentPage >= pageCount"
          :class="[
            'px-3 py-1 rounded-md transition-colors',
            currentPage >= pageCount
              ? 'bg-gray-200 text-gray-500 cursor-not-allowed'
              : 'bg-white hover:bg-gray-100 text-gray-700 border',
          ]"
        >
          <BaseIcon name="mdi:chevron-right" size="20" />
        </button>
      </div>
    </div>

    <!-- Berry Detail Modal -->
    <BaseModal
      v-model="modalOpen"
      :title="
        selectedBerry?.name
          ? formatBerryName(selectedBerry.name) + ' #' + selectedBerry.id
          : 'Berry Details'
      "
      size="large"
    >
      <div v-if="detailLoading" class="py-4">
        <SkeletonLoader type="detail" />
      </div>

      <div v-else-if="selectedBerry" class="py-4">
        <div class="grid grid-cols-1 md:grid-cols-2 gap-6">
          <!-- Berry Details -->
          <div>
            <h3 class="font-medium text-gray-900 mb-4">Berry Information</h3>
            <div class="bg-gray-50 rounded-md p-4 space-y-3">
              <div class="flex justify-between">
                <span class="text-gray-600">Growth Time:</span>
                <span class="font-medium">{{ selectedBerry.growth_time }} hours</span>
              </div>
              <div class="flex justify-between">
                <span class="text-gray-600">Max Harvest:</span>
                <span class="font-medium">{{ selectedBerry.max_harvest }}</span>
              </div>
              <div class="flex justify-between">
                <span class="text-gray-600">Size:</span>
                <span class="font-medium">{{ selectedBerry.size }} mm</span>
              </div>
              <div class="flex justify-between">
                <span class="text-gray-600">Smoothness:</span>
                <span class="font-medium">{{ selectedBerry.smoothness }}</span>
              </div>
              <div class="flex justify-between">
                <span class="text-gray-600">Soil Dryness:</span>
                <span class="font-medium">{{ selectedBerry.soil_dryness }}</span>
              </div>
            </div>
          </div>

          <!-- Flavors and Firmness -->
          <div>
            <h3 class="font-medium text-gray-900 mb-4">Flavor Profile</h3>
            <div class="bg-gray-50 rounded-md p-4">
              <div class="mb-4">
                <span class="text-gray-600">Firmness:</span>
                <span class="font-medium ml-2">
                  {{ formatBerryName(selectedBerry.firmness.name) }}
                </span>
              </div>

              <div>
                <h4 class="text-sm font-medium text-gray-700 mb-2">Flavor Potency</h4>
                <ul class="space-y-2">
                  <li
                    v-for="flavor in selectedBerry.flavors"
                    :key="flavor.flavor.name"
                    class="flex items-center"
                  >
                    <span class="text-primary-orange mr-2">•</span>
                    <div class="flex justify-between w-full">
                      <span>
                        {{ formatBerryName(flavor.flavor.name) }}
                      </span>
                      <span class="font-medium">{{ flavor.potency }}</span>
                    </div>
                  </li>
                </ul>
              </div>
            </div>
          </div>
        </div>
      </div>

      <div v-else class="text-center py-10 text-gray-500">No Berry selected</div>

      <template #footer>
        <button
          @click="closeModal"
          class="px-4 py-2 bg-gray-100 hover:bg-gray-200 text-gray-800 rounded-md transition-colors border"
        >
          Close
        </button>
      </template>
    </BaseModal>
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted, watch, computed } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import BaseIcon from '@/components/BaseIcon.vue'
import SkeletonLoader from '@/components/SkeletonLoader.vue'
import BaseModal from '@/components/BaseModal.vue'
import { useBerryStore } from '@/stores/berryStore'
import { storeToRefs } from 'pinia'

const route = useRoute()
const router = useRouter()
const berryStore = useBerryStore()
const {
  fetchBerries,
  fetchBerryDetail,
  setSearchQuery,
  setCurrentPage,
  setItemsPerPage,
  closeModal,
  initFromStorage,
  setSortOrder,
  showBerryDetail,
} = berryStore

const {
  berries,
  filteredBerries,
  totalCount,
  currentPage,
  itemsPerPage,
  loading,
  detailLoading,
  pageCount,
  selectedBerry,
  modalOpen,
  sortOrder,
} = storeToRefs(berryStore)

// Local state to ensure proper reactivity
const localSearchQuery = ref('')
const localSortOrder = ref('asc')
const localItemsPerPage = ref(10)

// Initialize from store and set up local state
const initializeComponent = async () => {
  await initFromStorage()

  // Set up local state from store
  localSearchQuery.value = berryStore.searchQuery
  localSortOrder.value = berryStore.sortOrder
  localItemsPerPage.value = berryStore.itemsPerPage

  // Fetch initial data
  await fetchBerries()
}

// Process URL query parameters if they exist
const processQueryParams = () => {
  // Handle page from query params
  if (route.query.page) {
    const page = parseInt(route.query.page as string)
    if (!isNaN(page)) {
      setCurrentPage(page)
    }
  }

  // Handle search query from params
  if (route.query.search) {
    const searchQuery = route.query.search as string
    setSearchQuery(searchQuery)
    localSearchQuery.value = searchQuery
  }
}

// Initialize component
onMounted(async () => {
  await initializeComponent()
  processQueryParams()
})

// Handle search input changes with debounce
let searchTimeout: number | null = null
const handleSearchInput = () => {
  if (searchTimeout) {
    clearTimeout(searchTimeout)
  }

  searchTimeout = window.setTimeout(() => {
    setSearchQuery(localSearchQuery.value)

    // Update route query for search
    const query = { ...route.query }
    if (localSearchQuery.value) {
      query.search = localSearchQuery.value
    } else {
      delete query.search
    }

    // Replace current route with updated query
    router.replace({ query })

    searchTimeout = null
  }, 300)
}

// Handle sort changes
const handleSortChange = (order: 'asc' | 'desc') => {
  localSortOrder.value = order
  setSortOrder(order)
}

// Handle items per page change
const handleItemsPerPageChange = () => {
  setItemsPerPage(localItemsPerPage.value)
}

// Handle page changes
const handlePageChange = (page: number) => {
  setCurrentPage(page)

  // Update route query for page
  const query = { ...route.query, page: page.toString() }
  router.replace({ query })
}

// Helper function to format berry name (capitalize first letter)
function formatBerryName(name: string): string {
  return name
    .split('-')
    .map((word) => word.charAt(0).toUpperCase() + word.slice(1))
    .join(' ')
}

// Helper function to show details
function showDetails(url: string): void {
  showBerryDetail(url)
}

// Keep local and store values in sync
watch(
  () => berryStore.searchQuery,
  (newValue) => {
    localSearchQuery.value = newValue
  }
)

watch(
  () => berryStore.sortOrder,
  (newValue) => {
    localSortOrder.value = newValue
  }
)

watch(
  () => berryStore.itemsPerPage,
  (newValue) => {
    localItemsPerPage.value = newValue
  }
)
</script>
