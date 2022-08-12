<template>
  <div class="max-size">
    <div class="container max no-scroll">
      <div class="row mobile">
        <div class="col s6 m6 l6">
          <div id="app-body-first" class="card round">
            <div class="tabs left-align">
              <a :class="{ active: selected === 'filelist'}" @click="select('filelist')">File List</a>
              <a :class="{ active: selected === 'playlists'}" @click="select('playlists')">Playlists</a>
            </div>
            <div id="FileList" class="page" :class="{ active: selected === 'filelist'}">
              <FileList :admin="true" />
              <Modal
                title="CHOOSE A FILE..."
                icon=" "
                button-classes="small responsive round bold grey3"
                padding="uploader"
                position="center medium"
              >
                <div id="FileListUploader">
                  <FileListUploader />
                </div>
              </Modal>
            </div>
            <div id="Playlists" class="page" :class="{ active: selected === 'playlists'}">
              <AudioPlayerPlaylists :controls="true" />
            </div>
          </div>
        </div>
        <div class="col s6 m6 l6">
          <div id="app-body-second">
            <div id="AudioPlayerControls">
              <AudioPlayerControls />
            </div>
          </div>
        </div>
      </div>
    </div>
    <div class="row no-space dark absolute bottom">
      <div class="card flat audioplayer-debug">
        <AudioPlayerDebug />
      </div>
      <div class="card flat transparent audioplayer">
        <AudioPlayer skin="dark" class="dark-player" />
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

    align-content: space-between;
    display: flex;
    flex-direction: column;
  }

  #FileList {
    height: auto;
    max-height: 68vh;
    max-width: 100%;

    align-content: space-between;
    display: flex;
    flex-direction: column;
  }

  #FileListUploader {
    height: auto;
    max-width: 100%;

    align-content: space-between;
    display: flex;
    flex-direction: column;
  }

  .card {
    background-color: #252526;
    max-height: 80vh;
  }

  .dark, .dark .card {
    background-color: #1c1c1c;
    border-radius: 0;
  }

  #AudioPlayerControls {
    height: auto;
    max-height: 68vh;
    max-width: 100%;

    align-content: space-between;
    display: flex;
    flex-direction: column;
  }

  .audioplayer {
    box-shadow: none;

    padding-left: 55rem;
    padding-right: 55rem;
    padding-top: 0;

    z-index: 600;

    .dark-player {
      width: 100%;
    }
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

  .audioplayer-debug {
    padding: 0 55rem 0 55rem;
  }

  .container {
    padding-left: 55rem;
    padding-right: 55rem;
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

    .audioplayer {
      padding-left: 8rem;
      padding-right: 8rem;
    }

    .container {
      overflow-x: scroll;

      padding-bottom: calc(10vh - 50px - 3em);
      padding-left: 8rem;
      padding-right: 8rem;
      padding-top: auto;
    }

    .mobile {
      width: 200vw;
    }

    .audioplayer-debug {
      padding: 0 8rem 0 8rem;

      z-index: 99;
    }
  }
</style>
