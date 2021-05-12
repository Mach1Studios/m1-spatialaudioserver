<template>
  <section class="section">
    <div class="columns is-multiline">
      <div class="column is-narrow">
          <Uploader/>
      </div>
      <div class="column">
        <AudioFiles/>
      </div>
    </div>
  </section>
</template>

<script>
import Uploader from '@/components/Uploader.vue';
import AudioFiles from '@/components/AudioFiles.vue';

export default {
  components: {
    Uploader,
    AudioFiles,
  },
};
</script>
<style lang="css" scoped>
</style>
