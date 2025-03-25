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
    <div class="p-0 bg-white h-main-content">
      <app-topbar
        @toggle-sidebar="toggleSidebar"
        @toggle-sidebar-desktop="toggleSidebarDesktop"
        @toggle-profile-menu="toggleProfileMenu"
      />
      <router-view />
    </div>
    <app-footer />
  </main>
  <!-- <div class="min-h-screen bg-gray-100">
    <header class="bg-white shadow">
      <nav class="container mx-auto px-4 py-4 flex justify-between items-center">
        <div class="flex space-x-6">
          <router-link :to="{ name: 'home' }" class="text-gray-800 hover:text-blue-600">
            {{ t('nav.home') }}
          </router-link>
          <router-link :to="{ name: 'about' }" class="text-gray-800 hover:text-blue-600">
            {{ t('nav.about') }}
          </router-link>
        </div>
        <LanguageSwitcher />
      </nav>
    </header>
    
    <main class="container mx-auto px-4 py-8">
      <router-view />
    </main>
    
    <footer class="bg-white shadow-inner py-4">
      <div class="container mx-auto px-4 text-center text-gray-600">
        &copy; {{ new Date().getFullYear() }} My Multilingual App
      </div>
    </footer>
  </div> -->
</template>

<script setup lang="ts">
import { ref } from 'vue'
import { useI18n } from 'vue-i18n'
import AppFooter from '@/components/AppFooter.vue'
import AppSidebar from '@/components/AppSidebar.vue'
import AppTopbar from '@/components/AppTopbar.vue'
import LanguageSwitcher from '@/components/LanguageSwitcher.vue'

const { t } = useI18n()

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
