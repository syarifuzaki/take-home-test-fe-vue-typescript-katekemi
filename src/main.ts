import { createApp } from 'vue'
import { createI18n } from 'vue-i18n'
import App from './App.vue'
import './style.css'
import router from './router'
import pinia from './plugins/pinia-persistence'
import VueClickAway  from 'vue3-click-away'
import Vue3Toastify, { type ToastContainerOptions } from 'vue3-toastify'

// Import translations
import en from './locales/en.json'
import id from './locales/id.json'
// Add other languages as needed

// Configure i18n
const i18n = createI18n({
  legacy: false, // Use Composition API
  locale: 'en', // Set default locale
  fallbackLocale: 'en',
  messages: {
    en,
    id,
    // Add other languages as needed
  }
})

// Create and mount the app
const app = createApp(App)

// Use plugins
app.use(pinia)
app.use(router)
app.use(i18n)
app.use(VueClickAway)
app.use(Vue3Toastify, {
  autoClose: 3000,
} as ToastContainerOptions)

app.mount('#app')