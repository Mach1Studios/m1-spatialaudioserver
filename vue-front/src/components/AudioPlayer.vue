<template>
  <div class="player">
    <vue-plyr>
      <audio controls crossorigin playsinline ref="player"></audio>
    </vue-plyr>
    <!-- <button type="button" name="button" @click="start(track)">Refresh {{track}}</button> -->
  </div>
</template>

<script>
import { mapActions, mapState } from 'vuex';

export default {
  name: 'AudioPlayer',
  computed: mapState({
    track: (state) => state.tracks.playing.id,
  }),
  methods: {
    ...mapActions('audio', ['updateSource']),
    ...mapActions('dash', ['start', 'stop']),
  },
  mounted() {
    this.updateSource(this.$refs.player);
  },
  beforeUnmount() {
    this.stop();
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
