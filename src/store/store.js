import Vue from 'vue';
import Vuex from 'vuex';

Vue.use(Vuex);

const state = {
  joining: false,
};

const mutations = {
  joining(state, bool) {
    state.joining = bool;
  },
};

export default new Vuex.Store({
  state,
  mutations,
});
