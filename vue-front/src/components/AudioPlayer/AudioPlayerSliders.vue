<template>
  <div class="row no-wrap middle-align" v-for="name in names" :key="name">
    <div class="col">
      <p class="bold" style="white-space:nowrap" :name="names">{{ name }}</p>
    </div>
    <div class="col">
      <input class="slider" step="0.01" min="0" max="1" value="0.5" type="range" @change="test(name, $event.target.value)">
    </div>
  </div>
</template>
<script>
import _ from 'lodash';

export default {
  name: 'AudioPlayerSliders',
  data() {
    return {
      names: _.map(['yawMultiplayer', 'pitchMultiplayer', 'rollMultiplayer', 'FOV', 'filterSpeed', 'oneEuroFilter']),
      defaultVolume: 0.5,
    };
  },
  computed: {},
  methods: {},
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
  $track-w: $track-k*$track-u + $track-xtra;
  $track-h: .25em;

  $thumb-w: 2em;
  $thumb-h: 1em;
  $thumb-r: .375em;

  @mixin track() {
    width: $track-w; height: $track-h;
    border-radius: .1875em;
    background-color: yellow;
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

  input[type='range'] {
    &,
    &::-webkit-slider-runnable-track,
    &::-webkit-slider-thumb {
      -webkit-appearance: none;
    }

    align-self: center;
    border: solid $input-bw transparent;
    padding: 0;
    width: 90%; height: $input-h;
    background:
      repeating-linear-gradient(90deg,
          $ruler-line-c, $ruler-line-c $ruler-line-w,
          transparent $ruler-line-w, transparent $track-u)
        no-repeat 50% $ruler-line-off border-box,
      repeating-linear-gradient(90deg,
          $ruler-line-c, $ruler-line-c $ruler-line-w,
          transparent $ruler-line-w, transparent $track-u)
        no-repeat 50% $ruler-line-off + $input-h + $input-bw border-box;
    background-size:
      $track-k*$track-u + $ruler-line-w $ruler-line-h,
      $track-k*$track-u + $ruler-line-w $ruler-line-h,
      $input-bw $input-h;
    cursor: pointer;

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
        word-spacing: 1em;
      }
    }
  }
  .sliders .title {
    font-style: normal;
    font-weight: bold;

    line-height: 1.17;
    letter-spacing: -0.5px;
  }
</style>
