import { createRouter, createWebHistory } from 'vue-router'
import HomeView from '../views/HomeView.vue'
import CityViewVue from '@/views/CityView.vue'

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes: [
    {
      path: '/',
      name: 'home',
      component: HomeView
    },
    {
      path: "/weather/:state/:city",
      name: "cityView",
      component: CityViewVue,
      meta: {
        title: "Weather",
      },
    },

  ]
})

export default router
