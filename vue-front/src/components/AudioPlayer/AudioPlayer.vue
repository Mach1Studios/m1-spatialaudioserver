<template>
  <div class="player">
    <div class="top-align">
      <progress name="progress" class="top" min="0" max="100" :value="playback" @click.prevent="playbackUpdate"></progress>
    </div>
    <div class="music-box">
      <audio ref="player"></audio>
    </div>
    <div class="btn-box">
      <span class="absolute left">
        <i class="material-icons play" :class="{ active: icon === 'pause_arrow' }" @click="play">{{icon}}</i>
        <span class="name">{{track.name}}</span>
      </span>
      <span class="absolute right">
        <span class="duration">{{currentTime}}</span>
        <span class="duration">/</span>
        <span class="duration">{{duration}}</span>
        <i class="material-icons repeat" :class="{ 'on-repeat': isRepeat }" @click="repeat">repeat</i>
        <span v-show="type !== 'static'" class="btn-flip" :class="skin" data-back="Local" data-front="Live"></span>
        <span v-show="type === 'static'" class="btn-flip" :class="skin" data-back="Live" data-front="Local"></span>
      </span>
    </div>
  </div>
</template>

<script>
import { Duration } from 'luxon';
import { mapActions, mapState } from 'vuex';

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
  watch: {
    isActiveStream(value) {
      this.isPlay = value;

      if (this.$refs.player && this.$refs.player.duration) {
        this.duration = Duration.fromObject({ seconds: this.$refs.player.duration }).toFormat('mm:ss');
      }
    },
  },
  computed: mapState({
    track: (state) => state.tracks.track,
    type: (state) => state.dash.type,
    isActiveStream: (state) => state.dash.isActiveStream,
    icon() {
      return this.isPlay ? 'pause_arrow' : 'play_arrow';
    },
  }),
  methods: {
    ...mapActions('audio', ['updateSource']),
    ...mapActions('dash', ['stop']),

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
    user-select: none;
    width: 100%;

    .music-box {
      position: absolute;
      left: 50%;
      top: 5px;
      transform: translateX(-50%);
    }
    .btn-box {
      position: absolute;
      top: 20px;
      width: 100%;
      display: flex;
      justify-content: center;
      i {
        font-size: 24px;
        color: #72646f;
        cursor: pointer;
      }
      i.active {
        color: #D36646;
      }
      i.repeat {
        margin-right: 10px;
      }
      i.on-repeat {
        color: #D36646;
      }
      .duration {
        font-size: 12px;
        color: #72646f;
        margin-right: 10px;
      }
    }
  }
  progress {
    width: 100%;
    cursor: pointer;

    &[value] {
      -webkit-appearance: none;
      appearance: none;
      background-color: #323237;
      color: #72646f;
      height: 5px;
      cursor: pointer;
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

  .btn-flip {
    opacity: 1;
    outline: 0;
    line-height: 25px;
    position: relative;
    text-align: center;
    letter-spacing: 1px;
    display: inline-block;
    text-decoration: none;
    font-family: 'Open Sans';
    text-transform: uppercase;

    cursor: pointer;

    &:hover {
      &:after {
        opacity: 1;
        transform: translateY(0) rotateX(0);
      }

      &:before {
        opacity: 0;
        transform: translateY(-50%) rotateX(-90deg);
      }
    }

    &:after {
      top: 0;
      left: 0;
      opacity: 0;
      width: 100%;
      display: block;
      transition: 0.5s;
      position: absolute;
      content: attr(data-back);
      transform: translateY(50%) rotateX(-90deg);
    }

    &:before {
      top: 0;
      left: 0;
      opacity: 1;
      display: block;
      padding: 0 30px;
      line-height: 25px;
      transition: 0.5s;
      position: relative;
      content: attr(data-front);
      transform: translateY(0) rotateX(0);
      border: 1px solid #D36646;
      box-shadow: 0 0 5px #D36646, 0 0 5px #D36646 inset;
    }
  }

  .dark {
    &:before {
      background: #323237;
      color: #adadaf;
    }
    &:after {
      background: #adadaf;
      color: #323237;
    }
  }
  .light {
    &:before {
      background: #f5e6d7;
      color: #72646f;
    }
    &:after {
      background: #72646f;
      color: #f5e6d7;
    }
  }
  .name {
    color: #adadaf;
    margin-left: 10px;
  }
  @media screen and (orientation: portrait) {
    span .name {
      display: none;
    }
  }
</style>
