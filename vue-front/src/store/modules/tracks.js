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
    console.log(tracks);

    commit('setTracks', _.map(tracks, ({ id, name }, index) => ({
      number: index + 1, id, name, duration: 'repeat',
    })));
  },
  async select({ commit }, name) {
    // await new FetchHelper(process.env.VUE_APP_STREAM_URL).send(`/play?sound=${name}&channels=8`);
    await new FetchHelper().send('/tracks/1');

    commit('setPlay', name);
  },
  async upload({ dispatch }, data) {
    await new FetchHelper().send('/upload', data);
    await dispatch('getAll');
  },
};

const mutations = {
  setTracks(store, tracks) {
    store.items = tracks;
  },
  setPlay(store, track) {
    store.playing = { name: track, playing: true };
  },
};

export default {
  namespaced: true, state, actions, mutations,
};
