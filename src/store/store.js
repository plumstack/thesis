import Vue from 'vue';
import Vuex from 'vuex';

Vue.use(Vuex);

const state = {
  joining: false,
};

const mutations = {
  joining(state, bool) { // eslint-disable-line
    state.joining = bool; // eslint-disable-line
  },
};

export default new Vuex.Store({
  state,
  mutations,
});
