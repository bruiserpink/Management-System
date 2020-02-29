import Vue from 'vue'
import Vuex from 'vuex'
Vue.use(Vuex)

export default new Vuex.Store({
  state: {
    token: ""
  },
  mutations: {
    setToken(state,token) {
      //修改token的值，但是在页面发生刷新以后，这个token的值会被销毁，
      state.token = token;
    },
  },
  actions: {
  },
  modules: {
  }
})
