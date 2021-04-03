import Vue from 'vue'
import Router from 'vue-router'

import Home from './views/Home.vue'
import Login from './views/Login.vue'
import Dashboard from "./views/Dashboard";

import authService from './service/authService'
import Register from "./views/Register";

Vue.use(Router);
const router = new Router({
  mode: 'history',
  base: process.env.BASE_URL,
  routes: [
    {
      path: '/',
      name: 'home',
      redirect: 'Dashboard',
      component: Home,
      children: [
        {
          path: 'dashboard',
          name: 'Dashboard',
          component: Dashboard
        },
      ]
    },
    { path: '/login', name: 'login', component: Login },
    { path: '/register', name: 'register', component: Register }
  ]
});

router.beforeEach((to, from, next) => {

  if (!authService.isUserAuthenticated() && to.fullPath !== '/login' && to.fullPath !== '/register') {
    router.app.$router.push('/login');
    return;
  }

  next();
});
export default router;
