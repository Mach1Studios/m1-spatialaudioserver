// import _ from 'lodash';
import { v4 as uuid } from 'uuid';

import Model from './model';

export default class TrackModel extends Model {
  constructor(item) {
    super(item);

    this.setModelKey(item, 'id', uuid());
    this.setModelKey(item, 'name');
    this.setModelKey(item, 'filename');
  }

  shape = {
    playlists: Array,
  }

  get track() {
    return { ...this.item };
  }
}
