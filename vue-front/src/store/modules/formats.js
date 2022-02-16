import _ from 'lodash';

const defaultState = () => ({
  items: [
    { id: 'M1Horizon', name: 'Mach1Horizon (Mach1 Horizon/Quad) [4CH]', type: 'mach1' },
    { id: 'M1HorizonS', name: 'Mach1Horizon + Static Stereo [6CH]', type: 'mach1' },
    { id: 'M1HorizonPairs', name: 'Mach1Horizon Pairs / Quad-Binaural [8CH]', type: 'mach1' },
    { id: 'M1Spatial', name: 'Mach1Spatial [8CH]', type: 'mach1-output' },
    { id: 'M1SpatialS', name: 'Mach1Spatial + Static Stereo [10CH]', type: 'mach1' },
    { id: 'M1SpatialFaces', name: 'Mach1Spatial Vector Face [6CH]', type: 'mach1' },
    { id: '2.0_M', name: '2.0 Stereo AR', type: 'surround' },
    { id: '2.0_C', name: '2.0 Stereo Cinema', type: 'surround' },
    { id: '3.0_LCR', name: '3.0 LCR', type: 'surround' },
    { id: '5.0_M', name: '5.0 Music', type: 'surround' },
    { id: '5.1_M', name: '5.1 Music  (Pro Tools default/C|24)', type: 'surround' },
    { id: '5.1_C', name: '5.1 Cinema (Pro Tools default/C|24)', type: 'surround' },
    { id: '5.1_C_SMPTE', name: '5.1 SMPTE Cinema (SMPTE/ITU for Dolby Digital (AC3)', type: 'surround' },
    { id: '5.1_C_Dts', name: '5.1 Dts Cinema (DTS)', type: 'surround' },
    { id: '5.0.2_C', name: '5.0.2 Cinema', type: 'surround' },
    { id: '5.1.2_C', name: '5.1.2 Cinema', type: 'surround' },
    { id: '5.0.4_C', name: '5.0.4 Cinema', type: 'surround' },
    { id: '5.1.4_C', name: '5.1.4 Cinema', type: 'surround' },
    { id: 'Octahedron_M', name: '6.0 Octahedron Music', type: 'surround' },
    { id: '6.0_M', name: '6.0 Cinema', type: 'surround' },
    { id: '7.0_C', name: '7.0 Cinema (Pro Tools default)', type: 'surround' },
    { id: '7.0_C_SDDS', name: '7.0 SDDS Cinema (Sony SDDS)', type: 'surround' },
    { id: '7.0.2_C', name: '7.0.2 Cinema', type: 'surround' },
    { id: '7.0.2_C_SMPTE', name: '7.0.2 SMPTE Cinema', type: 'surround' },
    { id: '7.0.4_C', name: '7.0.4 Cinema', type: 'surround' },
    { id: '7.1_M', name: '7.1 Music (Pro Tools default)', type: 'surround' },
    { id: '7.1_C', name: '7.1 Cinema (Pro Tools default)', type: 'surround' },
    { id: '7.1_C_SDDS', name: '7.1 SDDS Cinema (Sony SDDS)', type: 'surround' },
    { id: '7.1.2_C', name: 'Dolby Atmos 7.1.2 Channel-Bed Cinema', type: 'surround' },
    { id: '7.1.2_M', name: 'Dolby Atmos 7.1.2 Channel-Bed AR', type: 'surround' },
    { id: '7.1.4_C', name: '7.1.4 Cinema', type: 'surround' },
    { id: '7.1.2_C_SMPTE', name: '7.1.2 SMPTE Cinema', type: 'surround' },
    { id: '9.0_C.', name: '9.0 Cinema', type: 'surround' },
    { id: '9.1_C', name: '9.1 Cinema', type: 'surround' },
    { id: '16.0_M', name: '16.0 Music', type: 'surround' },
    { id: 'ACNSN3D', name: '1OA ACNSN3D', type: 'ambisonic' },
    { id: 'ACNSN3DO2A', name: '2OA ACNSN3D', type: 'ambisonic' },
    { id: 'ACNSN3DO3A', name: '3OA ACNSN3D', type: 'ambisonic' },
    { id: 'FuMa', name: '1OA FuMa', type: 'ambisonic' },
    { id: 'FuMaO2A', name: '2OA FuMa', type: 'ambisonic' },
    { id: 'FuMaO3A', name: '3OA FuMa', type: 'ambisonic' },
    { id: 'TBE', name: 'FB360 / TBE Hybrid 2OA', type: 'ambisonic' },
    { id: 'ACNSN3DmaxRE1oa', name: '1OA ANCSN3D maxRE', type: 'ambisonic' },
    { id: 'ACNSN3DmaxRE2oa', name: '2OA ANCSN3D maxRE', type: 'ambisonic' },
    { id: 'ACNSN3DmaxRE3oa', name: '3OA ANCSN3D maxRE', type: 'ambisonic' },
    { id: 'ACNSN3DmaxRE4oa', name: '4OA ANCSN3D maxRE', type: 'ambisonic' },
    { id: 'ACNSN3DmaxRE5oa', name: '5OA ANCSN3D maxRE', type: 'ambisonic' },
    { id: 'ACNSN3DmaxRE6oa', name: '6OA ANCSN3D maxRE', type: 'ambisonic' },
    { id: 'ACNSN3DmaxRE7oa', name: '7OA ANCSN3D maxRE', type: 'ambisonic' },
  ],
  item: {
    input: null,
    output: null,
  },
  defaultInput: null,
  defaultOutput: null,
});

const actions = {
  setFormatAsDefault({ commit, state }, data) {
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
};

const getters = {
  inputFormats(store) {
    return store.items.filter(({ id }) => id !== store.item.output);
  },
  outputFormats(store) {
    return store.items.filter(({ id, type }) => type === 'mach1-output' && id !== store.item.input);
  },
};

const mutations = {
  setDefaultInput(store, id) {
    store.defaultInput = id;
  },
  setDefaultOutput(store, id) {
    store.defaultOutput = id;
  },
};
export default {
  namespaced: true, state: defaultState, actions, getters, mutations,
};
