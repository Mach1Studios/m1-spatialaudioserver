<template>
  <div v-for="name in names" :key="name" class="field">
    <input id="a" class="state" type="radio" name="app" value="a">
    <label class="label black-text" for="a">
      <div class="indicator" />
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

  .state {
    opacity: 1e-5;
    pointer-events: none;

    position: absolute;
    right: 0;
    top: 0;
  }

  .label {
    align-items: center;
    display: inline-flex;

    cursor: pointer;
  }

  .text {
    opacity: .6;
    margin-left: 16px;
    transition: opacity .2s linear, transform .2s ease-out;
  }

  .indicator {
    width: 25px;
    height: 25px;

    overflow: hidden;
    position: relative;

    border-radius: 0;
    box-shadow:
      -8px -4px 8px 0px #ffffff,
      8px 4px 12px 0px #d1d9e6;
  }

  .indicator::before,
  .indicator::after {
    top: 10%;
    left: 10%;

    width: 80%;
    height: 80%;

    content: '';

    border-radius: 0;
    position: absolute;
  }

  .indicator::before {
    box-shadow:
      -4px -2px 4px 0px #d1d9e6,
      4px 2px 8px 0px #ffffff;
  }

  .indicator::after {
    background-color: #faebd7;
    box-shadow:
      -4px -2px 4px 0px #ffffff,
      4px 2px 8px 0px #d1d9e6;
    transform: scale3d(1, 1, 1);
    transition: opacity .25s ease-in-out, transform .25s ease-in-out;
  }

  .label:hover .text {
    opacity: 1;
  }

  .state:checked ~ .label .indicator::after {
    opacity: 0;
    transform: scale3d(.975, .975, 1) translate3d(0, 10%, 0);
  }

  .state:focus ~ .label .text {
    opacity: 1;
    transform: translate3d(8px, 0, 0);
  }
</style>
