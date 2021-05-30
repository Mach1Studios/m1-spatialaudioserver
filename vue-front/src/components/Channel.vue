<template lang="html">
  <div class="container is-flex is-flex-direction-column channel">
    <h4 class="title">AUDIO PREVIEW</h4>
    <div class="columns">
      <div class="column is-one-third">
        <p>Channel 0</p>
      </div>
      <div class="column">
        <span class="icon channel-icon">
          <ion-icon name="volume-low"></ion-icon>
        </span>
      </div>
      <div class="column">
        <input class="slider is-fullwidth is-small is-circle channel-slider" step="1" min="0" max="100" value="50" type="range">
      </div>
      <div class="column">
        <span class="icon channel-icon">
          <ion-icon name="volume-medium"></ion-icon>
        </span>
      </div>
    </div>
  </div>
</template>

<script>
export default {};
</script>

<style lang="css" scoped>
  .channel-button {
    background: transparent;
    border: none;
  }
  .channel .title {
    font-style: normal;
    font-weight: bold;
    font-size: 1rem;
    line-height: 1.17;
    letter-spacing: -0.5px;
  }
  .channel-icon {
    font-size: 50px;
  }
</style>
