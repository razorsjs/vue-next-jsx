import { createRouter, createWebHistory, RouteRecordRaw} from 'vue-router'

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
    component: () => import(/* webpackChunkName: "functionalComponent" */'../pages/example/functionalComponent/index.vue')
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
  history: createWebHistory(),
  routes
})
