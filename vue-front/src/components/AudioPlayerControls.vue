<template lang="html">
  <div class="preview" v-show="isActiveStream === true">
    <h4 class="title">AUDIO PREVIEW</h4>
    <div class="row no-wrap middle-align" v-for="channel in channels" :key="channel">
      <div class="col">
          <div style="white-space:nowrap">Channel {{channel + 1}}</div>
      </div>
      <div class="col">
          <AudioPlayerSineWave :channel="channel" :lineColor="lineColors[channel]"/>
      </div>
      <div class="col min">
          <i class="black-text">volume_up</i>
      </div>
      <div class="col min">
        <input class="volume" step="0.01" min="0" max="1" value="0.1" type="range" @change="changeVolume(channel, $event.target.value)">
      </div>
    </div>
  </div>
  <div class="channel-spinner" v-show="isActiveStream === false">
    <div class="spinner">
      Initialization{{spinner}}
    </div>
  </div>
</template>

<script>
import _ from 'lodash';
import hexRgb from 'hex-rgb';

import { mapActions, mapGetters, mapState } from 'vuex';

import AudioPlayerSineWave from './AudioPlayerSineWave.vue';

const wait = (sec) => new Promise((resolve) => {
  setTimeout(resolve, sec * 1000);
});

export default {
  name: 'AudioPlayerControls',
  components: { AudioPlayerSineWave },
  data() {
    return {
      spinner: '',
      lineColors: _.map(['#7F842F', '#e1a69f', '#4B3C53', '#C04040', '#D36646', '#9CA2C2', '#8BB4C9', '#DBD534'], (value) => hexRgb(value, { format: 'css' })),
      defaultVolume: 0.1,
    };
  },
  computed: {
    ...mapGetters('audio', { channels: 'listOfChannels', isActiveChannels: 'isActiveChannels' }),
    ...mapState('audio', { audio: 'context', source: 'source' }),
    ...mapState('dash', ['player', 'isActiveStream']),
  },
  created() {
    setInterval(() => {
      if (this.spinner === '...') {
        this.spinner = '';
      } else {
        this.spinner = `${this.spinner}.`;
      }
    }, 400);
  },
  methods: {
    ...mapActions('audio', ['createGainNodes', 'updateVolume']),
    changeVolume(channel, volume) {
      this.updateVolume({ channel, volume });
    },
    async init() {
      if (this.isActiveStream && this.isActiveChannels) {
        return this.createGainNodes(this.defaultVolume);
      }
      await wait(2);
      return this.init();
    },
  },
  mounted() {
    this.init();
  },
};
</script>

<style lang="scss" scoped>
  .preview .title {
    font-style: normal;
    font-weight: bold;
    font-size: 1rem;

    line-height: 1.17;
    letter-spacing: -0.5px;
  }

  .spinner {
    float: left;
    left: 45%;
  }

  div>.volume {
    filter:  grayscale(100%);
    height: 4px;
  }
</style>
