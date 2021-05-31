import _ from 'lodash';

import FetchHelper from '../utils';

const state = () => ({
  playing: {
    name: undefined,
    playing: false,
    dash: {},
  },
  items: [],
});

const actions = {
  async getAll({ commit }) {
    const tracks = await new FetchHelper().send('/tracks');

    commit('setTracks', _.map(tracks, (track, index) => ({ id: index + 1, name: track, duration: 'repeat' })));
  },
  async select({ commit }, name) {
    await new FetchHelper(process.env.VUE_APP_STREAM_URL).send(`/play?sound=${name}&channels=8`);

    commit('setPlay', name);
  },
};

const mutations = {
  setTracks(store, tracks) {
    // eslint-disable-next-line
    store.items = tracks;
  },
  setPlay(store, track) {
    // eslint-disable-next-line
    store.playing = { name: track, playing: true };
  },
};

export default {
  namespaced: true, state, actions, mutations,
};
