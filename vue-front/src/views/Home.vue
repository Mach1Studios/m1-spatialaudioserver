<template>
  <div class="container max">
    <div class="row">
      <div class="col s4">
        <div class="card">
          <FileList :admin="true"/>
          <FileListUploader/>
        </div>
      </div>
      <div class="col s4">
        <div class="card transparent audioplayer">
          <AudioPlayer/>
        </div>
        <div class="card">
          <AudioPlayerControls/>
        </div>
      </div>
      <div class="col s4">
        <div class="card">
          <StreamInfo/>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import AudioPlayer from '../components/AudioPlayer.vue';
import AudioPlayerControls from '../components/AudioPlayerControls.vue';
import FileList from '../components/FileList.vue';
import FileListUploader from '../components/FileListUploader.vue';
import StreamInfo from '../components/StreamInfo.vue';

export default {
  components: {
    AudioPlayer,
    AudioPlayerControls,
    FileList,
    FileListUploader,
    StreamInfo,
  },
};
</script>
<style lang="scss" scoped>
  .audioplayer {
    box-shadow: none;
    padding-top: 0;
  }
</style>
