const state = {
  username: '',
  userList: [],
  roomID: '',
};

const getters = {
  getUsername: (s) => s.username,
  getUsersList: (s) => s.userList,
  getRoomID: (s) => s.roomID,
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
};

export default {
  state,
  getters,
  mutations,
  actions,
};
