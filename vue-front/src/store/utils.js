// import _ from 'lodash';

export default class FetchHelper {
  #defaultUrl = process.env.VUE_APP_API_URL

  #defaultPath = ''

  constructor(url) {
    this.options = {
      mode: 'cors',
    };

    if (url && url !== this.#defaultUrl) {
      this.#defaultUrl = url;
      // TODO: some behavior for custom links
    }
  }

  set path(value) {
    // TODO: it should be some validation hanlder first
    this.#defaultPath = value;
  }

  get url() {
    // TODO: need to add query
    return new URL(this.#defaultPath, this.#defaultUrl);
  }

  async send(path) {
    this.path = path;

    // TODO: For next iteration need to create full response method with error handler
    try {
      const response = await fetch(this.url, this.options);

      try {
        const body = await response.json();
        return body;
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
