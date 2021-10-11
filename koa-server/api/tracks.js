// eslint-disable-next-line
import { readdir, rm } from 'fs/promises';

import _ from 'lodash';
import got from 'got';
import { DateTime } from 'luxon';

import { PlaylistModel, TrackModel } from './models';

export default {
  /**
   * List of methods that will be called only if `authenticator` method success
   * @type {Array}
   */
  protectored: ['update', 'del'],
  /**
   * Starting play sound file by id; send a request to the transcoded Nginx server
   *  supported dynamic and static mpeg-dash behavior
   * @param  {Object}  ctx  the default koa context whose encapsulates
   *                          node's request and response objects into a single object
   */
  async get(ctx) {
    const { id } = ctx.params;
    const { user } = ctx.session;

    const track = await ctx.redis.hgetall(`track:${id}`);
    if (_.isEmpty(track)) ctx.throw(404);

    const Playlist = new PlaylistModel();

    await Playlist.getItemsByUserRole(user);
    if (!(user && user.role === 'admin') && !Playlist.isTrackIncludes(id)) {
      ctx.throw(401, 'Permission deny');
    }

    // TODO: need to start to store information about prepared cache for file [mpeg-dash manifest];
    // and should be added the status of live broadcast

    // FIXME: all this setting need to move to env var
    await got.get(`http://m1-transcode/play?sound=${track.originalname}&id=${track.id}`).json();
    await ctx.redis.hset(`track:${id}`, { prepared: true });
    ctx.status = 204;
  },
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
      const items = await new TrackModel().getAllItemsFromStore();
      ctx.body = _.map(items, (item) => new TrackModel(item).track);
      return;
    }

    const Playlist = new PlaylistModel();

    await Playlist.getItemsByUserRole(user);
    if (Playlist.availableTracksId.length !== 0) {
      const tracks = await new TrackModel().getAllItemsFromStore();

      const items = _.filter(tracks, ({ id }) => Playlist.isTrackIncludes(id));
      ctx.body = _.map(items, (item) => new TrackModel(item).track);
    }
  },
  async update(ctx) {
    const { id } = ctx.params;
    const { body } = ctx.request;

    if (_.isEmpty(body)) ctx.throw(400, 'Error! An empty payload was passed to the request');

    const item = await ctx.redis.hgetall(`track:${id}`);
    if (_.isNull(item)) ctx.throw(404);
    const payload = {
      name: _.get(body, 'name', item.name),
      updated: DateTime.now(),
    };

    await ctx.redis.hset(`track:${id}`, payload);
    ctx.body = { ...item, ...payload };
  },
  /**
   * Removing a file and its prepared cache from the file system and database
   * @param  {Object}  ctx  the default koa context whose encapsulates
   *                          node's request and response objects into a single object
   */
  async remove(ctx) {
    const { id } = ctx.params;
    const key = `track:${id}`;
    const track = await ctx.redis.hgetall(key);

    if (_.isEmpty(track)) ctx.throw(404);
    const playlists = await ctx.redis.smembers(`${key}:playlists`);

    if (!_.isEmpty(playlists)) {
      const RTransaction = ctx.redis.pipeline();
      const WTransaction = ctx.redis.pipeline();

      _.each(playlists, (playlist) => {
        RTransaction.hget(`playlist:${playlist}`, 'tracks', (err, value) => {
          const items = _.compact(
            _.isString(value)
              ? _.pull(value.split(','), id)
              : [],
          );
          WTransaction.hset(`playlist:${playlist}`, 'tracks', items.toString());
        });
      });
      await RTransaction.exec();
      await WTransaction.exec();
    }

    const transaction = ctx.redis.multi()
      .del(key)
      .lrem('tracks:all', 0, key)
      .exec();

    const options = { force: true, recursive: true };
    await Promise.all([
      rm(new URL(`../public/preload/${id}`, import.meta.url), options),
      rm(new URL(`../public/${track}`, import.meta.url), options),
      transaction,
    ]);

    ctx.status = 204;
  },
};
