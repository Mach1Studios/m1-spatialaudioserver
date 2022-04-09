import _ from 'lodash';

const defaultState = () => ({
  channels: 0,
  AudioContext: null,
  gainNodes: [],
  gainNodesAnalyser: [],
  source: null,
  view: null,
});

const actions = {
  createGainNodes({ commit, state, getters }, volume = 0) {
    const context = new (window.AudioContext || window.webkitAudioContext)();
    commit('setAudioContext', context);

    const { channels, source } = state;
    const splitter = context.createChannelSplitter(channels);
    const merger = context.createChannelMerger(channels * 2);

    source.connect(splitter);
    context.createGain = context.createGain || context.createGainNode;

    let position = -1;
    const processing = (channel) => {
      const analyser = context.createAnalyser();
      const gain = context.createGain();
      const panner = context.createPanner();

      gain.gain.value = volume;

      panner.setPosition(position, 0, 0);
      panner.panningModel = 'equalpower';
      panner.connect(gain);

      splitter.connect(gain, channel);

      gain.connect(merger, 0, position === -1 ? 0 : 1);
      gain.connect(analyser);

      commit('setGain', gain);
      commit('setGainAnalyser', analyser);

      position *= -1;
      if (position === 1) processing(channel);
    };

    _.each(getters.listOfChannels, processing);
    merger.connect(context.destination);

    commit('loader', { enable: false }, { root: true });
    state.view.play();
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
  listOfChannels(state) {
    return _.range(state.channels);
  },
  isActiveChannels(state) {
    return _.isInteger(state.channels) && state.channels > 0;
  },
};

const mutations = {
  setAudioContext(state, AudioContext) {
    state.gainNodes = [];
    state.AudioContext = AudioContext;

    if (state.view && _.isNull(state.source)) {
      state.source = AudioContext.createMediaElementSource(state.view);
    }
  },
  setGain(state, gain) {
    if (gain) {
      state.gainNodes.push(gain);
    }
  },
  setGainVolume(state, { channel, volume }) {
    state.gainNodes[channel].gain.setTargetAtTime(volume * 1, state.AudioContext.currentTime, 0.05);
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
  },
};

export default {
  namespaced: true, state: defaultState, actions, getters, mutations,
};
