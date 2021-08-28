<template>
  <div class="field" v-for="name in names" :key="name">
    <input class="state" type="radio" name="app" id="a" value="a">
    <label class="label black-text" for="a">
      <div class="indicator"></div>
      <span class="text bold" :name="names">{{ name }}</span>
    </label>
  </div>
</template>
<script>
import _ from 'lodash';

export default {
  name: 'AudioPlayerRadioControls',
  data() {
    return {
      names: _.map(['Touch', 'Device', 'Facetracker', 'BoseAR']),
      defaultVolume: 0.5,
    };
  },
  computed: {
  },
};
</script>
<style lang="scss" scoped>
  *,
  *:before,
  *:after {
    box-sizing: inherit;
  }

  .wrapper {
    margin: 8px 0;
  }

  .state {
    position: absolute;
    top: 0;
    right: 0;
    opacity: 1e-5;
    pointer-events: none;
  }

  .label {
    display: inline-flex;
    align-items: center;
    cursor: pointer;
  }

  .text {
    margin-left: 16px;
    opacity: .6;
    transition: opacity .2s linear, transform .2s ease-out;
  }

  .indicator {
    position: relative;
    border-radius: 50%;
    height: 25px;
    width: 25px;
    box-shadow:
      -8px -4px 8px 0px #ffffff,
      8px 4px 12px 0px #d1d9e6;
    overflow: hidden;
  }

  .indicator::before,
  .indicator::after {
    content: '';
    position: absolute;
    top: 10%;
    left: 10%;
    height: 80%;
    width: 80%;
    border-radius: 50%;
  }

  .indicator::before {
    box-shadow:
      -4px -2px 4px 0px #d1d9e6,
      4px 2px 8px 0px #fff;
  }

  .indicator::after {
    background-color: antiquewhite;
    box-shadow:
      -4px -2px 4px 0px #fff,
      4px 2px 8px 0px #d1d9e6;
    transform: scale3d(1, 1, 1);
    transition: opacity .25s ease-in-out, transform .25s ease-in-out;
  }

  .state:checked ~ .label .indicator::after {
    transform: scale3d(.975, .975, 1) translate3d(0, 10%, 0);
    opacity: 0;
  }

  .state:focus ~ .label .text {
    transform: translate3d(8px, 0, 0);
    opacity: 1;
  }

  .label:hover .text {
    opacity: 1;
  }
</style>
