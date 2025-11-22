<template>
  <div v-for="name in names" :key="name" class="row no-wrap middle-align">
    <div class="col">
      <p class="bold" style="white-space:nowrap" :name="names">{{ name }}</p>
    </div>
    <div class="col">
      <input
        class="slider"
        step="0.01"
        min="0"
        max="1"
        value="0.5"
        type="range"
        @change="test(name, $event.target.value)"
      >
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

  $ruler-fs: .75;
  $ruler-line-h: .425em;
  $ruler-line-w: .0625em;
  $ruler-line-c: #c5b9b9;
  $ruler-line-off: ($input-bw - $ruler-line-h)/2;

  $track-k: 6;
  $track-u: 2em;
  $track-h: .25em;
  $track-xtra: 1em;
  $track-w: $track-k*$track-u + $track-xtra;

  $thumb-w: 2em;
  $thumb-h: 1em;
  $thumb-r: .375em;

  @mixin track() {
    background-color: #ffff00;
    border-radius: 0;

    height: $track-h;
    width: $track-w;
  }

  @mixin thumb() {
    background:
      radial-gradient(#{at 100% 50%}, #e8e8e8, #eaeaea 71%, transparent 71%)
        no-repeat ($thumb-w - 2*$thumb-r) 50%,
      linear-gradient(90deg, #e8e8e8, #d0d0d0) no-repeat 100% 50%,
      radial-gradient(#{at 0 50%}, #d0cfcf, #c3c3c3 71%, transparent 71%)
        no-repeat $thumb-r 50%,
      linear-gradient(90deg, #e2e2e2, #d0cfcf) no-repeat 0 50%,
      linear-gradient(#d2d2d2, #f9f9f9, #f9f9f9, #d2d2d2);
    background-size: 1.1*$thumb-r 100%;

    border: none;
    border-radius: 0;
    box-shadow:
       -.125em 0 .25em #928886,
      inset -1px 0 1px #ffffff;

    width: $thumb-w;
    height: $thumb-h;
  }

  input[type='range'] {
    &,
    &::-webkit-slider-runnable-track,
    &::-webkit-slider-thumb {
      -webkit-appearance: none;
    }

    align-self: center;
    border: solid $input-bw transparent;

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

    height: $input-h;
    padding: 0;
    width: 90%;

    cursor: pointer;

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
      margin-top: ($track-h - $thumb-h)/2;
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
        word-spacing: 1em;
      }
    }
  }
</style>
