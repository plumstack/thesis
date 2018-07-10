import router from '../../main';

const state = {
  username: '',
  userList: [],
  scores: [],
  roomID: '',
  skipped: false,
};

const getters = {
  getUsername: (s) => s.username,
  getUsersList: (s) => s.userList,
  getScores: (s) => s.scores,
  getRoomID: (s) => s.roomID,
  getSkipped: (s) => s.skipped,
};

const actions = {
  usernameVerify(x, username) {
    return x.state.userList.includes(username);
  },
  updateUserList({ commit }, userList) {
    commit('setUserList', userList);
  },
  updateScores({ commit }, scores) {
    commit('setScores', scores);
  },
  updateUsername({ commit }, username) {
    commit('setUsername', username);
  },
  updateRoomID({ commit }, roomID) {
    commit('setRoomID', roomID);
  },
  leaveRoom({ commit }) {
    commit('setRoomID', '');
    commit('setUserList', []);
    commit('setScores', []);
    commit('setUsername', '');
    router.push('/');
  },
  voteToSkip({ commit, rootState }) {
    if (!rootState.skipped) commit('setSkipped', true);
  },
  resetSkip({ commit }) {
    commit('setSkipped', false);
  },
};

const mutations = {
  setUsername(s, username) {
    s.username = username;
  },
  setUserList(s, userList) {
    s.userList = userList;
  },
  setScores(s, scores) {
    s.scores = scores;
  },
  setRoomID(s, roomID) {
    s.roomID = roomID;
  },
  setSkipped(s, vote) {
    s.skipped = vote;
  },
};

export default {
  state,
  getters,
  mutations,
  actions,
};
