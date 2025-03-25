<template>
  <div class="home py-8">
    <div class="max-w-3xl mx-auto bg-white shadow-md rounded-lg p-8">
      <h1 class="text-3xl font-bold text-gray-800 mb-4">{{ t('home.title') }}</h1>
      <p class="text-gray-600 mb-6">{{ t('home.description') }}</p>
      <button class="bg-blue-600 hover:bg-blue-700 text-white font-medium py-2 px-4 rounded-md transition duration-300">
        {{ t('home.button') }}
      </button>
      
      <div class="mt-8 border-t pt-6">
        <h2 class="text-xl font-semibold mb-4">Counter Example with Pinia</h2>
        <div class="flex items-center space-x-4">
          <button @click="counter.decrement" class="bg-red-500 hover:bg-red-600 text-white py-1 px-3 rounded">-</button>
          <span class="text-xl">{{ counter.count }}</span>
          <button @click="counter.increment" class="bg-green-500 hover:bg-green-600 text-white py-1 px-3 rounded">+</button>
        </div>
        <div class="mt-2 text-gray-600">
          Double count: {{ counter.doubleCount }}
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { useI18n } from 'vue-i18n'
import { useCounterStore } from '../stores/counter'

const { t } = useI18n()
const counter = useCounterStore()
</script>