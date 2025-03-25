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
          <h1 class="text-2xl font-medium text-center border border-white py-1.5 px-10">
            KATEKIMA
          </h1>
        </div>
      </div>

      <nav class="p-4 grow flex flex-col w-full justify-between">
        <div class="grow">
          <div class="mb-4">
            <p class="text-gray-400 text-xs uppercase mb-2">Dashboard</p>
            <router-link
              :to="{ name: 'dashboard' }"
              :class="[
                'flex items-center p-2 rounded transition-colors',
                currentRoute === 'home'
                  ? 'bg-primary-orange text-white hover:bg-orange-500'
                  : 'hover:bg-gray-700',
              ]"
            >
              <BaseIcon name="fa6-solid:house" size="20" color="white" class="mr-3" />
              <span>Dashboard</span>
            </router-link>
          </div>

          <div class="mb-4">
            <p class="text-gray-400 text-xs uppercase mb-2">Data Management</p>
            <router-link
              :to="{ name: 'berries' }"
              :class="[
                'flex items-center p-2 rounded transition-colors',
                currentRoute === 'berries' ||
                currentRoute === 'berry-detail' ||
                currentRoute === 'berry-add' ||
                currentRoute === 'berry-edit'
                  ? 'bg-primary-orange text-white hover:bg-orange-500'
                  : 'hover:bg-gray-700',
              ]"
            >
              <span>Berries</span>
            </router-link>
          </div>
        </div>

        <div class="mt-8">
          <a
            href="#"
            class="flex items-center p-2 rounded hover:bg-red-500/20 text-red-300"
          >
            <BaseIcon name="fa6-solid:arrow-right-from-bracket" size="20" class="mr-3" />
            <span>Logout</span>
          </a>
        </div>
      </nav>
    </div>
  </aside>
</template>

<script setup lang="ts">
import { ref, computed } from 'vue'
import { useRoute } from 'vue-router'
import BaseIcon from '@/components/BaseIcon.vue'

const activeView = ref('dashboard')
const props = defineProps({
  sidebarOpen: Boolean,
  sidebarOpenDesktop: Boolean,
})

const emit = defineEmits(['toggleSidebar'])
const route = useRoute()
const currentRoute = computed(() => route.name)
</script>
