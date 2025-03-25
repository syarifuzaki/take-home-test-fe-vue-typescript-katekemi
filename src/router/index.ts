// src/router/index.ts
import { createRouter, createWebHistory } from 'vue-router'
import DashboardView from '@/views/DashboardView.vue'
import BerryListView from '@/views/BerryListView.vue'
import BerryDetailView from '@/views/BerryDetailView.vue'
import BerryFormView from '@/views/BerryFormView.vue'

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes: [
    {
      path: '/',
      name: 'dashboard',
      component: DashboardView
    },
    {
      path: '/berries',
      name: 'berries',
      component: BerryListView
    },
    {
      path: '/berries/:id',
      name: 'berry-detail',
      component: BerryDetailView
    },
    {
      path: '/berries/add',
      name: 'berry-add',
      component: BerryFormView
    },
    {
      path: '/berries/edit/:id',
      name: 'berry-edit',
      component: BerryFormView
    }
  ]
})

export default router