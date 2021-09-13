<template>
  <div>
    <div class="preview" v-show="isActiveStream === true">
      <h4 class="title large-text">AUDIO PREVIEW</h4>
      <div class="row no-wrap middle-align" v-for="channel in channels" :key="channel">
        <div class="col">
          <p class="small-text" style="white-space:nowrap">Channel {{channel + 1}}</p>
        </div>
        <div class="col">
          <AudioPlayerSineWave :channel="channel" :lineColor="lineColors[channel]"/>
        </div>
        <div class="col min">
          <i class="material-icons small black-text" @click="mute(channel)">
            {{channelsMuted[channel] ? 'volume_off' : 'volume_up'}}
          </i>
        </div>
        <div class="col min">
          <input class="volume" step="0.01" min="0" max="1" type="range" v-model="channelsVolume[channel]" @change="changeVolume(channel, $event.target.value)">
        </div>
        <div class="col min">
          <input class="volume" step="1" min="-1" max="1" type="range" value="0" @change="changePosition(channel, $event.target.value)">
        </div>
      </div>
    </div>
    <div class="channel-spinner absolute middle" v-show="isActiveStream === false">
      <p class="small-text bold">Initialization{{spinner}}</p>
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

const getPosition = (channel) => ({
  left: channel * 2,
  right: channel * 2 + 1,
});

// 0,1 = 1,2 => 0
// 2,3 = 3,4 => 1
// 4,5 = 5,6 => 2
// 6,7 = 7,8 => 3

export default {
  name: 'AudioPlayerControls',
  components: { AudioPlayerSineWave },
  data() {
    return {
      spinner: '',
      lineColors: _.map(['#7F842F', '#e1a69f', '#4B3C53', '#C04040', '#D36646', '#9CA2C2', '#8BB4C9', '#DBD534'], (value) => hexRgb(value, { format: 'css' })),
      defaultVolume: 0.1,
      channelsVolume: {},
      channelsMuted: {},
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
      this.channelsVolume[channel] = volume;

      const { left, right } = getPosition(channel);

      this.updateVolume({ channel: right, volume });
      this.updateVolume({ channel: left, volume });

      this.channelsMuted[channel] = Number(volume) === 0;
    },
    changePosition(channel, value) {
      const { left, right } = getPosition(channel);
      switch (Number(value)) {
        case -1:
          this.updateVolume({ channel: right, volume: 0 });
          this.updateVolume({ channel: left, volume: this.channelsVolume[channel] });
          break;
        case 1:
          this.updateVolume({ channel: right, volume: this.channelsVolume[channel] });
          this.updateVolume({ channel: left, volume: 0 });
          break;
        default:
          this.updateVolume({ channel: right, volume: this.channelsVolume[channel] });
          this.updateVolume({ channel: left, volume: this.channelsVolume[channel] });
      }
    },
    mute(channel) {
      this.changeVolume(channel, this.channelsMuted[channel] ? this.defaultVolume : 0);
    },
    async init() {
      if (this.isActiveStream && this.isActiveChannels) {
        _.each(this.channels, (channel, index) => {
          this.channelsVolume[index] = this.defaultVolume;
        });
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
  .preview {
    .title {
      font-style: normal;
      font-weight: bold;

      line-height: 1.17;
      letter-spacing: -0.5px;
    }

    .volume {
      filter:  grayscale(100%);
      height: 1px;
    }

    i {
      cursor: pointer;
    }
  }
  .channel-spinner {
    float: left;
    left: 45%;
  }
</style>
