import { createRouter, createWebHistory, RouteRecordRaw} from 'vue-router'

export const routes: RouteRecordRaw[] = [
  {
    path: '/example',
    name: 'example',
    component: () => import('../pages/example/index.vue')
  },
  {
    path: '/example/component',
    name: 'component',
    component: () => import('../pages/example/componentExample/index.vue')
  },
  {
    path: '/benchmark',
    name: 'benchmark',
    component: () => import('../pages/benchmark/index.vue')
  },
  {
    path: '/benchmark/jsx',
    name: 'benchmarkJsx',
    component: () => import('../pages/benchmark/jsx.vue')
  },
  // {
  //   path: '/example/functionalComponent',
  //   name: 'functionalComponent',
  //   component: () => import('../pages/example/functionalComponent/index.vue')
  // },
  {
    path: '/',
    redirect: 'example'
  },
]

export const router = createRouter({
  history: createWebHistory(),
  routes
})
