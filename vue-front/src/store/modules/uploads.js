import _ from 'lodash';

const defaultState = () => ({
  formats: [
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
    { id: 'ACNSN3D', name: 'ACNSN3D', type: 'ambisonic', numberOfChannels: 4 },
    { id: 'FuMa', name: 'FuMa', type: 'ambisonic', numberOfChannels: 4 },
    { id: 'TBE', name: 'TBE', type: 'ambisonic', numberOfChannels: 8 },
    { id: 'ACNSN3DO2A', name: 'ACNSN3DO2A', type: 'ambisonic', numberOfChannels: 9 },
    { id: 'FuMaO2A', name: 'FuMaO2A', type: 'ambisonic', numberOfChannels: 9 },
    { id: 'ACNSN3DO3A', name: 'ACNSN3DO3A', type: 'ambisonic', numberOfChannels: 16 },
    { id: 'FuMaO3A', name: 'FuMaO3A', type: 'ambisonic', numberOfChannels: 16 },
    { id: 'ACNSN3DmaxRE1oa', name: 'ACNSN3DmaxRE1oa', type: 'ambisonic', numberOfChannels: 4 },
    { id: 'ACNSN3DmaxRE2oa', name: 'ACNSN3DmaxRE2oa', type: 'ambisonic', numberOfChannels: 9 },
    { id: 'ACNSN3DmaxRE3oa', name: 'ACNSN3DmaxRE3oa', type: 'ambisonic', numberOfChannels: 16 },
    { id: 'ACNSN3DmaxRE4oa', name: 'ACNSN3DmaxRE4oa', type: 'ambisonic', numberOfChannels: 25 },
    { id: 'ACNSN3DmaxRE5oa', name: 'ACNSN3DmaxRE5oa', type: 'ambisonic', numberOfChannels: 36 },
    { id: 'ACNSN3DmaxRE6oa', name: 'ACNSN3DmaxRE6oa', type: 'ambisonic', numberOfChannels: 49 },
    { id: 'ACNSN3DmaxRE7oa', name: 'ACNSN3DmaxRE7oa', type: 'ambisonic', numberOfChannels: 64 },
    { id: 'CH_16', name: '16.0', type: 'standart', numberOfChannels: 16 },
  ],
  item: {
    input: null,
    output: null,
    numberOfChannels: null,
  },
  files: [],
  defaultInput: null,
  defaultOutput: null,
});

const actions = {
  updateDefaultFormats({ commit, state }, data) {
    const { input, output } = data;
    console.log(data);

    const isInputExist = (_.isString(input) && _.findIndex(state.formats, { id: input }) !== -1) || _.isNull(input);
    const isOutputExist = (_.isString(output) && _.findIndex(state.formats, { id: output }) !== -1) || _.isNull(output);

    console.log(isInputExist, isOutputExist);
    console.log(_.isString(input), _.findIndex(state.formats, { id: input }));

    if (isInputExist) {
      commit('setDefaultInput', input);
    }
    if (isOutputExist) {
      commit('setDefaultOutput', output);
    }
  },
  // eslint-disable-next-line
  validateAudio({ commit, dispatch, state }, track) {
    if (_.has(track, 'numberOfChannels')) return;
    commit('loader', { enable: true, description: 'Checking number of channels' }, { root: true });

    const context = new (window.AudioContext || window.webkitAudioContext)();
    const reader = new FileReader();

    reader.onload = (e) => {
      const { result } = e.target;

      context.decodeAudioData(result, (buffer) => {
        const source = context.createBufferSource();
        source.connect(context.destination);
        source.buffer = buffer;

        commit('setFile', { track, numberOfChannels: buffer.numberOfChannels, name: track.name });
        commit('loader', { enable: false }, { root: true });
      });
    };
    reader.readAsArrayBuffer(track);
  },
};

const getters = {
  inputFormats(store) {
    return store.formats.filter(({ type }) => type !== 'mach1');
  },
  outputFormats(store) {
    return store.formats.filter(({ id, type }) => type === 'mach1' && id !== store.item.input);
  },
  validated(store) {
    return !_.isNull(store.item.numberOfChannels);
  },
};

const mutations = {
  setDefaultInput(store, id) {
    console.log(id, store.defaultInput);
    store.defaultInput = id;
    console.log(id, store.defaultInput);
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
  setFile(store, file) {
    store.files = [...store.files, file];
  },
  removeFile(store, item) {
    store.files = _.filter(store.files, (file) => file.name !== item.name);
  },
};
export default {
  namespaced: true, state: defaultState, actions, getters, mutations,
};
