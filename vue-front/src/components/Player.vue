<template>
  <div>
    <!-- <div class="wrapper">
      <video autoplay="false" ref="player"></video>
    </div> -->
    <vue-plyr>
      <audio controls crossorigin playsinline ref="player">
        <!-- <source
            src="/m1-debug-shrtpt-m1spatial.wav"
            type="audio/wav"
        /> -->
      </audio>
    </vue-plyr>
  </div>
</template>

<script>
/* eslint-disable */
import dashjs from 'dashjs';

// const videoPlayer = document.createElement("video");
// videoPlayer.setAttribute("class", "VideoPlayer");
// videoPlayer.setAttribute("id", "videoPlayer");
// videoPlayer.muted = true;

// const POLLING_INTERVAL = 1000;
const STABLE_BUFFER_TIME = 20;
const BUFFER_TIME_AT_TOP_QUALITY = 20;
const MANIFEST_LOAD_RETRY_INTERVAL = 50000;

const DEFAULT_CLIENT_SETTINGS = {
  streaming: {
    useSuggestedPresentationDelay: false,
    lowLatencyEnabled: false,
    stableBufferTime: STABLE_BUFFER_TIME,
    bufferTimeAtTopQualityLongForm: BUFFER_TIME_AT_TOP_QUALITY,
    retryIntervals: {
      MPD: MANIFEST_LOAD_RETRY_INTERVAL,
    },
    retryAttempts: {
      MPD: 3,
    },
  },
};

export default {
  name: 'Player',
  mounted() {
    const audio = document.querySelector('audio');
    const player = dashjs.MediaPlayer().create();

    console.log(this.$refs.player, audio);
    player.updateSettings(DEFAULT_CLIENT_SETTINGS);

    const url = "https://livesim.dashif.org/dash/vod/testpic_2s/audio.mpd";
    const localurl = 'http://localhost:8080/dash/play.mpd';
    player.initialize(this.$refs.player, localurl, true);

    player.on(dashjs.MediaPlayer.events.MANIFEST_LOADED, ({ data }) => {
      console.log('loaded', data);

      const audioAdaptationSet = data.Period.AdaptationSet_asArray.find((elem) => elem.contentType === 'audio');
      const videoAdaptationSets = data.Period.AdaptationSet_asArray.filter((elem) => elem.contentType === 'video');
      const numChannels = Number(audioAdaptationSet.Representation_asArray[0].AudioChannelConfiguration.value);

      console.log(audioAdaptationSet, videoAdaptationSets, numChannels);
    });

    player.on(dashjs.MediaPlayer.events.ERROR, (error) => {
      console.log('error', error);
    });
  },
};
</script>

<style scoped>
  .plyr__control {
    color: #1a1a1a;
  }
 .plyr__control:hover {
    background: transparent;
  }
  .hidden {
    display: none;
  }
</style>
