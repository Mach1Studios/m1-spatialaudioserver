import _ from 'lodash';
import { createStore } from 'vuex';

import audio from './modules/audio';
import dash from './modules/dash';
import tracks from './modules/tracks';
import users from './modules/users';

export default createStore({
  strict: process.env.NODE_ENV !== 'production',

  state: {
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
        state.notification = { ...state.notification, isError: true, message: error.message ?? 'Something went wrong' };
      }
      if (event) {
        state.notification = { ...state.notification, isSuccess: true, message: event.message ?? 'Complete!' };
      }
    },
  },
  modules: {
    audio,
    dash,
    tracks,
    users,
  },
});
