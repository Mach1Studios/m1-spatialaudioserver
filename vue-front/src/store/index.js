import _ from 'lodash';
import { v5 as uuidv5 } from 'uuid';

import { createStore } from 'vuex';
import VuexPersistence from 'vuex-persist';

// import dash from './modules/dash';
import audio from './modules/audio';
import auth from './modules/auth';
// import hls from './modules/hls';
import logs from './modules/logs';
import playlists from './modules/playlists';
import stream from './modules/stream';
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

const createNotification = (payload = {}) => {
  const { error, event } = payload;
  let notification = {
    icon: 'done', message: 'Complete!', visible: true, count: 1,
  };
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
    notification = { ...notification, icon: 'error', message };
  }
  if (event) {
    notification = { ...notification, ...event };
  }

  notification.id = uuidv5(notification.message, '1b671a64-40d5-491e-99b0-da01ff1f3341');
  return notification;
};

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

      const notification = createNotification(payload);
      commit('setToast', notification);
      await delay(payload.delay ?? 5);
      commit('unsetToast', notification.id);
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
    setToast(state, notification = {}) {
      const previousIndex = _.findIndex(state.notifications, { message: notification.message });
      // console.log('index=', previousIndex, 'element=', state.notifications[previousIndex]);

      if (previousIndex !== -1) {
        state.notifications[previousIndex].count += 1;
      } else {
        state.notifications.push(notification);
      }

      if (state.notifications.length > 3) state.notifications.shift();
    },
    setModalVisibility(state, title = null) {
      state.modalVisibility = title;
    },
    unsetToast(state, id) {
      const index = _.findIndex(state.notifications, { id });

      state.notifications[index].visible = false;
    },
  },
  modules: {
    audio,
    auth,
    // hls,
    logs,
    playlists,
    stream,
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
