<template>
  <div class="container max no-scroll">
    <!-- <FileList :admin="true"/>
    <FileListUploader/> -->

    <div class="row">
      <div class="col s6">
        <div class="card round">
            <div class="tabs left-align">
              <a :class="{ active: selected === 'filelist'}" @click="select('filelist')">File List</a>
              <a :class="{ active: selected === 'playlists'}" @click="select('playlists')">Playlists</a>
            </div>
            <div id="FileList" class="page" :class="{ active: selected === 'filelist'}">
                <FileList :admin="true"/>
                <Modal
                  title="CHOOSE A FILE..."
                  icon=" "
                  buttonClasses="small small-space bold large-margin large-btn grey-light-3"
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
      <div class="col s6">
        <AudioPlayerControls/>
      </div>
    </div>
  </div>
  <div class="row absolute dark bottom">
    <details class="card flat stream">
      <StreamInfo/>
      <summary class="medium-text">
        DASH STREAM INFO
        <i class="material-icons-outlined white-text">expand_more</i>
      </summary>
    </details>
    <div class="card round transparent audioplayer">
      <AudioPlayer skin="dark" class="dark-player"/>
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
    max-height: 73vh;
    max-width: 100%;

    display: flex;
    flex-direction: column;
    align-content: space-between;
  }
  // #Playlists {
  //   height: auto;
  //   max-height: 80vh;
  //   max-width: 100%;
  //
  //   display: flex;
  //   flex-direction: column;
  //   align-content: space-between;
  // }
  #FileListUploader {
    height: auto;
    max-height: 73vh;
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
    a {
      color: #ffffff;
      font-size: 18rem;
    }
  }
  .tabs>a.active {
    border-bottom: 2rem solid #ffffff;
  }
  .card {
    max-height: 80vh;
    background-color: #252526;
    // position: relative;
  }
  .dark .card{
    background-color: #1c1c1c;
    z-index: 600;
    border-radius: 0;
  }
  .large-btn {
    width: 100%;
  }
  details, summary {
    color: #ffffff;
  }
  summary {
    list-style: none;
  }
  summary::-webkit-details-marker {
    display: none;
  }
  .stream {
    margin-bottom: 0;
    padding-bottom: 0;
  }
</style>
