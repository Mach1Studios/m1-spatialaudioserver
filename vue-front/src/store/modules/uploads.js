import _ from 'lodash';
// import { getFileAudioBuffer } from '@soundcut/decode-audio-data-fast';

const defaultState = () => ({
  formats: [
    { id: '1.0', name: '1.0', type: 'standard', numberOfChannels: 1 },
    { id: 'M1Spatial-4', name: 'M1Spatial-4', type: 'mach1', numberOfChannels: 4 },
    { id: 'M1Horizon-4_2', name: 'M1Horizon-4_2', type: 'standard', numberOfChannels: 6 },
    { id: 'M1HorizonPairs', name: 'M1HorizonPairs', type: 'standard', numberOfChannels: 8 },
    { id: 'M1Spatial-6', name: 'M1Spatial-6', type: 'standard', numberOfChannels: 6 },
    { id: 'M1Spatial-8', name: 'M1Spatial-8', type: 'mach1', numberOfChannels: 8 },
    { id: 'M1Spatial-8_2', name: 'M1Spatial-8_2', type: 'standard', numberOfChannels: 10 },
    { id: 'M1Spatial-12', name: 'M1Spatial-12', type: 'mach1', numberOfChannels: 12 },
    { id: 'M1Spatial-14', name: 'M1Spatial-14', type: 'mach1', numberOfChannels: 14 },
    { id: 'M1Spatial-32', name: 'M1Spatial-32', type: 'standard', numberOfChannels: 32 },
    { id: 'M1Spatial-60', name: 'M1Spatial-60', type: 'standard', numberOfChannels: 60 },
    { id: '2.0_M', name: '2.0_M', type: 'standard', numberOfChannels: 2 },
    { id: '2.0_C', name: '2.0_C', type: 'standard', numberOfChannels: 2 },
    { id: '3.0_LCR', name: '3.0_LCR', type: 'standard', numberOfChannels: 3 },
    { id: '3.0_LCR', name: '4.0_LCRS', type: 'standard', numberOfChannels: 3 },
    { id: '4.0_AFormat', name: '4.0_AFormat', type: 'standard', numberOfChannels: 4 },
    { id: '5.0_M', name: '5.0_M', type: 'standard', numberOfChannels: 5 },
    { id: '5.0_C', name: '5.0_C', type: 'standard', numberOfChannels: 5 },
    { id: '5.0_S', name: '5.0_S', type: 'standard', numberOfChannels: 5 },
    { id: '5.0_R', name: '5.0_R', type: 'standard', numberOfChannels: 5 },
    { id: '5.0_C_SIM', name: '5.0_C_SIM', type: 'standard', numberOfChannels: 5 },
    { id: '5.1_M', name: '5.1_M', type: 'standard', numberOfChannels: 6 },
    { id: '5.1_C', name: '5.1_C', type: 'standard', numberOfChannels: 6 },
    { id: '5.1_S', name: '5.1_S', type: 'standard', numberOfChannels: 6 },
    { id: '5.1_R', name: '5.1_R', type: 'standard', numberOfChannels: 6 },
    { id: '5.1_M_SMPTE', name: '5.1_M_SMPTE', type: 'standard', numberOfChannels: 6 },
    { id: '5.1_C_SMPTE', name: '5.1_C_SMPTE', type: 'standard', numberOfChannels: 6 },
    { id: '5.1_S_SMPTE', name: '5.1_S_SMPTE', type: 'standard', numberOfChannels: 6 },
    { id: '5.1_R_SMPTE', name: '5.1_R_SMPTE', type: 'standard', numberOfChannels: 6 },
    { id: '5.1_M_Dts', name: '5.1_M_Dts', type: 'standard', numberOfChannels: 6 },
    { id: '5.1_C_Dts', name: '5.1_C_Dts', type: 'standard', numberOfChannels: 6 },
    { id: '5.1_S_Dts', name: '5.1_S_Dts', type: 'standard', numberOfChannels: 6 },
    { id: '5.1_R_Dts', name: '5.1_R_Dts', type: 'standard', numberOfChannels: 6 },
    { id: '5.1_C_SIM', name: '5.1_C_SIM', type: 'standard', numberOfChannels: 6 },
    { id: '5.0.2_M', name: '5.0.2_M', type: 'standard', numberOfChannels: 7 },
    { id: '5.0.2_C', name: '5.0.2_C', type: 'standard', numberOfChannels: 7 },
    { id: '5.0.2_S', name: '5.0.2_S', type: 'standard', numberOfChannels: 7 },
    { id: '5.1.2_M', name: '5.1.2_M', type: 'standard', numberOfChannels: 8 },
    { id: '5.1.2_C', name: '5.1.2_C', type: 'standard', numberOfChannels: 8 },
    { id: '5.1.2_S', name: '5.1.2_S', type: 'standard', numberOfChannels: 8 },
    { id: '5.0.4_M', name: '5.0.4_M', type: 'standard', numberOfChannels: 9 },
    { id: '5.0.4_C', name: '5.0.4_C', type: 'standard', numberOfChannels: 9 },
    { id: '5.0.4_S', name: '5.0.4_S', type: 'standard', numberOfChannels: 9 },
    { id: '5.1.4_M', name: '5.1.4_M', type: 'standard', numberOfChannels: 10 },
    { id: '5.1.4_C', name: '5.1.4_C', type: 'standard', numberOfChannels: 10 },
    { id: '5.1.4_S', name: '5.1.4_S', type: 'standard', numberOfChannels: 10 },
    { id: '5.0.5_C', name: '5.0.5_C', type: 'standard', numberOfChannels: 10 },
    { id: '5.0.6_C', name: '5.0.6_C', type: 'standard', numberOfChannels: 11 },
    { id: 'Octahedron_M', name: 'Octahedron_M', type: 'standard', numberOfChannels: 8 },
    { id: '6.0_M', name: '6.0_M', type: 'standard', numberOfChannels: 6 },
    { id: '7.0_M', name: '7.0_M', type: 'standard', numberOfChannels: 7 },
    { id: '7.0_C', name: '7.0_C', type: 'standard', numberOfChannels: 7 },
    { id: '7.0_S', name: '7.0_S', type: 'standard', numberOfChannels: 7 },
    { id: '7.0_M_SDDS', name: '7.0_M_SDDS', type: 'standard', numberOfChannels: 7 },
    { id: '7.0_C_SDDS', name: '7.0_C_SDDS', type: 'standard', numberOfChannels: 7 },
    { id: '7.0_M_SMPTE', name: '7.0_M_SMPTE', type: 'standard', numberOfChannels: 7 },
    { id: '7.0_C_SMPTE', name: '7.0_C_SMPTE', type: 'standard', numberOfChannels: 7 },
    { id: '7.0_S_SMPTE', name: '7.0_S_SMPTE', type: 'standard', numberOfChannels: 7 },
    { id: '7.0_C_3D', name: '7.0_C_3D', type: 'standard', numberOfChannels: 7 },
    { id: '7.0_C_SIM', name: '7.0_C_SIM', type: 'standard', numberOfChannels: 7 },
    { id: '7.1_M', name: '7.1_M', type: 'standard', numberOfChannels: 8 },
    { id: '7.1_C', name: '7.1_C', type: 'standard', numberOfChannels: 8 },
    { id: '7.1_S', name: '7.1_S', type: 'standard', numberOfChannels: 8 },
    { id: '7.1_M_SDDS', name: '7.1_M_SDDS', type: 'standard', numberOfChannels: 8 },
    { id: '7.1_C_SDDS', name: '7.1_C_SDDS', type: 'standard', numberOfChannels: 8 },
    { id: '7.1_M_SMPTE', name: '7.1_M_SMPTE', type: 'standard', numberOfChannels: 8 },
    { id: '7.1_C_SMPTE', name: '7.1_C_SMPTE', type: 'standard', numberOfChannels: 8 },
    { id: '7.1_S_SMPTE', name: '7.1_S_SMPTE', type: 'standard', numberOfChannels: 8 },
    { id: '7.1_C_SIM', name: '7.1_C_SIM', type: 'standard', numberOfChannels: 8 },
    { id: '7.0.2_M', name: '7.0.2_M', type: 'standard', numberOfChannels: 9 },
    { id: '7.0.2_C', name: '7.0.2_C', type: 'standard', numberOfChannels: 9 },
    { id: '7.0.2_S', name: '7.0.2_S', type: 'standard', numberOfChannels: 9 },
    { id: '7.0.2_M_SDDS', name: '7.0.2_M_SDDS', type: 'standard', numberOfChannels: 9 },
    { id: '7.0.2_C_SDDS', name: '7.0.2_C_SDDS', type: 'standard', numberOfChannels: 9 },
    { id: '7.0.2_M_SMPTE', name: '7.0.2_M_SMPTE', type: 'standard', numberOfChannels: 9 },
    { id: '7.0.2_C_SMPTE', name: '7.0.2_C_SMPTE', type: 'standard', numberOfChannels: 9 },
    { id: '7.0.2_S_SMPTE', name: '7.0.2_S_SMPTE', type: 'standard', numberOfChannels: 9 },
    { id: '7.1.2_M', name: '7.1.2_M', type: 'standard', numberOfChannels: 10 },
    { id: '7.1.2_C', name: '7.1.2_C', type: 'standard', numberOfChannels: 10 },
    { id: '7.1.2_C_SIM', name: '7.1.2_C_SIM', type: 'standard', numberOfChannels: 10 },
    { id: '7.1.2_S', name: '7.1.2_S', type: 'standard', numberOfChannels: 10 },
    { id: '7.1.2_M_SDDS', name: '7.1.2_M_SDDS', type: 'standard', numberOfChannels: 10 },
    { id: '7.1.2_C_SDDS', name: '7.1.2_C_SDDS', type: 'standard', numberOfChannels: 10 },
    { id: '7.1.2_M_SMPTE', name: '7.1.2_M_SMPTE', type: 'standard', numberOfChannels: 10 },
    { id: '7.1.2_C_SMPTE', name: '7.1.2_C_SMPTE', type: 'standard', numberOfChannels: 10 },
    { id: '7.1.2_S_SMPTE', name: '7.1.2_S_SMPTE', type: 'standard', numberOfChannels: 10 },
    { id: '7.0.4_M', name: '7.0.4_M', type: 'standard', numberOfChannels: 11 },
    { id: '7.0.4_C', name: '7.0.4_C', type: 'standard', numberOfChannels: 11 },
    { id: '7.0.4_S', name: '7.0.4_S', type: 'standard', numberOfChannels: 11 },
    { id: '7.1.4_M', name: '7.1.4_M', type: 'standard', numberOfChannels: 12 },
    { id: '7.1.4_C', name: '7.1.4_C', type: 'standard', numberOfChannels: 12 },
    { id: '7.1.4_C_SIM', name: '7.1.4_C_SIM', type: 'standard', numberOfChannels: 12 },
    { id: '7.1.4_S', name: '7.1.4_S', type: 'standard', numberOfChannels: 12 },
    { id: '7.0.6_C', name: '7.0.6_C', type: 'standard', numberOfChannels: 13 },
    { id: '8.0.2_C_THX', name: '8.0.2_C_THX', type: 'standard', numberOfChannels: 10 },
    { id: '9.0_M', name: '9.0_M', type: 'standard', numberOfChannels: 9 },
    { id: '9.0_C', name: '9.0_C', type: 'standard', numberOfChannels: 9 },
    { id: '9.1_M', name: '9.1_M', type: 'standard', numberOfChannels: 10 },
    { id: '9.1_C', name: '9.1_C', type: 'standard', numberOfChannels: 10 },
    { id: '9.1.6_M', name: '9.1.6_M', type: 'standard', numberOfChannels: 16 },
    { id: '9.1.6_C', name: '9.1.6_C', type: 'standard', numberOfChannels: 16 },
    { id: '10.0.2_C_THX', name: '10.0.2_C_THX', type: 'standard', numberOfChannels: 12 },
    { id: '16.0_M', name: '16.0_M', type: 'standard', numberOfChannels: 16 },
    { id: '22.0_C', name: '22.0_C', type: 'standard', numberOfChannels: 22 },
    { id: 'FOA-Ambix', name: 'FOA-Ambix', type: 'standard', numberOfChannels: 4 },
    { id: 'FOA-FuMa', name: 'FOA-FuMa', type: 'standard', numberOfChannels: 4 },
    { id: 'FuMa', name: 'FuMa', type: 'standard', numberOfChannels: 4 },
    { id: 'ACNSN3D', name: 'ACNSN3D', type: 'standard', numberOfChannels: 4 },
    { id: 'TBE', name: 'TBE', type: 'standard', numberOfChannels: 8 },
    { id: 'TBE_2', name: 'TBE_2', type: 'standard', numberOfChannels: 10 },
    { id: 'ACNSN3DO2A', name: 'ACNSN3DO2A', type: 'standard', numberOfChannels: 9 },
    { id: 'FuMaO2A', name: 'FuMaO2A', type: 'standard', numberOfChannels: 9 },
    { id: 'ACNSN3DO3A', name: 'ACNSN3DO3A', type: 'standard', numberOfChannels: 16 },
    { id: 'FuMaO3A', name: 'FuMaO3A', type: 'standard', numberOfChannels: 16 },
    { id: 'ACNSN3DYorkBasic1oa', name: 'ACNSN3DYorkBasic1oa', type: 'standard', numberOfChannels: 4 },
    { id: 'ACNSN3DYorkmaxRE1oa', name: 'ACNSN3DYorkmaxRE1oa', type: 'standard', numberOfChannels: 4 },
    { id: 'ACNSN3DmaxRE1oa', name: 'ACNSN3DmaxRE1oa', type: 'standard', numberOfChannels: 4 },
    { id: 'ACNSN3DmaxRE2oa', name: 'ACNSN3DmaxRE2oa', type: 'standard', numberOfChannels: 9 },
    { id: 'ACNSN3DmaxRE3oa', name: 'ACNSN3DmaxRE3oa', type: 'standard', numberOfChannels: 16 },
    { id: 'ACNSN3DmaxRE4oa', name: 'ACNSN3DmaxRE4oa', type: 'standard', numberOfChannels: 25 },
    { id: 'ACNSN3DmaxRE5oa', name: 'ACNSN3DmaxRE5oa', type: 'standard', numberOfChannels: 36 },
    { id: 'ACNSN3DmaxRE6oa', name: 'ACNSN3DmaxRE6oa', type: 'standard', numberOfChannels: 49 },
    { id: 'ACNSN3DmaxRE7oa', name: 'ACNSN3DmaxRE7oa', type: 'standard', numberOfChannels: 64 },
    { id: 'Ambeo', name: 'Ambeo', type: 'standard', numberOfChannels: 4 },
    { id: 'TetraMic', name: 'TetraMic', type: 'standard', numberOfChannels: 4 },
    { id: 'SPS-200', name: 'SPS-200', type: 'standard', numberOfChannels: 4 },
    { id: 'NT-SF1', name: 'NT-SF1', type: 'standard', numberOfChannels: 4 },
    { id: 'ORTF3D', name: 'ORTF3D', type: 'standard', numberOfChannels: 8 },
  ],
  files: [],
  defaultApply: false,
  defaultInput: null,
  defaultOutput: null,
});

const actions = {
  applyDefaultFormatsForTracks({ commit, dispatch, state }, { inputFormat, outputFormat }) {
    const { defaultInput, defaultOutput } = state;
    const { numberOfChannels } = _.find(state.formats, { id: inputFormat || defaultInput });

    _.each(state.files, (file) => {
      const item = { name: file.name };
      if (file.numberOfChannels !== numberOfChannels) {
        dispatch('toast', { event: { message: `Cannot apply default input format for track ${item.name} because it has a different number of channels`, icon: 'info' } }, { root: true });
      } else {
        item.inputFormat = inputFormat || defaultInput;
      }
      item.outputFormat = outputFormat || defaultOutput;

      commit('updateFile', item);
    });
  },
  updateDefaultFormats({ commit, state }, data) {
    const { input, output } = data;

    const isInputExist = (_.isString(input) && _.findIndex(state.formats, { id: input }) !== -1) || _.isNull(input);
    const isOutputExist = (_.isString(output) && _.findIndex(state.formats, { id: output }) !== -1) || _.isNull(output);

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
    // const test = getFileAudioBuffer(track, context);
    // console.log(test);

    const reader = new FileReader();

    const label = 'parse sound';
    console.time(label);

    reader.onload = (e) => {
      console.timeLog(label);
      const { result } = e.target;

      // const test = getFileAudioBuffer(result, context);
      // console.log(test);

      context.decodeAudioData(result, (buffer) => {
        console.timeLog(label);

        const source = context.createBufferSource();
        source.connect(context.destination);
        source.buffer = buffer;

        if (_.find(state.files, { name: track.name })) {
          dispatch('toast', { error: { message: `You have already chosen a track called "${track.name}"` } }, { root: true });
        } else {
          console.timeEnd(label);
          commit('setFile', { track, numberOfChannels: buffer.numberOfChannels, name: track.name });
        }
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
    return store.formats.filter(({ type }) => type === 'mach1');
  },
  // validated(store) {
  //   return !_.isNull(store.item.numberOfChannels);
  // },
};

const mutations = {
  setDefaultInput(store, id) {
    store.defaultInput = id;
  },
  setDefaultOutput(store, id) {
    store.defaultOutput = id;
  },
  setDefaultApply(store, value) {
    store.defaultApply = _.isBoolean(value) ? value : false;
  },
  setFile(store, file) {
    store.files = [...store.files, file];
  },
  updateFile(store, { name, inputFormat = null, outputFormat = null }) {
    const index = _.findIndex(store.files, { name });

    store.files[index].inputFormat = inputFormat;
    store.files[index].outputFormat = outputFormat;
  },
  removeFile(store, item) {
    store.files = _.filter(store.files, (file) => file.name !== item.name);
  },
};
export default {
  namespaced: true, state: defaultState, actions, getters, mutations,
};
