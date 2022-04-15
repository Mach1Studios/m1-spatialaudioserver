<template>
  <div class="max-size">
    <div class="container max no-scroll">
      <div class="row mobile">
        <div class="col s6 m6 l6">
          <div class="card round"  id="app-body-first">
              <div class="tabs left-align">
                <a :class="{ active: selected === 'filelist'}" @click="select('filelist')">File List</a>
                <a :class="{ active: selected === 'playlists'}" @click="select('playlists')">Playlists</a>
              </div>
              <div id="FileList" class="page" :class="{ active: selected === 'filelist'}">
                  <FileList :admin="true"/>
                  <Modal
                    title="CHOOSE A FILE..."
                    icon=" "
                    buttonClasses="small responsive round bold grey3"
                    padding="uploader"
                    currentPosition="left"
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
        <div class="col s6 m6 l6">
          <div id="app-body-second">
            <div id="AudioPlayerControls">
              <AudioPlayerControls/>
            </div>
          </div>
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
  // #AudioPlayerDebug {
  //   max-height: calc((100vh - 99vh) - 50px);
  //   height: auto;
  // }
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
    max-height: 68vh;
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
    .card {
      box-shadow: var(--shadow-2);
    }
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
  .audioplayer-debug {
    padding-top: 0;
    padding-bottom: 0;
  }

  @media screen and (orientation: portrait) {
    #app-header {
      max-height: 10vh;
    }
    #app-body-first {
      max-height: calc(100vh - var(--height) - 50px - 6em);
      * {
        max-height: calc(100vh - 2 * var(--height) - 50px - 6em);
      }
    }
    #app-body-second {
      max-height: calc(100vh - var(--height) - 50px - 6em);
      * {
        max-height: calc(100vh - 2 * var(--height) - 50px - 3em);
      }
    }
    .container {
      overflow-x: scroll;
      padding-top: auto;
      padding-left: 8rem;
      padding-right: 8rem;
      padding-bottom: calc(10vh - 50px - 3em);
    }
    .mobile {
      width: 200vw;
    }
    .audioplayer-debug {
      z-index: 99;
    }
  }
  // @media screen and (orientation: landscape) {
  //   #app-header {
  //     max-height: 10vh;
  //   }
  //   #app-body-first {
  //     max-height: calc((100vh - var(--height) - 50px - 6em) / 1.4);
  //     * {
  //       max-height: calc((100vh - 2 * var(--height) - 50px - 6em) / 1.4);
  //     }
  //   }
  //   #app-body-second {
  //     max-height: calc((100vh - var(--height) - 50px - 6em) / 1.4);
  //     * {
  //       max-height: calc((100vh - 2 * var(--height) - 50px - 3em) / 1.4);
  //     }
  //   }
  //   .container {
  //     overflow-x: scroll;
  //     padding-top: auto;
  //     padding-left: 8rem;
  //     padding-right: 8rem;
  //     padding-bottom: calc(10vh - 50px - 3em);
  //   }
  //   .mobile {
  //     width: 200vw;
  //   }
  //   .audioplayer-debug {
  //     z-index: 99;
  //   }
  // }
</style>
