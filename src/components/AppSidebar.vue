<template>
  <!-- Sidebar overlay for mobile -->
  <div
    v-if="props.sidebarOpen"
    @click="emit('toggleSidebar')"
    class="md:hidden fixed inset-0 bg-black bg-opacity-50 z-20"
  ></div>

  <!-- Sidebar -->
  <aside
    :class="[
      'top-0 h-full bg-primary-navy text-white w-64 overflow-y-auto transition-all duration-300 ease-in-out z-30 flex flex-col justify-between',
      props.sidebarOpenDesktop ? 'fixed' : 'fixed md:hidden',
      props.sidebarOpen ? 'transform-none' : '-translate-x-full md:transform-none',
    ]"
  >
    <div class="grow flex flex-col">
      <div class="p-3 border-b border-gray-700">
        <div class="flex items-center justify-center">
          <h1
            class="text-2xl font-medium text-center py-1.5 px-4 flex items-center gap-2"
          >
            <BaseIcon name="mdi:pokeball" size="28" />
            <span>KATEKEMI</span>
          </h1>
        </div>
      </div>

      <nav class="py-4 grow flex flex-col w-full justify-between">
        <div class="grow">
          <!-- Dashboard Section -->
          <div class="mb-4 px-4">
            <p class="text-gray-400 text-xs uppercase mb-2 pl-2">Dashboard</p>
            <router-link
              :to="{ name: 'dashboard' }"
              :class="[
                'flex items-center p-2 rounded-md transition-colors',
                $route.name === 'dashboard'
                  ? 'bg-primary-orange text-white hover:bg-orange-600'
                  : 'hover:bg-gray-700',
              ]"
            >
              <BaseIcon name="mdi:view-dashboard" class="mr-3" size="20" />
              <span>Dashboard</span>
            </router-link>
          </div>

          <!-- Data Management Section -->
          <div class="mb-4 px-4">
            <p class="text-gray-400 text-xs uppercase mb-2 pl-2">Data Management</p>

            <div>
              <button
                @click="toggleSubMenu"
                :class="[
                  'flex items-center p-2 rounded-md transition-colors cursor-pointer w-full',
                  $route.name === 'products' ||
                  $route.name === 'product-detail' ||
                  $route.name === 'product-add' ||
                  $route.name === 'product-edit' ||
                  $route.name === 'berries'
                    ? 'bg-primary-orange text-white hover:bg-orange-600'
                    : 'hover:bg-gray-700',
                ]"
              >
                <div class="flex items-center flex-grow">
                  <BaseIcon name="mdi:pokeball" class="mr-3" size="20" />
                  <span>Module</span>
                </div>
                <BaseIcon
                  :name="subMenuOpen ? 'mdi:chevron-up' : 'mdi:chevron-down'"
                  size="20"
                />
              </button>

              <!-- Submenu -->
              <div
                v-if="subMenuOpen"
                class="ml-3 mt-3 space-y-3 border-l border-gray-700 pl-2"
              >
                <router-link
                  :to="{ name: 'products' }"
                  :class="[
                    'flex items-center p-2 text-sm  transition-colors',
                    $route.name === 'products' ||
                    $route.name === 'product-detail' ||
                    $route.name === 'product-add' ||
                    $route.name === 'product-edit'
                      ? 'text-primary-orange border border-primary-orange hover:bg-orange-400/50 hover:text-white rounded-md'
                      : 'text-gray-300 hover:text-white',
                  ]"
                >
                  <BaseIcon name="mdi:format-list-bulleted" class="mr-2" size="16" />
                  <span>Products</span>
                </router-link>

                <router-link
                  :to="{ name: 'berries' }"
                  :class="[
                    'flex items-center p-2 text-sm  transition-colors',
                    $route.name === 'berries'
                      ? 'text-primary-orange border border-primary-orange hover:bg-orange-400/50 hover:text-white rounded-md'
                      : 'text-gray-300 hover:text-white',
                  ]"
                >
                  <BaseIcon name="mdi:fruit-cherries" class="mr-2" size="16" />
                  <span>Berries</span>
                </router-link>
              </div>
            </div>
          </div>
        </div>

        <div class="mt-2 px-4">
          <button
            class="flex items-center p-2 rounded-md hover:bg-red-500/20 text-red-300 w-full transition-colors"
          >
            <BaseIcon name="mdi:logout" class="mr-3" size="20" />
            <span>Logout</span>
          </button>
        </div>
      </nav>
    </div>
  </aside>
</template>

<script setup lang="ts">
import { ref } from 'vue'
import BaseIcon from '@/components/BaseIcon.vue'

const props = defineProps({
  sidebarOpen: Boolean,
  sidebarOpenDesktop: Boolean,
})

const emit = defineEmits(['toggleSidebar'])

// Manage submenu states
const subMenuOpen = ref(true) // Open by default

function toggleSubMenu() {
  subMenuOpen.value = !subMenuOpen.value
}
</script>
