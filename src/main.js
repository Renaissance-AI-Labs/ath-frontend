import './assets/main.css'

import { createApp } from 'vue'
import App from './App.vue'
import router from './router'

// Log environment variables on startup
console.log("Application starting with environment:", import.meta.env);


const app = createApp(App)

app.use(router)

app.mount('#app')
