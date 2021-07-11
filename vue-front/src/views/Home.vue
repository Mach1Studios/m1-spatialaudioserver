<template>
  <div class="container max">
    <div class="row">
      <div class="col s4">
        <div class="card">
          <FileList :admin="true"/>
          <FileListUploader class="padding"/>
        </div>
      </div>
      <div class="col s4">
        <div class="card">
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
    <Preloader
      :title="loader.title"
      :isLoading="loader.isLoading"
    />
  </div>
</template>

<script>
import { mapState } from 'vuex';

import FileListUploader from '../components/FileListUploader.vue';
import FileList from '../components/FileList.vue';
import AudioPlayer from '../components/AudioPlayer.vue';
import AudioPlayerControls from '../components/AudioPlayerControls.vue';
import StreamInfo from '../components/StreamInfo.vue';
import Preloader from '../components/Preloader.vue';

export default {
  components: {
    AudioPlayer,
    AudioPlayerControls,
    FileList,
    FileListUploader,
    StreamInfo,
    Preloader,
  },
  computed: mapState({
    loader: (state) => state.loader,
  }),
};
</script>
<style lang="scss" scoped>

</style>
