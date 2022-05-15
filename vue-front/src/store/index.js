import _ from 'lodash';
import { v4 as uuid } from 'uuid';

import { createStore } from 'vuex';
import VuexPersistence from 'vuex-persist';

import audio from './modules/audio';
import auth from './modules/auth';
import dash from './modules/dash';
import logs from './modules/logs';
import playlists from './modules/playlists';
import tracks from './modules/tracks';
import uploads from './modules/uploads';
import users from './modules/users';

const delay = (sec) => new Promise((resolve) => setTimeout(resolve, sec * 1000));

// eslint-disable-next-line
const persistSettings = new VuexPersistence({
  key: 'm1::store::settings',
  storage: window.localStorage,
  modules: ['auth', 'uploads'],
});

// const persistLogs = new VuexPersistence({
//   key: 'm1::store::logs',
//   storage: window.localStorage,
//   modules: ['logs'],
// });

const Store = createStore({
  strict: process.env.NODE_ENV !== 'production',

  plugins: [persistSettings.plugin],

  state: {
    modalVisibility: null,
    loader: {
      isLoading: false, title: 'Processing', description: 'Audiofile is loading',
    },
    notifications: [],
  },

  actions: {
    async toast({ commit, state }, payload) {
      if (state.loader.isLoading) {
        commit('loader', { enable: false });
        await delay(0.5);
      }
      const id = uuid();
      commit('setToast', { id, ...payload });
      await delay(payload.delay ?? 5);
      commit('unsetToast', id);
    },
  },

  mutations: {
    loader(state, payload) {
      const { description, enable, title } = payload;
      if (_.isBoolean(enable)) {
        state.loader.isLoading = enable;
      }
      if (_.isString(description)) {
        state.loader.description = description;
      }
      if (_.isString(title)) {
        state.loader.title = title;
      }
    },
    setToast(state, payload = {}) {
      const { id, error, event } = payload;
      const notification = { id, icon: 'done', message: 'Complete!' };
      if (error) {
        let message = error.message ?? 'Something went wrong';
        if (_.isObject(error.errors)) {
          if (_.values(error.errors).length === 1) {
            const [value] = _.values(error.errors);
            message = value.message ?? 'Something went wrong';
          } else {
            message = `${message} The list of incorrect fields: \r\n`;
            _.each(error.errors, (description) => {
              message = `${message} \r\n ${description.message}`;
            });
          }
        }
        state.notifications.push({ ...notification, icon: 'error', message });
      }
      if (event) {
        state.notifications.push({ ...notification, ...event });
      }
      if (state.notifications.length > 3) state.notifications.shift();
    },
    setModalVisibility(state, title = null) {
      state.modalVisibility = title;
    },
    unsetToast(state, id) {
      _.remove(state.notifications, { id });
    },
  },
  modules: {
    audio,
    auth,
    dash,
    logs,
    playlists,
    tracks,
    uploads,
    users,
  },
});

Store.subscribeAction({
  error: (_action, _state, error) => {
    Store.dispatch('toast', { error });
  },
});

export default Store;
