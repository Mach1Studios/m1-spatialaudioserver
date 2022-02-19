import _ from 'lodash';

const defaultState = () => ({
  items: [
    { id: 'Stereo', name: 'Stereo', type: 'standart', numberOfChannels: 2 },
    { id: 'Stereo_Cinema', name: 'Stereo_Cinema', type: 'standart', numberOfChannels: 2 },
    { id: 'LCR', name: 'LCR', type: 'standart', numberOfChannels: 3 },
    { id: 'M1Horizon', name: 'M1Horizon (Mach1 Horizon/Quad)', type: 'mach1' },
    { id: 'M1HorizonS', name: 'M1Horizon+S (Mach1 Horizon/Quad)', type: 'mach1' },
    { id: 'M1HorizonPairs', name: 'M1HorizonPairs (Mach1 Horizon/Quad-Binaural)', type: 'mach1' },
    { id: 'M1Spatial', name: 'M1Spatial (Mach1 Spatial)', type: 'mach1' },
    { id: 'M1SpatialS', name: 'M1Spatial+S (Mach1 Spatial)', type: 'mach1' },
    { id: 'M1SpatialPairs', name: 'M1SpatialPairs (Mach1 Spatial Pairs)', type: 'mach1' },
    { id: 'M1SpatialFaces', name: 'M1SpatialFaces', type: 'mach1' },
    { id: 'FiveOh', name: 'FiveOh', type: 'standart', numberOfChannels: 5 },
    { id: 'FiveOneFilm', name: 'FiveOneFilm (Pro Tools default/C|24)', type: 'standart', numberOfChannels: 6 },
    { id: 'FiveOneFilm_Cinema', name: 'FiveOneFilm_Cinema (Pro Tools default/C|24)', type: 'standart', numberOfChannels: 6 },
    { id: 'FiveOneSmpte', name: 'FiveOneSmpte (SMPTE/ITU for Dolby Digital (AC3)', type: 'standart', numberOfChannels: 6 },
    { id: 'FiveOneDts', name: 'FiveOneDts (DTS)', type: 'standart', numberOfChannels: 6 },
    { id: 'SixOh', name: 'SixOh', type: 'standart', numberOfChannels: 6 }, // TODO: need to check number of channels for this type of format
    { id: 'SevenOnePt', name: 'SevenOnePt (Pro Tools default)', type: 'standart', numberOfChannels: 8 },
    { id: 'SevenOnePt_Cinema', name: 'SevenOnePt_Cinema (Pro Tools default)', type: 'standart', numberOfChannels: 8 },
    { id: 'SevenZero_Cinema', name: 'SevenZero_Cinema (Pro Tools default)', type: 'standart', numberOfChannels: 7 },
    { id: 'SevenOneSDDS', name: 'SevenOneSDDS (Sony SDDS)', type: 'standart', numberOfChannels: 8 },
    { id: 'SevenZeroSDDS', name: 'SevenZeroSDDS (Sony SDDS)', type: 'standart', numberOfChannels: 7 },
    { id: 'FiveOneTwo', name: 'FiveOneTwo (Film/Pro Tools default)', type: 'standart', numberOfChannels: 11 },
    { id: 'FiveZeroTwo', name: 'FiveZeroTwo (Film/Pro Tools default)', type: 'standart', numberOfChannels: 11 }, // FIXME: finished here
    { id: 'FiveOneFour', name: 'FiveOneFour (Film/Pro Tools default)', type: 'standart', numberOfChannels: 2 },
    { id: 'FiveZeroFour', name: 'FiveZeroFour (Film/Pro Tools default)', type: 'standart', numberOfChannels: 2 },
    { id: 'SevenOneTwo', name: 'SevenOneTwo (Film/Pro Tools default)', type: 'standart', numberOfChannels: 2 },
    { id: 'SevenZeroTwo', name: 'SevenZeroTwo (Film/Pro Tools default)', type: 'standart', numberOfChannels: 2 },
    { id: 'SevenOneFour', name: 'SevenOneFour (Film/Pro Tools default)', type: 'standart', numberOfChannels: 2 },
    { id: 'SevenZeroFour', name: 'SevenZeroFour (Film/Pro Tools default)', type: 'standart', numberOfChannels: 2 },
    { id: 'SevenOneTwo', name: 'SevenOneTwo (SMPTE)', type: 'standart', numberOfChannels: 2 },
    { id: 'SevenZeroTwo', name: 'SevenZeroTwo (SMPTE)', type: 'standart', numberOfChannels: 2 },
    { id: 'DolbyAtmosSevenOneTwo', name: 'DolbyAtmosSevenOneTwo', type: 'standart', numberOfChannels: 2 },
    { id: 'NineOne', name: 'NineOne', type: 'standart', numberOfChannels: 2 },
    { id: 'NineZero', name: 'NineZero', type: 'standart', numberOfChannels: 2 },
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
    { id: 'CH_16', name: '16.0', type: 'standart', numberOfChannels: 16 },
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
    return store.items.filter(({ id, type }) => type === 'mach1' && id !== store.item.input);
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
