// import _ from 'lodash';
import { v4 as uuid } from 'uuid';

import Model from './model';

export default class TrackModel extends Model {
  #item = {}

  constructor(item) {
    super();

    this.setModelKey(item, 'id', uuid());
    this.setModelKey(item, 'name');
    this.setModelKey(item, 'filename');
  }

  get track() {
    const password = this.#item ? this.#item : {};
    return { ...this.item, ...password };
  }
}
