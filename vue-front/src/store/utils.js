import _ from 'lodash';

console.log(process.env);

// const executeExeption = (message = 'Unknown error occurred') => {
//   console.log(process.env.VUE_APP_API_URL, message);
//   // throw new Error(message);
// };

export default class FetchHelper {
  #defaultUrl = process.env.VUE_APP_API_URL

  constructor(url = process.env.VUE_APP_API_URL) {
    console.log(_.get(process, 'env'));
    this.url = url;
    this.options = {
      mode: 'cors',
    };
  }

  // set url()

  async send(path) {
    console.log('send', this.url);
    const response = await fetch(`${this.url}${path}`);

    return response;
  }
}
