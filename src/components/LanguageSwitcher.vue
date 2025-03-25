<template>
  <div class="relative" v-click-away="closeDropdown">
    <button
      @click="toggleDropdown"
      class="flex items-center gap-2 px-4 py-2 bg-gray-100 border rounded-full hover:bg-gray-200 focus:outline-none focus:ring-2 focus:ring-blue-500"
      aria-haspopup="true"
      :aria-expanded="isOpen"
    >
      <img
        :src="selectedLanguage.image"
        :alt="selectedLanguage.flag"
        class="w-auto h-4 object-contain mx-auto"
        loading="lazy"
      />
      <span class="hidden sm:block"
        >{{ t(`language.${selectedLanguage.code}`) }} ({{ selectedLanguage.flag }})</span
      >
      <svg
        class="w-4 h-4 transition-transform"
        :class="{ 'rotate-180': isOpen }"
        fill="none"
        stroke="currentColor"
        viewBox="0 0 24 24"
      >
        <path
          stroke-linecap="round"
          stroke-linejoin="round"
          stroke-width="2"
          d="M19 9l-7 7-7-7"
        />
      </svg>
    </button>

    <transition
      enter-active-class="transition duration-100 ease-out"
      enter-from-class="transform scale-95 opacity-0"
      enter-to-class="transform scale-100 opacity-100"
      leave-active-class="transition duration-75 ease-in"
      leave-from-class="transform scale-100 opacity-100"
      leave-to-class="transform scale-95 opacity-0"
    >
      <ul
        v-show="isOpen"
        class="absolute justify-left right-0 z-10 w-64 py-1 mt-2 origin-top-right bg-white rounded-md shadow-lg ring-1 ring-black ring-opacity-5 focus:outline-none"
      >
        <li v-for="lang in supportedLocales" :key="lang.code" class="hover:bg-gray-100">
          <button
            @click="setLanguage(lang.code)"
            class="flex items-center w-full px-4 py-2 space-x-2"
          >
            <img
              :src="lang.image"
              :alt="lang.flag"
              class="w-auto h-4 object-contain mx-auto"
              loading="lazy"
            />
            <span>{{ t(`language.${lang.code}`) }} ({{ lang.flag }})</span>
          </button>
        </li>
      </ul>
    </transition>
  </div>
</template>

<script setup lang="ts">
import { ref, watch, onMounted } from 'vue'
import { useI18n } from 'vue-i18n'

const { locale, t } = useI18n()
const isOpen = ref(false)

interface Language {
  code: string
  flag: string
  image: string
}

const supportedLocales: Language[] = [
  {
    code: 'en',
    flag: '🇺🇸',
    image: 'https://hatscripts.github.io/circle-flags/flags/gb.svg',
  },
  {
    code: 'id',
    flag: '🇮🇩',
    image: 'https://hatscripts.github.io/circle-flags/flags/id.svg',
  },
]

const currentLocale = ref(locale.value)
const selectedLanguage = ref(
  supportedLocales.find((lang) => lang.code === currentLocale.value) ||
    supportedLocales[0]
)

// Initialize from localStorage
const savedLocale = localStorage.getItem('userLocale')
if (savedLocale) {
  currentLocale.value = savedLocale
  locale.value = savedLocale
}

watch(
  currentLocale,
  (newVal) => {
    locale.value = newVal
    localStorage.setItem('userLocale', newVal)
    const lang = supportedLocales.find((l) => l.code === newVal)
    if (lang) selectedLanguage.value = lang
  },
  {
    immediate: true,
  }
)

const toggleDropdown = () => {
  isOpen.value = !isOpen.value
}

const closeDropdown = () => {
  isOpen.value = false
}

const setLanguage = (langCode: string) => {
  currentLocale.value = langCode
  closeDropdown()
}
</script>
