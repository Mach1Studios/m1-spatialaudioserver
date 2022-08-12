<template>
  <div v-show="isActiveStream === true" id="Controls" class="card round">
    <div class="preview">
      <h4 class="title large-text">
        AUDIO PREVIEW
      </h4>
      <div class="channel-controls flex-item scroll">
        <div v-for="channel in channels" :key="channel" class="row middle-align responsive">
          <div class="channel-name">
            <p class="small-text upper white-text" style="white-space:nowrap">Channel {{ channel + 1 }}</p>
          </div>
          <div class="channel-wave">
            <AudioPlayerSineWave :channel="channel" :line-color="lineColors[channel]" />
          </div>
          <div class="controls">
            <div class="volume-control middle-align">
              <div>
                <i class="material-icons small" @click="mute(channel)">
                  {{ channelsMuted[channel] ? 'volume_off' : 'volume_up' }}
                </i>
              </div>
              <div class="channel">
                <input
                  v-model="channelsVolume[channel]"
                  step="0.01"
                  min="0"
                  max="1"
                  type="range"
                  @change="changeVolume(channel, $event.target.value)"
                >
              </div>
            </div>
            <div class="position-control middle-align">
              <div>
                <p>L</p>
              </div>
              <div class="channel">
                <input
                  step="1"
                  min="-1"
                  max="1"
                  type="range"
                  value="0"
                  @change="changePosition(channel, $event.target.value)"
                >
              </div>
              <div>
                <p>R</p>
              </div>
            </div>
          </div>
        </div>
      </div>
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
      defaultVolume: 0.5,
      channelsVolume: {},
      channelsMuted: {},
    };
  },
  computed: {
    ...mapGetters('audio', { channels: 'listOfChannels', isActiveChannels: 'isActiveChannels' }),
    ...mapState('audio', { audio: 'context', source: 'source' }),
    ...mapState('stream', ['player', 'isActiveStream']),
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
      // console.log(this.isActiveStream, this.isActiveChannels);
      if (this.isActiveStream && this.isActiveChannels) {
        _.each(this.channels, (channel, index) => {
          this.channelsVolume[index] = this.defaultVolume;
        });
        return this.createGainNodes(this.defaultVolume);
      }
      await wait(0.5);
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
  $ruler-line-off: ($input-bw - $ruler-line-h) / 2;
  $ruler-line-c: #c5b9b9;
  $ruler-fs: .75;

  $track-u: 2em;
  $track-k: 8em;
  $track-xtra: 0.5em;
  $track-w: $track-k + $track-xtra * 3;
  $track-h: .15em;

  $thumb-w: 2em;
  $thumb-h: 1em;
  $thumb-r: .375em;

  .preview {
    .title {
      color: #ffffff;
      font-size: 18rem;
      font-style: normal;
      letter-spacing: -0.5px;
      line-height: 1.17;

      margin-bottom: 8rem;
      margin-top: 8rem;
      padding-bottom: 8rem;
    }

    i {
      color: #4d4d4d;
      cursor: pointer;
    }

    p {
      color: #4d4d4d;
    }
  }

  .channel-controls {
    align-content: space-between;
    display: flex;
    flex-direction: column;

    overflow-x: hidden;
    scrollbar-color: #858585 #323237;

    height: auto;
    max-height: 64vh; // note important for playlist scroll
    max-width: 100%;

    padding-bottom: 16rem;

    .row {
      display: flex;
      justify-content: flex-start;

      .channel-name {
        order: 1;
      }

      .channel-wave {
        margin-left: 40rem;
        order: 2;
      }
      .controls {
        display: flex;
        flex-direction: row;

        margin-left: 40rem;
        order: 4;

        .volume-control {
          i {
            margin: 0 4rem 0 0;
          }
        }
        .position-control {
          margin-left: 30rem;

          p {
            margin: 0 4rem 0 4rem;
          }
        }
      }
    }

    &::-webkit-scrollbar-track {
      border-radius: 3rem;
      background-color: #323237;
    }

    &::-webkit-scrollbar {
      width: 5rem;

      background-color: #323237;
      border-radius: 3rem;
    }

    &::-webkit-scrollbar-thumb {
      background-color: #858585;
      border-radius: 3em;
    }
  }

  @mixin track() {
    background-color: #858585;
    border-radius: .1875em;

    height: $track-h;
    width: $track-w;
  }
  @mixin thumb() {
    height: $thumb-h;
    width: $thumb-w;

    border-radius: .5em;
    border: none;

    box-shadow:
       -.125em 0 .25em #252526,
      inset -1px 0 1px #fff;

    background:
      radial-gradient(#{at 100% 50%}, #d0cfcf, #d0cfcf 71%, transparent 71%)
        no-repeat ($thumb-w - 2 * $thumb-r) 50%,
      linear-gradient(90deg, #d0cfcf, #d0d0d0) no-repeat 100% 50%,
      radial-gradient(#{at 0 50%}, #d0cfcf, #c3c3c3 71%, transparent 71%)
        no-repeat $thumb-r 50%,
      linear-gradient(90deg, #e2e2e2, #d0cfcf) no-repeat 0 50%,
      linear-gradient(#d2d2d2, #f9f9f9, #d0cfcf, #d2d2d2);
    background-size: 1.1 * $thumb-r 100%;
  }

  .channel input[type='range'] {
    background-color: transparent;
    margin: 0;

    &,
    &::-webkit-slider-runnable-track,
    &::-webkit-slider-thumb {
      -webkit-appearance: none;
    }

    height: $input-h;
    width: $input-bw * 20;

    &::-webkit-slider-runnable-track {
      @include track();
      position: relative;
    }

    &::-moz-range-track {
      @include track();
    }

    &::-ms-track {
      @include track();
      border: none;
      color: transparent;
    }

    &::-ms-fill-lower {
      display: none;
    }

    &::-webkit-slider-thumb {
      @include thumb();
      margin-top: ($track-h - $thumb-h) / 2;
    }

    &::-moz-range-thumb {
      @include thumb();
    }

    &::-ms-thumb {
      @include thumb();
    }

    &::-webkit-slider-runnable-track, ::v-deep(#track) {
      &:before, &:after {
        position: relative;
      }

      &:before {
        right: 100%;
        top: 50%;
        transform: translate(50%, -50%) rotate(90deg) translate(0, 32%);
      }

      &:after {
        left: 50%;
        width: 3em;
      }
    }
  }

  .flex-item {
    scrollbar-color: #858585 #323237;

    &::-webkit-scrollbar-track {
      background-color: #323237;
      border-radius: 3rem;
    }

    &::-webkit-scrollbar {
      background-color: #323237;
      border-radius: 3rem;
      width: 5rem;
    }

    &::-webkit-scrollbar-thumb {
      background-color: #858585;
      border-radius: 3em;
    }
  }

  @media screen and (orientation: portrait) {
    #Controls {
      .channel-controls {
        max-height: calc(100vh - var(--height) - 50px - 14em);
      }

      .channel-controls .row {
        flex-direction: row;
        flex-flow: row wrap;

        .channel-wave {
          flex-basis: 100%;
          margin-left: 0;
        }

        .controls {
          flex-basis: 100%;
          margin-left: 0;

          .volume-control i {
            margin: 0;
          }

          .position-control {
            margin-left: 5rem;

            p {
             margin: 0;
            }
          }
        }
      }
    }
  }
</style>
