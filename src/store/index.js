import Vue from 'vue';
import Vuex from 'vuex';

Vue.use(Vuex);

export default new Vuex.Store({
  state: {
    authInfo: {},
    routes: [],
  },
  getters: {
    authInfoGet: state => state.authInfo,
    routesGet: state => state.routes,
  },
  mutations: {
    authInfoMut(state, val) {
      state.authInfo = val;
    },
    routesMut(state, val) {
      state.routes = val;
      console.log(state);
    },
  },
  actions: {},
});
