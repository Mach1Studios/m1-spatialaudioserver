<template lang="html">
  <div v-show="active === true">
    <h4 class="label">AUDIO PREVIEW</h4>
    <div class="field is-horizontal" v-for="channel in channels" :key="channel">
      <div class="field-label is-normal">
        Channel {{channel + 1}}
      </div>
      <div class="field-body">
        <div class="field">
          <div class="control">
            <!-- <span class="icon">
              <ion-icon name="volume-low"></ion-icon>
            </span> -->
            <input class="slider is-fullwidth is-circle" step="1" min="0" max="100" value="50" type="range" @change="changeVolume(channel, $event.target.value)">
            <!-- <ion-icon name="volume-medium"></ion-icon> -->
          </div>
        </div>
      </div>

    </div>
  </div>
  <div v-show="active === false">
    <p>Initialization...</p>
  </div>
</template>

<script>
import { mapGetters, mapState } from 'vuex';

const wait = (sec) => new Promise((resolve) => {
  setTimeout(resolve, sec * 1000);
});

const AudioContext = window.AudioContext || window.webkitAudioContext;

export default {
  name: 'AudioPlayerControls',
  data() {
    return { active: false };
  },
  computed: {
    ...mapState('dash', ['player', 'source']),
    ...mapGetters('dash', { channels: 'listOfChannels' }),
  },
  methods: {
    changeVolume(channel, value) {
      if (this.gainNodes) {
        this.gainNodes[channel].gain.value = Number(value) / 200;
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
  mounted() {
    this.init();
  },
};
</script>

<style lang="scss" scoped>
  // .channel .label {
  //   font-style: normal;
  //   font-weight: bold;
  //   font-size: 1rem;
  //   line-height: 1.17;
  //   letter-spacing: -0.5px;
  // }
  // .channel-icon {
  //   font-size: 50px;
  // }
</style>
