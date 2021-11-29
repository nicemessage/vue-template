import Vue from 'vue';
import ElementUI from 'element-ui';
import moment from 'moment'; // 日期处理类库
import loadComponents from '@/assets/js/common/loadComponents'; // components全局组件
import loadDirectives from '@/assets/js/common/loadDirectives'; // components全局指令
import animated from 'animate.css'; // animate.css 动画库
import { api, limit } from '@/assets/js/common/api/ajax';
import VueLazyload from 'vue-lazyload';
import Fragment from 'vue-fragment';
import App from './App.vue';
import router from './router';
import store from './store';

import 'nprogress/nprogress.css';
// nprogress样式文件

import 'element-ui/lib/theme-chalk/index.css';
import './assets/css/index.scss';

// 引入moco文件
require('./mock');

Vue.use(animated);
Vue.use(ElementUI);
Vue.use(loadComponents);
Vue.use(loadDirectives);
Vue.use(Fragment.Plugin);
Vue.use(VueLazyload, {
  preLoad: 1.3,
  error: 'dist/error.png',
  loading: 'dist/loading.gif',
  attempt: 1,
});

Vue.prototype.$moment = moment;
Vue.prototype.$api = api;
Vue.prototype.$limit = limit;
Vue.config.productionTip = false;

new Vue({
  router,
  store,
  render: (h) => h(App),
}).$mount('#app');


