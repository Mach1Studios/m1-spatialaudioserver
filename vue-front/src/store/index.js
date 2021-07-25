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
    loader(state, { enable = false }) {
      // console.log('loader');
      // eslint-disable-next-line
      state.loader.isLoading = enable;
    },
  },
  modules: {
    audio,
    dash,
    tracks,
    users,
  },
});
