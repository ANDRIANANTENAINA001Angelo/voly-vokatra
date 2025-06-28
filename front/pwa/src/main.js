// import './assets/main.css'

import { createApp } from 'vue'
import App from './App.vue'
import router from './router/index';
import { registerSW } from 'virtual:pwa-register'

const updateSW = registerSW({
  onNeedRefresh() {
    if (confirm("Nouvelle version dispo ! Recharger ?")) {
      updateSW(true)
    }
  },
  onOfflineReady() {
    console.log("⚡ Prêt pour usage hors ligne !");
  }
})


createApp(App)
.use(router)
.mount('#app')
