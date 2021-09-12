import _ from 'lodash';
import { v4 as uuid } from 'uuid';
import Model from './services/model';

class PlaylistModel extends Model {
  constructor(item) {
    super();

    this.setModelKey(item, 'id', uuid());
    this.setModelKey(item, 'name');
    this.setModelKey(item, 'tracks', []);
    this.setModelKey(item, 'permission', []);
    this.setModelKey(item, 'visibility', false);
  }

  shape = {
    tracks: Array,
    permission: Array,
    visibility: Boolean,
  }

  get playlist() {
    return { ...this.item };
  }
}

export default {
  async list(ctx) {
    const model = new PlaylistModel();

    const items = await ctx.redis.lrange('playlist:all', 0, 100);
    const playlists = await Promise.all(_.map(items, async (item) => {
      const values = await ctx.redis.hmget(item, model.keys);

      const { playlist } = new PlaylistModel(_.zipObject(model.keys, values));

      return playlist;
    }));

    ctx.body = playlists;
  },
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
  async update(ctx) {
    const { id } = ctx.params;
    const { body } = ctx.request;

    console.log(body);

    const item = await ctx.redis.hgetall(`playlist:${id}`);
    if (_.isNull(item)) ctx.throw(404);
    if (_.isEmpty(body)) ctx.throw(400, 'Error! An empty payload was passed to the request');

    const model = new PlaylistModel(item);
    console.log(model.item);
    const payload = model.difference(body);
    if (_.isEmpty(payload)) ctx.throw(400, 'Error! Nothing to change');
    console.log(payload);

    await ctx.redis.hset(`playlist:${id}`, payload);
    ctx.body = { ...item, ...payload };
  },
  async del(ctx) {
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
};
