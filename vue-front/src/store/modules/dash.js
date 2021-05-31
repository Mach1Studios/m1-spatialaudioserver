/* eslint-disable no-param-reassign */
/* eslint-disables */
import _ from 'lodash';

// import FetchHelper from '../utils';
//

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
  errors: {},
  info: {},
  player: {},
  settings,
  url: `${process.env.VUE_APP_STREAM_URL}/dash/play.mpd`,
  channels: 0,
  source: {},
});

const actions = {
  async start({ commit }, { player, source }) {
    commit('setPlayer', { player, source });
  },
  updateChannels({ commit }, count) {
    commit('setChannels', count);
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
      }
    }
  },
};

const getters = {
  listOfChannels(store) {
    return _.range(store.channels);
  },
};

const mutations = {
  setPlayer(store, { player, source }) {
    store.player = player;
    store.source = source;
  },
  setChannels(store, count = 0) {
    store.channels = count;
  },
  setInfo(store, info = {}) {
    store.info = { ...store.info, ...info };
  },
};

export default {
  namespaced: true, state, actions, getters, mutations,
};
