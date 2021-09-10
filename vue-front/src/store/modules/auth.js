// import _ from 'lodash';
// import { validate as isUuid } from 'uuid';
// eslint-disable-next-line
import FetchHelper from '../utils';

const defaultState = () => ({
  profile: {
    session: false,
  },
});

const api = new FetchHelper('auth');

const actions = {
  async login({ commit, dispatch }, data) {
    const profile = await api.post(data);

    if (profile) {
      dispatch('toast', { event: { message: `Success! Welcome back, ${profile.user.nickname}` } }, { root: true });
      commit('setProfile', profile);

      return true;
    }
    return false;
  },
};

const mutations = {
  setProfile(store, profile) {
    store.profile = profile;
  },
};

export default {
  namespaced: true, state: defaultState, actions, mutations,
};