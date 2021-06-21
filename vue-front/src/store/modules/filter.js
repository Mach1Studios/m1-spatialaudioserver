const state = () => ({
  filters: 0,
});

const actions = {
  updateFilters({ commit }, count) {
    commit('setFilters', count);
  },
};

const mutations = {
  setFilters(store, count = 0) {
    store.filters = count;
  },
};

export default {
  namespaced: true, state, actions, mutations,
};
