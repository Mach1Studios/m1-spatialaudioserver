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
    console.log('[AUDIO] createGainNodes called', {
      channels: state.channels,
      hasExistingContext: !!state.AudioContext,
      hasExistingSource: !!state.source,
      hasView: !!state.view,
    });

    // If we already have an AudioContext and MediaElementSource, reuse them
    let context = state.AudioContext;
    let source = state.source;
    
    if (!context || context.state === 'closed') {
      console.log('[AUDIO] Creating new AudioContext');
      context = new (window.AudioContext || window.webkitAudioContext)();
      commit('setAudioContext', context);
    } else {
      console.log('[AUDIO] Reusing existing AudioContext');
    }

    const { channels, view } = state;

    // Only create MediaElementSource if we don't have one yet
    if (!source) {
      try {
        console.log('[AUDIO] Creating MediaElementSource', {
          viewExists: !!view,
          viewSrc: view?.src,
          contextState: context.state,
        });
        source = context.createMediaElementSource(view);
        commit('setMediaSource', source);
        console.log('[AUDIO] MediaElementSource created successfully');
      } catch (error) {
        console.error('[AUDIO] Failed to create MediaElementSource:', error);
        throw error;
      }
    } else {
      console.log('[AUDIO] Reusing existing MediaElementSource');
    }

    console.log('[AUDIO] Creating audio processing chain', {
      channels,
      volume,
    });

    // Disconnect existing nodes to avoid feedback
    if (state.gainNodes.length > 0) {
      console.log('[AUDIO] Disconnecting existing gain nodes');
      state.gainNodes.forEach(node => {
        try {
          node.disconnect();
        } catch (e) {
          // Ignore errors from already disconnected nodes
        }
      });
      commit('clearGainNodes');
    }

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

    console.log('[AUDIO] Audio processing chain created, hiding loader and starting playback');
    commit('loader', { enable: false }, { root: true });
    
    console.log('[AUDIO] Attempting to play audio', {
      viewReadyState: view.readyState,
      viewPaused: view.paused,
      viewSrc: view.src,
    });
    
    state.view.play().then(() => {
      console.log('[AUDIO] Playback started successfully');
    }).catch((error) => {
      console.error('[AUDIO] Failed to start playback:', error);
    });
  },
  updateSource({ commit }, source) {
    console.log('[AUDIO] updateSource called', {
      hasSource: !!source,
      tagName: source?.tagName,
    });
    commit('setSource', source);
  },
  updateVolume({ commit, state }, { channel, volume }) {
    if (state.gainNodes && state.gainNodes[channel]) {
      commit('setGainVolume', { channel, volume });
    }
  },
  updateNumberOfChannels({ commit }, count) {
    console.log('[AUDIO] updateNumberOfChannels called', { count });
    commit('setNumberOfChannels', count);
  },
  reset({ commit }) {
    console.log('[AUDIO] reset called');
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
    console.log('[AUDIO MUTATION] setAudioContext', {
      newContextState: AudioContext?.state,
    });
    state.gainNodes = [];
    state.gainNodesAnalyser = [];
    state.AudioContext = AudioContext;
  },
  setMediaSource(state, source) {
    console.log('[AUDIO MUTATION] setMediaSource', {
      hasSource: !!source,
    });
    state.source = source;
  },
  setGain(state, gain) {
    if (gain) {
      state.gainNodes.push(gain);
    }
  },
  clearGainNodes(state) {
    state.gainNodes = [];
    state.gainNodesAnalyser = [];
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
    console.log('[AUDIO MUTATION] setNumberOfChannels', { from: state.channels, to: count });
    state.channels = count;
  },
  setSource(state, source) {
    console.log('[AUDIO MUTATION] setSource', {
      hasSource: !!source,
      tagName: source?.tagName,
    });
    state.view = source;
  },
  resetAudioState(state) {
    console.log('[AUDIO MUTATION] resetAudioState called', { currentChannels: state.channels });
    
    // Disconnect and clear gain nodes
    if (state.gainNodes.length > 0) {
      console.log('[AUDIO MUTATION] Disconnecting gain nodes');
      state.gainNodes.forEach(node => {
        try {
          node.disconnect();
        } catch (e) {
          // Ignore errors from already disconnected nodes
        }
      });
    }
    
    // DON'T close AudioContext or clear MediaElementSource - reuse them for next track
    // Only reset gain nodes and channels
    state.gainNodes = [];
    state.gainNodesAnalyser = [];
    state.channels = 0; // Reset channels so watcher fires on next track
    console.log('[AUDIO MUTATION] resetAudioState complete', { channelsNowSetTo: state.channels });
  },
};

export default {
  namespaced: true, state: defaultState, actions, getters, mutations,
};
