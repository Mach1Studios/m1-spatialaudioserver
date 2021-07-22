import _ from 'lodash';
import dashjs from 'dashjs';

const settings = {
  streaming: {
    useSuggestedPresentationDelay: false,
    lowLatencyEnabled: false,
    stableBufferTime: 20,
    bufferTimeAtTopQualityLongForm: 20,
    retryIntervals: {
      MPD: 50000,
    },
    retryAttempts: {
      MPD: 3,
    },
  },
};

const defaultState = () => ({
  isActiveStream: false,
  errors: {},
  info: {},
  player: null,
  settings,
  // url: null,
  url: `${process.env.VUE_APP_STREAM_URL}/dash/e073f4dd-bae3-472f-8e1a-3841b53476ce.mpd`,
});

const load = (ctx) => {
  if (_.isNull(ctx.state.url)) {
    return null;
  }
  if (ctx.state.player) {
    ctx.state.player.destroy();
  }
  const player = dashjs.MediaPlayer().create();

  player.updateSettings(settings);
  player.initialize(ctx.rootState.audio.view, ctx.state.url, true);
  console.log('Got');

  _.each(dashjs.MediaPlayer.events, (event) => {
    const callback = (...args) => {
      console.log(event, args);
      player.off(event, callback);
    };
    player.on(event, callback);
  });

  player.on(dashjs.MediaPlayer.events.MANIFEST_LOADED, ({ data }) => {
    console.log('MANIFEST_LOADED', data);
    const audioAdaptationSet = data.Period.AdaptationSet_asArray.find((elem) => elem.contentType === 'audio');
    const numChannels = Number(audioAdaptationSet.Representation_asArray[0].AudioChannelConfiguration.value);

    ctx.dispatch('audio/updateNumberOfChannels', numChannels, { root: true });

    const { profiles, minimumUpdatePeriod, suggestedPresentationDelay } = data;
    ctx.dispatch('updateInfo', { profiles, minimumUpdatePeriod, suggestedPresentationDelay });
  });

  // eslint-disable-next-line
  player.on(dashjs.MediaPlayer.events.ERROR, (error) => {
    console.log('error', error);
  });

  return player;
};

const actions = {
  async start(ctx, id) {
    console.log(id);
    // ctx.commit('setURL', id);
    ctx.commit('setPlayer', load(ctx));
    // const { source } = rootState.audio;

    // player.attachSource(url);
    console.log('start');
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
    store.info = { ...store.info, ...info };
  },
  setPlayer(store, player) {
    store.player = player;
  },
  setURL(store, id) {
    store.url = `${process.env.VUE_APP_STREAM_URL}/dash/${id}.mpd`;
  },
};

export default {
  namespaced: true, state: defaultState, actions, mutations,
};
