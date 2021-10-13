import _ from 'lodash';
import { DateTime } from 'luxon';

import { redis } from '../../configs';

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

  #validation = {}

  constructor(item) {
    const timestamp = DateTime.now();
    this.setModelKey(item, 'created', timestamp);
    this.setModelKey(item, 'updated', timestamp);
  }

  get keys() {
    return _.uniq(this.#keys);
  }

  get item() {
    return { ...this.#item };
  }

  set validation(validation) {
    this.#validation = validation;
  }

  get validation() {
    return this.#validation;
  }

  setModelKey(source, path, defaultValue) {
    this.#keys = _.union(this.keys, [path]);
    this.#item[path] = (this.shape && this.shape[path])
      ? proceed(this.shape[path], _.get(source, path, defaultValue))
      : _.get(source, path, defaultValue);

    return this.#item[path];
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

  async getAllItemsFromStore() {
    try {
      if (!_.has(this, 'redisStoreKey')) throw new Error('Missing "redisStoreKey" props');
      const ids = await redis.lrange(this.redisStoreKey, 0, -1);
      const items = await Promise.all(_.map(ids, async (item) => {
        const values = await redis.hmget(item, this.keys);
        return _.zipObject(this.keys, values);
      }));
      return items;
    } catch (e) {
      // NOTE: doesn't matter if database return error (we can skip it and return empty array)
      console.error('DB Request Execution Issue:');
      console.error(e);

      return [];
    }
  }

  static sanitizeId = (...args) => _.map(args, (id) => _.words(id, /[^:]+/g)[1]);
}
