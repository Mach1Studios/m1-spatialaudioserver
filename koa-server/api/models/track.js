// import _ from 'lodash';
import { v4 as uuid } from 'uuid';

import Model from './model';

export default class TrackModel extends Model {
  constructor(item) {
    super(item);

    // NOTE: getting the original name from upload from-data payload
    const filename = this.setModelKey(item, 'originalname');

    this.setModelKey(item, 'id', uuid());
    this.setModelKey(item, 'name', filename);
    this.setModelKey(item, 'size');
    this.setModelKey(item, 'mimetype');

    // NOTE: boolean value for checking cashed dash files on Nginx
    this.setModelKey(item, 'prepared', false);
  }

  redisStoreKey = 'tracks:all'

  shape = {
    playlists: Array,
    prepared: Boolean,
  }

  get track() {
    return { ...this.item };
  }
}
