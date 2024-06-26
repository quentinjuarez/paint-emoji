import { createPinia, Pinia } from 'pinia'
import piniaPluginPersistedstate from 'pinia-plugin-persistedstate'
import { PiniaSharedState } from 'pinia-shared-state'
import { markRaw } from 'vue'
import type { Router } from 'vue-router'
import initServices from '@/plugins/services'

export default function (router: Router): Pinia {
  const pinia = createPinia()

  pinia.use(({ store }) => {
    store.$router = markRaw(router)
    store.$api = initServices()
  })

  pinia.use(piniaPluginPersistedstate)
  pinia.use(PiniaSharedState({}))

  return pinia
}
