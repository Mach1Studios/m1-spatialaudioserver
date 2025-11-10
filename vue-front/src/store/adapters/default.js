import _ from 'lodash';
import dashjs from 'dashjs';

const settings = {
  streaming: {
    useSuggestedPresentationDelay: false,
    lowLatencyEnabled: false,
    stableBufferTime: 30,
    bufferTimeAtTopQualityLongForm: 30,
    retryIntervals: { MPD: 10 * 1000 }, // NOTE: guys from earshot set this value to 50sec, cos sometimes it make nginx crazy, we tested on 10sec now
    retryAttempts: { MPD: 10 },
  },
};

const requestTypeSettings = [
  'MPD', 'XLinkExpansion', 'InitializationSegment', 'IndexSegment', 'MediaSegment', 'other',
];

const load = (ctx) => new Promise((resolve, reject) => {
  console.log('[DASH] load called', { 
    url: ctx.state.info.url,
    hasPlayer: !!ctx.state.player,
  });
  
  if (_.isEmpty(ctx.state.info.url)) {
    console.error('[DASH] Missing stream url');
    reject(new Error('Missing stream url'));
    return;
  }
  
  if (ctx.state.player) {
    console.log('[DASH] Destroying existing player');
    ctx.state.player.destroy();
    ctx.commit('setPlayer', null);
  }

  console.log('[DASH] Creating new player');
  const player = dashjs.MediaPlayer().create();

  player.updateSettings(settings);
  _.each(requestTypeSettings, (type) => player.setXHRWithCredentialsForType(type, true));

  console.log('[DASH] Initializing player', {
    hasView: !!ctx.rootState.audio.view,
    url: ctx.state.info.url,
  });
  player.initialize(ctx.rootState.audio.view, ctx.state.info.url, false);

  ctx.commit('setPlayer', player);

  player.on(dashjs.MediaPlayer.events.MANIFEST_LOADED, ({ data }) => {
    console.log('[DASH] MANIFEST_LOADED event received');
    ctx.dispatch('logs/createMessage', { message: 'Dash stream manifest loaded' }, { root: true });

    const audioAdaptationSet = data.Period.AdaptationSet_asArray.find((elem) => elem.contentType === 'audio');
    const numChannels = Number(audioAdaptationSet.Representation_asArray[0].AudioChannelConfiguration.value);

    console.log('[DASH] Updating number of channels', { numChannels });
    ctx.dispatch('audio/updateNumberOfChannels', numChannels, { root: true });
    ctx.dispatch('logs/createMessage', { message: 'Audio channels initialized', data: { numChannels } }, { root: true });
    const {
      profiles, minimumUpdatePeriod, suggestedPresentationDelay, type,
    } = data;

    if (!profiles) {
      console.log('[DASH] Manifest profiles missed, retrying...');
      ctx.dispatch('logs/createMessage', { message: 'Manifest profiles missed. Retraining...', data: { ...ctx.state, profiles } }, { root: true });
      load(ctx).then((result) => resolve(result));
    } else {
      console.log('[DASH] Manifest loaded successfully');
      ctx.commit('setStreamInformation', { processing: false });
    }

    ctx.dispatch('updateInfo', { profiles, minimumUpdatePeriod, suggestedPresentationDelay, type });
  });

  player.on(dashjs.MediaPlayer.events.CAN_PLAY, () => {
    console.log('[DASH] CAN_PLAY event received');
    ctx.commit('setActiveStream', true);
    ctx.dispatch('logs/createMessage', { message: 'Dash stream cached. Track is playable' }, { root: true });
  });

  player.on(dashjs.MediaPlayer.events.ERROR, async (error) => {
    console.error('[DASH] Player error', { code: error.error.code, error: error.error });
    if (error.error.code === 10 || error.error.code === 31) {
      ctx.commit('loader', { description: 'Waiting dash stream configurations' }, { root: true });
      ctx.commit('setStreamInformation', { processing: true });

      load(ctx).then((result) => resolve(result));
    } else if (error.error.code !== 22) {
      const message = 'Got unhandled DASH stream error';
      const data = error.error;

      ctx.dispatch('logs/createMessage', { message, data, type: 'error' }, { root: true });
    }
  });
});

const parse = (id) => {
  // In production, use window.location.origin to avoid hardcoded port issues
  const streamUrl = process.env.NODE_ENV === 'development' 
    ? (process.env.VUE_APP_STREAM_URL ?? 'http://localhost:8080')
    : (typeof window !== 'undefined' ? window.location.origin : 'http://localhost');
  return `${streamUrl}/dash/static/${id}/manifest.mpd`;
};

export default { load, parse };
