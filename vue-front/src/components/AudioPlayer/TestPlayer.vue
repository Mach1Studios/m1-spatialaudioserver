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
      <audio id="test-player" ref="testplayer" />
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
        <span v-show="type !== 'static'" class="btn-flip" :class="skin" data-back="HLS" data-front="DASH" />
        <span v-show="type === 'static'" class="btn-flip" :class="skin" data-back="DASH" data-front="HLS" />
      </span>
    </div>
  </div>
</template>

<script>
import HLS from 'hls.js';
import { Duration } from 'luxon';
// import { mapActions } from 'vuex';

export default {
  name: 'TestPlayer',
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

      // additional test
      track: 'Test Track',
      type: 'static',
      isActiveStream: true,
    };
  },
  computed: {
    icon() {
      return this.isPlay ? 'pause_arrow' : 'play_arrow';
    },
  },
  watch: {
    isActiveStream(value) {
      this.isPlay = value;

      if (this.$refs.testplayer && this.$refs.testplayer.duration) {
        this.duration = Duration.fromObject({ seconds: this.$refs.testplayer.duration }).toFormat('mm:ss');
      }
    },
  },
  methods: {
    // ...mapActions('audio', ['updateSource']),
    // ...mapActions('hls', ['start', 'stop']),

    play() {
      // this.start();
      // if (!this.isActiveStream) return;

      if (this.$refs.testplayer.paused) {
        this.$refs.testplayer.play();
      } else {
        this.$refs.testplayer.pause();
      }

      this.isPlay = !this.$refs.testplayer.paused;
    },
    // playbackUpdate(event) {
    //   if (event.target && this.$refs.testplayer && this.$refs.testplayer.currentTime) {
    //     const offset = event.offsetX / event.target.getBoundingClientRect().width;
    //     this.$refs.testplayer.currentTime = (offset * this.$refs.testplayer.duration);
    //   }
    // },
    // repeat() {
    //   this.isRepeat = !this.isRepeat;
    //   this.$refs.testplayer.loop = this.isRepeat;
    // },
    // timeUpdate() {
    //   if (this.$refs.testplayer && this.$refs.testplayer.currentTime) {
    //     this.currentTime = Duration.fromObject({ seconds: this.$refs.testplayer.currentTime }).toFormat('mm:ss');
    //     this.playback = (this.$refs.testplayer.currentTime / this.$refs.testplayer.duration) * 100;
    //   }
    // },
  },
  mounted() {
    const Stream = new HLS({ debug: true, defaultAudioCodec: 'mp4a.40.5' });

    if (HLS.isSupported()) {
      console.log('hello hls.js!');
    }

    Stream.attachMedia(this.$refs.testplayer);

    console.log(this.$refs.testplayer);

    Stream.on(HLS.Events.MEDIA_ATTACHED, () => {
      console.log('video and hls.js are now bound together !');

      Stream.loadSource('http://localhost:8080/hls/static/3f33a88c-63da-4871-8436-a14661ff657c/master.m3u8');
      Stream.on(HLS.Events.MANIFEST_PARSED, (event, data) => {
        console.log(
          `manifest loaded, found ${data.levels.length} quality level`,
        );
      });
    });

    Stream.on(HLS.Events.ERROR, (event, data) => {
      switch (data.details) {
        case HLS.ErrorDetails.FRAG_LOAD_ERROR:
          // ....
          break;
        default:
          break;
      }
    });

    // this.updateSource(this.$refs.testplayer);
    // this.$refs.testplayer.addEventListener('timeupdate', this.timeUpdate);
  },
  // beforeUnmount() {
  //   this.$refs.testplayer.pause();
  //   this.$refs.testplayer.removeEventListener('timeupdate', this.timeUpdate);
  //
  //   this.stop();
  // },
};
</script>

<style lang="scss" scoped>
  video {
    width: 300px;
    height: 100px;
  }
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

      span {
        vertical-align: middle;
      }
      i {
        font-size: 24px;
        color: #72646f;
        cursor: pointer;
      }
      i.active {
        color: #ffff00;
      }
      i.repeat {
        margin-right: 10px;
      }
      i.on-repeat {
        color: #ffff00;
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
    letter-spacing: 1rem;
    display: inline-block;
    text-decoration: none;
    text-transform: uppercase;
    font-weight: 600;
    font-size: var(--default-font-size);

    cursor: pointer;
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
      border: 1px solid #ffff00;
      box-shadow: 0 0 5px #ffff00, 0 0 5px #ffff00 inset;
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
      border: 1px solid #ffff00;
      box-shadow: 0 0 5px #ffff00, 0 0 5px #ffff00 inset;
      // border: 1px solid #FCCC0A;
      // box-shadow: 0 0 5px #FCCC0A, 0 0 5px #FCCC0A inset;
    }
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
  }

  .dark {
    &:before {
      background: #1a1a1a;
      color: #fff7eb;
      // background: #323237;
      // color: #adadaf;
    }
    &:after {
      background: #1a1a1a;
      color: #fff7eb;
      // background: #323237;
      // color: #adadaf;
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
