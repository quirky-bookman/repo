import { createApp } from 'vue'
import './assets/main.css'
import { createRouter, createWebHistory } from 'vue-router'
import ui from '@nuxt/ui/vue-plugin'
import App from './App.vue'

const router = createRouter({
  history: createWebHistory(),
  routes: [{ path: '/:pathMatch(.*)*', component: App }],
})

const app = createApp(App)
app.use(router)
app.use(ui)
app.mount('#app')
