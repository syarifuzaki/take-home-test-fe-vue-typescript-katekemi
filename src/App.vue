<template>
  <div class="min-h-screen bg-gray-100">
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
  </div>
</template>

<script setup lang="ts">
import { useI18n } from 'vue-i18n'
import LanguageSwitcher from './components/LanguageSwitcher.vue'

const { t } = useI18n()
</script>