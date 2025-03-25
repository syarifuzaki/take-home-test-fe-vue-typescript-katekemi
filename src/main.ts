import { createApp } from 'vue'
import { createPinia } from 'pinia'
import { createI18n } from 'vue-i18n'
import App from './App.vue'
import './style.css'
import router from './router'

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
app.use(createPinia())
app.use(router)
app.use(i18n)

app.mount('#app')