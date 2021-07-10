<template>
  <div class="container is-fluid">
    <div class="columns">
      <div class="column is-one-third">
        <div class="box is-flex is-flex-direction-column is-justify-content-space-between">
          <FileList :admin="true"/>
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
