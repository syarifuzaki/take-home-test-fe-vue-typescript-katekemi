import { createRouter, createWebHistory } from 'vue-router'
import DashboardView from '@/views/DashboardView.vue'
import BerryListView from '@/views/BerryListView.vue'
import ProductListView from '@/views/ProductListView.vue'
import ProductDetailView from '@/views/ProductDetailView.vue'
import ProductFormView from '@/views/ProductFormView.vue'
import PokemonListView from '@/views/PokemonListView.vue'

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes: [
    {
      path: '/',
      name: 'dashboard',
      component: DashboardView
    },
    {
      path: '/products',
      name: 'products',
      component: ProductListView
    },
    {
      path: '/products/:id',
      name: 'product-detail',
      component: ProductDetailView
    },
    {
      path: '/products/add',
      name: 'product-add',
      component: ProductFormView
    },
    {
      path: '/products/edit/:id',
      name: 'product-edit',
      component: ProductFormView
    },
    {
      path: '/berries',
      name: 'berries',
      component: BerryListView
    },
    {
      path: '/pokemon',
      name: 'pokemon',
      component: PokemonListView
    }
  ]
})

export default router