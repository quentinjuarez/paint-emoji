import { createRouter, createWebHistory } from 'vue-router'

export default () => {
  const router = createRouter({
    history: createWebHistory(),
    routes: [
      {
        path: '/',
        name: 'index',
        component: () => import('@/pages/index.vue'),
        meta: {},
        redirect: '/generate'
      },
      {
        path: '/generate',
        name: 'generate',
        component: () => import('@/pages/generate.vue'),
        meta: {}
      },
      {
        path: '/:pathMatch(.*)*',
        name: 'not-found',
        component: () => import('@/pages/error.vue')
      }
    ]
  })

  return router
}
