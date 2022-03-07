import _ from 'lodash';
import * as tus from 'tus-js-client';

import FetchHelper from '../utils';

const defaultTrackState = {
  id: undefined,
  name: undefined,
  originalname: undefined,
  prepared: false,
  size: 0,
  mimetype: undefined,
  // NOTE: Additional stored params for playble track
  playing: false,
  dash: {},
};

const defaultState = () => ({
  track: defaultTrackState,
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
    commit('loader', { enable: true, description: 'The live stream is starting...' }, { root: true });
    // await api.get(id);
    await dispatch('getAll');
    const track = _.find(state.items, { id });

    commit('setPlayingTrack', { ...track, prepared: true, playing: true });
    dispatch('dash/start', id, { root: true });
  },
  /**
   * Uploading .wav files to the server
   * @param  {Function} dispatch Dispatch an action. options can have `root: true` that allows to dispatch root actions in namespaced modules
   * @param  {Object}   data     File from new FormData()
   */
  async upload({ commit, dispatch }, data) {
    const endpoint = _.get(new FetchHelper('upload'), 'url.href');
    const options = {
      endpoint,
      retryDelays: [0, 1000, 3000, 5000, 10000, 20000],
      chunkSize: 8 * 1000000,
      metadata: {
        filename: data.file.name,
        filetype: data.file.type,
      },
    };

    const inputFormat = _.get(data, 'inputFormat');
    if (inputFormat) {
      _.set(options, 'metadata.input_format', inputFormat);
    }

    const outputFormat = _.get(data, 'outputFormat');
    if (outputFormat) {
      _.set(options, 'metadata.output_format', outputFormat);
    }

    await new Promise((resolve, reject) => {
      const upload = new tus.Upload(data.file, {
        ...options,
        // NOTE: tus-js using xhr :( and this hook is used for enabling credentials in preflight requests
        onBeforeRequest(req) {
          const xhr = req.getUnderlyingObject();
          xhr.withCredentials = true;
        },
        onError(err) {
          try {
            const response = err.originalResponse.getBody();
            const error = JSON.parse(response);

            dispatch('toast', { error }, { root: true });
            resolve();
          } catch (e) {
            console.error(e);
            dispatch('toast', { error: { ...e } }, { root: true });
            reject(err);
          }
        },
        onProgress(bytesUploaded, bytesTotal) {
          const percentage = (bytesUploaded / bytesTotal) * 100;
          commit('loader', { enable: true, description: `Uploading Progress: ${percentage.toFixed(2)}%` }, { root: true });

          if (percentage === 100) {
            commit('loader', { enable: true, description: 'Creating Dash.js manifest' }, { root: true });
          }
        },
        onSuccess() {
          dispatch('toast', { event: { message: 'File upload successfully!' } }, { root: true });
          resolve();
        },
      });

      upload.start();
    });

    // NOTE: flush local state after upload event; should be removed in the feature when we start to have a lot of sound files (more than 50 or maybe 100)
    await dispatch('getAll');
  },
  async reload({ commit, dispatch }, { id, name }) {
    commit('loader', { enable: true, description: 'Trying to flush the sound cache and corrupted dash files' }, { root: true });
    const endpoint = new FetchHelper();
    endpoint.path = `reload?${new URLSearchParams({ id, name }).toString()}`;

    await endpoint.get();
    dispatch('toast', { event: { message: 'Dash manifest reloaded' } }, { root: true });
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
  setPlayingTrack(store, track = defaultTrackState) {
    store.track = { ...track };
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
