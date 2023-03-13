import _ from 'lodash';
import { validate as isUuid } from 'uuid';

// eslint-disable-next-line
import defaultAdapter from '../adapters/default';
import additionalAdapter from '../adapters/additional';

// const settings = {
//   streaming: {
//     useSuggestedPresentationDelay: false,
//     lowLatencyEnabled: false,
//     stableBufferTime: 30,
//     bufferTimeAtTopQualityLongForm: 30,
//     retryIntervals: { MPD: 10 * 1000 }, // NOTE: guys from earshot set this value to 50sec, cos sometimes it make nginx crazy, we tested on 10sec now
//     retryAttempts: { MPD: 10 },
//   },
// };

const defaultState = () => ({
  errors: {},
  info: {},
  isActiveStream: false,
  player: null,
  processing: false,
  // settings,
  type: null,
  adapter: 'dash',
});

const actions = {
  async start(ctx, url) {
    ctx.commit('setActiveStream', false);
    ctx.commit('setStreamInformation', { url });
    ctx.commit('loader', { description: 'Starting to initialize the audio player' }, { root: true });

    switch (ctx.state.adapter) {
      case 'dash':
        await defaultAdapter.load(ctx);
        break;
      case 'hls':
        await additionalAdapter.load(ctx);
        break;
      default:
        await defaultAdapter.load(ctx);
    }
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
      switch (store.adapter) {
        case 'dash':
          store.info.url = defaultAdapter.parse(payload.url);
          break;
        case 'hls':
          store.info.url = additionalAdapter.parse(payload.url);
          break;
        default:
          store.info.url = defaultAdapter.parse(payload.url);
      }
      // store.info.url = defaultAdapter.parse(payload.url); // `${process.env.VUE_APP_STREAM_URL}/dash/static/${payload.url}/manifest.mpd`;
      store.processing = true;
    }
  },
  setPlayer(store, player) {
    store.player = player;
  },
  setAdapter(store, typeOfAdapter) {
    const adapters = ['hls', 'dash'];
    store.adapter = adapters.includes(typeOfAdapter) ? typeOfAdapter : 'dash';
  },
};

export default { namespaced: true, state: defaultState, actions, mutations };
