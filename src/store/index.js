import Vue from 'vue'
import Vuex from 'vuex'
Vue.use(Vuex)

export default new Vuex.Store({
  state: {
    GoodsDetailsInfo: [],
  },
  mutations: {
    shareGoodsInfo(state,payload) {
      state.GoodsDetailsInfo.push(payload);
    }
  },
  actions: {
  },
  modules: {
  }
})
