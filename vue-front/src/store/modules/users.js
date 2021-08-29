import _ from 'lodash';
import { v4 as uuid, validate as isUuid } from 'uuid';

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
  // eslint-disable-next-line
  async getAll({ commit }) {
    const users = await api.get();
    commit('setUsers', _.map(users, (user, index) => ({ number: index + 1, ...user })));
    // eslint-disable-next-line
    // const users = [
    //   {
    //     id: '1',
    //     number: '1',
    //     nickname: 'Siouxsie_1957',
    //     email: 'siouxsieandthebanshees@gmail.com',
    //     role: 'user',
    //     lastSeen: '21.07.1995',
    //   },
    //   {
    //     id: '2',
    //     number: '2',
    //     nickname: 'Peter_1957',
    //     email: 'bauhaus@gmail.com',
    //     role: 'user',
    //     lastSeen: '04.08.1983',
    //   },
    //   {
    //     id: '3',
    //     number: '3',
    //     nickname: 'Ian_1956',
    //     email: 'joydivision@gmail.com',
    //     role: 'admin',
    //     lastSeen: '18.05.1980',
    //   },
    // ];
  },
  // eslint-disable-next-line
  async create({ commit }, data) {
    // TODO: should be remove after created support from redis db
    const id = uuid();

    const user = await api.post(data);
    console.log(user);
    commit('createUser', { ...data, id });
  },
  async remove({ commit }, data) {
    const id = !isUuid(data) ? _.get(data, 'id') : data;
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
  removeUser(store, id) {
    store.items = _.remove(store.items, (item) => item.id !== id);
  },
};

export default {
  namespaced: true, state: defaultState, actions, getters, mutations,
};
