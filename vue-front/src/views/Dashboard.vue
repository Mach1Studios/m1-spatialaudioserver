<template>
  <div class="max-size">
    <div class="container max no-scroll">
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
                    buttonClasses="small responsive round bold grey-light-3 uploader"
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
    <div class="row no-space dark absolute bottom">
      <div class="card flat">
        <AudioPlayerDebug/>
      </div>
      <div class="card flat transparent audioplayer">
        <AudioPlayer skin="dark" class="dark-player"/>
      </div>
    </div>
  </div>
</template>

<script>
/* eslint-disable */
import AudioPlayer from '../components/AudioPlayer/AudioPlayer.vue';
import AudioPlayerDebug from '../components/AudioPlayer/AudioPlayerDebug.vue';
import AudioPlayerControls from '../components/AudioPlayer/AudioPlayerControls.vue';
import FileList from '../components/FileList.vue';
import Modal from '../components/Base/Modal.vue';
import FileListUploader from '../components/FileListUploader.vue';
import StreamInfo from '../components/StreamInfo.vue';
import AudioPlayerPlaylists from '../components/AudioPlayer/AudioPlayerPlaylists.vue';

export default {
  components: {
    AudioPlayer,
    AudioPlayerDebug,
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
  .max-size {
    height: 100vh;
  }
  .uploader {
    margin: 16rem 0 16rem 0;
  }
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
    z-index: 600;
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
</style>
