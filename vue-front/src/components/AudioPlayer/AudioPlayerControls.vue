<template>
  <div v-show="isActiveStream === true" id="Controls">
    <article>
      <div class="preview">
        <div class="preview-header">
          <h4 class="title large-text">
            AUDIO PREVIEW
          </h4>
          <button class="close-button" @click="closePreview" title="Close preview">
            <i class="material-icons">close</i>
          </button>
        </div>
        <div class="channel flex-item scroll">
          <div v-for="channel in channels" :key="channel" class="grid middle-align">
            <div class="col s1 channel-number">
              <p class="small-text upper white-text" style="white-space:nowrap">Channel {{ channel + 1 }}</p>
            </div>
            <div class="col s4 channel-wave">
              <AudioPlayerSineWave :channel="channel" :line-color="lineColors[channel]" />
            </div>
            <div class="col s7 channel-controls">
              <div class="volume-control middle-align">
                <div>
                  <i class="material-icons fill small" @click="mute(channel)">
                    {{ channelsMuted[channel] ? 'volume_off' : 'volume_up' }}
                  </i>
                </div>
                <div class="controller">
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
                <div class="controller">
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
    </article>
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
  watch: {
    '$store.getters["audio/isActiveChannels"]'(newVal, oldVal) {
      console.log('[CONTROLS] isActiveChannels changed', { from: oldVal, to: newVal, isActiveStream: this.isActiveStream });
      // When channels become active and stream is already active, initialize immediately
      if (newVal && this.isActiveStream) {
        console.log('[CONTROLS] Both stream and channels active, initializing gain nodes immediately');
        this.initializeAudio();
      }
    },
    '$store.state.stream.isActiveStream'(newVal, oldVal) {
      console.log('[CONTROLS] isActiveStream changed', { from: oldVal, to: newVal, isActiveChannels: this.isActiveChannels });
      // When stream becomes active and channels are already active, initialize immediately
      if (newVal && this.isActiveChannels) {
        console.log('[CONTROLS] Both stream and channels active, initializing gain nodes immediately');
        this.initializeAudio();
      }
    },
  },
  methods: {
    ...mapActions('audio', ['createGainNodes', 'updateVolume']),
    closePreview() {
      this.$emit('close-preview');
    },
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
    async initializeAudio() {
      console.log('[CONTROLS] initializeAudio called', {
        isActiveStream: this.isActiveStream,
        isActiveChannels: this.isActiveChannels,
        channels: this.channels,
      });
      
      if (this.isActiveStream && this.isActiveChannels) {
        console.log('[CONTROLS] Creating gain nodes for audio processing');
        _.each(this.channels, (channel, index) => {
          this.channelsVolume[index] = this.defaultVolume;
        });
        console.log('[CONTROLS] About to call createGainNodes with volume:', this.defaultVolume);
        const result = await this.createGainNodes(this.defaultVolume);
        console.log('[CONTROLS] createGainNodes returned:', result);
        return result;
      } else {
        console.log('[CONTROLS] Cannot initialize - stream or channels not ready');
      }
    },
    async init() {
      console.log('[CONTROLS] init (polling) called', {
        isActiveStream: this.isActiveStream,
        isActiveChannels: this.isActiveChannels,
        channels: this.channels,
      });
      
      if (this.isActiveStream && this.isActiveChannels) {
        console.log('[CONTROLS] Conditions met, initializing audio');
        return this.initializeAudio();
      }
      
      console.log('[CONTROLS] Waiting for stream/channels to be active, retrying in 0.5s');
      await wait(0.5);
      return this.init();
    },
  },
  mounted() {
    console.log('[CONTROLS] Component mounted', {
      isActiveStream: this.isActiveStream,
      isActiveChannels: this.isActiveChannels,
      channels: this.channels,
    });
    console.log('[CONTROLS] Watchers registered:', Object.keys(this.$options.watch || {}));
    this.init();
  },
};
</script>

<style lang="scss" scoped>
  $input-bw: 0.5em;
  $input-h: 1.55em;
  $input-bg-c: #c3b7b7;
  $input-bg-ct: rgba($input-bg-c, 0);

  $ruler-line-h: .425em;
  $ruler-line-w: .0625em;
  $ruler-line-off: calc(($input-bw - $ruler-line-h) / 2);

  $ruler-fs: .75;
  $ruler-line-c: #c5b9b9;

  $track-u: 2em;
  $track-k: 8em;
  $track-h: .15em;
  $track-xtra: 0.5em;
  $track-w: $track-k + $track-xtra * 3;

  $thumb-w: 2em;
  $thumb-h: 1em;
  $thumb-r: .375em;

  .flex-item {
    scrollbar-color: var(--primary-color) var(--secondary-color);

    &::-webkit-scrollbar-track {
      background-color: var(--secondary-color);
      border-radius: 0;
    }

    &::-webkit-scrollbar {
      background-color: var(--secondary-color);
      border-radius: 0;
      width: 5rem;
    }

    &::-webkit-scrollbar-thumb {
      background-color: var(--primary-color);
      border-radius: 0;
    }
  }

  .preview {
    .preview-header {
      display: flex;
      justify-content: space-between;
      align-items: center;
      margin-bottom: 8rem;
      margin-top: 8rem;
      padding-bottom: 8rem;
    }

    .title {
      color: var(--secondary-highlight-color);
      letter-spacing: -0.5px;
      font-style: normal;
      line-height: 1.17;
      font-size: 18rem;
      margin: 0;
      flex: 1;
    }

    .close-button {
      background: none;
      border: none;
      padding: 4rem;
      cursor: pointer;
      display: flex;
      align-items: center;
      justify-content: center;
      color: var(--secondary);
      transition: color 0.2s ease;
      margin-left: 16rem;

      &:hover {
        color: var(--secondary-highlight-color);
      }

      &:focus {
        outline: none;
      }

      i {
        font-size: 24rem;
        color: inherit;
      }
    }

    i {
      color: var(--secondary);

      cursor: pointer;
    }

    p {
      color: var(--secondary);
    }
  }

  article {
    background-color: var(--secondary-dark-color);
    border-radius: 0 !important;
  }

  .channel {
    align-content: space-between;
    flex-direction: column;
    display: flex;

    scrollbar-color: var(--primary-color) var(--secondary-color);
    overflow-x: hidden;

    height: auto;
    max-width: 100%;
    max-height: 65vh;

    padding-bottom: 16rem;

    .grid {
      display: flex;
      justify-content: flex-start;

      .channel-number {
        order: 1;
      }

      .channel-wave {
        margin-left: 40rem;
        order: 2;
      }
      .channel-controls {
        display: flex;
        grid-gap: inherit;
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
      border-radius: 0;
      background-color: var(--secondary-color);
    }

    &::-webkit-scrollbar {
      width: 5rem;

      border-radius: 0;
      background-color: var(--secondary-color);
    }

    &::-webkit-scrollbar-thumb {
      border-radius: 0;
      background-color: var(--primary-color);
    }
  }

  @mixin track() {
    background-color: var(--primary-color);
    border-radius: 0;

    height: $track-h;
    width: $track-w;
  }
  @mixin thumb() {
    height: $thumb-h;
    width: $thumb-w;

    border-radius: 0;
    border: none;

    box-shadow:
       -.125em 0 .25em var(--secondary-dark-color),
      inset -1px 0 1px var(--secondary-highlight-color);

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

  .controller input[type='range'] {
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
      margin-top: calc(($track-h - $thumb-h) / 2);
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

  @media screen and (orientation: portrait) {
    #Controls {
      .channel {
        max-height: calc(100vh - var(--height) - 50px - 12em);
      }

      .channel .grid {
        flex-direction: row;
        flex-flow: row wrap;

        .channel-wave {
          margin-left: 0;
        }

        .channel-controls {
          margin-left: 0;

          .volume-control i {
            margin: 0;
          }

          .position-control {
            margin-left: 0rem;

            p {
             margin: 0;
            }
          }
        }
      }
    }
  }
</style>
