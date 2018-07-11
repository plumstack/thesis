import Vue from 'vue';
import Vuex from 'vuex';


import userInfo from './modules/userInfo';
import queueVotes from './modules/queueVotes';

Vue.use(Vuex);


export default new Vuex.Store({
  modules: { userInfo, queueVotes },
});

