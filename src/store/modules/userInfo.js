const state = {
  username: '',
  userList: [],
  roomID: '',
  skipped: false,
};

const getters = {
  getUsername: (s) => s.username,
  getUsersList: (s) => s.userList,
  getRoomID: (s) => s.roomID,
  getSkipped: (s) => s.skipped,
};

const actions = {
  usernameVerify({ rootState }, username) {
    if (rootState.userList.contains(username)) return false;
    return true;
  },
  updateUserlist({ commit }, userList) {
    commit('setUserList', userList);
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
    commit('setUsername', '');
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
