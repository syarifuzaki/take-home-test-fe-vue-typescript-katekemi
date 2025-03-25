<template>
  <div class="p-4 md:px-6">
    <h1 class="text-2xl font-bold mb-6 text-hashmicro-navy">Dashboard</h1>
    <p class="text-gray-600 mb-6">
      Welcome to the Dashboard. This is a simple dashboard template built with Vue 3 and
      Tailwind CSS.
    </p>
  </div>
</template>

<script setup lang="ts">
import { useI18n } from 'vue-i18n'
import { useCounterStore } from '@/stores/counter'

const { t } = useI18n()
const counter = useCounterStore()
</script>
