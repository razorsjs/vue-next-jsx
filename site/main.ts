import './index.css'
import { createApp, FunctionalComponent } from 'vue'
// @ts-ignore
import App from './app'
import {router} from './router'
const app = createApp(App)
import abutton from './abutton.vue'
app.component('a-button', abutton)
app.use(router)
app.mount('#app')
