import { createRouter, createWebHistory } from 'vue-router'
import routes from './routes'
import globalMiddleware from '@/middlewares/global'

export default () => {
  const router = createRouter({
    history: createWebHistory(__BASE_URL__),
    routes: routes
  })

  router.beforeEach(globalMiddleware)

  return router
}
