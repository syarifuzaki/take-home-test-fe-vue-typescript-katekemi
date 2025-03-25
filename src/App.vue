<template>
  <app-sidebar
    :sidebar-open="sidebarOpen"
    :sidebar-open-desktop="sidebarOpenDesktop"
    @toggle-sidebar="toggleSidebar"
  />
  <main
    :class="[
      'transition-all duration-300 ease-in-out',
      sidebarOpenDesktop ? (sidebarOpen ? 'md:ml-64' : 'ml-0 md:ml-64') : 'md:ml-0',
    ]"
  >
    <div class="p-0 bg-gray-50 h-main-content">
      <app-topbar
        @toggle-sidebar="toggleSidebar"
        @toggle-sidebar-desktop="toggleSidebarDesktop"
        @toggle-profile-menu="toggleProfileMenu"
      />
      <router-view />
    </div>
    <app-footer />
  </main>
</template>

<script setup lang="ts">
import { ref } from 'vue'
import AppFooter from '@/components/AppFooter.vue'
import AppSidebar from '@/components/AppSidebar.vue'
import AppTopbar from '@/components/AppTopbar.vue'

const sidebarOpen = ref(false)
const sidebarOpenDesktop = ref(true)
const profileMenuOpen = ref(false)

function toggleSidebar() {
  sidebarOpen.value = !sidebarOpen.value
}

function toggleSidebarDesktop() {
  sidebarOpenDesktop.value = !sidebarOpenDesktop.value
}

function toggleProfileMenu() {
  profileMenuOpen.value = !profileMenuOpen.value
}
</script>
