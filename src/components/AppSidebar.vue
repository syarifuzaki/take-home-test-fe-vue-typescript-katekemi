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
            <a
              href="#"
              :class="[
                'flex items-center p-2 rounded transition-colors',
                activeView === 'dashboard'
                  ? 'bg-primary-orange text-white hover:bg-orange-500'
                  : 'hover:bg-gray-700',
              ]"
            >
              <i class="fas fa-home mr-3"></i>
              <span>Dashboard</span>
            </a>
          </div>

          <!-- <div class="mb-4">
            <p class="text-gray-400 text-xs uppercase mb-2">Data Management</p>
            <a
              href="#"
              @click="setActiveView('employees')"
              :class="[
                'flex items-center p-2 rounded transition-colors',
                activeView === 'employees'
                  ? 'bg-primary-orange text-white hover:bg-orange-500'
                  : 'hover:bg-gray-700',
              ]"
            >
              <i class="fas fa-users mr-3"></i>
              <span>Employees</span>
            </a>
          </div> -->
        </div>

        <div class="mt-8">
          <a
            href="#"
            class="flex items-center p-2 rounded hover:bg-red-500/20 text-red-300"
          >
            <i class="fas fa-sign-out-alt mr-3"></i>
            <span>Logout</span>
          </a>
        </div>
      </nav>
    </div>
  </aside>
</template>

<script setup lang="ts">
import { ref } from 'vue'
import BaseIcon from '@/components/BaseIcon.vue'

const activeView = ref('dashboard')
const props = defineProps({
  sidebarOpen: Boolean,
  sidebarOpenDesktop: Boolean,
})

const emit = defineEmits(['toggleSidebar'])
</script>
