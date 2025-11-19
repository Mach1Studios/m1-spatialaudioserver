import { rm } from 'fs/promises';
import { existsSync } from 'fs';

import _ from 'lodash';
import { DateTime } from 'luxon';

import { PlaylistModel, TrackModel } from './models';

export default {
  /**
   * Starting play sound file by id; send a request to the transcoded Nginx server
   *  supported dynamic and static mpeg-dash behavior
   * @param  {Object}  ctx  the default koa context whose encapsulates
   *                          node's request and response objects into a single object
   */
  async get(ctx) {
    try {
      const { id } = ctx.params;
      const { user } = ctx.session || {};
      const { part } = ctx.request.query;
      const item = await ctx.redis.hgetall(`track:${id}`);
      if (_.isEmpty(item)) {
        ctx.throw(404, 'Track not found');
        return;
      }

      const Playlist = new PlaylistModel();

      await Playlist.getItemsByUserRole(user);
      if (!(user && user.role === 'admin') && !Playlist.isTrackIncludes(id)) {
        ctx.throw(401, 'Permission deny');
        return;
      }

      // TODO: need to start to store information about prepared cache for file [mpeg-dash manifest];
      // and should be added the status of live broadcast

      if (part === 'manifest.mpd') {
        const { track } = new TrackModel(item);
        await ctx.redis.hset(`track:${id}`, {
          listened: track.listened + 1,
          prepared: true,
        });
      }
      ctx.status = 204;
    } catch (error) {
      // Re-throw Koa errors (which have status codes)
      if (error.status) {
        throw error;
      }
      // Log unexpected errors and return 500
      console.error('Error in tracks.get:', error);
      ctx.throw(500, 'Internal server error');
    }
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
  /**
   * Check all tracks for missing DASH manifests and return list
   * @param  {Object}  ctx  the default koa context
   */
  async checkManifests(ctx) {
    const { user } = ctx.session;
    
    if (!user || user.role !== 'admin') {
      ctx.throw(403, 'Admin access required');
      return;
    }

    const items = await new TrackModel().getAllItemsFromStore();
    const results = [];

    for (const item of items) {
      const track = new TrackModel(item).track;
      const dashPath = `/public/preload/${track.id}/manifest.mpd`;
      const hlsPath = `/public/hls/${track.id}/manifest.m3u8`;
      
      const hasDash = existsSync(dashPath);
      const hasHls = existsSync(hlsPath);
      
      results.push({
        id: track.id,
        name: track.name,
        hasDash,
        hasHls,
        needsRegeneration: !hasDash || !hasHls,
      });
      
      if (!hasDash || !hasHls) {
        console.log(`[MANIFEST CHECK] Track ${track.name} (${track.id}) missing manifests - DASH: ${hasDash}, HLS: ${hasHls}`);
      }
    }

    const missing = results.filter(r => r.needsRegeneration);
    console.log(`[MANIFEST CHECK] Total tracks: ${results.length}, Missing manifests: ${missing.length}`);
    
    ctx.body = {
      total: results.length,
      missing: missing.length,
      tracks: results,
    };
  },
  /**
   * Regenerate DASH/HLS manifests for a specific track
   * @param  {Object}  ctx  the default koa context
   */
  async regenerateManifest(ctx) {
    const { user } = ctx.session;
    const { id } = ctx.params;
    
    if (!user || user.role !== 'admin') {
      ctx.throw(403, 'Admin access required');
      return;
    }

    const item = await ctx.redis.hgetall(`track:${id}`);
    if (_.isEmpty(item)) {
      ctx.throw(404, 'Track not found');
      return;
    }

    const track = new TrackModel(item).track;
    console.log(`[MANIFEST REGEN] Starting regeneration for ${track.name} (${id})`);

    try {
      // Call the nginx reload endpoint internally
      const response = await fetch(`http://172.20.0.4/api/reload?id=${id}&name=${encodeURIComponent(track.originalname)}`);
      
      if (!response.ok) {
        console.error(`[MANIFEST REGEN] Failed for ${track.name}: ${response.status}`);
        ctx.throw(500, 'Failed to regenerate manifest');
        return;
      }

      console.log(`[MANIFEST REGEN] Successfully regenerated for ${track.name}`);
      ctx.body = { 
        success: true, 
        message: `Manifest regenerated for ${track.name}`,
        id,
      };
    } catch (error) {
      console.error(`[MANIFEST REGEN] Error for ${track.name}:`, error);
      ctx.throw(500, `Failed to regenerate manifest: ${error.message}`);
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
      rm(`/public/preload/${id}`, options),
      rm(`/public/${track.originalname}`, options),
      transaction,
    ]);

    ctx.status = 204;
  },
};
