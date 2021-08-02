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
    this.#defaultPath = value ?? '';
  }

  get url() {
    // TODO: need to add query
    return new URL(this.#defaultPath, this.#defaultUrl);
  }

  async get(path) {
    return this.#request({ path });
  }

  async post(path, body) {
    return this.#request({ path, body, method: 'POST' });
  }

  // async send(path, payload) {
  //   this.path = path;
  //
  //   // TODO: For next iteration need to create full response method with error handler
  //   try {
  //     if (payload) {
  //       this.options.method = 'POST';
  //       this.options.body = payload;
  //     }
  //     const response = await fetch(this.url, this.options);
  //
  //     try {
  //       const body = await response.json();
  //       return body;
  //     } catch (e) {
  //       if (response.ok) throw new Error('Wrong JSON response');
  //
  //       throw e;
  //     }
  //   } catch (e) {
  //     if (e.message === 'Wrong JSON response') {
  //       // NOTE: just skip for this
  //     }
  //     return null;
  //   }
  // }

  async #request({ path, method, body }) {
    this.path = path;
    this.options.method = method ?? 'GET';
    this.options.body = body;

    // TODO: For next iteration need to create full response method with error handler
    try {
      const response = await fetch(this.url, this.options);

      try {
        return await response.json();
      } catch (e) {
        console.log(e.message);
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
