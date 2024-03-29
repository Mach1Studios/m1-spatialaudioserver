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
  async restore({ commit, dispatch, state }) {
    try {
      const profile = await new FetchHelper('profile').get();

      if (profile) {
        commit('setProfile', profile);
      } else if (state.profile) {
        dispatch('toast', { event: { message: `${state?.user?.nickname ?? 'Oops'}, your session has expired, please provide your credentials` } }, { root: true });
        commit('setProfile', { session: false });
      }
    } catch (e) {
      if (e.message === 'Session expired') {
        dispatch('toast', { event: { message: `${state?.user?.nickname ?? 'Oops'}, your session has expired, please provide your credentials` } }, { root: true });
        commit('setProfile', { session: false });
        return;
      }
      throw e;
    }
  },
  async logout({ commit, dispatch }) {
    await api.del('logout');
    dispatch('toast', { event: { message: 'Log out success! See you later ;)' } }, { root: true });
    commit('setProfile', { session: false });
  },
};

const getters = {
  userId(state) {
    return state.profile.user.id;
  },
};

const mutations = {
  setProfile(store, profile) {
    store.profile = profile;
  },

};

export default {
  namespaced: true, state: defaultState, actions, getters, mutations,
};
