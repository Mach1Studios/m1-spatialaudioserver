import _ from 'lodash';

const defaultState = () => ({
  items: [
    { id: 'Stereo', name: 'Stereo', type: 'standart' },
    { id: 'Stereo_Cinema', name: 'Stereo_Cinema', type: 'standart' },
    { id: 'LCR', name: 'LCR', type: 'standart' },
    { id: 'M1Horizon', name: 'M1Horizon (Mach1 Horizon/Quad)', type: 'mach1' },
    { id: 'M1HorizonS', name: 'M1Horizon+S (Mach1 Horizon/Quad)', type: 'mach1' },
    { id: 'M1HorizonPairs', name: 'M1HorizonPairs (Mach1 Horizon/Quad-Binaural)', type: 'mach1' },
    { id: 'M1Spatial', name: 'M1Spatial (Mach1 Spatial)', type: 'mach1' },
    { id: 'M1SpatialS', name: 'M1Spatial+S (Mach1 Spatial)', type: 'mach1' },
    { id: 'M1SpatialPairs', name: 'M1SpatialPairs (Mach1 Spatial Pairs)', type: 'mach1' },
    { id: 'M1SpatialFaces', name: 'M1SpatialFaces', type: 'mach1' },
    { id: 'FiveOh', name: 'FiveOh', type: 'standart' },
    { id: 'FiveOneFilm', name: 'FiveOneFilm (Pro Tools default/C|24)', type: 'standart' },
    { id: 'FiveOneFilm_Cinema', name: 'FiveOneFilm_Cinema (Pro Tools default/C|24)', type: 'standart' },
    { id: 'FiveOneSmpte', name: 'FiveOneSmpte (SMPTE/ITU for Dolby Digital (AC3)', type: 'standart' },
    { id: 'FiveOneDts', name: 'FiveOneDts (DTS)', type: 'standart' },
    { id: 'SixOh', name: 'SixOh', type: 'standart' },
    { id: 'SevenOnePt', name: 'SevenOnePt (Pro Tools default)', type: 'standart' },
    { id: 'SevenOnePt_Cinema', name: 'SevenOnePt_Cinema (Pro Tools default)', type: 'standart' },
    { id: 'SevenZero_Cinema', name: 'SevenZero_Cinema (Pro Tools default)', type: 'standart' },
    { id: 'SevenOneSDDS', name: 'SevenOneSDDS (Sony SDDS)', type: 'standart' },
    { id: 'SevenZeroSDDS', name: 'SevenZeroSDDS (Sony SDDS)', type: 'standart' },
    { id: 'FiveOneTwo', name: 'FiveOneTwo (Film/Pro Tools default)', type: 'standart' },
    { id: 'FiveZeroTwo', name: 'FiveZeroTwo (Film/Pro Tools default)', type: 'standart' },
    { id: 'FiveOneFour', name: 'FiveOneFour (Film/Pro Tools default)', type: 'standart' },
    { id: 'FiveZeroFour', name: 'FiveZeroFour (Film/Pro Tools default)', type: 'standart' },
    { id: 'SevenOneTwo', name: 'SevenOneTwo (Film/Pro Tools default)', type: 'standart' },
    { id: 'SevenZeroTwo', name: 'SevenZeroTwo (Film/Pro Tools default)', type: 'standart' },
    { id: 'SevenOneFour', name: 'SevenOneFour (Film/Pro Tools default)', type: 'standart' },
    { id: 'SevenZeroFour', name: 'SevenZeroFour (Film/Pro Tools default)', type: 'standart' },
    { id: 'SevenOneTwo', name: 'SevenOneTwo (SMPTE)', type: 'standart' },
    { id: 'SevenZeroTwo', name: 'SevenZeroTwo (SMPTE)', type: 'standart' },
    { id: 'DolbyAtmosSevenOneTwo', name: 'DolbyAtmosSevenOneTwo', type: 'standart' },
    { id: 'NineOne', name: 'NineOne', type: 'standart' },
    { id: 'NineZero', name: 'NineZero', type: 'standart' },
    { id: 'ACNSN3D', name: 'ACNSN3D', type: 'ambisonic' },
    { id: 'FuMa', name: 'FuMa', type: 'ambisonic' },
    { id: 'TBE', name: 'TBE', type: 'ambisonic' },
    { id: 'ACNSN3DO2A', name: 'ACNSN3DO2A', type: 'ambisonic' },
    { id: 'FuMaO2A', name: 'FuMaO2A', type: 'ambisonic' },
    { id: 'ACNSN3DO3A', name: 'ACNSN3DO3A', type: 'ambisonic' },
    { id: 'FuMaO3A', name: 'FuMaO3A', type: 'ambisonic' },
    { id: 'ACNSN3DmaxRE1oa', name: 'ACNSN3DmaxRE1oa', type: 'ambisonic' },
    { id: 'ACNSN3DmaxRE2oa', name: 'ACNSN3DmaxRE2oa', type: 'ambisonic' },
    { id: 'ACNSN3DmaxRE3oa', name: 'ACNSN3DmaxRE3oa', type: 'ambisonic' },
    { id: 'ACNSN3DmaxRE4oa', name: 'ACNSN3DmaxRE4oa', type: 'ambisonic' },
    { id: 'ACNSN3DmaxRE5oa', name: 'ACNSN3DmaxRE5oa', type: 'ambisonic' },
    { id: 'ACNSN3DmaxRE6oa', name: 'ACNSN3DmaxRE6oa', type: 'ambisonic' },
    { id: 'ACNSN3DmaxRE7oa', name: 'ACNSN3DmaxRE7oa', type: 'ambisonic' },
    { id: 'CH_16', name: '16.0', type: 'standart' },
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
    return store.items.filter(({ id, type }) => type === 'mach1' && id !== store.item.input);
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
