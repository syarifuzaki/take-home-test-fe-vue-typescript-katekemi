<template>
  <div class="language-switcher">
    <select
      v-model="currentLocale"
      @change="changeLocale"
      class="bg-white border border-gray-300 rounded px-3 py-1 focus:outline-none focus:ring-2 focus:ring-blue-500 pr-8"
    >
      <option value="en">{{ t('language.en') }}</option>
      <option value="id">{{ t('language.id') }}</option>
    </select>
  </div>
</template>

<script setup lang="ts">
import { ref } from 'vue'
import { useI18n } from 'vue-i18n'

const { locale, t } = useI18n()
const currentLocale = ref(locale.value)

const changeLocale = () => {
  locale.value = currentLocale.value
  // Optionally save the locale preference to localStorage
  localStorage.setItem('userLocale', currentLocale.value)
}

// Initialize from localStorage if available
const savedLocale = localStorage.getItem('userLocale')
if (savedLocale) {
  locale.value = savedLocale
  currentLocale.value = savedLocale
}
</script>