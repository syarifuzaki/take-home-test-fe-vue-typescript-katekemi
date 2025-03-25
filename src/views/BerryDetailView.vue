<!-- src/views/BerryDetailView.vue -->
<template>
  <div class="p-6">
    <div class="flex justify-between items-center mb-6">
      <h1 class="text-2xl font-bold">Berry Details</h1>
      <router-link
        :to="{ name: 'berries' }"
        class="bg-gray-200 hover:bg-gray-300 text-gray-700 px-4 py-2 rounded-md flex items-center"
      >
        <BaseIcon name="mdi:arrow-left" size="20" class="mr-1" />
        Back to List
      </router-link>
    </div>

    <!-- Berry Selection -->
    <div class="bg-white rounded-md shadow p-6 mb-6">
      <div class="flex flex-col md:flex-row items-start md:items-center gap-4">
        <div class="w-full md:w-1/3">
          <label class="block text-sm font-medium text-gray-700 mb-1">Select Berry</label>
          <select
            v-model="selectedBerryName"
            class="w-full border rounded-md p-2 focus:outline-none focus:ring-2 focus:ring-primary-orange"
          >
            <option v-for="berry in berries" :key="berry.name" :value="berry.name">
              {{ formatBerryName(berry.name) }}
            </option>
          </select>
        </div>
        <button
          @click="fetchBerryByName(selectedBerryName)"
          class="mt-4 md:mt-6 bg-primary-orange hover:bg-orange-600 text-white px-4 py-2 rounded-md"
        >
          View Details
        </button>
      </div>
    </div>

    <!-- Berry Details Content -->
    <div class="bg-white rounded-md shadow p-6">
      <SkeletonLoader v-if="loading" type="detail" />

      <div v-else-if="selectedBerry">
        <h2 class="text-xl font-bold mb-4 text-primary-navy">
          {{ formatBerryName(selectedBerry.name) }} Berry
        </h2>

        <div class="grid grid-cols-1 md:grid-cols-2 gap-6">
          <!-- Basic Info -->
          <div class="bg-gray-50 p-4 rounded-md">
            <h3 class="font-medium text-lg mb-3 text-primary-navy">Basic Information</h3>
            <div class="space-y-2">
              <div class="flex justify-between">
                <span class="text-gray-600">Growth Time:</span>
                <span class="font-medium">{{ selectedBerry.growth_time }} hour(s)</span>
              </div>
              <div class="flex justify-between">
                <span class="text-gray-600">Max Harvest:</span>
                <span class="font-medium">{{ selectedBerry.max_harvest }} berries</span>
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

          <!-- Properties -->
          <div class="bg-gray-50 p-4 rounded-md">
            <h3 class="font-medium text-lg mb-3 text-primary-navy">Properties</h3>
            <div class="space-y-2">
              <div class="flex justify-between">
                <span class="text-gray-600">Firmness:</span>
                <span class="font-medium capitalize">{{
                  selectedBerry.firmness.name
                }}</span>
              </div>
              <div class="flex justify-between">
                <span class="text-gray-600">Item:</span>
                <span class="font-medium capitalize">{{ selectedBerry.item.name }}</span>
              </div>
              <div class="flex justify-between">
                <span class="text-gray-600">Natural Gift Type:</span>
                <span class="font-medium capitalize">{{
                  selectedBerry.natural_gift_type.name
                }}</span>
              </div>
              <div class="flex justify-between">
                <span class="text-gray-600">Natural Gift Power:</span>
                <span class="font-medium">{{ selectedBerry.natural_gift_power }}</span>
              </div>
            </div>
          </div>

          <!-- Flavors -->
          <div class="bg-gray-50 p-4 rounded-md md:col-span-2">
            <h3 class="font-medium text-lg mb-3 text-primary-navy">Flavors</h3>
            <div
              class="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-4"
            >
              <div
                v-for="flavor in selectedBerry.flavors"
                :key="flavor.flavor.name"
                class="bg-white p-3 rounded-md shadow-sm"
              >
                <div class="font-medium capitalize">{{ flavor.flavor.name }}</div>
                <div class="text-gray-600">Potency: {{ flavor.potency }}</div>
              </div>
            </div>
          </div>
        </div>
      </div>

      <div v-else class="text-center py-10 text-gray-500">
        Select a berry to view its details
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted, watch } from 'vue'
import { useRoute } from 'vue-router'
import BaseIcon from '@/components/BaseIcon.vue'
import SkeletonLoader from '@/components/SkeletonLoader.vue'
import { useBerryStore } from '@/stores/berryStore'

const route = useRoute()
const berryStore = useBerryStore()
const {
  berries,
  selectedBerry,
  loading,
  fetchBerries,
  fetchBerryDetail,
  fetchBerryByName,
} = berryStore

const selectedBerryName = ref('')

// Helper function to format berry name (capitalize first letter)
function formatBerryName(name: string): string {
  return name.charAt(0).toUpperCase() + name.slice(1)
}

onMounted(async () => {
  // Fetch berry list for the dropdown
  if (berries.value.length === 0) {
    await fetchBerries()
  }

  // If we have an ID in the route, fetch that berry
  if (route.params.id) {
    await fetchBerryDetail(route.params.id as string)

    // Update the selected berry name in the dropdown
    if (selectedBerry.value) {
      selectedBerryName.value = selectedBerry.value.name
    }
  }
})

// Watch for changes in route and update the berry details
watch(
  () => route.params.id,
  async (newId) => {
    if (newId) {
      await fetchBerryDetail(newId as string)

      // Update the selected berry name in the dropdown
      if (selectedBerry.value) {
        selectedBerryName.value = selectedBerry.value.name
      }
    }
  }
)
</script>
