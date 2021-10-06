import _ from 'lodash';
import { createStore } from 'vuex';

import audio from './modules/audio';
import auth from './modules/auth';
import dash from './modules/dash';
import playlists from './modules/playlists';
import tracks from './modules/tracks';
import users from './modules/users';

const Store = createStore({
  strict: process.env.NODE_ENV !== 'production',

  state: {
    modalVisibility: null,
    loader: {
      isLoading: false, title: 'Processing', description: 'Audiofile is loading',
    },
    notification: {
      isError: false, isSuccess: false, message: '',
    },
  },
  actions: {
    async toast({ commit }, payload) {
      commit('setToast', payload);
      setTimeout(() => commit('setToast'), 5 * 1000);
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
      const { error, event } = payload;
      state.notification = { isError: false, isSuccess: false, message: '' };

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
        state.notification = { ...state.notification, isError: true, message };
      }
      if (event) {
        state.notification = { ...state.notification, isSuccess: true, message: event.message ?? 'Complete!' };
      }
    },
    setModalVisibility(state, title = null) {
      state.modalVisibility = title;
    },
  },
  modules: {
    audio,
    auth,
    dash,
    playlists,
    tracks,
    users,
  },
});

export { Store };
export default () => {
  throw new Error('Missing store instance');
};
