<template>
  <div class="row no-space dark absolute bottom">
    <div class="card flat transparent audioplayer">
      <TestPlayer skin="dark" class="dark-player" />
    </div>
  </div>
</template>

<script>
// import { Mach1DecoderProxy } from 'mach1spatial-decode';

import TestPlayer from '../components/AudioPlayer/TestPlayer.vue';

export default {
  components: {
    TestPlayer,
  },
};
</script>
<style lang="scss" scoped>
  .audioplayer {
    bottom: 0;
    padding-left: 55rem;
    padding-right: 55rem;
    z-index: 600;
    .dark-player {
      width: 100%;
    }
    box-shadow: none;
    padding-top: 0;
  }
</style>
