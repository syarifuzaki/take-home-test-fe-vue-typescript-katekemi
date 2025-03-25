import { defineStore } from 'pinia'
import { ref } from 'vue'

export const useLangStore = defineStore('lang', () => {
  const currentLocale = ref(localStorage.getItem('userLocale') || 'en')
  
  function setLocale(locale: string) {
    currentLocale.value = locale
    localStorage.setItem('userLocale', locale)
  }
  
  return { 
    currentLocale,
    setLocale
  }
})