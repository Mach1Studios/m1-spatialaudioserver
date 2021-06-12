<template>
  <div class="container is-fluid">
    <div class="columns">
      <div class="column is-2">
        <div class="box is-flex is-flex-direction-column is-justify-content-space-between">
          <RadioControls/>
        </div>
      </div>
      <div class="column is-3">
        <div class="box is-flex is-flex-direction-column is-justify-content-space-between">
          <AudioPlayer/>
        </div>
      </div>
      <div class="column is-5"></div>
      <div class="column is-2">
        <div class="box is-flex is-flex-direction-column is-justify-content-space-between">

        </div>
      </div>
    </div>
  </div>
</template>

<script>
import AudioPlayer from '../components/AudioPlayer.vue';
import RadioControls from '../components/RadioControls.vue';

export default {
  components: {
    AudioPlayer,
    RadioControls,
  },
};
</script>
<style lang="scss" scoped>
</style>
