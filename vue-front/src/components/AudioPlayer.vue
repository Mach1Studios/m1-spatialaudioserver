<template>
  <div class="player">
    <div class="music-box">
      <audio ref="player"></audio>
    </div>
    <div class="btn-box">
      <span class="play absolute left"><i class="material-icons">play_arrow</i></span>
      <span class="absolute right">
        <span class="duration">0:0</span>
        <span class="duration">/</span>
        <span class="duration">0:0</span>
        <i class="material-icons repeat">repeat</i>
        <span class="btn-flip" data-back="Local" data-front="Live"></span>
      </span>
    </div>
  </div>
</template>

<script>
import { mapActions, mapState } from 'vuex';

export default {
  name: 'AudioPlayer',
  computed: mapState({
    track: (state) => state.tracks.playing.id,
  }),
  methods: {
    ...mapActions('audio', ['updateSource']),
    ...mapActions('dash', ['start', 'stop']),
  },
  mounted() {
    this.updateSource(this.$refs.player);
  },
  beforeUnmount() {
    this.stop();
  },
};
</script>

<style lang="scss" scoped>
  .player {
    height: 30px;

    .btn-box {
      position: absolute;
      top: 5px;
      width: 100%;
      display: flex;
      justify-content: center;

      i {
        font-size: 24px;
        color: #72646f;
        cursor: pointer;
      }
      i.active {
        color: #ff3677;
      }
      i.repeat {
        margin-right: 10px;
      }
      .duration {
        font-size: 12px;
        color: #72646f;
        margin-right: 10px;
      }
    }

    .music-box {
      width: 90%;
      position: absolute;
      left: 50%;
      top: 5px;
      transform: translateX(-50%);

      // input[type="range"] {
      //   height: 5px;
      //   width: 100%;
      //   margin: 0 0 10px 0;
      // }
      // input[type="range"]::-webkit-slider-thumb {
      //   height: 5px;
      //   width: 7px;
      // }
    }
    // input[type="range"] {
    //   -webkit-appearance: none !important;
    //   margin: 0px;
    //   padding: 0px;
    //   background: #f2eae4;
    //   height: 5px;
    //   width: 93%;
    //   outline: none;
    //   cursor: pointer;
    //   border-radius: 5px;
    // }
    //
    // input[type="range"]::-ms-fill-lower {
    //   background: #f2eae4;
    // }
    //
    // input[type="range"]::-ms-fill-upper {
    //   background: #f2eae4;
    // }
    //
    // input[type="range"]::-moz-range-track {
    //   border: none;
    //   background: #f2eae4;
    // }
    //
    // input[type="range"]::-webkit-slider-thumb {
    //   -webkit-appearance: none !important;
    //   background: #ff3677;
    //   height: 5px;
    //   width: 5px;
    //   border-radius: 50%;
    // }
    //
    // input[type="range"]::-moz-range-thumb {
    //   background: #ff3677;
    //   height: 8px;
    //   width: 8px;
    //   border-radius: 100%;
    // }
    //
    // input[type="range"]::-ms-thumb {
    //   -webkit-appearance: none !important;
    //   background: #ff3677;
    //   height: 8px;
    //   width: 8px;
    //   border-radius: 100%;
    // }

    // .info {
    //   position: absolute;
    //   left: 50%;
    //   top: 20px;
    //   transform: translateX(-50%);
    //   text-align: center;
    //
    //   .singer {
    //     font-size: 12px;
    //     color: #72646f;
    //   }
    // }
  }

  .btn-flip {
    opacity: 1;
    outline: 0;
    color: #fff;
    line-height: 25px;
    position: relative;
    text-align: center;
    letter-spacing: 1px;
    display: inline-block;
    text-decoration: none;
    font-family: 'Open Sans';
    text-transform: uppercase;

    &:hover{

      &:after{
        opacity: 1;
        transform: translateY(0) rotateX(0);
        }

      &:before{
        opacity: 0;
        transform: translateY(-50%) rotateX(-90deg);
      }
    }

    &:after{
      top: 0;
      left: 0;
      opacity: 0;
      width: 100%;
      color: #323237;
      display: block;
      transition: 0.5s;
      position: absolute;
      background: #adadaf;
      content: attr(data-back);
      transform: translateY(50%) rotateX(-90deg);
    }

    &:before{
      top: 0;
      left: 0;
      opacity: 1;
      color: #adadaf;
      display: block;
      padding: 0 30px;
      line-height: 25px;
      transition: 0.5s;
      position: relative;
      background: #323237;
      content: attr(data-front);
      transform: translateY(0) rotateX(0);
      border: 1px solid #D36646;
      box-shadow: 0 0 5px #D36646, 0 0 5px #D36646 inset;
    }
  }
</style>
