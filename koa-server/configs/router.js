import _ from 'lodash';
import Router from '@koa/router';
import multer from '@koa/multer';

import * as resources from '../api';

// const dist = new URL('../public/', import.meta.url).pathname;
const uploader = multer();

const router = new Router();
const supportMethods = ['list', 'get', 'post', 'put', 'del'];

_.each(resources, (methods, resource) => {
  _.each(methods, (callback, method) => {
    if (method === 'post' && resource === 'upload') {
      router[method](`/${resource}`, uploader.any(), callback);
      return;
    }
    if (supportMethods.includes(method)) {
      switch (method) {
        case 'get':
          router.get(`/${resource}/:id`, callback);
          break;
        case 'list':
          router.get(`/${resource}`, callback);
          break;
        default:
          router[method](`/${resource}`, callback);
          break;
      }
    }
  });
});

export default router;
