<template>
  <div class="container is-fluid">
    <div class="columns">
      <div class="column is-one-third">
        <div class="box is-flex is-flex-direction-column is-justify-content-space-between">
          <AudioPlayerRadioControls/>
        </div>
      </div>
      <div class="column is-one-third">
        <div class="box is-flex is-flex-direction-column is-justify-content-space-between">
          <AudioPlayer/>
        </div>
      </div>
      <div class="column is-one-third">
        <div class="box is-flex is-flex-direction-column is-justify-content-space-between">
          <AudioPlayerSliders/>
        </div>
      </div>
    </div>
  </div>
  <div class="is-flex is-flex-direction-column is-justify-content-space-between">
    <AudioPlayerTouch/>
  </div>
</template>

<script>
// import _ from 'lodash';
import { mapGetters, mapState } from 'vuex';

import {
  // Mach1SoundPlayer,
  Mach1DecoderProxy,
} from 'mach1spatial-decode';

import AudioPlayerRadioControls from '../components/AudioPlayerRadioControls.vue';
import AudioPlayer from '../components/AudioPlayer.vue';
import AudioPlayerSliders from '../components/AudioPlayerSliders.vue';
import AudioPlayerTouch from '../components/AudioPlayerTouch.vue';

const wait = (sec) => new Promise((resolve) => {
  setTimeout(resolve, sec * 1000);
});

export default {
  components: {
    AudioPlayerRadioControls,
    AudioPlayer,
    AudioPlayerSliders,
    AudioPlayerTouch,
  },
  computed: {
    ...mapState('dash', ['player', 'source']),
    ...mapGetters('dash', { channels: 'listOfChannels' }),
  },
  mounted() {
    this.decoder = new Mach1DecoderProxy();
    //
    window.addEventListener('mousemove', (event) => {
      window.mouseX = (event.clientX) / window.innerWidth;
      window.mouseY = (event.clientY) / window.innerHeight;
    }, false);
    this.loop();
    this.init();
  },
  methods: {
    loop() {
      // console.log('animate');
      const map = (value, x1, y1, x2, y2) => ((value - x1) * (y2 - x2)) / (y1 - x1) + x2;
      requestAnimationFrame(this.loop);

      window.yaw = map(window.mouseX, 0, 1, -180, 180);
      window.pitch = map(window.mouseY, 0, 1, 45, -45);
      window.roll = 0;

      const rotateX = `rotateX(${parseInt(-window.pitch, 10)}deg)`;
      const rotateY = `rotateY(${parseInt(-window.yaw, 10)}deg)`;

      const transform = `translate(-50%, -50%) ${rotateX} ${rotateY}`;
      document.getElementById('touchstats:card').style.transform = transform;

      // console.log();
      const decoded = this.decoder.decode(window);

      if (decoded && decoded.length > 0) {
        for (let i = 0; i < decoded.length; i += 1) {
          this.changeVolume(i, decoded[i]);
        }
      }

      // _.each(this.decoder.decode(window), this.changeVolume);
      // console.log(this.decoder.decode(window));
    },
    changeVolume(channel, value) {
      if (channel && value && this.gainNodes && this.gainNodes[channel]) {
        // console.log('changeVolume', channel, value);
        this.gainNodes[channel].gain.value = Number(value);
      }
    },
    async init() {
      const isActive = this.player && this.player.getActiveStream && this.player.getActiveStream()
        ? this.player.getActiveStream().isActive()
        : false;
      if (isActive && this.channels.length > 0) {
        const audio = new AudioContext();

        const source = audio.createMediaElementSource(this.source);
        const splitter = audio.createChannelSplitter(this.channels.length);
        const merger = audio.createChannelMerger(this.channels.length);

        source.connect(splitter);

        audio.createGain = audio.createGain || audio.createGainNode;

        const gainNodes = [];

        for (let i = 0; i < this.channels.length; i += 1) {
          const gain = audio.createGain();
          gainNodes.push(gain);
          splitter.connect(gain, i, 0);
          gain.connect(merger, 0, 0);
          gain.connect(merger, 0, 1);
          gain.gain.value = 0.1;
        }

        merger.connect(audio.destination);

        this.merger = merger;
        this.gainNodes = gainNodes;
        this.splitter = splitter;

        this.active = true;
      } else {
        delete this.merger;
        delete this.gainNodes;
        delete this.splitter;

        this.active = false;

        await wait(2);
        await this.init();
      }
    },
  },
};
</script>
<style lang="scss" scoped>
</style>
