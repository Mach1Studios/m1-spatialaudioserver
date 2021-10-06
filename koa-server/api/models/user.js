import _ from 'lodash';
import { v4 as uuid } from 'uuid';

import { encryptSync } from '../services/encryption';
import Model from './model';

export default class UserModel extends Model {
  #item = {}

  #validation = {
    nickname: 'required|minLength:3',
    email: 'required|email',
    role: 'required|in:admin,user',
    password: 'required|minLength:8',
  }

  #errors = []

  constructor(item, { validation = true } = {}) {
    super(item);

    this.setModelKey(item, 'id', uuid());
    this.setModelKey(item, 'nickname');
    this.setModelKey(item, 'email');
    this.setModelKey(item, 'role', 'user');
    this.setModelKey(item, 'lastSeen');

    if (validation) {
      this.validation = this.#validation;
    }

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
}
