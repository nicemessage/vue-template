import Vue from 'vue';
import Router from 'vue-router';
import store from '@/store';
import { api } from '@/assets/js/common/api/ajax.js';
import Cookies from 'js-cookie';
import NProgress from 'nprogress';
import routes from './routerConfig';

const Layout = () => import('@/views/layouts/TopNav/index.vue');
// const Layout = () => import('@/views/layouts/LeftNav/index.vue');

Vue.use(Router);

const router = new Router({
  mode: 'history',
  base: process.env.BASE_URL,
  routes: [
    {
      path: '/',
      name: 'home',
      component: Layout,
      redirect: '/personal',
      children: [...routes],
    },
    {
      path: '*',
      name: 'error404',
      component: () => import('@/views/error/404.vue'),
    },
  ],
});

router.beforeEach(async (to, from, next) => {
  console.log(window.location);
  if (!Cookies.getJSON('sso.jd.com')) {
    window.location.href = `${process.env.VUE_APP_LOGIN + window.location.href}`;
    return false;
  } else {
    const authInfoMut = await api.post('/user');
    store.commit('authInfoMut', authInfoMut);
    const menuList = await api.get('routes');
    store.commit('routesMut', menuList);
    NProgress.start();
    next();
    return false;
  }
});
router.afterEach(() => {
  // 关闭进度条
  NProgress.done();
});

// cv以下代码解决路由地址重复的报错问题
const originalPush = Router.prototype.push;
Router.prototype.push = function push(location) {
  return originalPush.call(this, location).catch(err => err);
};

export default router;
