import _ from 'lodash';
import { DateTime } from 'luxon';
import { v4 as uuid } from 'uuid';

const defaultState = { history: [] };

const actions = {
  createMessage({ commit }, data) {
    const payload = {
      id: uuid(),
      timestamp: DateTime.now(),
      message: _.get(data, 'message', ''),
      data: _.get(data, 'data'),
      type: _.get(data, 'type', 'info'),
    };
    commit('setMessage', payload);
  },
  flush({ commit }) {
    commit('flushHistory');
  },
};

const mutations = {
  // eslint-disable-next-line
  setMessage(store, payload) {
    // store.history.push(payload);
  },
  flushHistory(store) {
    store.history = [];
  },
};

export default { namespaced: true, state: defaultState, actions, mutations };
