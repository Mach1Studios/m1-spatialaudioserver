import _ from 'lodash';

export default class FetchHelper {
  #defaultUrl = new URL(process.env.VUE_APP_API_URL)

  #defaultPath = process.env.VUE_APP_API_PATH || ''

  #path = ''

  constructor(url, options = {}) {
    this.options = {
      mode: 'cors',
      referrerPolicy: 'origin-when-cross-origin',
      credentials: 'include',
      ...options,
    };

    if (url && _.isString(url)) {
      if (url && url !== this.#defaultUrl.origin) {
        try {
          this.#defaultUrl = new URL(url);
        } catch (e) {
          this.#defaultPath = _.startsWith('/') ? `${this.#defaultPath}${url}` : `${this.#defaultPath}/${url}`;
        }
      }
    }
  }

  dispatch(proxy) {
    this.dispatch = proxy;
    return this;
  }

  get path() {
    return `${this.#defaultPath}${this.#path}`;
  }

  set path(value) {
    if (!_.isString(value) || value.length === 0) {
      this.#path = '';
      return;
    }
    // TODO: it should be some validation hanlder first
    this.#path = _.startsWith('/') ? value : `/${value}`;
  }

  get url() {
    // TODO: need to add query
    return new URL(this.path, this.#defaultUrl);
  }

  async get(itemId) {
    return this.#request({ itemId });
  }

  async post(body, { itemId } = {}) {
    return this.#request({ itemId, body, method: 'POST' });
  }

  async put(body, { itemId } = {}) {
    const id = _.get(body, 'id', itemId);
    return this.#request({ itemId: id, body, method: 'PUT' });
  }

  async del(itemId) {
    return this.#request({ itemId, method: 'DELETE' });
  }

  async #request({ itemId, method, body }) {
    this.path = itemId;
    this.options.method = method ?? 'GET';
    if (_.isObject(body) && !(body instanceof FormData)) {
      _.set(this.options, 'headers.Accept', 'application/json');
      _.set(this.options, 'headers.Content-Type', 'application/json');

      try {
        this.options.body = JSON.stringify(body);
      } catch (e) {
        throw new Error('Broken request payload');
      }
    } else {
      this.options.body = body;
    }

    const response = await fetch(this.url, this.options);
    if (response.status === 204) return null;

    const payload = await response.json();
    if (response.ok) return payload;

    throw payload;
  }
}
