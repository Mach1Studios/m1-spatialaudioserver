// import _ from 'lodash';
// import { validate as isUuid } from 'uuid';

import FetchHelper from '../utils';

const defaultState = () => ({
  profile: {

  },
});

const api = new FetchHelper('auth');

const actions = {
  async login({ commit }, data) {
    const profile = await api.post(data);

    commit('setProfile', profile);
  },
};

const mutations = {
  setProfile(store, users) {
    store.items = users;
  },
};

export default {
  namespaced: true, state: defaultState, actions, mutations,
};
