import _ from 'lodash';
import Hls from 'hls.js';

// .on() dashjs.MediaPlayer.events.MANIFEST_LOADED => Hls.Events.MANIFEST_LOADED
// .on() dashjs.MediaPlayer.events.CAN_PLAY => Hls.Events.AUDIO_TRACK_LOADED
// .on() dashjs.MediaPlayer.events.ERROR => Hls.Events.ERROR

const load = (ctx) => new Promise((resolve, reject) => {
  if (_.isEmpty(ctx.state.info.url)) reject(new Error('Missing stream url'));
  if (ctx.state.player) {
    ctx.state.player.destroy();
    ctx.commit('setPlayer', null);
  }

  const player = new Hls({ debug: false, defaultAudioCodec: 'mp4a.40.5' });
  player.attachMedia(ctx.rootState.audio.view);
  ctx.commit('setPlayer', player);

  player.on(Hls.Events.MEDIA_ATTACHED, () => {
    ctx.dispatch('logs/createMessage', { message: 'HLS stream bound to the player' }, { root: true });

    player.loadSource(ctx.state.info.url);
    player.on(Hls.Events.MANIFEST_PARSED, () => {
      ctx.dispatch('logs/createMessage', { message: 'HLS stream manifest loaded' }, { root: true });

      ctx.dispatch('audio/updateNumberOfChannels', 8, { root: true });
      ctx.commit('setStreamInformation', { processing: false });
    });
  });

  player.on(Hls.Events.AUDIO_TRACK_LOADED, () => {
    ctx.commit('setActiveStream', true);
    ctx.dispatch('logs/createMessage', { message: 'HLS stream cached. Track is playable' }, { root: true });
  });

  // player.once(Hls.Events.FRAG_BUFFERED, (event, data) => {
  //   // console.log('Hls.Events.FRAG_BUFFERED');
  //   // console.log(data.frag.data, data.frag.data.buffer);
  //   // const { buffer } = data.frag.data.slice();
  //   //
  //   // // const context = new (window.AudioContext || window.webkitAudioContext)();
  //   // // const reader = new FileReader();
  //   // //
  //   // // reader.onload = (e) => {
  //   // //   const { result } = e.target;
  //   // //
  //   // context.decodeAudioData(buffer, (opt) => {
  //   //   const source = context.createBufferSource();
  //   //   source.connect(context.destination);
  //   //   source.buffer = buffer;
  //   //
  //   //   console.log(opt);
  //   //
  //   //   // if (_.find(state.files, { name: track.name })) {
  //   //   //   dispatch('toast', { error: { message: `You have already chosen a track called "${track.name}"` } }, { root: true });
  //   //   // } else {
  //   //   //   commit('setFile', { track, numberOfChannels: buffer.numberOfChannels, name: track.name });
  //   //   // }
  //   //   // commit('loader', { enable: false }, { root: true });
  //   // });
  //   // };
  //   // reader.readAsArrayBuffer(data.tracks.audio.buffer);
  // });

  player.on(Hls.Events.ERROR, (event, data) => {
    switch (data.details) {
      case Hls.ErrorDetails.FRAG_LOAD_ERROR:
        // ....
        break;
      default:
        break;
    }
  });
});

const parse = (id) => `${process.env.VUE_APP_STREAM_URL ?? 'http://localhost:8080'}/hls/static/${id}/master.m3u8`;

export default { load, parse };
