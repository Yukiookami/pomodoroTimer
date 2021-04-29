import Vue from 'vue'
import Vuex from 'vuex'

Vue.use(Vuex)

export default new Vuex.Store({
  state: {
    showButtonIcon: false
  },
  mutations: {
    setShowButtonIcon (state, val) {
      state.showButtonIcon = val
    }
  },
  actions: {
  },
  modules: {
  }
})
