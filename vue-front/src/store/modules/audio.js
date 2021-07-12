import _ from 'lodash';

const defaultState = () => ({
  channels: 0,
  context: new (window.AudioContext || window.webkitAudioContext)(),
  gainNodes: [],
  gainNodesAnalyser: [],
  source: null,
});

const actions = {
  createGainNodes({ commit, state, getters }) {
    commit('setGain');

    const { context, source } = state;
    const splitter = context.createChannelSplitter(state.channels);
    const merger = context.createChannelMerger(state.channels);

    const biquadFilter = context.createBiquadFilter();
    const convolver = context.createConvolver();
    const distortion = context.createWaveShaper();

    source.connect(splitter);

    distortion.connect(biquadFilter);

    context.createGain = context.createGain || context.createGainNode;

    _.each(getters.listOfChannels, (chanel) => {
      const analyser = context.createAnalyser();
      const gain = context.createGain();

      splitter.connect(gain, chanel, 0);

      biquadFilter.connect(gain);
      convolver.connect(gain);

      gain.connect(merger, 0, 0);
      gain.connect(merger, 0, 1);
      gain.connect(analyser);

      analyser.connect(context.destination);

      gain.gain.value = 0.005;
      commit('setGain', gain);
      commit('setGainAnalyser', analyser);
    });

    merger.connect(context.destination);
  },
  updateVolume({ commit, state }, { channel, volume }) {
    // console.log(channel, volume, state.gainNodes, state.gainNodes[channel]);
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
  setGain(state, gain) {
    if (gain) {
      state.gainNodes.push(gain);
    } else {
      state.gainNodes = [];
    }
  },
  setGainVolume(state, { channel, volume }) {
    state.gainNodes[channel].gain.value = Number(volume) / 10;
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
    state.source = state.context.createMediaElementSource(source);
  },
};

export default {
  namespaced: true, state: defaultState, actions, getters, mutations,
};
