import _ from 'lodash';
// import validator from 'validator';

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

  // setModelRule(key, rule, message) {
  //
  // }

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

  // validationRules() {
  //
  // }
  //
  // static validator() {
  //   const errors = [];
  //   const inspect = (rule, value, message) => {
  //     if (!validator[rule](value)) errors.push({ message });
  //   };
  //   return { errors, inspect };
  // }

  // static validation(errors, rule, message) {
  //   if (!rule)
  //   return errors;
  // }
}
