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

const api = new FetchHelper('tracks');

const actions = {
  /**
   * Getting all available sound files [included both versions: like static (preloaded/cached mpeg-dash) and dynamic (live stream)]
   * @param  {Function}  commit Commit a mutation. options can have `root: true` that allows to commit root mutations in namespaced modules
   */
  async getAll({ commit }) {
    const tracks = await api.get();
    commit('setTracks', _.map(tracks, ({ id, name }, index) => ({
      number: index + 1, id, name, duration: 'repeat',
    })));
  },
  async select({ commit, state, dispatch }, id) {
    if (id === state.track.id) return;

    commit('loader', { enable: true, description: 'The live stream is starting...' }, { root: true });
    const { name } = _.find(state.items, { id });
    await api.get(id);

    commit('setPlay', { id, name });
    dispatch('dash/start', id, { root: true });
  },
  /**
   * Uploading .wav files to the server
   * @param  {Function} dispatch Dispatch an action. options can have `root: true` that allows to dispatch root actions in namespaced modules
   * @param  {Object}   data     File from new FormData()
   */
  async upload({ dispatch }, data) {
    await new FetchHelper('upload').post(data);

    // NOTE: flush local state after upload event; should be removed in the feature when we start to have a lot of sound files (more than 50 or maybe 100)
    await dispatch('getAll');
  },
  async remove({ dispatch }, id) {
    await api.del(id);
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
