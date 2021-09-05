<template>
  <div id="Playlist" class="large-width">
    <div class="add-new-playlist">
      <Modal
        title="Add new playlist"
        icon="add"
        position="center"
        buttonClasses="small absolute center middle grey-light-3"
        padding="medium-padding"
      >
        <PlaylistAddForm/>
      </Modal>
    </div>
    <div v-for="item in playlists" :key="item">
      <transition name="fade">
        <div class="playlists">
          <div class="card flat grey-light-4">
            <div class="row no-wrap">
              <div class="col min" @click="show = (show === item.id) ? show = false : show = item.id">
                <img src="../../assets/playlist.svg" class="circle large">
              </div>
              <div class="col" @click="show = (show === item.id) ? show = false : show = item.id">
                <h6 class="bold no-margin">{{item.name}}</h6>
                <p>Last upload: music.wav</p>
              </div>
              <div class="col min">
                <nav class="right-align">
                  <button class="border round transparent-border" @click="visibility">
                    <i class="material-icons">{{icon}}</i>
                  </button>
                  <Modal
                    icon="edit"
                    position="center"
                    padding="no-padding"
                  >
                  <PlaylistEditForm/>
                  </Modal>
                  <Modal
                    icon="share"
                    position="center small"
                    padding="no-padding"
                  >
                  </Modal>
                  <button class="border round transparent-border" @click="remove(item)">
                    <i class="material-icons">delete</i>
                  </button>
                </nav>
              </div>
            </div>
          </div>
          <div v-show="show === item.id" class="card flat grey-light-5 list">
            <FileList :admin="true"/>
          </div>
        </div>
      </transition>
    </div>
  </div>
</template>

<script>
import { mapState, mapActions } from 'vuex';
import FileList from '../FileList.vue';
import Modal from '../Modal.vue';
import PlaylistAddForm from '../PlaylistAddForm.vue';
import PlaylistEditForm from '../PlaylistEditForm.vue';

export default {
  name: 'AudioPlayerPlaylists',
  components: {
    FileList,
    Modal,
    PlaylistAddForm,
    PlaylistEditForm,
  },
  el: '#Playlist',
  data() {
    return {
      show: false,
      isPrivate: true,
    };
  },
  props: { admin: Boolean, user: Boolean, visibility: Boolean },
  computed: mapState({
    tracks: (state) => state.tracks.items,
    icon() {
      return this.isPrivate ? 'visibility' : 'visibility_off';
    },
    playlists: (state) => state.playlists.items,
  }),
  methods: {
    ...mapActions('tracks', [
      'select', 'remove',
    ]),
    ...mapActions('playlists', ['remove']),
  },
  created() {
    this.$store.dispatch('tracks/getAll');
    this.$store.dispatch('playlists/getAll');
  },
};
</script>

<style lang="scss" scoped>
  .playlists {
    margin-top: 16rem;
    i {
      font-size: 16px;
      color: #4d4d4d;
    }
    p {
      font-size: 14px;
      color: #72646f;
    }
    p:first-of-type {
      margin-top: 2px;
    }
    .card {
      border-radius: 0;
    }
  }

  .fade-enter-active, .fade-leave-active {
    transition: opacity .5s;
  }

  .fade-enter, .fade-leave-to {
    opacity: 0;
  }

  .add-new-playlist {
    padding-bottom: 16px;
  }

  .list {
    margin-top: 0;
  }
</style>
