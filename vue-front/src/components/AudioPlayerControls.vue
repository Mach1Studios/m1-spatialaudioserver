<template lang="html">
  <div v-show="isActiveStream === true">
    <h4 class="label">AUDIO PREVIEW</h4>
    <div class="field is-horizontal" v-for="channel in channels" :key="channel">
      <div class="field-label is-normal">
        <label class="label">Channel {{channel + 1}}</label>
      </div>
      <div class="field-body">
        <div class="field">
          <div class="control">
            <AudioPlayerSineWave :channel="channel" :lineColor="lineColors[channel]"/>
            <!-- <input class="slider is-fullwidth is-circle" step="1" min="0" max="100" value="50" type="range" @change="changeVolume(channel, $event.target.value)">
           -->
          </div>
        </div>
        <div class="field" id="volume-slider">
          <div class="control">
            <button class="button">
              <span class="icon is-small">
                <ion-icon name="volume-medium"></ion-icon>
              </span>
            </button>
            <input id="volume" step="1" min="0" max="100" value="50" type="range" @change="changeVolume(channel, $event.target.value)">
          </div>
        </div>
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
  // eslint-disable-next-line
  components: { AudioPlayerSineWave },
  data() {
    return {
      spinner: '',
      lineColors: _.map(['#7F842F', '#e1a69f', '#4B3C53', '#C04040', '#D36646', '#9CA2C2', '#8BB4C9', '#DBD534'], (value) => hexRgb(value, { format: 'css' })),
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
      // if (this.gainNodes) {
      //   // this.gainNodes[channel].gain.value = Number(value) / 200;
      // }
    },
    async init() {
      if (this.isActiveStream && this.isActiveChannels) {
        return this.createGainNodes();
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
  .spinner {
    float: left;
    left: 45%;
  }

  #volume-slider {
    .control{
      display: flex;
      filter:  grayscale(100%);
    }
    .button {
      border: none;
      float: left;
    }
  }
</style>
