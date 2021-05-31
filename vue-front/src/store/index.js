import { createStore } from 'vuex';

import tracks from './modules/tracks';
import dash from './modules/dash';

export default createStore({
  // state: {
  // },
  // mutations: {
  // },
  // actions: {
  // },
  modules: {
    dash,
    tracks,
  },
});
