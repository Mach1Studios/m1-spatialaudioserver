<template>
  <div class="container is-fluid">
    <div class="columns">
      <div class="column is-2">
        <div class="box is-flex is-flex-direction-column is-justify-content-space-between">
          <AudioPlayerRadioControls/>
        </div>
      </div>
      <div class="column is-3">
        <div class="box is-flex is-flex-direction-column is-justify-content-space-between">
          <AudioPlayer/>
        </div>
      </div>
      <div class="column is-4"></div>
      <div class="column is-3">
        <div class="box is-flex is-flex-direction-column is-justify-content-space-between">
          <AudioPlayerSliders/>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import AudioPlayerRadioControls from '../components/AudioPlayerRadioControls.vue';
import AudioPlayer from '../components/AudioPlayer.vue';
import AudioPlayerSliders from '../components/AudioPlayerSliders.vue';

export default {
  components: {
    AudioPlayerRadioControls,
    AudioPlayer,
    AudioPlayerSliders,
  },
};
</script>
<style lang="scss" scoped>

</style>
