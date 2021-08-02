<template>
  <div class="player">
    <audio controls="controls" ref="player"></audio>
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

  audio {
    width: 100%;
  }
</style>
