<template>
  <div class="player">
    <vue-plyr>
      <audio controls crossorigin playsinline ref="player"></audio>
    </vue-plyr>
  </div>
</template>

<script>
import { mapState, mapActions } from 'vuex';
// import dashjs from 'dashjs';

export default {
  name: 'AudioPlayer',
  computed: mapState('dash', ['info', 'url', 'settings']),
  methods: {
    ...mapActions('audio', ['updateNumberOfChannels']),
    ...mapActions('dash', ['load', 'updateInfo']),
  },
  mounted() {
    const source = this.$refs.player;
    this.load({ source });
  },

};
</script>

<style scoped>
  .hidden {
    display: none;
  }

  .player {
    --plyr-color-main: #7a7a7a;
    --plyr-audio-controls-background: #ffffff;
    --plyr-audio-control-color: #1c1c1c;
    --plyr-audio-control-color-hover: #1c1c1c;
    --plyr-audio-control-background-hover: #dbdbdb;
    --plyr-progress-loading-background: #eeef5d;
  }
</style>
