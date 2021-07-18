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
  url: `${process.env.VUE_APP_STREAM_URL}/dash/play.mpd`,
});

const actions = {
  async load({ commit, state }, { source }) {
    if (state.player) {
      state.player.destroy();
      commit('setPlayer', null);
    }

    const player = dashjs.MediaPlayer().create();
    player.updateSettings(settings);
    player.initialize(source, this.url, true);

    player.on(dashjs.MediaPlayer.events.MANIFEST_LOADED, ({ data }) => {
      console.log('MANIFEST_LOADED', data);
      const audioAdaptationSet = data.Period.AdaptationSet_asArray.find((elem) => elem.contentType === 'audio');
      const numChannels = Number(audioAdaptationSet.Representation_asArray[0].AudioChannelConfiguration.value);

      this.updateNumberOfChannels(numChannels);

      const { profiles, minimumUpdatePeriod, suggestedPresentationDelay } = data;
      console.log('before updateInfo');
      this.updateInfo({ profiles, minimumUpdatePeriod, suggestedPresentationDelay });
    });

    // eslint-disable-next-line
    player.on(dashjs.MediaPlayer.events.ERROR, (error) => {
      console.log('error', error);
    });

    commit('setPlayer', player);
    commit('audio/setSource', source, { root: true });
  },
  async start({ commit, state }, id) {
    commit('setURL', id);

    const { player, url } = state;
    // const { source } = rootState.audio;

    player.attachSource(url);
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
