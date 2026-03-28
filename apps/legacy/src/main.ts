import '@paint-emoji/ui/style.css'
import 'floating-vue/dist/style.css'
import App from './App.vue'
import { createApp } from 'vue'
import FloatingVue from 'floating-vue'
import initRouter from './router'
import { initPinia } from '@paint-emoji/shared'

const app = createApp(App)

const router = initRouter()
app.use(router)

const pinia = initPinia(router)
app.use(pinia)
app.use(FloatingVue)

app.mount('#app')
