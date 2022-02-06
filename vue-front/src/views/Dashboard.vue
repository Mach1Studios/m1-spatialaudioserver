<template>
  <div class="max-size">
    <div class="container max no-scroll">
      <div class="row mobile">
        <div class="col s6 m6 l6">
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
                    buttonClasses="small responsive round bold grey-light-3"
                    padding="uploader"
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
        <div id="AudioPlayerControls" class="col s6 m6 l6">
          <AudioPlayerControls/>
        </div>
      </div>
    </div>
    <div class="row no-space dark absolute bottom">
      <div class="card flat audioplayer-debug">
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
<style lang="scss" scoped>
  .max-size {
    height: 100vh;
  }
  .uploader {
    background-color: #252526;
    padding: 8rem 0 8rem 0;
  }
  #Playlists {
    height: auto;
    max-height: 68vh;
    max-width: 100%;

    display: flex;
    flex-direction: column;
    align-content: space-between;
  }
  #FileList {
    height: auto;
    max-height: 68vh;
    max-width: 100%;

    display: flex;
    flex-direction: column;
    align-content: space-between;
  }
  #FileListUploader {
    height: auto;
    max-height: 73vh;
    max-width: 100%;

    display: flex;
    flex-direction: column;
    align-content: space-between;
  }
  #AudioPlayerControls {
    height: auto;
    max-height: 68vh;
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
  }
  .dark, .dark .card{
    background-color: #1c1c1c;
    border-radius: 0;
  }
  .large-btn {
    width: 100%;
  }
  .audioplayer-debug {
    padding-top: 0;
    padding-bottom: 0;
  }

  /* SCSS for Large (lg) screen */
  @media only screen and (max-width: 992px) {
    .container {
      overflow-x: scroll;
    }
    #FileList {
      height: auto;
      max-height: 55vh;
    }
    #AudioPlayerControls {
      height: auto;
      max-height: 55vh;
    }
    .mobile {
      width: 200vw;
    }
    .audioplayer-debug {
      z-index: 599;
    }
  }

  /* SCSS for Medium (md) screen */
  @media only screen and (max-width: 800px) {
    .container {
      overflow-x: scroll;
    }
    #FileList {
      height: auto;
      max-height: 55vh;
    }
    #AudioPlayerControls {
      height: auto;
      max-height: 55vh;
    }
    .mobile {
      width: 200vw;
    }
    .audioplayer-debug {
      z-index: 599;
    }
  }

  /* SCSS for Medium (md) screen */
  @media only screen and (max-width: 768px) {
    .container {
      overflow-x: scroll;
    }
    #FileList {
      height: auto;
      max-height: 55vh;
    }
    #AudioPlayerControls {
      height: auto;
      max-height: 55vh;
    }
    .mobile {
      width: 200vw;
    }
    .audioplayer-debug {
      z-index: 599;
    }
  }

  /* SCSS for Medium (md) screen */
  @media only screen and (max-width: 600px) {
    .container {
      overflow-x: scroll;
    }
    #FileList {
      height: auto;
      max-height: 55vh;
    }
    #AudioPlayerControls {
      height: auto;
      max-height: 55vh;
    }
    .mobile {
      width: 200vw;
    }
    .audioplayer-debug {
      z-index: 599;
    }
  }

  /* SCSS for Extra Small (xs) screen */
  @media only screen and (max-width: 414px) {
    .container {
      overflow-x: scroll;
    }
    #FileList {
      height: auto;
      max-height: 55vh;
    }
    #AudioPlayerControls {
      height: auto;
      max-height: 55vh;
    }
    .mobile {
      width: 200vw;
    }
    .audioplayer-debug {
      z-index: 599;
    }
  }

  /* SCSS for Extra Small (xs) screen */
  @media only screen and (max-width: 394px) {
    .container {
      overflow-x: scroll;
    }
    #FileList {
      height: auto;
      max-height: 55vh;
    }
    #AudioPlayerControls {
      height: auto;
      max-height: 55vh;
    }
    .mobile {
      width: 200vw;
    }
    .audioplayer-debug {
      z-index: 599;
    }
  }

  /* SCSS for Extra Small (xs) screen */
  @media only screen and (max-width: 375px) {
    .container {
      overflow-x: scroll;
      padding-left: 8rem;
      padding-top: 10vh;
      padding-bottom: 0;
    }
    #FileList {
      height: auto;
      max-height: 63vh;
    }
    #AudioPlayerControls {
      height: auto;
      max-height: 55vh;
    }
    .mobile {
      width: 200vw;
    }
    .audioplayer-debug {
      z-index: 599;
    }
  }

  /* SCSS for Extra Small (xs) screen */
  @media only screen and (max-width: 360px) {
    .container {
      overflow-x: scroll;
    }
    #FileList {
      height: auto;
      max-height: 55vh;
    }
    #AudioPlayerControls {
      height: auto;
      max-height: 55vh;
    }
    .mobile {
      width: 200vw;
    }
    .audioplayer-debug {
      z-index: 599;
    }
  }

  /* SCSS for Extra Small (xs) screen */
  @media only screen and (max-width: 320px) {
    .container {
      overflow-x: scroll;
    }
    #FileList {
      height: auto;
      max-height: 55vh;
    }
    #AudioPlayerControls {
      height: auto;
      max-height: 55vh;
    }
    .mobile {
      width: 200vw;
    }
    .audioplayer-debug {
      z-index: 599;
    }
  }

  /* SCSS for Extra Small (md) & Landscap screen */
  @media only screen and (max-width: 823px) and (min-width:801px) {
    .container {
      overflow-x: scroll;
      padding-left: 8rem;
      padding-top: 10vh;
      padding-bottom: 0;
    }
    #FileList {
      height: auto;
      max-height: 31vh;
    }
    #AudioPlayerControls {
      height: auto;
      max-height: 31vh;
      max-height: 55vh;
    }
    .mobile {
      width: 200vw;
    }
    .audioplayer-debug {
      z-index: 599;
    }
  }

  /* SCSS for Small (sm) & Landscap screen */
  @media only screen and (max-width: 667px) and (min-width:601px) {
    .container {
      overflow-x: scroll;
      padding-left: 8rem;
      padding-top: 10vh;
      padding-bottom: 0;
    }
    #FileList {
      height: auto;
      max-height: 31vh;
    }
    #AudioPlayerControls {
      height: auto;
      max-height: 31vh;
    }
    .mobile {
      width: 200vw;
    }
    .audioplayer-debug {
      z-index: 599;
    }
  }

  /* SCSS for Small (sm) & Landscap Mobile screen */
  @media only screen and (max-width: 568px){
    .container {
      overflow-x: scroll;
      padding-left: 8rem;
      padding-top: 10vh;
      padding-bottom: 0;
    }
    #FileList {
      height: auto;
      max-height: 60vh;
    }
    #AudioPlayerControls {
      height: auto;
      max-height: 60vh;
    }
    .mobile {
      width: 200vw;
    }
    .audioplayer-debug {
      z-index: 599;
    }
  }
</style>
