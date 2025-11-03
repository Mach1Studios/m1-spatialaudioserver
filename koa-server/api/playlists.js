import _ from 'lodash';
import { PlaylistModel, TrackModel } from './models';

export default {
  /**
   * @param  {Object}  ctx  the default koa context whose encapsulates
   *                          node's request and response objects into a single object
   */
  async list(ctx) {
    const { user } = ctx.session;

    ctx.body = await new PlaylistModel().getItemsByUserRole(user);
  },
  async get(ctx) {
    const { id } = ctx.params;
    const { user } = ctx.session;

    const Playlist = new PlaylistModel();

    const playlists = await Playlist.getItemsByUserRole(user);
    const playlist = _.find(playlists, { id });

    if (!playlist) ctx.throw(404, 'Playlist not found');

    const tracks = await new TrackModel().getAllItemsFromStore();

    ctx.status = 200;
    ctx.body = {
      id: playlist.id,
      name: playlist.name,
      isPublic: playlist.visibility,
      owner: {
        id: user.id,
        username: user.nickname,
      },
      tracks: _.map(playlist.tracks, (track) => {
        const { name, originalname } = _.find(tracks, { id: track });

        return {
          id: track,
          name,
          position: 0,
          description: `Original name is ${originalname}`,
          url: `wav/static/${originalname}`,
        };
      }),
    };
  },
  async getPublic(ctx) {
    const { id } = ctx.params;

    // Get playlist from Redis
    const playlistData = await ctx.redis.hgetall(`playlist:${id}`);
    if (_.isEmpty(playlistData)) ctx.throw(404, 'Playlist not found');

    const { playlist } = new PlaylistModel(playlistData);

    // Check if playlist is public
    if (!playlist.visibility) {
      ctx.throw(403, 'This playlist is private');
    }

    // Get all tracks
    const tracks = await new TrackModel().getAllItemsFromStore();

    ctx.status = 200;
    ctx.body = {
      id: playlist.id,
      name: playlist.name,
      isPublic: playlist.visibility,
      tracks: _.map(playlist.tracks, (track) => {
        const trackData = _.find(tracks, { id: track });
        if (!trackData) return null;

        const { name, originalname } = trackData;
        return {
          id: track,
          name,
          position: 0,
          description: `Original name is ${originalname}`,
          url: `wav/static/${originalname}`,
        };
      }).filter(Boolean),
    };
  },
  /**
   * Creating a new playlist by PlaylistModel and save it to DB
   * @param  {Object}  ctx  the default koa context whose encapsulates
   *                          node's request and response objects into a single object
   */
  async create(ctx) {
    const { body } = ctx.request;

    const { playlist } = new PlaylistModel(body);

    await ctx.redis.multi()
      .hset(`playlist:${playlist.id}`, playlist)
      .rpush('playlist:all', `playlist:${playlist.id}`)
      .exec();

    ctx.status = 201;
    ctx.body = playlist;
  },
  /**
   * Updating a playlist by playlist id and save it to DB
   * @param  {Object}  ctx  the default koa context whose encapsulates
   *                          node's request and response objects into a single object
   */
  async update(ctx) {
    const { id } = ctx.params;
    const { body } = ctx.request;

    if (_.isEmpty(body)) ctx.throw(400, 'Error! An empty payload was passed to the request');

    const item = await ctx.redis.hgetall(`playlist:${id}`);
    if (_.isNull(item)) ctx.throw(404);

    const payload = new PlaylistModel(item).difference(body);
    if (_.isEmpty(payload)) ctx.throw(400, 'Error! Nothing to change');

    await PlaylistModel
      .initStoreTransaction(item, payload)
      .hset(`playlist:${id}`, payload)
      .exec();

    ctx.body = { ...item, ...payload };
  },
  /**
   * Removing a playlist from DB by playlist id and return empty body with 204;
   * returns 404 if not found
   * @param  {Object}  ctx  the default koa context whose encapsulates
   *                          node's request and response objects into a single object
   */
  async remove(ctx) {
    const { id } = ctx.params;
    const key = `playlist:${id}`;
    const playlist = await ctx.redis.hgetall(key);
    if (_.isEmpty(playlist)) ctx.throw(404);

    await Promise.all([
      ctx.redis.del(key),
      ctx.redis.lrem('playlist:all', 0, key),
    ]);

    ctx.status = 204;
  },
  async getByType(ctx) {
    const { user } = ctx.session;

    const playlists = await new PlaylistModel().getItemsByUserRole(user);
    console.log(playlists);

    const body = _.reduce(playlists, (result, playlist) => {
      console.log(playlist.visibility);
      if (playlist.visibility) {
        result.public.push({
          id: playlist.id,
          // title: playlist.name,
          name: playlist.name,
          // url: `playlists/${playlist.id}`,
        });
      } else {
        result.private.push({
          id: playlist.id,
          // title: playlist.name,
          name: playlist.name,
          // url: `playlists/${playlist.id}`,
        });
      }
      return result;
    }, { public: [], private: [] });
    ctx.body = [{ section: 'public', items: body.public }, { section: 'private', items: body.private }];
    // console.log(body);
  },
};
