import './index.css'
import { createApp, FunctionalComponent } from 'vue'
// @ts-ignore
import abutton from './abutton.vue'
import App from './app.vue'
import {router} from './router'

const app = createApp(App)
app.component('a-button', abutton)
app.use(router)
app.mount('#app')
