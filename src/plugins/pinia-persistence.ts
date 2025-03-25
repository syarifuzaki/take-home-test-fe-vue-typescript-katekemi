import { createPinia } from 'pinia'
import piniaPluginPersistedstate from 'pinia-plugin-persistedstate'

// Create Pinia instance
const pinia = createPinia()

// Add persistence plugin
pinia.use(piniaPluginPersistedstate)

export default pinia