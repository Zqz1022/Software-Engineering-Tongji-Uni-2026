import { createRouter, createWebHistory } from 'vue-router'
import { useSessionStore } from '../modules/auth/session'

export const router = createRouter({
  history: createWebHistory(),
  routes: [
    { path: '/login', name: 'login', component: () => import('../modules/auth/LoginPage.vue') },
    {
      path: '/',
      name: 'home',
      component: () => import('../modules/forum/BoardsPage.vue'),
      meta: { requiresAuth: true },
    },
    { path: '/:pathMatch(.*)*', redirect: '/' },
  ],
})

router.beforeEach(async (to) => {
  if (!to.meta.requiresAuth) return
  const session = useSessionStore()
  try {
    await session.restore()
  } catch {
    return { name: 'login' }
  }
  if (!session.user) return { name: 'login' }
})
