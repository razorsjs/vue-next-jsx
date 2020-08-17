import { createRouter, createWebHashHistory, RouteRecordRaw} from 'vue-router'
import {defineAsyncComponent} from 'vue'

export const routes: RouteRecordRaw[] = [
  {
    path: '/example',
    name: 'example',
    component: () => import(/* webpackChunkName: "example" */ '../pages/example/index.vue')
  },
  {
    path: '/example/component',
    name: 'component',
    component: () => import(/* webpackChunkName: "componentExample" */'../pages/example/componentExample/index.vue')
  },
  {
    path: '/example/functionalComponent',
    name: 'functionalComponent',
    component: defineAsyncComponent(() => import(/* webpackChunkName: "functionalComponent" */'../pages/example/functionalComponent/index.vue'))
  },
  {
    path: '/example/cssVars',
    name: 'cssVars',
    component: () => import(/* webpackChunkName: "cssVars" */'../pages/example/cssVars/index.vue')
  },
  {
    path: '/example/dynamicComponent',
    name: 'dynamicComponent',
    component: () => import(/* webpackChunkName: "dynamicComponent" */'../pages/example/dynamicComponent/index.vue')
  },
  {
    path: '/example/directive',
    name: 'directive',
    component: () => import(/* webpackChunkName: "directive" */'../pages/example/directive/index.vue')
  },
  {
    path: '/example/transition',
    name: 'transition',
    component: () => import(/* webpackChunkName: "transition" */'../pages/example/transition/index.vue')
  },
  {
    path: '/example/listTransition',
    name: 'listTransition',
    component: () => import(/* webpackChunkName: "listTransition" */'../pages/example/transition/listTransition.vue')
  },
  {
    path: '/benchmark',
    name: 'benchmark',
    component: () => import(/* webpackChunkName: "benchmark" */'../pages/benchmark/index.vue')
  },
  {
    path: '/benchmark/jsx',
    name: 'benchmarkJsx',
    component: () => import(/* webpackChunkName: "benchmark-jsx" */'../pages/benchmark/jsx.vue')
  },
  {
    path: '/',
    redirect: 'example'
  },
]

export const router = createRouter({
  history: createWebHashHistory(),
  routes
})
