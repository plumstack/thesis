import Vue from 'vue';
import Vuex from 'vuex';

Vue.use(Vuex);

const state = {
  joining: false,
  userName: '',
  isHost: false,
};

const mutations = {
  setJoining(state, bool) {       // eslint-disable-line
    state.joining = bool;         // eslint-disable-line
  },

  setUserName(state, userName) {  // eslint-disable-line
    state.userName = userName;    // eslint-disable-line
  },

  setHost(state) {                // eslint-disable-line
    state.isHost = true;          // eslint-disable-line
  },
};

export default new Vuex.Store({
  state,
  mutations,
});
