import Request from '../utils';

const state = () => ([]);

const actions = {
  async getAll({ commit }) {
    const tracks = await new Request().send('/tracks');
    console.log(tracks);
    commit('setTracks', tracks);
  },
};

const mutations = {
  setTracks(store, tracks) {
    // eslint-disable-next-line
    store = tracks;
  },
};

export default {
  namespaced: true, state, actions, mutations,
};
