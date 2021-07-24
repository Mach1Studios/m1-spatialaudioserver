import _ from 'lodash';
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
    // retryAttempts: {
    //   MPD: 3,
    // },
  },
};

const defaultState = () => ({
  errors: {},
  info: {},
  isActiveStream: false,
  player: null,
  processing: false,
  settings,
  // url: null,
  // url: `${process.env.VUE_APP_STREAM_URL}/dash/47569324-f666-4545-983a-ee7b09aed309.mpd`,
});

const wait = (sec) => new Promise((resolve) => {
  setTimeout(resolve, sec * 1000);
});

const load = async (ctx) => {
  if (_.isNull(ctx.state.url)) {
    return null;
  }
  if (ctx.state.player) {
    ctx.state.player.destroy();
  }

  console.log('w');
  await wait(5 / 1000);

  // await wait(5);
  console.log('e');

  const player = dashjs.MediaPlayer().create();

  player.updateSettings(settings);
  player.initialize(ctx.rootState.audio.view, ctx.state.info.url, true);
  console.log('Got');

  // _.each(dashjs.MediaPlayer.events, (event) => {
  //   const callback = (...args) => {
  //     console.log(event, args);
  //     player.off(event, callback);
  //   };
  //   player.on(event, callback);
  // });

  player.on(dashjs.MediaPlayer.events.MANIFEST_LOADED, ({ data }) => {
    console.log('MANIFEST_LOADED', data);
    const audioAdaptationSet = data.Period.AdaptationSet_asArray.find((elem) => elem.contentType === 'audio');
    const numChannels = Number(audioAdaptationSet.Representation_asArray[0].AudioChannelConfiguration.value);

    ctx.dispatch('audio/updateNumberOfChannels', numChannels, { root: true });

    const { profiles, minimumUpdatePeriod, suggestedPresentationDelay } = data;
    ctx.dispatch('updateInfo', { profiles, minimumUpdatePeriod, suggestedPresentationDelay });
  });

  // eslint-disable-next-line
  player.on(dashjs.MediaPlayer.events.ERROR, async (error) => {
    console.log('error', error.error.message, error);
    if (error.error.code === 10) {
      // await load(ctx);
    }
  });

  return player;
};

const actions = {
  async start(ctx, url) {
    ctx.commit('setInfo', { url });

    const player = await load(ctx);
    ctx.commit('setPlayer', player);
  },
  updateInfo(ctx, info) {
    ctx.commit('setInfo', info);

    const activeStream = ctx.state.player.getActiveStream();
    console.log('setInfo', activeStream);
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

        ctx.commit('setInfo', { audioBufferLevel, audioBitRate });
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
  setInfo(store, info = {}) {
    console.log(info);
    store.info = { ...store.info, ...info };
  },
  setPlayer(store, player) {
    store.player = player;
  },
  setStreamInformation(store, payload) {
    const { id, processing } = payload;

    store.url = (id) ? `${process.env.VUE_APP_STREAM_URL}/dash/${id}.mpd` : null;
    store.processing = _.isBoolean(processing) ? processing : false;
  },
};

export default {
  namespaced: true, state: defaultState, actions, mutations,
};
