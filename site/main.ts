///<reference path="../node_modules/vue-tsx-support/enable-check.d.ts"/>
///<reference path="../node_modules/vue-tsx-support/options/allow-unknown-props.d.ts"/>
///<reference path="../node_modules/vue-tsx-support/options/enable-html-attrs.d.ts"/>
///<reference path="../node_modules/vue-tsx-support/options/enable-vue-router.d.ts"/>

import './index.css'
import { createApp } from 'vue'
import abutton from './components/abutton.vue'
import App from './app.vue'
import {router} from './router'
import logMounted from './directives/logMounted';

const app = createApp(App)
// global component
app.component('a-button', abutton)
app.directive('log-mounted', logMounted)
app.use(router)
app.mount('#app')
