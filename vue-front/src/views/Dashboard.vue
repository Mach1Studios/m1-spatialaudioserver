<template>
  <div class="container max">
    <!-- <FileList :admin="true"/>
    <FileListUploader/> -->

    <div class="row">
      <div class="col s4">
        <div class="card round">
            <div class="tabs center-align">
              <a :class="{ active: selected === 'filelist'}" @click="select('filelist')">File List</a>
              <a :class="{ active: selected === 'playlists'}" @click="select('playlists')">Playlists</a>
            </div>
            <div id="FileList" class="page" :class="{ active: selected === 'filelist'}">
                <FileList :admin="true"/>
                <Modal
                  title="CHOOSE A FILE..."
                  icon=" "
                  buttonClasses="small grey-light-3 large-width small-space large-margin bold"
                >
                  <div id="FileListUploader">
                    <FileListUploader/>
                  </div>
                </Modal>
            </div>
            <div id="Playlists" class="page" :class="{ active: selected === 'playlists'}">
              <AudioPlayerPlaylists :admin="true" :controls="true"/>
            </div>
        </div>
      </div>
      <div class="col s4">
        <div class="card round transparent audioplayer">
          <AudioPlayer class="dark-player"/>
        </div>
        <div class="card round">
          <AudioPlayerControls/>
        </div>
      </div>
      <div class="col s4">
        <div class="card round">
          <StreamInfo/>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
/* eslint-disable */
import AudioPlayer from '../components/AudioPlayer/AudioPlayer.vue';
import AudioPlayerControls from '../components/AudioPlayer/AudioPlayerControls.vue';
import FileList from '../components/FileList.vue';
import Modal from '../components/Modal.vue';
import FileListUploader from '../components/FileListUploader.vue';
import StreamInfo from '../components/StreamInfo.vue';
import AudioPlayerPlaylists from '../components/AudioPlayer/AudioPlayerPlaylists.vue';

export default {
  components: {
    AudioPlayer,
    AudioPlayerControls,
    FileList,
    Modal,
    FileListUploader,
    StreamInfo,
    AudioPlayerPlaylists,
  },
  data() {
    return {
      selected: 'filelist',
    };
  },
  methods: {
    select(value) {
      this.selected = value;
    },
  },
  created() {
    this.$store.dispatch('tracks/getAll');
  },
};
</script>
<style lang="scss">
  #FileList {
    height: auto;
    max-height: 83vh;
    max-width: 100%;

    display: flex;
    flex-direction: column;
    align-content: space-between;
  }
  #FileListUploader {
    height: auto;
    max-height: 83vh;
    max-width: 100%;

    display: flex;
    flex-direction: column;
    align-content: space-between;
  }
  .audioplayer {
    .dark-player {
      width: 100%;
    }
    box-shadow: none;
    padding-top: 0;
  }
  .tabs {
    border-bottom: 0;
  }

  .card {
    max-height: 85vh;
  }
</style>
