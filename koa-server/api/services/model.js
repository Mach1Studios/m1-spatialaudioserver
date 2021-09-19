/* eslint-disable max-classes-per-file */
import _ from 'lodash';
import { v4 as uuid } from 'uuid';

import { encryptSync } from './encryption';

function proceed(Basic, value) {
  switch (Basic.name) {
    case 'Array':
      return _.compact(_.isString(value) ? value.split(',') : []);
    case 'Boolean':
      return value === 'true';
    default:
      return new Basic(value);
  }
}

export default class Model {
  #keys = []

  #item = {}

  get keys() {
    return _.uniq(this.#keys);
  }

  get item() {
    return { ...this.#item };
  }

  setModelKey(source, path, defaultValue) {
    this.#keys = _.union(this.keys, [path]);
    this.#item[path] = (this.shape && this.shape[path])
      ? proceed(this.shape[path], _.get(source, path, defaultValue))
      : _.get(source, path, defaultValue);
  }

  difference(payload) {
    if (!_.isObject(payload) || _.isEmpty(payload)) throw new Error('An empty payload was passed to the method');

    return _.reduce(this.item, (result, value, key) => {
      const payloadValue = _.get(payload, key);
      if (!_.isUndefined(payloadValue) && payloadValue !== value) {
        return { ...result, [key]: payloadValue };
      }

      return result;
    }, {});
  }
}

export class UserModel extends Model {
  #item = {}

  constructor(item) {
    super();

    this.setModelKey(item, 'id', uuid());
    this.setModelKey(item, 'nickname');
    this.setModelKey(item, 'email');
    this.setModelKey(item, 'role', 'user');
    this.setModelKey(item, 'lastSeen');

    if (_.has(item, 'password')) {
      const { hash, salt } = encryptSync(_.get(item, 'password'));
      this.#item.hash = hash;
      this.#item.salt = salt;
    }
  }

  get user() {
    const password = this.#item ? this.#item : {};
    return { ...this.item, ...password };
  }

  static validate() {
    // TODO: should store standart validation object
    return null;
  }
}

export class PlaylistModel extends Model {
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
