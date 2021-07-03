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

const state = () => ({
  isActiveStream: false,
  errors: {},
  info: {},
  player: {},
  settings,
  url: `${process.env.VUE_APP_STREAM_URL}/dash/play.mpd`,
});

const actions = {
  async start({ commit }, { player, source }) {
    commit('setPlayer', player);
    commit('audio/setSource', source, { root: true });
  },
  updateInfo(ctx, info) {
    ctx.commit('setInfo', info);

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
};

export default {
  namespaced: true, state, actions, mutations,
};
