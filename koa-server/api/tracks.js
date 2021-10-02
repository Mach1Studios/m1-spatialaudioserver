// eslint-disable-next-line
import { readdir, rm } from 'fs/promises';

import _ from 'lodash';
import got from 'got';

import { PlaylistModel, TrackModel } from './models';

export default {
  /**
   * List of methods that will be called only if `authenticator` method success
   * @type {Array}
   */
  protectored: ['update', 'del'],
  /**
   * Scaning and returns a list of available sound files (by match .wav extention)
   * from the public dir
   * @param  {Object}  ctx  the default koa context whose encapsulates
   *                          node's request and response objects into a single object
   */
  async list(ctx) {
    ctx.body = [];
    const { user } = ctx.session;

    if (user && user.role === 'admin') {
      ctx.body = await new TrackModel().getAllItemsFromStore();
      return;
    }

    const Playlist = new PlaylistModel();

    await Playlist.getItemsByUserRole(user);
    if (Playlist.availableTracksId.length !== 0) {
      const tracks = await new TrackModel().getAllItemsFromStore();

      ctx.body = _.filter(tracks, ({ id }) => Playlist.isTrackIncludes(id));
    }
  },
  /**
   * Starting play sound file by id; send a request to the transcoded Nginx server
   *  supported dynamic and static mpeg-dash behavior
   * @param  {Object}  ctx  the default koa context whose encapsulates
   *                          node's request and response objects into a single object
   */
  async get(ctx) {
    const { id } = ctx.params;

    const track = await ctx.redis.hgetall(`track:${id}`);
    if (_.isEmpty(track)) ctx.throw(404);

    // TODO: need to start to store information about prepared cache for file [mpeg-dash manifest];
    // and should be added the status of live broadcast

    await got.get(`http://localhost:8080/play?sound=${track.originalname}&id=${track.id}`).json();
    ctx.status = 204;
  },
  async update(ctx) {
    const { id } = ctx.params;
    const { body } = ctx.request;

    console.log(id, body);
  },
  /**
   * Removing a file and its prepared cache from the file system and database
   * @param  {Object}  ctx  the default koa context whose encapsulates
   *                          node's request and response objects into a single object
   */
  async del(ctx) {
    const { id } = ctx.params;
    const key = `track:${id}`;
    const track = await ctx.redis.hgetall(key);

    if (_.isEmpty(track)) ctx.throw(404);
    const playlists = await ctx.redis.smembers(`${key}:playlists`);
    console.log(playlists);

    // const transaction = ctx.redis.multi();
    if (!_.isEmpty(playlists)) {
      // _.each(playlists, (playlist) => {
      //
      // });
    }
    // transaction.del(key).lrem('tracks:all', 0, key);

    const options = { force: true, recursive: true };
    await Promise.all([
      // rm(new URL(`../public/preload/${id}`, import.meta.url), options),
      // rm(new URL(`../public/${track}`, import.meta.url), options),

      // transaction.exec(),
    ]);

    ctx.status = 204;
  },
};
