import _ from 'lodash';
import { DateTime } from 'luxon';

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
    this.setModelKey(item, 'updated', timestamp);

    if (!_.has(item, 'id')) this.setModelKey(item, 'created', timestamp);
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
