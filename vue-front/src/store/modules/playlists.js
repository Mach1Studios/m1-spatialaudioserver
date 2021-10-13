import _ from 'lodash';
// eslint-disable-next-line
import { v4 as uuid, validate as isUuid } from 'uuid';
// eslint-disable-next-line
import FetchHelper from '../utils';

const defaultState = () => ({
  // playlist: {
  //   id: undefined,
  //   name: undefined,
  //   tracks: undefined,
  //   permissions: undefined,
  //   visibility: undefined,
  // },
  items: [],
});

const api = new FetchHelper('playlists');

const actions = {
  async getAll({ commit }) {
    const playlists = await api.get();
    commit('setPlaylists', _.map(playlists, (playlist, index) => ({ number: index + 1, ...playlist })));
  },
  async create({ commit }, { name }) {
    const playlist = await api.post({ name });
    commit('createPlaylist', playlist);
  },
  async update({ commit, getters }, data) {
    if (!_.has(data, 'id')) return;

    const id = _.get(data, 'id');
    // NOTE: update playlist name
    if (_.get(data, 'name')) {
      await api.put(data);
      commit('updatePlaylistName', data);
    }
    if (_.get(data, 'visibility')) {
      const { visibility } = getters.select(id);
      await api.put({ id, visibility: !visibility });

      commit('updatePlaylistVisibility', data);
    }
  },
  async remove({ commit }, data) {
    const id = !isUuid(data) ? _.get(data, 'id') : data;
    await api.del(id);
    commit('removePlaylist', id);
  },
  async removeItemFromPlaylist({ commit }, data) {
    await api.put(data);
    if (_.has(data, 'tracks')) {
      commit('updatePlaylistTracks', data);
    }
    if (_.has(data, 'permissions')) {
      commit('updatePlaylistPermissions', data);
    }
  },
  async addItemToPlaylist({ commit }, data) {
    await api.put(data);
    if (_.has(data, 'tracks')) {
      commit('updatePlaylistTracks', data);
    }
    if (_.has(data, 'permissions')) {
      commit('updatePlaylistPermissions', data);
    }
  },
};

const getters = {
  select(state) {
    return (id) => _.find(state.items, { id });
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
  updatePlaylistTracks(store, { id, tracks }) {
    const index = _.findIndex(store.items, (item) => item.id === id);
    const item = store.items[index];

    store.items[index] = { ...item, tracks };
  },
  updatePlaylistPermissions(store, { id, permissions }) {
    const index = _.findIndex(store.items, (item) => item.id === id);
    const item = store.items[index];

    store.items[index] = { ...item, permissions };
  },
  removePlaylist(store, id) {
    store.items = _.remove(store.items, (item) => item.id !== id);
  },
};

export default {
  namespaced: true, state: defaultState, actions, getters, mutations,
};
