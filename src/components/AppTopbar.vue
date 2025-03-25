<template>
  <!-- Navbar Content -->
  <div
    class="flex justify-between items-center p-4 sticky top-0 bg-primary-navy md:bg-gray-50 z-10 shadow-md"
  >
    <button
      @click="emit('toggleSidebar')"
      class="mr-4 focus:outline-none rounded-full w-10 h-10 flex md:hidden justify-center items-center bg-gray-200 hover:bg-gray-300 duration-300"
    >
      <BaseIcon
        name="fa6-solid:bars-staggered"
        size="20"
        color=""
        class="text-primary-navy"
      />
    </button>
    <button
      @click="emit('toggleSidebarDesktop')"
      class="mr-4 focus:outline-none rounded-full w-10 h-10 hidden md:flex justify-center items-center bg-gray-200 hover:bg-gray-300 duration-300"
    >
      <BaseIcon
        name="fa6-solid:bars-staggered"
        size="20"
        color=""
        class="text-primary-navy"
      />
    </button>

    <div class="flex items-center gap-2">
      <LanguageSwitcher />
      <a
        href="https://github.com/syarifuzaki/take-home-test-fe-vue-typescript-katekemi"
        target="_blank"
        class="bg-gray-200 hover:bg-gray-300 rounded-full w-10 h-10 flex items-center justify-center"
      >
        <BaseIcon name="fa6-brands:github" size="20" color="" class="text-primary-navy" />
      </a>
      <div class="relative">
        <button
          @click="emit.toggleProfileMenu"
          class="bg-gray-200 hover:bg-gray-300 rounded-full w-auto h-10 flex items-center justify-center p-2 gap-2 border text-sm"
        >
          <div
            class="w-7 h-7 rounded-full bg-primary-navy flex items-center justify-center text-white shrink-0 text-sm"
          >
            A
          </div>
          Admin User
          <BaseIcon name="fa6-solid:angle-down" size="16" class="mr-1" />
        </button>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import BaseIcon from '@/components/BaseIcon.vue'
import LanguageSwitcher from '@/components/LanguageSwitcher.vue'

const emit = defineEmits(['toggleSidebar', 'toggleSidebarDesktop', 'toggleProfileMenu'])
</script>
