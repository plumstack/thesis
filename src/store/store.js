import Vue from 'vue';
import Vuex from 'vuex';

Vue.use(Vuex);

const state = {
  joining: false,
  username: '',
  isHost: false,
  searching: false,
};

const mutations = {
  setJoining(state, bool) {       // eslint-disable-line
    state.joining = bool;         // eslint-disable-line
  },

  setUserName(state, username) {  // eslint-disable-line
    state.username = username;    // eslint-disable-line
  },

  setHost(state, bool) {          // eslint-disable-line
    state.isHost = bool;          // eslint-disable-line
  },

  setSearching(state, bool) {     // eslint-disable-line
    state.searching = bool;       // eslint-disable-line
  },
};

export default new Vuex.Store({
  state,
  mutations,
});
