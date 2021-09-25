import { v4 as uuid } from 'uuid';

import Model from './model';

export default class PlaylistModel extends Model {
  constructor(item) {
    super();

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
}
