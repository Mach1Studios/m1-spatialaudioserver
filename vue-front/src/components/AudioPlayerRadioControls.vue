<template>
  <div class="radio-controls">
    <div class="control">
      <label class="radio">
        <input type="radio" name="controls">
        Touch
      </label>
    </div>
  </div>
</template>
<script>
export default {
  name: 'RadioControls',
};
</script>
<style lang="scss" scoped>
  input[type="radio"] {
    filter:  grayscale(100%);
  }
</style>
