import _ from 'lodash';
import { validate as isUuid } from 'uuid';

import FetchHelper from '../utils';

const defaultState = () => ({
  // user: {
  //   id: undefined,
  //   nickname: undefined,
  //   email: undefined,
  //   role: undefined,
  //   lastSeen: undefined,
  // },
  items: [],
});

const api = new FetchHelper('users');

const actions = {
  async getAll({ commit }) {
    const users = await api.get();
    commit('setUsers', _.map(users, (user) => ({ ...user })));
    // commit('setUsers', _.map(users, (user, index) => ({ number: index + 1, ...user })));
  },
  async create({ commit }, data) {
    const user = await api.post(data);
    commit('createUser', user);
  },

  // async update({ commit }, data) {
  //   if (!_.has(data, 'id')) return;
  //
  //   // const { nickname, email, role } = data;
  //
  //   // NOTE: update user nickname
  //   // if (_.get(data, 'nickname')) {
  //   //   await api.put(data);
  //   //   commit('updateUserNickname', data);
  //   // }
  // },
  async remove({ commit }, data) {
    const id = !isUuid(data) ? _.get(data, 'id') : data;
    await api.del(id);
    commit('removeUser', id);
  },
};

const getters = {
  select({ state }, id) {
    return _.find(state.items, { id });
  },
};

const mutations = {
  setUsers(store, users) {
    store.items = users;
  },
  createUser(store, user) {
    store.items = [...store.items, user];
  },
  updateUserNickname(store, { id, name }) {
    const index = _.findIndex(store.items, (item) => item.id === id);
    const item = store.items[index];

    store.items[index] = { ...item, name };
  },
  removeUser(store, id) {
    store.items = _.remove(store.items, (item) => item.id !== id);
  },
};

export default {
  namespaced: true, state: defaultState, actions, getters, mutations,
};
