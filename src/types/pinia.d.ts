import type { ApiInterface } from '@/plugins/services'
import type { Router } from 'vue-router'

declare module 'pinia' {
  export interface PiniaCustomProperties {
    $router: Router
    $api: ApiInterface
  }
}
