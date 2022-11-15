<template>
  <div class="player">
    <div class="top-align">
      <progress
        name="progress"
        class="top"
        min="0"
        max="100"
        :value="playback"
        @click.prevent="playbackUpdate"
      />
    </div>
    <div class="music-box">
      <audio ref="player" />
    </div>
    <div class="btn-box">
      <span class="absolute left">
        <i class="material-icons play" :class="{ active: icon === 'pause_arrow' }" @click="play">{{ icon }}</i>
        <span class="name">{{ track.name }}</span>
      </span>
      <span class="absolute right">
        <span class="duration">{{ currentTime }}</span>
        <span class="duration">/</span>
        <span class="duration">{{ duration }}</span>
        <i class="material-icons repeat" :class="{ 'on-repeat': isRepeat }" @click="repeat">repeat</i>
        <button class="btn-player small" @click="setAdapter(isActiveAdapter === 'hls' ? 'dash' : 'hls')">
          <span>{{ isActiveAdapter }}</span>
        </button>
      </span>
    </div>
  </div>
</template>

<script>
import { Duration } from 'luxon';
import { mapActions, mapState, mapMutations } from 'vuex';

export default {
  name: 'AudioPlayer',
  props: {
    skin: {
      type: String,
      default: 'dark',
      validator: (value) => (value === 'dark' ? 'dark' : 'light'),
    },
  },
  data() {
    return {
      isRepeat: false,
      isPlay: false,
      duration: '00:00',
      currentTime: '00:00',
      playback: 0,
    };
  },
  computed: mapState({
    track: (state) => state.tracks.track,
    type: (state) => state.stream.type,
    isActiveStream: (state) => state.stream.isActiveStream,
    isActiveAdapter: (state) => state.stream.adapter,

    icon() {
      return this.isPlay ? 'pause_arrow' : 'play_arrow';
    },
    // typeOfStream() {
    //   return this.isPlay ? 'HLS' : 'DASH';
    // },
    // switchAdapter: (state) => state.stream.switchAdapter,
  }),
  watch: {
    isActiveStream(value) {
      this.isPlay = value;

      if (this.$refs.player && this.$refs.player.duration) {
        this.duration = Duration.fromObject({ seconds: this.$refs.player.duration }).toFormat('mm:ss');
      }
    },
  },
  methods: {
    ...mapActions('audio', ['updateSource']),
    ...mapActions('stream', ['stop']),
    ...mapMutations('stream', ['setAdapter']),

    play() {
      if (!this.isActiveStream) return;

      if (this.$refs.player.paused) {
        this.$refs.player.play();
      } else {
        this.$refs.player.pause();
      }

      this.isPlay = !this.$refs.player.paused;
    },
    playbackUpdate(event) {
      if (event.target && this.$refs.player && this.$refs.player.currentTime) {
        const offset = event.offsetX / event.target.getBoundingClientRect().width;
        this.$refs.player.currentTime = (offset * this.$refs.player.duration);
      }
    },
    repeat() {
      this.isRepeat = !this.isRepeat;
      this.$refs.player.loop = this.isRepeat;
    },
    timeUpdate() {
      if (this.$refs.player && this.$refs.player.currentTime) {
        this.currentTime = Duration.fromObject({ seconds: this.$refs.player.currentTime }).toFormat('mm:ss');
        this.playback = (this.$refs.player.currentTime / this.$refs.player.duration) * 100;
      }
    },
  },
  mounted() {
    this.updateSource(this.$refs.player);

    this.$refs.player.addEventListener('timeupdate', this.timeUpdate);
  },
  beforeUnmount() {
    this.$refs.player.pause();
    this.$refs.player.removeEventListener('timeupdate', this.timeUpdate);

    this.stop();
  },
};
</script>

<style lang="scss" scoped>
  .player {
    height: 50px;
    width: 100%;

    user-select: none;

    .music-box {
      left: 50%;
      position: absolute;
      top: 5px;
      transform: translateX(-50%);
    }
    .btn-box {
      display: flex;
      justify-content: center;
      position: absolute;
      top: 20px;

      width: 100%;

      span {
        vertical-align: middle;
      }

      i {
        color: #72646f;
        font-size: 24px;

        cursor: pointer;
      }

      i.active, i.on-repeat {
        color: #ffff00;
      }

      i.repeat {
        margin-right: 10px;
      }

      .duration {
        color: #72646f;
        font-size: 12px;

        margin-right: 10px;
      }
    }
  }

  progress {
    cursor: pointer;

    width: 100%;

    &[value] {
      -webkit-appearance: none;
      appearance: none;

      background-color: #323237;
      color: #72646f;

      cursor: pointer;

      height: 5px;
    }

    &[value]::-webkit-progress-bar {
      background-color: #323237;
      color: #72646f;
    }

    &::-webkit-progress-value {
      background-color: #72646f;
    }

    &[value]::-moz-progress-bar {
      background-color: #72646f;
    }
  }

  .name {
    color: #adadaf;
    margin-left: 10px;
  }

  .btn-player {
    border: 1px solid #ffff00;
    border-radius: 0;
    // box-shadow: 0 0 5px #ffff00, 0 0 5px #ffff00 inset !important;
    color: #72646f;
    background-color: transparent;
    padding: 0 30px;
    line-height: 25px;
    position: relative;
    top: 0;
    left: 0;
    font-size: var(--default-font-size);
    font-weight: 600;
    letter-spacing: 2rem;
    text-transform: uppercase;
    width: 30rem;
  }

  .btn-player:hover:before {
    top: 0%;
    bottom: auto;
    height: 100%;
  }
  .btn-player:before {
    display: block;
    position: absolute;
    left: 0px;
    bottom: 0px;
    height: 0px;
    width: 100%;
    z-index: -1;
    content: '';
    background: #ffff00;
    transition: all 0.4s cubic-bezier(0.215, 0.61, 0.355, 1) 0s;
  }
  button.btn-player::after {
    background-image: none;
  }

  @media screen and (orientation: portrait) {
    span .name {
      display: none;
    }
  }

  // .btn-flip {
  //   cursor: pointer;
  //   display: inline-block;
  //   font-size: var(--default-font-size);
  //   font-weight: 600;
  //   letter-spacing: 1rem;
  //   line-height: 25px;
  //   opacity: 1;
  //   outline: 0;
  //   position: relative;
  //   text-align: center;
  //   text-decoration: none;
  //   text-transform: uppercase;
  //
  //   &:after {
  //     border: 1px solid #ffff00;
  //     box-shadow: 0 0 5px #ffff00, 0 0 5px #ffff00 inset;
  //     content: attr(data-back);
  //     display: block;
  //     left: 0;
  //     opacity: 0;
  //     position: absolute;
  //     top: 0;
  //     transform: translateY(50%) rotateX(-90deg);
  //     transition: 0.5s;
  //     width: 100%;
  //   }
  //
  //   &:before {
  //     border: 1px solid #ffff00;
  //     box-shadow: 0 0 5px #ffff00, 0 0 5px #ffff00 inset;
  //     content: attr(data-front);
  //     display: block;
  //     left: 0;
  //     line-height: 25px;
  //     opacity: 1;
  //     padding: 0 30px;
  //     position: relative;
  //     top: 0;
  //     transform: translateY(0) rotateX(0);
  //     transition: 0.5s;
  //   }
  //   &:hover {
  //     &:after {
  //       opacity: 1;
  //       transform: translateY(0) rotateX(0);
  //     }
  //
  //     &:before {
  //       opacity: 0;
  //       transform: translateY(-50%) rotateX(-90deg);
  //     }
  //   }
  // }
  //
  // .dark {
  //   &:before {
  //     background: #1a1a1a;
  //     color: #fff7eb;
  //   }
  //   &:after {
  //     background: #1a1a1a;
  //     color: #fff7eb;
  //   }
  // }
  //
  // .light {
  //   &:before {
  //     background: #f5e6d7;
  //     color: #72646f;
  //   }
  //   &:after {
  //     background: #72646f;
  //     color: #f5e6d7;
  //   }
  // }
</style>
