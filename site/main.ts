///<reference path="../node_modules/vue-tsx-support/enable-check.d.ts"/>
///<reference path="../node_modules/vue-tsx-support/options/enable-html-attrs.d.ts"/>

import './index.css'
import { createApp } from 'vue'
// @ts-ignore
import abutton from './abutton.vue'
import App from './app.vue'
import {router} from './router'

const app = createApp(App)
app.component('a-button', abutton)
app.use(router)
app.mount('#app')
