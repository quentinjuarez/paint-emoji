import { createApp } from 'vue'
import './style.css'
import App from './App.vue'
import initRouter from './router'
import initPinia from './stores/plugin'
import initI18n from './i18n'
import vClickOutside from './plugins/vClickOutside'

const app = createApp(App)

const router = initRouter()
app.use(router)

const pinia = initPinia(router)

app.use(pinia)

const i18n = initI18n()
app.use(i18n)

app.directive('click-outside', vClickOutside)

app.mount('#app')
