<template>
  <div class="max-size">
    <main class="max responsive no-scroll">
      <div class="grid mobile">
        <div :class="firstColumnClass">
          <div id="app-body-first">
            <article>
              <div class="tabs left-align">
                <a :class="{ active: selected === 'filelist'}" @click="select('filelist')">FILE LIST</a>
                <a :class="{ active: selected === 'playlists'}" @click="select('playlists')">PLAYLISTS</a>
              </div>
              <div id="FileList" class="page" :class="{ active: selected === 'filelist'}">
                <FileList :admin="true" />
                <Modal
                  title="CHOOSE A FILE..."
                  icon=" "
                  button-classes="small responsive grey3 round bold"
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
            </article>
          </div>
        </div>
        <div v-show="isActiveStream" :class="secondColumnClass">
          <div id="app-body-second">
            <div id="AudioPlayerControls">
              <AudioPlayerControls />
            </div>
          </div>
        </div>
      </div>
    </main>
    <div class="grid responsive dark-player-card absolute bottom">
      <div class="audioplayer-debug s12">
        <article class="transparent">
          <AudioPlayerDebug />
        </article>
      </div>
      <div class="audioplayer s12">
        <article class="transparent">
          <AudioPlayer class="dark-player" />
        </article>
      </div>
    </div>
  </div>
</template>

<script>
/* eslint-disable */
import { mapState } from 'vuex';
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
  computed: {
    ...mapState('stream', ['isActiveStream']),
    firstColumnClass() {
      return this.isActiveStream ? 'col s6 m6 l6' : 'col s12 m12 l12';
    },
    secondColumnClass() {
      return 'col s6 m6 l6';
    },
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
    height: 90vh;
  }

  .uploader {
    background-color: var(--secondary-dark-color);
    padding: 8rem 0 8rem 0;
  }

  #Playlists {
    height: auto;
    max-height: 65vh;
    max-width: 100%;

    align-content: space-between;
    display: flex;
    flex-direction: column;
  }

  #FileList {
    height: auto;
    max-height: 65vh;
    max-width: 100%;

    align-content: space-between;
    display: flex;
    flex-direction: column;
  }
  //
  // #FileListUploader {
  //   height: auto;
  //   max-width: 100%;
  //
  //   align-content: space-between;
  //   display: flex;
  //   flex-direction: column;
  // }

  article {
    background-color: var(--secondary-dark-color);
    border-radius: 0 !important;
  }

  .dark-player-card, .dark-player-card .card {
    background-color: var(--primary-dark-color);
    border-radius: 0;
  }

  #AudioPlayerControls {
    height: auto;
    max-height: 65vh;
    max-width: 100%;

    align-content: space-between;
    display: flex;
    flex-direction: column;
  }

  #app-body-first {
    transition: width 0.3s ease;
  }

  #app-body-second {
    transition: width 0.3s ease;
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

    article {
      padding-top: 0;
    }
  }

  .tabs {
    border-bottom: 0;

    a {
      color: var(--secondary-highlight-color);
      font-size: 18rem;
    }
  }

  .tabs>a.active {
    border-bottom: 2rem solid var(--secondary-highlight-color);
  }

  .audioplayer-debug {
    padding: 0 55rem 0 55rem;
    article {
      padding-top: 0;
      padding-bottom: 0;
    }
  }

  main {
    padding-left: 55rem;
    padding-right: 55rem;
  }

  .grid.mobile {
    transition: width 0.3s ease;
  }

  .grid.mobile > .col {
    transition: width 0.3s ease, opacity 0.3s ease;
  }

  @media screen and (orientation: portrait) {
    #app-header {
      max-height: 10vh;
    }

    #app-body-first {
      max-height: calc(100vh - var(--height) - 50px - 6em);

      * {
        max-height: calc(100vh - var(--height) - 50px - 6em);
      }
    }

    #app-body-second {
      max-height: calc(100vh - var(--height) - 50px - 6em);

      * {
        max-height: calc(100vh - var(--height) - 50px - 6em);
      }
    }

    .audioplayer {
      padding-left: 8rem;
      padding-right: 8rem;
    }

    main {
      overflow-x: scroll;

      // padding-bottom: calc(10vh - 50px - 3em);
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
