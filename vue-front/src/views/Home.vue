<template>
  <div class="container is-fluid">
    <div class="columns">
      <div class="column is-one-third">
        <div class="box is-flex is-flex-direction-column is-justify-content-space-between">
          <FileList/>
          <FileListUploader class="is-align-self-center"/>
        </div>
      </div>
      <div class="column is-one-third">
        <div class="box is-flex is-flex-direction-column is-justify-content-space-between">
          <AudioPlayer/>
        </div>
        <div class="box is-flex is-flex-direction-column is-justify-content-space-between">
          <AudioPlayerControls/>
        </div>
      </div>
      <div class="column is-one-third">
        <div class="box is-flex is-flex-direction-column is-justify-content-space-between">
          <StreamInfo/>
          <Preloader/>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import FileListUploader from '@/components/FileListUploader.vue';
import FileList from '@/components/FileList.vue';
import AudioPlayer from '@/components/AudioPlayer.vue';
import AudioPlayerControls from '@/components/AudioPlayerControls.vue';
import StreamInfo from '@/components/StreamInfo.vue';
import Preloader from '@/components/Preloader.vue';

export default {
  components: {
    FileListUploader,
    FileList,
    AudioPlayer,
    AudioPlayerControls,
    StreamInfo,
    Preloader,
  },
};
</script>
<style lang="scss" scoped>

</style>
