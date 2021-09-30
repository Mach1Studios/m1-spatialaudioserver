import _ from 'lodash';
import { v4 as uuid } from 'uuid';

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

  shape = {
    tracks: Array,
    permissions: Array,
    visibility: Boolean,
  }

  get playlist() {
    return { ...this.item };
  }

  isTrackIncludes(trackId) {
    return this.#tracksId.includes(trackId) !== -1;
  }

  async getItemsByUserRole(user) {
    const items = await redis.lrange('playlist:all', 0, 100);

    const playlists = Promise.all(_.map(items, async (item) => {
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
}
