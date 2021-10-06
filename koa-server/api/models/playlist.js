import _ from 'lodash';
import { v4 as uuid, validate } from 'uuid';

import Model from './model';
import { redis } from '../../configs';

export default class PlaylistModel extends Model {
  #playlists = []

  #tracksId = []

  set #items(items) {
    this.#playlists = items;
    this.#tracksId = _.reduce(items, (result, { tracks }) => _.uniq([...result, ...tracks]), []);
  }

  constructor(item) {
    super(item);

    this.setModelKey(item, 'id', uuid());
    this.setModelKey(item, 'name');
    this.setModelKey(item, 'tracks', []);
    this.setModelKey(item, 'permissions', []);
    this.setModelKey(item, 'visibility', false);
  }

  redisStoreKey = 'playlist:all'

  shape = {
    tracks: Array,
    permissions: Array,
    visibility: Boolean,
  }

  get playlist() {
    return { ...this.item };
  }

  get availableTracksId() {
    return _.map(this.#tracksId, (id) => `track:${id}`);
  }

  isTrackIncludes(payload) {
    const id = (_.has(payload, 'id') || validate(payload))
      ? _.get(payload, 'id', payload)
      : undefined;
    return payload && this.#tracksId.includes(id);
  }

  async getItemsByUserRole(user) {
    const items = await redis.lrange('playlist:all', 0, -1);

    const playlists = await Promise.all(_.map(items, async (item) => {
      const values = await redis.hmget(item, this.keys);

      const { playlist } = new PlaylistModel(_.zipObject(this.keys, values));

      return playlist;
    }));
    const visible = _.filter(playlists, { visibility: true });

    switch (_.get(user, 'role')) {
      case 'admin':
        this.#items = playlists;
        break;
      case 'user':
        this.#items = [
          ...visible, ..._.filter(playlists, ({ permissions }) => permissions.includes(user.id)),
        ];
        break;
      default:
        this.#items = visible;
        break;
    }

    return this.#playlists;
  }

  static initStoreTransaction(source, target) {
    const { tracks, permissions } = target;
    const { id } = source;
    const tracksToRemove = _.difference(source.tracks, tracks);
    const permissionsToRemove = _.difference(source.visibility, permissions);

    const transaction = redis.multi();

    if (!_.isEmpty(tracks)) {
      _.each(tracks, (track) => transaction.sadd(`track:${track}:playlists`, id));
    }
    if (!_.isEmpty(tracksToRemove)) {
      _.each(tracksToRemove, (track) => transaction.srem(`track:${track}:playlists`, id));
    }

    if (!_.isEmpty(permissions)) {
      _.each(permissions, (user) => transaction.sadd(`user:${user}:playlists`, id));
    }
    if (!_.isEmpty(permissionsToRemove)) {
      _.each(permissionsToRemove, (user) => transaction.srem(`user:${user}:playlists`, id));
    }
    return transaction;
  }
}
