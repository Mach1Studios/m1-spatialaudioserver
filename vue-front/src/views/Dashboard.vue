<template>
  <div class="container max no-scroll">
    <div class="row">
      <div class="col s4">
        <div class="card round">
          <div>
            <div class="tabs center-align">
              <a :class="{ active: selected === 'filelist'}" @click="select('filelist')">File List</a>
              <a :class="{ active: selected === 'playlists'}" @click="select('playlists')">Playlists</a>
            </div>
            <div id="FileList" class="page padding" :class="{ active: selected === 'filelist'}">
              <FileList :admin="true"/>
              <FileListUploader/>
            </div>
            <div id="Playlists" class="page padding" :class="{ active: selected === 'playlists'}">
              <AudioPlayerPlaylists :admin="true" :controls="true"/>
            </div>
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
import AudioPlayer from '../components/AudioPlayer/AudioPlayer.vue';
import AudioPlayerControls from '../components/AudioPlayer/AudioPlayerControls.vue';
import FileList from '../components/FileList.vue';
import FileListUploader from '../components/FileListUploader.vue';
import StreamInfo from '../components/StreamInfo.vue';
import AudioPlayerPlaylists from '../components/AudioPlayer/AudioPlayerPlaylists.vue';

export default {
  components: {
    AudioPlayer,
    AudioPlayerControls,
    FileList,
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
  .audioplayer {
    .dark-player {
      width: 100%;
    }
    box-shadow: none;
    padding-top: 0;
  }
</style>
