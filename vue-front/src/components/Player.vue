<template>
  <div>
    <vue-plyr>
      <audio controls crossorigin playsinline>
        <source
            src="/demo_public_file_example_MP3_1MG.mp3"
            type="audio/mp3"
        />
        <source
            src="/path/to/audio.ogg"
            type="audio/ogg"
        />
      </audio>
    </vue-plyr>
  </div>
</template>

<script>
export default {
  name: 'Component',
  mounted() {
    console.log(this.$refs.plyr.player);
  },
};
</script>

<style scoped>
  .plyr__control {
    color: #1a1a1a;
  }
 .plyr__control:hover {
    background: transparent;
  }
</style>
