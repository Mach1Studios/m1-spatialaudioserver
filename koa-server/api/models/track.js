// import _ from 'lodash';
import { v4 as uuid } from 'uuid';

import Model from './model';

export default class TrackModel extends Model {
  constructor(item) {
    super(item);

    const filename = this.setModelKey(item, 'originalname');

    this.setModelKey(item, 'id', uuid());
    this.setModelKey(item, 'name', filename);
    this.setModelKey(item, 'size');
    this.setModelKey(item, 'mimetype');
  }

  shape = {
    playlists: Array,
  }

  get track() {
    return { ...this.item };
  }
}
