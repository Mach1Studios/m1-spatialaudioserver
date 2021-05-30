// import _ from 'lodash';

export default class FetchHelper {
  #defaultUrl = process.env.VUE_APP_API_URL

  #defaultPath = ''

  constructor(url) {
    this.options = {
      mode: 'cors',
    };

    if (url && url !== this.#defaultUrl) {
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
    const response = await fetch(this.url, this.options);
    const body = await response.json();

    return body;
  }
}
