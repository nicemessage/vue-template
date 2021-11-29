import { api, limit } from './api/ajax';

import global from './global.js';

export default {
  install(Vue) {
    Object.defineProperty(Vue.prototype, '$api', {
      value: api,
    });
    Object.defineProperty(Vue.prototype, '$limit', {
      value: limit,
    });
    Object.defineProperty(Vue.prototype, '$global', {
      value: global,
    });
  },
};
