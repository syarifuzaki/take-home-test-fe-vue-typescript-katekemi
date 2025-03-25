<!-- src/components/AppSidebar.vue -->
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
            <span>POKÉMON APP</span>
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

            <!-- Products -->
            <div class="mb-2">
              <router-link
                :to="{ name: 'products' }"
                :class="[
                  'flex items-center p-2 rounded-md transition-colors w-full',
                  $route.name === 'products' ||
                  $route.name === 'product-detail' ||
                  $route.name === 'product-add' ||
                  $route.name === 'product-edit'
                    ? 'bg-primary-orange text-white hover:bg-orange-600'
                    : 'hover:bg-gray-700',
                ]"
              >
                <BaseIcon name="mdi:fruit-cherries" class="mr-3" size="20" />
                <!-- <BaseIcon name="mdi:fruit-cherries" class="mr-3" size="20" /> -->
                <span>Soal 1</span>
              </router-link>
            </div>

            <!-- Pokémon with collapsible submenu -->
            <div>
              <div
                :class="[
                  'flex items-center p-2 rounded-md transition-colors cursor-pointer w-full',
                  $route.name === 'pokemon'
                    ? 'bg-primary-orange text-white hover:bg-orange-600'
                    : 'hover:bg-gray-700',
                ]"
              >
                <router-link
                  :to="{ name: 'pokemon' }"
                  class="flex items-center flex-grow"
                >
                  <BaseIcon name="mdi:pokeball" class="mr-3" size="20" />
                  <span>Pokémon</span>
                </router-link>
                <button
                  @click="togglePokemonMenu"
                  class="text-gray-300 hover:text-white focus:outline-none"
                >
                  <BaseIcon
                    :name="pokemonMenuOpen ? 'mdi:chevron-up' : 'mdi:chevron-down'"
                    size="20"
                  />
                </button>
              </div>

              <!-- Submenu -->
              <div
                v-if="pokemonMenuOpen"
                class="ml-6 mt-1 space-y-1 border-l border-gray-700 pl-2"
              >
                <router-link
                  :to="{ name: 'pokemon', query: { filter: 'favorites' } }"
                  class="flex items-center p-2 text-sm text-gray-300 hover:text-white transition-colors"
                >
                  <BaseIcon name="mdi:star" class="mr-2" size="16" />
                  <span>Favorites</span>
                </router-link>

                <button
                  @click="toggleTypeMenu"
                  class="flex items-center p-2 text-sm text-gray-300 hover:text-white transition-colors w-full"
                >
                  <BaseIcon name="mdi:format-list-bulleted" class="mr-2" size="16" />
                  <span>Types</span>
                  <BaseIcon
                    :name="typeMenuOpen ? 'mdi:chevron-up' : 'mdi:chevron-down'"
                    size="16"
                    class="ml-auto"
                  />
                </button>

                <!-- Pokémon Types Submenu -->
                <div v-if="typeMenuOpen" class="ml-4 space-y-1">
                  <router-link
                    v-for="type in pokemonTypes"
                    :key="type.name"
                    :to="{ name: 'pokemon', query: { type: type.name } }"
                    class="flex items-center p-1 text-xs text-gray-300 hover:text-white transition-colors"
                  >
                    <div :class="['w-2 h-2 rounded-full mr-2', type.color]"></div>
                    <span>{{ type.displayName }}</span>
                  </router-link>
                </div>
              </div>
            </div>
          </div>

          <!-- Settings Section -->
          <!-- <div class="mb-4 px-4">
            <p class="text-gray-400 text-xs uppercase mb-2 pl-2">Settings</p>
            <router-link
              :to="{ name: 'about' }"
              :class="[
                'flex items-center p-2 rounded-md transition-colors',
                $route.name === 'about'
                  ? 'bg-primary-orange text-white hover:bg-orange-600'
                  : 'hover:bg-gray-700',
              ]"
            >
              <BaseIcon name="mdi:information" class="mr-3" size="20" />
              <span>About</span>
            </router-link>
          </div> -->
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
import { useRoute } from 'vue-router'

const route = useRoute()
const props = defineProps({
  sidebarOpen: Boolean,
  sidebarOpenDesktop: Boolean,
})

const emit = defineEmits(['toggleSidebar'])

// Manage submenu states
const pokemonMenuOpen = ref(true) // Open by default
const typeMenuOpen = ref(false)

function togglePokemonMenu() {
  pokemonMenuOpen.value = !pokemonMenuOpen.value
}

function toggleTypeMenu() {
  typeMenuOpen.value = !typeMenuOpen.value
}

// Pokémon type data for the submenu
const pokemonTypes = [
  { name: 'normal', displayName: 'Normal', color: 'bg-gray-400' },
  { name: 'fire', displayName: 'Fire', color: 'bg-red-500' },
  { name: 'water', displayName: 'Water', color: 'bg-blue-500' },
  { name: 'grass', displayName: 'Grass', color: 'bg-green-500' },
  { name: 'electric', displayName: 'Electric', color: 'bg-yellow-500' },
  { name: 'ice', displayName: 'Ice', color: 'bg-blue-300' },
  { name: 'fighting', displayName: 'Fighting', color: 'bg-red-700' },
  { name: 'poison', displayName: 'Poison', color: 'bg-purple-500' },
  { name: 'ground', displayName: 'Ground', color: 'bg-yellow-700' },
  { name: 'flying', displayName: 'Flying', color: 'bg-indigo-300' },
  { name: 'psychic', displayName: 'Psychic', color: 'bg-pink-500' },
  { name: 'bug', displayName: 'Bug', color: 'bg-green-600' },
  { name: 'rock', displayName: 'Rock', color: 'bg-yellow-800' },
  { name: 'ghost', displayName: 'Ghost', color: 'bg-purple-700' },
  { name: 'dragon', displayName: 'Dragon', color: 'bg-indigo-700' },
  { name: 'dark', displayName: 'Dark', color: 'bg-gray-800' },
  { name: 'steel', displayName: 'Steel', color: 'bg-gray-500' },
  { name: 'fairy', displayName: 'Fairy', color: 'bg-pink-300' },
]
</script>
