/* eslint-disable no-param-reassign */
/* eslint-disables */
// import _ from 'lodash';

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
});

const actions = {
  async start({ commit }, player) {
    commit('setPlayer', player);

    // console.log('init', player);

    // const tracks = await new FetchHelper().send('/tracks');
    //
    // commit('setTracks', _.map(tracks, (track, index) => ({ id: index + 1, name: track, duration: 'repeat' })));
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

const mutations = {
  setPlayer(store, player) {
    store.player = player;
  },
  setChannels(store, count = 0) {
    store.channels = count;
  },
  setInfo(store, info = {}) {
    store.info = { ...store.info, ...info };

    console.log(store.info);
  },
};

export default {
  namespaced: true, state, actions, mutations,
};
