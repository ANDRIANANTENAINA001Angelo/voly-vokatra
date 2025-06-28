// src/router/index.js
import { createRouter, createWebHistory } from 'vue-router';
import AuthPage from "../pages/AuthPage.vue";
import Dashboard from "../pages/Dashboard.vue";
import Profil from "../pages/Profil.vue";

const routes = [
  { path: '/', name: 'auth', component: AuthPage },           
  { path: '/dashboard', name: 'dashboard', component: Dashboard, meta: { requiresAuth: true } }, 
  { path: '/profil', name: 'profil', component: Profil, meta: { requiresAuth: true } }, 
];

const router = createRouter({
  history: createWebHistory(),
  routes
});

router.beforeEach((to, from, next) => {
  const token = localStorage.getItem('token');

  if (to.meta.requiresAuth && !token) {
    next({ name: 'auth' });
  } else {
    next();
  }
});


export default router;
