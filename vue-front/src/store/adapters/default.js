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
  if (_.isEmpty(ctx.state.info.url)) reject(new Error('Missing stream url'));
  if (ctx.state.player) {
    ctx.state.player.destroy();
    ctx.commit('setPlayer', null);
  }

  const player = dashjs.MediaPlayer().create();

  player.updateSettings(settings);
  _.each(requestTypeSettings, (type) => player.setXHRWithCredentialsForType(type, true));

  player.initialize(ctx.rootState.audio.view, ctx.state.info.url, false);

  ctx.commit('setPlayer', player);

  player.on(dashjs.MediaPlayer.events.MANIFEST_LOADED, ({ data }) => {
    ctx.dispatch('logs/createMessage', { message: 'Dash stream manifest loaded' }, { root: true });

    const audioAdaptationSet = data.Period.AdaptationSet_asArray.find((elem) => elem.contentType === 'audio');
    const numChannels = Number(audioAdaptationSet.Representation_asArray[0].AudioChannelConfiguration.value);

    ctx.dispatch('audio/updateNumberOfChannels', numChannels, { root: true });
    ctx.dispatch('logs/createMessage', { message: 'Audio channels initialized', data: { numChannels } }, { root: true });
    const {
      profiles, minimumUpdatePeriod, suggestedPresentationDelay, type,
    } = data;

    if (!profiles) {
      ctx.dispatch('logs/createMessage', { message: 'Manifest profiles missed. Retraining...', data: { ...ctx.state, profiles } }, { root: true });
      load(ctx).then((result) => resolve(result));
    } else {
      ctx.commit('setStreamInformation', { processing: false });
    }

    ctx.dispatch('updateInfo', { profiles, minimumUpdatePeriod, suggestedPresentationDelay, type });
  });

  player.on(dashjs.MediaPlayer.events.CAN_PLAY, () => {
    ctx.commit('setActiveStream', true);
    ctx.dispatch('logs/createMessage', { message: 'Dash stream cached. Track is playable' }, { root: true });
  });

  player.on(dashjs.MediaPlayer.events.ERROR, async (error) => {
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
