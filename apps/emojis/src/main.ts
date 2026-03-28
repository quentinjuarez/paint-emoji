import '@paint-emoji/ui/style.css'
import App from './App.vue'
import { createApp } from 'vue'
import initRouter from './router'
import { initPinia, vClickOutside } from '@paint-emoji/shared'

const app = createApp(App)

const router = initRouter()
app.use(router)

const pinia = initPinia(router)
app.use(pinia)

app.directive('click-outside', vClickOutside)

app.mount('#app')
