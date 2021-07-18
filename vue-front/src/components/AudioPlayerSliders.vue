<template>
  <div class="sliders">
    <h4 class="title">filterSpeed</h4>
    <div class="field">
      <input class="slider" type="range" min="0" max="100" value="0">
    </div>
  </div>
</template>
<script>
export default {
  name: 'AudioPlayerSliders',
};
</script>
<style lang="scss" scoped>
  div>.slider {
    filter:  grayscale(100%);
  }

  .slider {
    height: 4px;
  }

  .sliders .title {
    font-style: normal;
    font-weight: bold;
    font-size: 1rem;

    line-height: 1.17;
    letter-spacing: -0.5px;
  }
</style>
