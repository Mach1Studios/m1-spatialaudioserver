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
        <div class="col channel">
          <input step="0.01" min="0" max="1" type="range" v-model="channelsVolume[channel]" @change="changeVolume(channel, $event.target.value)">
        </div>
        <div class="col channel">
          <input step="1" min="-1" max="1" type="range" value="0" @change="changePosition(channel, $event.target.value)">
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
  $input-bw: 0.5em;
  $input-h: 1.55em;
  $input-bg-c: #c3b7b7;
  $input-bg-ct: rgba($input-bg-c, 0);

  $ruler-line-w: .0625em;
  $ruler-line-h: .425em;
  $ruler-line-off: ($input-bw - $ruler-line-h)/2;
  $ruler-line-c: #c5b9b9;
  $ruler-fs: .75;

  $track-u: 2em;
  $track-k: 6;
  $track-xtra: 1em;
  $track-w: $track-k + $track-xtra*2;
  $track-h: .15em;

  $thumb-w: 2em;
  $thumb-h: 1em;
  $thumb-r: .375em;

  @mixin track() {
    width: $track-w; height: $track-h;
    border-radius: .1875em;
    background-color: #c5c5c5;
  }
  @mixin thumb() {
    border: none;
    width: $thumb-w; height: $thumb-h;
    border-radius: .5em;
    box-shadow:
       -.125em 0 .25em #928886,
      inset -1px 0 1px #fff;
    background:
      radial-gradient(#{at 100% 50%}, #e8e8e8, #eaeaea 71%, transparent 71%)
        no-repeat ($thumb-w - 2*$thumb-r) 50%,
      linear-gradient(90deg, #e8e8e8, #d0d0d0) no-repeat 100% 50%,
      radial-gradient(#{at 0 50%}, #d0cfcf, #c3c3c3 71%, transparent 71%)
        no-repeat $thumb-r 50%,
      linear-gradient(90deg, #e2e2e2, #d0cfcf) no-repeat 0 50%,
      linear-gradient(#d2d2d2, #f9f9f9, #f9f9f9, #d2d2d2);
    background-size: 1.1*$thumb-r 100%;
  }

  .channel input[type='range']{
    &,
    &::-webkit-slider-runnable-track,
    &::-webkit-slider-thumb {
      -webkit-appearance: none;
    }

    align-self: center;
    border: solid $input-bw transparent;
    padding: 0;
    width: 90%; height: $input-h;

    &::-webkit-slider-runnable-track {
      position: relative;
      @include track();
    }
    &::-moz-range-track {
      @include track();
    }
    &::-ms-track {
      border: none;
      @include track();
      color: transparent;
    }

    &::-ms-fill-lower { display: none; }

    &::-webkit-slider-thumb {
      margin-top: ($track-h - $thumb-h)/2;
      @include thumb();
    }
    &::-moz-range-thumb {
      @include thumb();
    }
    &::-ms-thumb {
      @include thumb();
    }

    &::-webkit-slider-runnable-track, /deep/ #track {
      &:before, &:after {
        position: relative;
      }
      &:before {
        top: 50%; right: 100%;
        transform: translate(50%, -50%) rotate(90deg) translate(0, 32%);
      }
      &:after {
        left: 50%;
        width: 3em;
        // word-spacing: 1em;
      }
    }
  }
  .preview {
    .title {
      font-style: normal;
      font-weight: bold;

      line-height: 1.17;
      letter-spacing: -0.5px;
    }

    i {
      cursor: pointer;
    }
  }
  .channel-spinner {
    float: left;
    left: 45%;
  }

  // .volume input[type='range']{
  //   -webkit-appearance: none;
  //   // width: calc(100% - (#{10px + 10px}));
  //   height: 1rem;
  //   width: 7em;
  //   border-radius: 5px;
  //   background: #000000;
  //   outline: none;
  //   padding: 0;
  //   margin: 0;
  //   cursor: pointer;
  //
  //   // Range Handle
  //     &::-webkit-slider-thumb {
  //       -webkit-appearance: none;
  //       width: 10rem;
  //       height: 10rem;
  //       border-radius: 50%;
  //       background: #000;
  //       box-shadow: 0 1px 3px #7d7d7d;
  //       background:
  //         linear-gradient(#c5c5c5, whitesmoke) padding-box,
  //         linear-gradient(#fbfbfb, #c2c2c2) border-box;
  //       cursor: pointer;
  //     transition: all 0.15s ease-in-out;
  //   }
  //   &::-moz-range-thumb {
  //     border: 0;
  //     width: 10rem;
  //     height: 10rem;
  //     border-radius: 50%;
  //     // background: #2c3e50;
  //     box-shadow: 0 2px 5px #7d7d7d;
  //     background:
  //       linear-gradient(#c5c5c5, whitesmoke) padding-box,
  //       linear-gradient(#fbfbfb, #c2c2c2) border-box;
  //     cursor: pointer;
  //     transition: background 0.15s ease-in-out;
  //   }
  // }
</style>
