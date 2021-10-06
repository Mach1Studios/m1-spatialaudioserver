import _ from 'lodash';

import FetchHelper from '../utils';

const defaultState = () => ({
  track: {
    id: undefined,
    name: undefined,
    originalname: undefined,
    prepared: false,
    size: 0,
    mimetype: undefined,
    // NOTE: Additional stored params for playble track
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
    commit('setTracks', _.map(tracks, ({
      id, name, originalname, prepared, size, mimetype,
    }) => ({
      id, name, originalname, prepared, size, mimetype, duration: 'repeat',
    })));
  },
  async select({ commit, state, dispatch }, id) {
    if (id === state.track.id) return;

    commit('loader', { enable: true, description: 'The live stream is starting...' }, { root: true });
    await api.get(id);
    await commit('getAll');
    const track = _.find(state.items, { id });

    commit('setPlay', { ...track, prepared: true });
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
  async update({ commit }, data) {
    // NOTE: update track name
    if (_.get(data, 'name')) {
      await api.put(data);
      commit('updateTrackName', data);
    }
  },
  async remove({ commit, dispatch }, id) {
    try {
      await Promise.all([
        api.del(id), commit('removeTrack', id),
      ]);
      dispatch('toast', { event: { message: 'File deleted' } }, { root: true });
    } catch (e) {
      // NOTE: try to sync files from api
      await dispatch('getAll');
    }
  },
};

const mutations = {
  setTracks(store, tracks) {
    store.items = [...tracks];
  },
  removeTrack(store, id) {
    store.items = _.filter(store.items, (item) => item.id !== id);
  },
  setPlay(store, track) {
    store.track = { ...track, playing: true };
  },
  updateTrackName(store, { id, name }) {
    const index = _.findIndex(store.items, (item) => item.id === id);
    const item = store.items[index];

    store.items[index] = { ...item, name };
  },
};

export default {
  namespaced: true, state: defaultState, actions, mutations,
};
