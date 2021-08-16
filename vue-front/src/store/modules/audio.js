import _ from 'lodash';

const defaultState = () => ({
  channels: 0,
  context: new (window.AudioContext || window.webkitAudioContext)(),
  gainNodes: [],
  gainNodesAnalyser: [],
  source: null,
  view: null,
});

// const merger = () => {
//   const analyser = context.createAnalyser();
//   const gain = context.createGain();
//   const panner = context.createPanner();
//
//   splitter.connect(gain, chanel, 0);
//
//   biquadFilter.connect(gain);
//   convolver.connect(gain);
//
//   panner.setPosition(1, 0, 0);
//   panner.panningModel = 'equalpower';
//
//   gain.connect(panner);
//
//   gain.connect(analyser);
//
//   analyser.connect(context.destination);
//   panner.connect(context.destination);
//
//   gain.gain.value = 0.1;
// }

const actions = {
  createGainNodes({ commit, state, getters }) {
    console.log('flush all channels settings');
    commit('setGain');

    const { channels, context, source } = state;
    const splitter = context.createChannelSplitter(channels);

    source.connect(splitter);
    context.createGain = context.createGain || context.createGainNode;

    const merger = (position, channel) => {
      if (position !== -1 && position !== 1) throw new Error('Broken position');
      const analyser = context.createAnalyser();
      const gain = context.createGain();
      const panner = context.createPanner();

      panner.setPosition(position, 0, 0);
      panner.panningModel = 'equalpower';

      gain.connect(panner);
      gain.connect(analyser);

      analyser.connect(context.destination);
      panner.connect(context.destination);

      gain.gain.value = 0;

      splitter.connect(gain, channel, 0);
      commit('setGain', gain);
      commit('setGainAnalyser', analyser);
    };

    _.each(getters.listOfChannels, (channel) => {
      merger(1, channel);
      merger(-1, channel);

      // const analyser = context.createAnalyser();
      // const gain = context.createGain();
      // const panner = context.createPanner();
      //
      // const index = channel % 2 === 0 ? -1 : 1;
      //
      // panner.setPosition(index, 0, 0);
      // panner.panningModel = 'equalpower';
      //
      // gain.connect(panner);
      // gain.connect(analyser);
      //
      // analyser.connect(context.destination);
      // panner.connect(context.destination);
      //
      // gain.gain.value = 0.1;
      //
      // splitter.connect(gain, channel, 0);
      // commit('setGain', gain);
      // commit('setGainAnalyser', analyser);
    });

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
  listOfChannelsD(state) {
    return _.range(state.channels * 2);
  },
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
    state.gainNodes[channel].gain.setTargetAtTime(volume * 0.5, state.context.currentTime, 0.05);
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
