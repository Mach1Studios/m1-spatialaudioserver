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
    // Close old AudioContext if it exists
    if (state.AudioContext) {
      state.AudioContext.close();
    }

    const context = new (window.AudioContext || window.webkitAudioContext)();
    commit('setAudioContext', context);

    const { channels, view } = state;

    // Create a new source from the current view/audio element with the new context
    const source = context.createMediaElementSource(view);
    commit('setMediaSource', source);

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
  reset({ commit }) {
    commit('resetAudioState');
  },
};

const getters = {
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
  setAudioContext(state, AudioContext) {
    state.gainNodes = [];
    state.gainNodesAnalyser = [];
    state.AudioContext = AudioContext;
  },
  setMediaSource(state, source) {
    state.source = source;
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
  resetAudioState(state) {
    if (state.AudioContext) {
      state.AudioContext.close();
    }
    state.AudioContext = null;
    state.source = null;
    state.gainNodes = [];
    state.gainNodesAnalyser = [];
  },
};

export default {
  namespaced: true, state: defaultState, actions, getters, mutations,
};
