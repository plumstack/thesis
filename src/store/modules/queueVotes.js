const state = {
  votes: {},
};

const getters = {
  getVotes: (s) => s.votes,
//  getVote: (s, trackID) => s.votes[trackID],
};

const actions = {
  voteOn({ commit }, { trackID, vote }) {
    commit('setSongVote', { trackID, vote });
  },
  addToQueue( { state, commit }, trackID ) { //eslint-disable-line
    console.log(state.votes);
    if (!(trackID in state.votes)) {
      state.votes[trackID] = 0;
    }
  },
};

const mutations = {
  setSongVote(s, { trackID, vote }) {
    s.votes[trackID] = vote;
  },
};


export default {
  state,
  getters,
  actions,
  mutations,
};
