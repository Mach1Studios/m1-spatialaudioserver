import Router from '@koa/router';

import auth from '../api/auth';
import playlists from '../api/playlists';
import profile from '../api/profile';
import tracks from '../api/tracks';
// import upload from '../api/upload';
import users from '../api/users';

const router = new Router({ prefix: '/v1' });

// Authorization route
router
  .post('/auth', auth.login)
  .del('/auth/logout', auth.validate, auth.logout)
  .get('/auth/validate', auth.validate);

// User profile route
router
  .get('/profile', profile.get);
// .put('/profile', auth.validate, profile.update);

// Playlist route
router
  .get('/playlists', playlists.list)
  .post('/playlists', auth.validate, playlists.create)
  .get('/playlists/getByType', playlists.getByType)
  .get('/playlists/:id', auth.validate, playlists.get)
  .put('/playlists/:id', auth.validate, playlists.update)
  .del('/playlists/:id', auth.validate, playlists.remove);

// Tracks route
router
  .get('/tracks', tracks.list)
  .get('/tracks/:id', tracks.get)
  .put('/tracks/:id', auth.validate, tracks.update)
  .del('/tracks/:id', auth.validate, tracks.remove);

// User route
router
  .get('/users', auth.validate, users.list)
  .post('/users', auth.validate, users.create)
  .del('/users/:id', auth.validate, users.remove);

export default router;
