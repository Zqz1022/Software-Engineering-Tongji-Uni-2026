import { createRouter, createWebHistory } from 'vue-router'
import { useSessionStore } from '../modules/auth/session'

export const router = createRouter({
  history: createWebHistory(),
  routes: [
    { path: '/login', name: 'login', component: () => import('../modules/auth/LoginPage.vue') },
    {
      path: '/',
      component: () => import('../layouts/AppLayout.vue'),
      meta: { requiresAuth: true },
      children: [
        { path: '', name: 'home', component: () => import('../modules/forum/PlazaPage.vue') },
        { path: 'chat', name: 'chat', component: () => import('../modules/chat/ChatPage.vue') },
        { path: 'vip', name: 'vip', component: () => import('../modules/membership/VipPage.vue') },
        {
          path: 'account',
          name: 'account',
          component: () => import('../modules/user/AccountPage.vue'),
        },
      ],
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
