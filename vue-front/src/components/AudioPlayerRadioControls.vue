<template>
  <div class="field">
    <label class="radio">
      <input type="radio" name="radio">
      <span>Touch</span>
    </label>
  </div>
</template>
<script>
export default {
  name: 'AudioPlayerRadioControls',
};
</script>
<style lang="scss" scoped>
  .radio>* {
    filter:  grayscale(100%);
  }
</style>
