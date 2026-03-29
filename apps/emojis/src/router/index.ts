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
        redirect: '/emojis',
        children: [
          {
            path: 'emojis',
            name: 'emojis',
            component: () => import('@/pages/emojis.vue'),
            meta: {}
          }
        ]
      },
      {
        path: '/oauth/google',
        name: 'oauth-google',
        component: () => import('@/pages/oauth/google.vue'),
        meta: {}
      },
      {
        path: '/oauth/slack',
        name: 'oauth-slack',
        component: () => import('@/pages/oauth/slack.vue'),
        meta: {}
      },
      {
        path: '/logout',
        name: 'logout',
        component: () => import('@/pages/logout.vue'),
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
