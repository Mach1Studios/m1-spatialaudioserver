import _ from 'lodash';
import Router from 'koa-router';

import * as resources from '../api';

const router = new Router();
const supportMethods = ['get', 'post', 'put', 'del'];

_.each(resources, (methods, resource) => {
  _.each(methods, (callback, method) => {
    console.log(resource, method);
    if (supportMethods.includes(method)) {
      router[method](`/${resource}`, callback);
    }
  });
});

export default router;
