<template>
  <!-- Navbar Content -->
  <div class="flex justify-between items-center p-4 sticky top-0 bg-gray-100 z-10">
    <button
      @click="emit('toggleSidebar')"
      class="mr-4 focus:outline-none rounded-full w-10 h-10 flex md:hidden justify-center items-center hover:bg-gray-200 duration-300"
    >
      <i class="fa-solid fa-bars-staggered text-xl"></i>
    </button>
    <button
      @click="emit('toggleSidebarDesktop')"
      class="mr-4 focus:outline-none rounded-full w-10 h-10 hidden md:flex justify-center items-center hover:bg-gray-200 duration-300"
    >
      <i class="fa-solid fa-bars-staggered text-xl"></i>
    </button>

    <div class="flex items-center gap-2">
      <a
        href="https://github.com/syarifuzaki/frontend-test-hashmicro"
        target="_blank"
        class="bg-gray-200 hover:bg-gray-300 rounded-full w-10 h-10 flex items-center justify-center"
      >
        <i class="fa-brands fa-github text-xl"></i>
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
          <i class="fa-solid fa-chevron-down text-sm mr-1"></i>
        </button>
        <!-- <div
          v-if="showProfileMenu"
          class="absolute right-0 z-10 mt-2 w-48 origin-top-right rounded-md bg-white ring-1 shadow-lg ring-black/5 focus:outline-hidden"
        >
          <div class="py-1">
            <button
              type="button"
              class="flex items-center gap-4 w-full px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
              @click="showProfileModal = true"
            >
              <i class="fa-solid fa-user text-sm"></i>
              User Profile
            </button>
            <button
              type="button"
              class="flex items-center gap-4 w-full px-4 py-2 text-left text-sm text-gray-700 hover:bg-red-50 hover:text-primary-red"
            >
              <i class="fas fa-sign-out-alt text-sm"></i>
              Logout
            </button>
          </div>
        </div> -->
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
// const props = defineProps({
// })
const emit = defineEmits(['toggleSidebar', 'toggleSidebarDesktop', 'toggleProfileMenu'])
</script>
