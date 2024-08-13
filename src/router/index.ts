import Vue from 'vue'
import VueRouter, { RouteConfig } from 'vue-router'
import AuthPage from '../views/AuthPage.vue'
import MainPage from '../views/MainPage.vue'

Vue.use(VueRouter)

const routes: Array<RouteConfig> = [
  {
    path: '/login',
    name: 'login',
    component: AuthPage,
    meta: { requiresAuth: false }
  },
  {
    path: '/',
    name: 'main',
    component: MainPage,
    meta: { requiresAuth: true }
  }
]

const router = new VueRouter({
  mode: 'history',
  base: process.env.BASE_URL,
  routes
})

router.beforeEach((to, from, next) => {
  const isAuthenticated = localStorage.getItem('token') !== null;

  if (to.meta?.requiresAuth && !isAuthenticated) {
    next('/login');
  } else if (to.path === '/login' && isAuthenticated) {
    next('/');
  } else {
    next();
  }
})

export default router
