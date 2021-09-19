import _ from 'lodash';
import Router from '@koa/router';

import * as resources from '../api';

const router = new Router();
const supportMethods = ['list', 'get', 'post', 'create', 'put', 'save', 'update', 'del'];

const authenticator = (resource, method) => {
  const middleware = async (ctx, next) => next();
  if (!_.has(resource, 'protectored')) return middleware;

  const protectored = _.get(resource, 'protectored');
  if (_.isArray(protectored)) {
    if (!protectored.includes(method)) return middleware;
  }
  return async (ctx, next) => {
    const { user } = ctx.session;

    if (_.get(user, 'role') === 'admin') {
      await next();
    } else {
      ctx.throw(401, 'Permission deny');
    }
  };
};

_.each(resources, (methods, resource) => {
  _.each(methods, (handler, method) => {
    if (supportMethods.includes(method)) {
      const protector = authenticator(resources[resource], method);

      switch (method) {
        case 'get':
          router.get(`/${resource}/:id`, protector, handler);
          break;
        case 'list':
          router.get(`/${resource}`, protector, handler);
          break;
        case 'post':
        case 'create':
          router.post(`/${resource}`, protector, handler);
          break;
        case 'put':
        case 'save':
        case 'update':
          router.put(`/${resource}/:id`, protector, handler);
          break;
        case 'del':
          router.del(`/${resource}/:id`, protector, handler);
          break;
        default:
          router[method](`/${resource}`, protector, handler);
          break;
      }
    }
  });
});

export default router;
