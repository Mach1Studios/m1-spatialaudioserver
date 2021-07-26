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
  },
  modules: {
    audio,
    dash,
    tracks,
    users,
  },
});
