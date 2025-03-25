<!-- src/components/SkeletonLoader.vue -->
<template>
  <div v-if="type === 'table'" class="animate-pulse">
    <div class="h-10 bg-gray-200 mb-4 rounded"></div>
    <div v-for="i in rows" :key="i" class="h-12 bg-gray-200 mb-2 rounded"></div>
  </div>

  <div v-else-if="type === 'detail'" class="animate-pulse">
    <div class="h-8 bg-gray-200 w-1/3 mb-4 rounded"></div>
    <div class="h-4 bg-gray-200 w-full mb-3 rounded"></div>
    <div class="h-4 bg-gray-200 w-5/6 mb-3 rounded"></div>
    <div class="h-24 bg-gray-200 mb-4 rounded"></div>
    <div class="grid grid-cols-2 gap-4 mt-6">
      <div v-for="i in 6" :key="i">
        <div class="h-4 bg-gray-200 w-1/3 mb-2 rounded"></div>
        <div class="h-8 bg-gray-200 rounded"></div>
      </div>
    </div>
  </div>

  <div v-else-if="type === 'form'" class="animate-pulse">
    <div v-for="i in fields" :key="i" class="mb-4">
      <div class="h-4 bg-gray-200 w-1/4 mb-2 rounded"></div>
      <div class="h-10 bg-gray-200 rounded"></div>
    </div>
    <div class="h-10 bg-gray-200 w-1/4 mt-6 rounded"></div>
  </div>
</template>

<script setup lang="ts">
interface Props {
  type: 'table' | 'detail' | 'form'
  rows?: number
  fields?: number
}

withDefaults(defineProps<Props>(), {
  rows: 5,
  fields: 5,
})
</script>
