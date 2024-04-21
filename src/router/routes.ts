import type { RouteRecordRaw } from 'vue-router'

const baseRoutes: RouteRecordRaw[] = [
  {
    path: '',
    name: 'index',
    component: () => import('@/pages/index.vue'),
    meta: {}
  },
  {
    path: '/oauth/google',
    name: 'oauth-google',
    component: () => import('@/pages/oauth/google.vue'),
    meta: {}
  },
  {
    path: '/logout',
    name: 'logout',
    component: () => import('@/pages/logout.vue'),
    meta: {}
  }
]

const routes = [
  ...baseRoutes,
  // NOT FOUND
  {
    path: '/:pathMatch(.*)*',
    name: 'not-found',
    component: () => import('@/pages/error.vue')
  }
]

export default routes
