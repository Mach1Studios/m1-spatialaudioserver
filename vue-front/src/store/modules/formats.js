import _ from 'lodash';

const defaultState = () => ({
  items: [
    { id: 'M1Horizon', name: 'Mach1Horizon (Mach1 Horizon/Quad) [4CH]', type: 'mach1' },
    { id: 'M1HorizonS', name: 'Mach1Horizon + Static Stereo [6CH]', type: 'mach1' },
    { id: 'M1HorizonPairs', name: 'Mach1Horizon Pairs / Quad-Binaural [8CH]', type: 'mach1' },
    { id: 'M1Spatial', name: 'Mach1Spatial [8CH]', type: 'mach1-output' },
    { id: 'M1SpatialS', name: 'Mach1Spatial + Static Stereo [10CH]', type: 'mach1' },
    { id: 'M1SpatialFaces', name: 'Mach1Spatial Vector Face [6CH]', type: 'mach1' },
    { id: '2.0_M', name: '2.0 Stereo AR', type: 'surround', numberOfChannels: 2 },
    { id: '2.0_C', name: '2.0 Stereo Cinema', type: 'surround', numberOfChannels: 2 },
    { id: '3.0_LCR', name: '3.0 LCR', type: 'surround', numberOfChannels: 3 },
    { id: '5.0_M', name: '5.0 Music', type: 'surround', numberOfChannels: 5 },
    { id: '5.1_M', name: '5.1 Music  (Pro Tools default/C|24)', type: 'surround', numberOfChannels: 6 },
    { id: '5.1_C', name: '5.1 Cinema (Pro Tools default/C|24)', type: 'surround', numberOfChannels: 6 },
    { id: '5.1_C_SMPTE', name: '5.1 SMPTE Cinema (SMPTE/ITU for Dolby Digital (AC3)', type: 'surround', numberOfChannels: 6 },
    { id: '5.1_C_Dts', name: '5.1 Dts Cinema (DTS)', type: 'surround', numberOfChannels: 6 },
    { id: '5.0.2_C', name: '5.0.2 Cinema', type: 'surround', numberOfChannels: 7 },
    { id: '5.1.2_C', name: '5.1.2 Cinema', type: 'surround', numberOfChannels: 8 },
    { id: '5.0.4_C', name: '5.0.4 Cinema', type: 'surround', numberOfChannels: 9 },
    { id: '5.1.4_C', name: '5.1.4 Cinema', type: 'surround', numberOfChannels: 10 },
    { id: 'Octahedron_M', name: '6.0 Octahedron Music', type: 'surround', numberOfChannels: 6 },
    { id: '6.0_M', name: '6.0 Cinema', type: 'surround', numberOfChannels: 6 },
    { id: '7.0_C', name: '7.0 Cinema (Pro Tools default)', type: 'surround', numberOfChannels: 7 },
    { id: '7.0_C_SDDS', name: '7.0 SDDS Cinema (Sony SDDS)', type: 'surround', numberOfChannels: 7 },
    { id: '7.0.2_C', name: '7.0.2 Cinema', type: 'surround', numberOfChannels: 9 },
    { id: '7.0.2_C_SMPTE', name: '7.0.2 SMPTE Cinema', type: 'surround', numberOfChannels: 9 },
    { id: '7.0.4_C', name: '7.0.4 Cinema', type: 'surround', numberOfChannels: 11 },
    { id: '7.1_M', name: '7.1 Music (Pro Tools default)', type: 'surround', numberOfChannels: 8 },
    { id: '7.1_C', name: '7.1 Cinema (Pro Tools default)', type: 'surround', numberOfChannels: 8 },
    { id: '7.1_C_SDDS', name: '7.1 SDDS Cinema (Sony SDDS)', type: 'surround', numberOfChannels: 8 },
    { id: '7.1.2_C', name: 'Dolby Atmos 7.1.2 Channel-Bed Cinema', type: 'surround', numberOfChannels: 10 },
    { id: '7.1.2_M', name: 'Dolby Atmos 7.1.2 Channel-Bed AR', type: 'surround', numberOfChannels: 10 },
    { id: '7.1.4_C', name: '7.1.4 Cinema', type: 'surround', numberOfChannels: 12 },
    { id: '7.1.2_C_SMPTE', name: '7.1.2 SMPTE Cinema', type: 'surround', numberOfChannels: 10 },
    { id: '9.0_C.', name: '9.0 Cinema', type: 'surround', numberOfChannels: 9 },
    { id: '9.1_C', name: '9.1 Cinema', type: 'surround', numberOfChannels: 10 },
    { id: '16.0_M', name: '16.0 Music', type: 'surround', numberOfChannels: 16 },
    { id: 'ACNSN3D', name: '1OA ACNSN3D', type: 'ambisonic', numberOfChannels: 4 },
    { id: 'ACNSN3DO2A', name: '2OA ACNSN3D', type: 'ambisonic', numberOfChannels: 9 },
    { id: 'ACNSN3DO3A', name: '3OA ACNSN3D', type: 'ambisonic', numberOfChannels: 16 },
    { id: 'FuMa', name: '1OA FuMa', type: 'ambisonic', numberOfChannels: 4 },
    { id: 'FuMaO2A', name: '2OA FuMa', type: 'ambisonic', numberOfChannels: 9 },
    { id: 'FuMaO3A', name: '3OA FuMa', type: 'ambisonic', numberOfChannels: 16 },
    { id: 'TBE', name: 'FB360 / TBE Hybrid 2OA', type: 'ambisonic', numberOfChannels: 8 },
    { id: 'ACNSN3DmaxRE1oa', name: '1OA ANCSN3D maxRE', type: 'ambisonic', numberOfChannels: 4 },
    { id: 'ACNSN3DmaxRE2oa', name: '2OA ANCSN3D maxRE', type: 'ambisonic', numberOfChannels: 9 },
    { id: 'ACNSN3DmaxRE3oa', name: '3OA ANCSN3D maxRE', type: 'ambisonic', numberOfChannels: 16 },
    { id: 'ACNSN3DmaxRE4oa', name: '4OA ANCSN3D maxRE', type: 'ambisonic', numberOfChannels: 25 },
    { id: 'ACNSN3DmaxRE5oa', name: '5OA ANCSN3D maxRE', type: 'ambisonic', numberOfChannels: 36 },
    { id: 'ACNSN3DmaxRE6oa', name: '6OA ANCSN3D maxRE', type: 'ambisonic', numberOfChannels: 49 },
    { id: 'ACNSN3DmaxRE7oa', name: '7OA ANCSN3D maxRE', type: 'ambisonic', numberOfChannels: 64 },
  ],
  item: {
    input: null,
    output: null,
    numberOfChannels: null,
  },
  defaultInput: null,
  defaultOutput: null,
});

const actions = {
  updateDefaultFormats({ commit, state }, data) {
    const { input, output } = data;

    const isInputExist = (_.isString(input) && _.findIndex(state.items, { id: input })) || _.isNull(input);
    const isOutputExist = (_.isString(output) && _.findIndex(state.items, { id: output })) || _.isNull(output);

    if (isInputExist) {
      commit('setDefaultInput', input);
    }
    if (isOutputExist) {
      commit('setDefaultOutput', output);
    }
  },
  validateAudio({ commit, dispatch, state }, track) {
    commit('loader', { description: 'Checking number of channels' }, { root: true });

    const context = new (window.AudioContext || window.webkitAudioContext)();
    const reader = new FileReader();

    reader.onload = (e) => {
      const { result } = e.target;

      context.decodeAudioData(result, (buffer) => {
        const source = context.createBufferSource();
        source.connect(context.destination);
        source.buffer = buffer;

        console.log(!_.isNull(state.item.numberOfChannels) && e.item.numberOfChannels !== buffer.numberOfChannels);
        if (!_.isNull(state.item.numberOfChannels) && e.item.numberOfChannels !== buffer.numberOfChannels) {
          dispatch('toast', { event: { message: 'The selected tracks have a different number of channels and cannot be uploaded together' } }, { root: true });
        } else {
          commit('setNumberOfChannels', buffer.numberOfChannels);
        }

        commit('loader', { enable: false }, { root: true });
      });
    };
    reader.readAsArrayBuffer(track);
  },
};

const getters = {
  inputFormats(store) {
    console.log(store.item.numberOfChannels);
    // return store.items.filter(({ id }) => id !== store.item.output);
    return store.items.filter(({ numberOfChannels }) => {
      console.log(numberOfChannels, store.item.numberOfChannels);
      return numberOfChannels === store.item.numberOfChannels;
    });
  },
  outputFormats(store) {
    return store.items.filter(({ id, type }) => type === 'mach1-output' && id !== store.item.input);
  },
  validated(store) {
    return !_.isNull(store.item.numberOfChannels);
  },
};

const mutations = {
  setDefaultInput(store, id) {
    store.defaultInput = id;
  },
  setDefaultOutput(store, id) {
    store.defaultOutput = id;
  },
  setItemValidation(store, value) {
    store.item.validated = value;
  },
  setNumberOfChannels(store, value) {
    store.item.numberOfChannels = value;
  },
};
export default {
  namespaced: true, state: defaultState, actions, getters, mutations,
};
