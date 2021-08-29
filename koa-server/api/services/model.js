import _ from 'lodash';

export default class Model {
  #keys = []

  #item = {}

  #setModelKey(source, path, defaultValue) {
    this.#keys = _.union(this.#keys, [path]);
    return _.get(source, path, defaultValue);
  }

  get keys() {
    return _.uniq(this.#keys);
  }

  get item() {
    return { ...this.#item };
  }
}
