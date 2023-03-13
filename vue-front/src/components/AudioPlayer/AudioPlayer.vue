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
    <div class="player-box">
      <audio ref="player" />
    </div>
    <div class="btn-box">
      <span class="absolute left">
        <i class="material-icons fill play" :class="{ active: icon === 'pause_arrow' }" @click="play">{{ icon }}</i>
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
    width: 100%;
    height: 50px;

    user-select: none;

    progress {
      width: 100%;

      cursor: pointer;

      &[value] {
        height: 5px;

        cursor: pointer;

        appearance: none;
        -webkit-appearance: none;

        color: var(--primary-accent-color);
        background-color: var(--secondary-color);
      }

      &[value]::-webkit-progress-bar {
        color: var(--primary-accent-color);
        background-color: var(--secondary-color);
      }

      &::-webkit-progress-value {
        background-color: var(--primary-accent-color);
      }

      &[value]::-moz-progress-bar {
        background-color: var(--primary-accent-color);
      }
    }

    .player-box {
      top: 5px;
      left: 50%;

      position: absolute;
      transform: translateX(-50%);
    }

    .btn-box {
      top: 20px;
      width: 100%;

      display: flex;
      justify-content: center;
      position: absolute;

      .name {
        margin-left: 10px;
        color: var(--additional-light-color);
      }

      .btn-player {
        top: 0;
        left: 0;

        width: 30rem;

        padding: 0 30px;
        border-radius: 0;

        font-weight: 600;
        line-height: 25px;

        position: relative;

        letter-spacing: 2rem;
        text-transform: uppercase;

        background-color: transparent;
        color: var(--primary-accent-color);

        font-size: var(--default-font-size);
        border: 1px solid var(--secondary-accent-color);
      }

      .btn-player:hover:before {
        top: 0%;
        bottom: auto;
        height: 100%;
      }
      .btn-player:before {
        left: 0px;
        bottom: 0px;
        height: 0px;
        width: 100%;
        z-index: -1;

        content: '';

        display: block;
        position: absolute;

        background: var(--secondary-accent-color);
        transition: all 0.4s cubic-bezier(0.215, 0.61, 0.355, 1) 0s;
      }
      button.btn-player::after {
        background-image: none;
      }

      span {
        vertical-align: middle;
      }

      i {
        font-size: 24px;

        cursor: pointer;

        color: var(--primary-accent-color);
      }

      i.active, i.on-repeat {
        color: var(--secondary-accent-color);
      }

      i.repeat {
        margin-right: 10px;
      }

      .duration {
        font-size: 12px;
        margin-right: 10px;
        color: var(--primary-accent-color);
      }
    }
  }

  @media screen and (orientation: portrait) {
    span .name {
      display: none;
    }
  }
</style>
