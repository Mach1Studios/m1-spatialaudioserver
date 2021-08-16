import _ from 'lodash';

const defaultState = () => ({
  slider: {
    name: undefined,
  },
  context: new (window.AudioContext || window.webkitAudioContext)(),
  gainNodes: [],
  gainNodesAnalyser: [],
  source: null,
  view: null,
});

const actions = {
  createGainNodes({ commit, state, getters }) {
    commit('setGain');

    const { sliders, context, source } = state;
    const splitter = context.createSliders(sliders);

    source.connect(splitter);
    context.createGain = context.createGain || context.createGainNode;

    const merger = (position, slider) => {
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

      gain.gain.value = 0.1;

      splitter.connect(gain, slider, 0);
      commit('setGain', gain);
      commit('setGainAnalyser', analyser);
    };

    _.each(getters.listOfSliders, (slider) => {
      merger(1, slider);
      merger(-1, slider);
    });
  },
  updateSource({ commit }, source) {
    commit('setSource', source);
  },
  updateVolume({ commit, state }, { slider, volume }) {
    if (state.gainNodes && state.gainNodes[slider]) {
      commit('setGainVolume', { slider, volume });
    }
  },
  updateNumberOfChannels({ commit }, count) {
    commit('setNumberOfChannels', count);
  },
};

const getters = {
  listOfSlidersD(state) {
    return _.range(state.sliders * 2);
  },
  listOfSliders(state) {
    return _.range(state.sliders);
  },
  isActiveSliders(state) {
    return _.isInteger(state.sliders) && state.sliders > 0;
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
  setGainVolume(state, { slider, volume }) {
    state.gainNodes[slider].gain.setTargetAtTime(Number(volume), state.context.currentTime, 0.05);
  },
  setGainAnalyser(state, analyser) {
    if (analyser) {
      state.gainNodesAnalyser.push(analyser);
    } else {
      state.gainNodesAnalyser = [];
    }
  },
  setNumberOfChannels(state, count = 0) {
    state.sliders = count;
  },
  setSource(state, source) {
    state.view = source;
    state.source = state.context.createMediaElementSource(source);
  },
};

export default {
  namespaced: true, state: defaultState, actions, getters, mutations,
};
