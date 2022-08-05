import _ from 'lodash';
import { validate as isUuid } from 'uuid';
import HLS from 'hls.js';

const defaultState = () => ({
  errors: {},
  info: {},
  isActiveStream: false,
  player: null,
  processing: false,
  // settings,
  type: null,
});

const load = (ctx) => new Promise(() => {
  // if (_.isEmpty(ctx.state.info.url)) reject(new Error('Missing stream url'));
  if (ctx.state.player) {
    ctx.state.player.destroy();
    ctx.commit('setPlayer', null);
  }

  const Stream = new HLS({ debug: false, defaultAudioCodec: 'mp4a.40.5' });

  if (HLS.isSupported()) {
    console.log('hello hls.js!');
  }

  // Stream.initialize(ctx.rootState.audio.view, ctx.state.info.url, false);

  // ctx.commit('setPlayer', Stream);

  Stream.attachMedia(ctx.rootState.audio.view);

  // ctx.dispatch('logs/createMessage', { message: 'HLS stream manifest loaded' }, { root: true });

  Stream.on(HLS.Events.MEDIA_ATTACHED, () => {
    console.log('video and hls.js are now bound together !');

    Stream.loadSource('http://localhost:8080/hls/static/3f33a88c-63da-4871-8436-a14661ff657c/master.m3u8');
    Stream.on(HLS.Events.MANIFEST_PARSED, (event, data) => {
      console.log(
        `manifest loaded, found ${data.levels.length} quality level`,
      );

      console.log(data);
    });
  });
});

const actions = {
  async start(ctx, url) {
    ctx.commit('setActiveStream', false);
    ctx.commit('setStreamInformation', { url });
    ctx.commit('loader', { description: 'Starting to initialize the audio player' }, { root: true });

    await load(ctx);
  },
  async stop({ commit, state }) {
    if (state.player && state.player.destroy) state.player.destroy();

    commit('setActiveStream', false);
    commit('setPlayer', null);
    commit('tracks/setPlayingTrack', null, { root: true });
  },
  updateInfo(ctx, info) {
    ctx.commit('setStreamInformation', info);
    if (_.isNull(ctx.state.player)) return;

    const activeStream = ctx.state.player.getActiveStream();
    if (activeStream) {
      const streamInfo = activeStream.getStreamInfo();
      const dashMetrics = ctx.state.player.getDashMetrics();
      const dashAdapter = ctx.state.player.getDashAdapter();

      if (dashMetrics && streamInfo) {
        const periodIdx = streamInfo.index;
        const repSwitch = dashMetrics.getCurrentRepresentationSwitch('audio', true);
        const audioBufferLevel = dashMetrics.getCurrentBufferLevel('audio', true);
        const audioBitRate = repSwitch
          ? Math.round(dashAdapter.getBandwidthForRepresentation(repSwitch.to, periodIdx) / 1000)
          : undefined;

        ctx.commit('setStreamInformation', { audioBufferLevel, audioBitRate });
        ctx.commit('setActiveStream', true);
      } else {
        ctx.commit('setActiveStream', activeStream.isActive());
      }
    } else {
      // const dashMetrics = ctx.state.player.getDashMetrics();
      // const dashAdapter = ctx.state.player.getDashAdapter();
      //
      // if (dashMetrics) {
      //   const repSwitch = dashMetrics.getCurrentRepresentationSwitch('audio', true);
      //
      //   console.log(dashAdapter);
      //   const audioBufferLevel = dashMetrics.getCurrentBufferLevel('audio', true);
      //   const audioBitRate = repSwitch
      //     ? Math.round(dashAdapter.getBandwidthForRepresentation(repSwitch.to) / 1000)
      //     : undefined;
      //
      //   console.log(audioBufferLevel, audioBitRate);
      //
      //   ctx.commit('setActiveStream', true);
      // }
    }
  },
};

const mutations = {
  setActiveStream(store, status) {
    store.isActiveStream = status;
  },
  setStreamInformation(store, payload) {
    const {
      processing, url, type, ...info
    } = payload;

    store.info = { ...store.info, ...info };
    store.processing = _.isBoolean(processing) ? processing : false;

    // TODO: need to start to track this
    store.type = type || null;
    // NOTE: replace parameters after main storage update if need it
    if (_.isString(url) && isUuid(url)) {
      store.info.url = `${process.env.VUE_APP_STREAM_URL}/dash/static/${payload.url}/manifest.mpd`;
      store.processing = true;
    }
  },
  setPlayer(store, player) {
    store.player = player;
  },
};

export default { namespaced: true, state: defaultState, actions, mutations };
