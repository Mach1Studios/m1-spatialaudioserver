import _ from 'lodash';

// import FetchHelper from '../utils';

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

const actions = {
  async getAll({ commit }) {
    const users = [
      {
        id: '1',
        number: '1',
        nickname: 'Siouxsie_1957',
        email: 'siouxsieandthebanshees@gmail.com',
        role: 'user',
        lastSeen: '21.07.1995',
      },
      {
        id: '2',
        number: '2',
        nickname: 'Peter_1957',
        email: 'bauhaus@gmail.com',
        role: 'user',
        lastSeen: '04.08.1983',
      },
      {
        id: '3',
        number: '3',
        nickname: 'Ian_1956',
        email: 'joydivision@gmail.com',
        role: 'admin',
        lastSeen: '18.05.1980',
      },
    ];
    commit('setUsers', users);
  },
  // eslint-disable-next-line
  async create({ commit }, data) {
    console.log('text');
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
};

export default {
  namespaced: true, state: defaultState, actions, getters, mutations,
};
