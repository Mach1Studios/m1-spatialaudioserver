import _ from 'lodash';
import { v4 as uuid } from 'uuid';

import { encryptSync } from '../services/encryption';
import Model from './model';

export default class UserModel extends Model {
  #item = {}

  #errors = []

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

  get isValid() {
    return this.#errors.length === 0;
  }

  // rules() {
  //   const validation = Model.validator();
  //   const { nickname, email, role } = this.user;
  //
  //   validation.inspect(_.isString(nickname) && nickname.length > 3, 'Field nickname should be string and has length more then 3');
  //   validation.inspect(_.isString(email))
  //
  //   // if (!_.isString(nickname) || nickname.length <= 3) this.#errors.push({ message : })
  //
  //   // TODO: should store standart validation object
  //   return validation;
  // }
}
