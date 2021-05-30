<template>
  <div class="container is-fluid">
    <div class="columns">
      <div class="column is-one-third">
        <div class="box is-flex is-flex-direction-column is-justify-content-space-between audio-uploader">
          <AudioFiles/>
          <Uploader class="is-align-self-center"/>
        </div>
      </div>
      <div class="column is-one-third">
        <div class="box is-flex is-flex-direction-column is-justify-content-space-between">
          <Player/>
        </div>
        <div class="box is-flex is-flex-direction-column is-justify-content-space-between">
          <Channel/>
        </div>
      </div>
      <div class="column is-one-third">
        <div class="box is-flex is-flex-direction-column is-justify-content-space-between">
          <DashStreamInfo/>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import Uploader from '@/components/Uploader.vue';
import AudioFiles from '@/components/AudioFiles.vue';
import Player from '@/components/Player.vue';
import Channel from '@/components/Channel.vue';
import DashStreamInfo from '@/components/DashStreamInfo.vue';

export default {
  components: {
    Uploader,
    AudioFiles,
    Player,
    Channel,
    DashStreamInfo,
  },
};
</script>
<style lang="css" scoped>
.audio-uploader {
  height: 95vh;
}
</style>
