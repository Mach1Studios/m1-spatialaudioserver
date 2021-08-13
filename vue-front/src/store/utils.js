import _ from 'lodash';

export default class FetchHelper {
  #defaultUrl = new URL(process.env.VUE_APP_API_URL)

  #defaultPath = ''

  #path = ''

  constructor(url) {
    this.options = {
      mode: 'cors',
    };

    if (url && _.isString(url)) {
      if (url && url !== this.#defaultUrl.origin) {
        try {
          this.#defaultUrl = new URL(url);
        } catch (e) {
          // if (e.message !== "Failed to construct 'URL': Invalid URL") throw e;
          this.#defaultPath = _.startsWith('/') ? url : `/${url}`;
        }
      }
    }
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

  async del(itemId) {
    return this.#request({ itemId, method: 'DELETE' });
  }

  async #request({ itemId, method, body }) {
    this.path = itemId;
    this.options.method = method ?? 'GET';
    this.options.body = body;

    // TODO: For next iteration need to create full response method with error handler
    try {
      const response = await fetch(this.url, this.options);

      try {
        return await response.json();
      } catch (e) {
        if (response.ok) throw new Error('Wrong JSON response');

        throw e;
      }
    } catch (e) {
      if (e.message === 'Wrong JSON response') {
        // NOTE: just skip for this
      }
      return null;
    }
  }
}
