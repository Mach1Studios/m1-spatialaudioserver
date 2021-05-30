import _ from 'lodash';

import FetchHelper from '../utils';

const state = () => ({
  items: [],
});

const actions = {
  async getAll({ commit }) {
    const tracks = await new FetchHelper().send('/tracks');

    commit('setTracks', _.map(tracks, (track, index) => ({ id: index + 1, name: track, duration: 'repeat' })));
  },
};

const mutations = {
  setTracks(store, tracks) {
    // eslint-disable-next-line
    store.items = tracks;
  },
};

export default {
  namespaced: true, state, actions, mutations,
};
