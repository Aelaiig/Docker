import Vue from 'vue';
import Router from 'vue-router';

import Home from './views/Home.vue';
import SignUp from './views/SignUp.vue';
import SignUpOmniauth from './views/SignUpOmniauth.vue';
import SignIn from './views/SignIn.vue';
import ResetPassword from './views/ResetPassword.vue';

Vue.use(Router);

const router = new Router({
  mode: 'history',
  base: process.env.BASE_URL,
  routes: [
    {
      path: '/',
      name: 'home',
      component: Home,
      meta: {
        authRequire: false,
      },
    },
    {
      path: '/signup',
      name: 'signup',
      component: SignUp,
    },
    {
      path: '/signupOmniauth',
      name: 'signupOmniauth',
      component: SignUpOmniauth,
    },
    {
      path: '/signin',
      name: 'signin',
      component: SignIn,
    },
    {
      path: '/resetPassword/:authKey',
      name: 'resetPassword',
      component: ResetPassword,
    },
  ],
});

router.beforeEach((to, from, next) => {
  if (to.meta.authRequire === true) {
    const token = localStorage.getItem('user-token');
    if (!token) {
      next('/signin');
      return;
    }
  }
  next();
});

export default router;
