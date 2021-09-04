import _ from 'lodash';
// import { validate as isUuid } from 'uuid';

// import FetchHelper from '../utils';

const defaultState = () => ({
  // playlist: {
  //   id: undefined,
  //   name: undefined,
  //   tracks: undefined,
  //   permission: undefined,
  //   visibility: undefined,
  // },
  items: [],
});

// const api = new FetchHelper('playlists');

const actions = {
  // eslint-disable-next-line
  async getAll({ commit }) {
    // const playlists = await api.get();
    // eslint-disable-next-line
    const playlists = [
      {
        id: '1',
        name: 'Playlist1',
        tracks: ['1', '2', '3'],
        permission: ['1', '2', '3'],
        visibility: true,
      },
      {
        id: '2',
        name: 'Playlist2',
        tracks: ['4', '5', '6'],
        permission: ['4', '5', '6'],
        visibility: false,
      },
      {
        id: '3',
        name: 'Playlist3',
        tracks: ['7', '8', '9'],
        permission: ['7', '8', '9'],
        visibility: true,
      },
    ];

    commit('setPlaylists', _.map(playlists, (playlist, index) => ({ number: index + 1, ...playlist })));
  },
  // eslint-disable-next-line
  async create({ commit }, data) {
    // const playlist = await api.post(data);
    // commit('createPlaylist', playlist);
  },
  // eslint-disable-next-line
  async remove({ commit }, data) {
    // const id = !isUuid(data) ? _.get(data, 'id') : data;
    // await api.del(id);
    // commit('removePlaylist', id);
  },
};

const getters = {
  select({ state }, id) {
    return _.find(state.items, { id });
  },
};

const mutations = {
  setPlaylists(store, playlists) {
    store.items = playlists;
  },
  createPlaylist(store, playlist) {
    store.items = [...store.items, playlist];
  },
  removePlaylist(store, id) {
    store.items = _.remove(store.items, (item) => item.id !== id);
  },
};

export default {
  namespaced: true, state: defaultState, actions, getters, mutations,
};
