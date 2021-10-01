// eslint-disable-next-line
import { readdir, rm } from 'fs/promises';

import _ from 'lodash';
import got from 'got';

import { PlaylistModel, TrackModel } from './models';


const sanitizeId = (...args) => _.map(args, (id) => _.words(id, /[^:]+/g)[1]);

export default {
  /**
   * List of methods that will be called only if `authenticator` method success
   * @type {Array}
   */
  protectored: ['del'],
  /**
   * Scaning and returns a list of available sound files (by match .wav extention)
   * from the public dir
   * @param  {Object}  ctx  the default koa context whose encapsulates
   *                          node's request and response objects into a single object
   */
  async list(ctx) {
    ctx.body = [];
    // NOTE: must be changed when there will be too many files
    // or moved to another db
    // or added pagination
    // const items = await ctx.redis.find('file*', 100);
    // const keys = sanitizeId(...items);
    //
    // const tracks = await ctx.redis.mget(...items);
    // const body = _.zipWith(keys, tracks, (id, name) => ({ id, name }));
    //
    // ctx.body = body;
    const { user } = ctx.session;
    const items = await ctx.redis.lrange('tracks:all', 0, -1);

    if (user && user.role === 'admin') {
      const keys = sanitizeId(...items);
      console.log(keys);

      const tracks = await ctx.redis.mget(...items);
      const body = _.zipWith(keys, tracks, (id, name) => ({ id, name }));

      ctx.body = body;
    }

    // const Playlist = new PlaylistModel();
    //
    // await Playlist.getItemsByUserRole(user);
    // console.log(Playlist.availableTracksId);
    // if (Playlist.availableTracksId.length !== 0) {
    //   const tracks = await ctx.redis.mget(...Playlist.availableTracksId);
    //
    //   console.log(tracks);
    //   ctx.body = tracks;
    // }
  },
  /**
   * Starting play sound file by id; send a request to the transcoded Nginx server
   *  supported dynamic and static mpeg-dash behavior
   * @param  {Object}  ctx  the default koa context whose encapsulates
   *                          node's request and response objects into a single object
   */
  async get(ctx) {
    const { id } = ctx.params;

    const track = await ctx.redis.get(`track:${id}`);
    if (_.isNull(track)) ctx.throw(404);

    // TODO: need to start to store information about prepared cache for file [mpeg-dash manifest];
    // and should be added the status of live broadcast

    await got.get(`http://localhost:8080/play?sound=${track}&id=${id}`).json();
    ctx.status = 202;
  },
  /**
   * Removing a file and its prepared cache from the file system and database
   * @param  {Object}  ctx  the default koa context whose encapsulates
   *                          node's request and response objects into a single object
   */
  async del(ctx) {
    const { id } = ctx.params;

    const track = await ctx.redis.getdel(`track:${id}`);
    if (_.isNull(track)) ctx.throw(404);

    const options = { force: true, recursive: true };
    await Promise.all([
      rm(new URL(`../public/preload/${id}`, import.meta.url), options),
      rm(new URL(`../public/${track}`, import.meta.url), options),
    ]);

    ctx.status = 204;
  },
};
