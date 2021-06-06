import { createStore } from 'vuex';

import tracks from './modules/tracks';
import dash from './modules/dash';

export default createStore({
  strict: process.env.NODE_ENV !== 'production',

  state: {
    loader: {
      isLoading: false, title: 'Processing',
    },
  },
  mutations: {
    loader(state, { enable = false }) {
      state.loader.isLoading = enable;
    },
  },
  modules: {
    dash,
    tracks,
  },
});
