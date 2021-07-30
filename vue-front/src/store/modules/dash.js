import _ from 'lodash';
import { validate as isUuid } from 'uuid';
import dashjs from 'dashjs';

const settings = {
  streaming: {
    useSuggestedPresentationDelay: true,
    // lowLatencyEnabled: false,
    // stableBufferTime: 20,
    // bufferTimeAtTopQualityLongForm: 20,
    retryIntervals: {
      MPD: 50000,
    },
    retryAttempts: {
      MPD: 5,
    },
  },
};

const defaultState = () => ({
  errors: {},
  info: {},
  isActiveStream: false,
  player: null,
  processing: false,
  settings,
});

const load = (ctx) => new Promise((resolve, reject) => {
  if (_.isEmpty(ctx.state.info.url)) reject(new Error('Missing stream url'));
  if (ctx.state.player) {
    ctx.state.player.destroy();
    ctx.commit('setPlayer', null);
  }

  const player = dashjs.MediaPlayer().create();

  player.updateSettings(settings);
  player.initialize(ctx.rootState.audio.view, ctx.state.info.url, true);

  ctx.commit('setPlayer', player);

  _.each(dashjs.MediaPlayer.events, (event) => {
    const callback = (...args) => {
      console.log(event, args);
      player.off(event, callback);
    };
    player.on(event, callback);
  });

  player.on(dashjs.MediaPlayer.events.MANIFEST_LOADED, ({ data }) => {
    const audioAdaptationSet = data.Period.AdaptationSet_asArray.find((elem) => elem.contentType === 'audio');
    const numChannels = Number(audioAdaptationSet.Representation_asArray[0].AudioChannelConfiguration.value);
    console.log(data);

    ctx.dispatch('audio/updateNumberOfChannels', numChannels, { root: true });
    const { profiles, minimumUpdatePeriod, suggestedPresentationDelay } = data;
    if (ctx.state.processing || !profiles) {
      ctx.commit('setStreamInformation', { processing: false });
      load(ctx).then((result) => resolve(result));
    }

    ctx.dispatch('updateInfo', { profiles, minimumUpdatePeriod, suggestedPresentationDelay });
  });

  player.on(dashjs.MediaPlayer.events.CAN_PLAY, () => {
    ctx.commit('setActiveStream', true);
    ctx.commit('loader', { enable: false }, { root: true });
  });

  player.on(dashjs.MediaPlayer.events.ERROR, async (error) => {
    if (error.error.code === 10 || error.error.code === 31) {
      ctx.commit('loader', { description: 'Waiting dash stream configurations' }, { root: true });
      ctx.commit('setStreamInformation', { processing: true });

      load(ctx).then((result) => resolve(result));
    } else if (error.error.code !== 22) {
      console.error('Got unhandled DASH stream error:');
      console.error(error.error);
    }
  });
});

const actions = {
  async start(ctx, url) {
    ctx.commit('setStreamInformation', { url });
    ctx.commit('loader', { description: 'Starting to initialize the audio player' }, { root: true });

    await load(ctx);
  },
  async stop({ commit, state }) {
    if (state.player && state.player.destroy) state.player.destroy();

    commit('setPlayer', null);
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
    }
  },
};

const mutations = {
  setActiveStream(store, status) {
    store.isActiveStream = status;
  },
  setStreamInformation(store, payload) {
    const { processing, url, ...info } = payload;

    store.info = { ...store.info, ...info };
    store.processing = _.isBoolean(processing) ? processing : false;
    // NOTE: replace parameters after main storage update if need it
    if (_.isString(url) && isUuid(url)) {
      // store.info.url = `${process.env.VUE_APP_STREAM_URL}/content/${payload.url}.mp4/manifest.mpd`;
      store.info.url = `${process.env.VUE_APP_STREAM_URL}/dash/static/${payload.url}/manifest.mpd`;
      store.processing = true;
    }
  },
  setPlayer(store, player) {
    store.player = player;
  },
};

export default {
  namespaced: true, state: defaultState, actions, mutations,
};
