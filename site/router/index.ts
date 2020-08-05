import { createRouter, createWebHistory } from 'vue-router'

export const routes: any = [
  {
    path: '/plaintext',
    name: 'Plain Text',
    component: () => import('../pages/plaintext/index.vue')
  },
  {
    path: '/new',
    name: 'Plain Text',
    component: () => import('../pages/plaintext/index.new.vue')
  },
  {
    path: '/',
    redirect: 'plaintext'
  },
]

export const router = createRouter({
  history: createWebHistory(),
  routes
})
