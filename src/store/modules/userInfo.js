const state = {
  joining: false,
  username: '',
  userList: [],
  searching: false,
};

const getters = {
  getUsername() {},
  getUsersList() {},
};

const actions = {
  usernameVerify() {},
  fetchUserlist() {},
  leaveRoom() {},
  updateUserlist() {},
};

const mutations = {
  setJoining(s, bool) {
    s.joining = bool;
  },

  setUsername(s, username) {
    s.username = username;
  },
  setUserList() {},
  clearUsername() {},
  clearUserlist() {},
  setSearching(s, bool) {
    s.searching = bool;
  },
};

export default {
  state,
  getters,
  mutations,
  actions,
};
