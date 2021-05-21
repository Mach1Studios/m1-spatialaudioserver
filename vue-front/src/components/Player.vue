<template>
  <div>
    <vue-plyr>
      <audio controls crossorigin playsinline>
        <source
            src="/m1-debug-shrtpt-m1spatial.wav"
            type="audio/wav"
        />
      </audio>
    </vue-plyr>
  </div>
</template>

<script>
export default {
  name: 'Component',
  mounted() {},
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
