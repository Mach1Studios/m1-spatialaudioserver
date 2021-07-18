import _ from 'lodash';

import FetchHelper from '../utils';

const defaultState = () => ({
  playing: {
    id: undefined,
    name: undefined,
    playing: false,
    dash: {},
  },
  items: [],
});

const actions = {
  async getAll({ commit }) {
    const tracks = await new FetchHelper().send('/tracks');
    commit('setTracks', _.map(tracks, ({ id, name }, index) => ({
      number: index + 1, id, name, duration: 'repeat',
    })));
  },
  async select({ commit, state, dispatch }, id) {
    const { name } = _.find(state.items, { id });
    await new FetchHelper().send(`/tracks/${id}`);

    commit('setPlay', { id, name });
    dispatch('dash/start', id, { root: true });
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
    store.playing = { ...track, playing: true };
  },
};

export default {
  namespaced: true, state: defaultState, actions, mutations,
};
