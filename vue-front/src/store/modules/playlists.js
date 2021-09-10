import _ from 'lodash';
import { v4 as uuid, validate as isUuid } from 'uuid';

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
  async create({ commit }, data) {
    // console.log(data);
    const playlist = {
      id: uuid(),
      name: data.name,
      tracks: [],
      permission: [],
      visibility: false,
    };
    commit('createPlaylist', playlist);
  },
  async update({ commit }, data) {
    console.log(data);
    if (!_.has(data, 'id')) return;
    // NOTE: update playlist name
    if (_.get(data, 'name')) {
      commit('updatePlaylistName', data);
    }
    if (_.get(data, 'visibility')) {
      commit('updatePlaylistVisibility', data);
    }
  },
  async remove({ commit }, data) {
    const id = !isUuid(data) ? _.get(data, 'id') : data;
    // await api.del(id);
    commit('removePlaylist', id);
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
  updatePlaylistName(store, { id, name }) {
    const index = _.findIndex(store.items, (item) => item.id === id);
    const item = store.items[index];

    store.items[index] = { ...item, name };
  },
  updatePlaylistVisibility(store, { id }) {
    const index = _.findIndex(store.items, (item) => item.id === id);
    const item = store.items[index];

    store.items[index] = { ...item, visibility: !item.visibility };
  },
  removePlaylist(store, id) {
    store.items = _.remove(store.items, (item) => item.id !== id);
  },
};

export default {
  namespaced: true, state: defaultState, actions, getters, mutations,
};
