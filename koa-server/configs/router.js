import _ from 'lodash';
import Router from '@koa/router';
import multer from '@koa/multer';

import * as resources from '../api';

// const dist = new URL('../public/', import.meta.url).pathname;
const uploader = multer();

const router = new Router();
const supportMethods = ['get', 'post', 'put', 'del'];

_.each(resources, (methods, resource) => {
  _.each(methods, (callback, method) => {
    if (supportMethods.includes(method)) {
      if (method === 'post' && resource === 'upload') {
        router[method](`/${resource}`, uploader.any(), callback);
      } else {
        router[method](`/${resource}`, callback);
      }
    }
  });
});

export default router;
