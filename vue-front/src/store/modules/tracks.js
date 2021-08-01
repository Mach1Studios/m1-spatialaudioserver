import _ from 'lodash';

import FetchHelper from '../utils';

const defaultState = () => ({
  track: {
    id: undefined,
    name: undefined,
    playing: false,
    dash: {},
  },
  items: [],
});

const api = new FetchHelper();

const actions = {
  async getAll({ commit }) {
    const tracks = await api.get('/tracks');
    commit('setTracks', _.map(tracks, ({ id, name }, index) => ({
      number: index + 1, id, name, duration: 'repeat',
    })));
  },
  async select({ commit, state, dispatch }, id) {
    if (id === state.track.id) return;

    commit('loader', { enable: true, description: 'The live stream is starting...' }, { root: true });
    const { name } = _.find(state.items, { id });
    await api.get(`/tracks/${id}`);

    commit('setPlay', { id, name });
    dispatch('dash/start', id, { root: true });
  },
  async upload({ dispatch }, data) {
    await api.post('/upload', data);
    await dispatch('getAll');
  },
  async remove({ dispatch }, id) {
    await api.send(`/tracks/${id}`, id);
    await dispatch('getAll');
  },
};

const mutations = {
  setTracks(store, tracks) {
    store.items = tracks;
  },
  setPlay(store, track) {
    store.track = { ...track, playing: true };
  },
};

export default {
  namespaced: true, state: defaultState, actions, mutations,
};
