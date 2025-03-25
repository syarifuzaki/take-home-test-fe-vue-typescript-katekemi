<template>
  <!-- Mobile Nav Bar -->
  <div
    class="sticky top-0 z-10 md:hidden bg-primary-navy text-white p-4 flex justify-between items-center"
  >
    <div class="flex items-center">
      <button
        @click="props.toggleSidebar"
        class="mr-4 focus:outline-none rounded-full w-10 h-10 flex justify-center items-center hover:bg-gray-100/50 duration-300"
      >
        <i class="fa-solid fa-bars-staggered text-xl"></i>
      </button>
    </div>
    <div class="flex items-center gap-2">
      <a
        href="https://github.com/syarifuzaki/take-home-test-fe-vue-typescript-katekemi"
        target="_blank"
        class="bg-gray-50/10 hover:bg-gray-50/20 rounded-full w-10 h-10 flex items-center justify-center"
      >
        <i class="fa-brands fa-github text-xl"></i>
      </a>
      <div class="relative">
        <button
          class="bg-gray-50/10 hover:bg-gray-50/20 rounded-full w-auto h-10 flex items-center justify-center p-2 gap-2 text-sm"
        >
          <div
            class="w-7 h-7 rounded-full bg-primary-navy flex items-center justify-center text-white shrink-0 text-sm"
          >
            A
          </div>
          Admin User
          <i class="fa-solid fa-chevron-down text-sm mr-1"></i>
        </button>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import BaseIcon from '@/components/BaseIcon.vue'

const props = defineProps({
  toggleSidebar: Function,
})
</script>
