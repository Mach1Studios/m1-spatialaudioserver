import _ from 'lodash';

const defaultState = () => ({
  channels: 0,
  context: new (window.AudioContext || window.webkitAudioContext)(),
  gainNodes: [],
  gainNodesAnalyser: [],
  source: null,
  view: null,
});

const actions = {
  createGainNodes({ commit, state, getters }, volume = 0) {
    commit('setGain');

    const { channels, context, source } = state;
    const splitter = context.createChannelSplitter(channels);
    const merger = context.createChannelMerger(channels * 2);

    source.connect(splitter);
    context.createGain = context.createGain || context.createGainNode;

    let position = -1;
    const processing = (channel) => {
      const analyser = context.createAnalyser();
      const gain = context.createGain();
      const panner = context.createPanner();

      // FIXME: analyser broken spatial sound
      // gain.connect(analyser);
      // analyser.connect(context.destination);

      gain.gain.value = volume;

      panner.setPosition(position, 0, 0);
      panner.panningModel = 'equalpower';
      panner.connect(gain);

      splitter.connect(gain, channel);
      gain.connect(merger, 0, position === -1 ? 0 : 1);

      commit('setGain', gain);
      commit('setGainAnalyser', analyser);

      position *= -1;
      if (position === 1) processing(channel);
    };

    _.each(getters.listOfChannels, processing);
    merger.connect(context.destination);

    // commit('loader', { enable: false }, { root: true });
  },
  updateSource({ commit }, source) {
    commit('setSource', source);
  },
  updateVolume({ commit, state }, { channel, volume }) {
    if (state.gainNodes && state.gainNodes[channel]) {
      commit('setGainVolume', { channel, volume });
    }
  },
  updateNumberOfChannels({ commit }, count) {
    commit('setNumberOfChannels', count);
  },
};

const getters = {
  listOfDecodeChannels(state) {
    return _.range(state.channels * 2);
  },
  listOfChannels(state) {
    return _.range(state.channels);
  },
  listOfInputChannels(state) {
    return _.range(state.channels % 2); // Added for every other channel
  },
  isActiveChannels(state) {
    return _.isInteger(state.channels) && state.channels > 0;
  },
};

const mutations = {
  setGain(state, gain) {
    if (gain) {
      state.gainNodes.push(gain);
    } else {
      state.gainNodes = [];
    }
  },
  setGainVolume(state, { channel, volume }) {
    state.gainNodes[channel].gain.setTargetAtTime(volume * 1, state.context.currentTime, 0.05);
  },
  setGainAnalyser(state, analyser) {
    if (analyser) {
      state.gainNodesAnalyser.push(analyser);
    } else {
      state.gainNodesAnalyser = [];
    }
  },
  setNumberOfChannels(state, count = 0) {
    state.channels = count;
  },
  setSource(state, source) {
    state.view = source;
    state.source = state.context.createMediaElementSource(source);
  },
};

export default {
  namespaced: true, state: defaultState, actions, getters, mutations,
};
