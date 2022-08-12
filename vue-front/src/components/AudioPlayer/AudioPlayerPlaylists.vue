<template>
  <div id="Playlist" class="flex-item scroll">
    <div class="playlists-items">
      <div v-for="item in playlists" :key="item">
        <transition name="fade">
          <div class="playlist flex-item">
            <div class="card playlist-header">
              <div class="row no-wrap">
                <div class="col min">
                  <img src="../../assets/playlist.svg" class="circle medium">
                </div>
                <div class="col" @click="show = (show === item.id) ? show = false : show = item.id">
                  <h6 class="bold no-margin white-text top-align">
                    {{ item.name }}
                  </h6>
                  <div>
                    <p class="small-text">Last upload: music.wav</p>
                  </div>
                </div>
                <div class="absolute right">
                  <div class="col min">
                    <nav v-if="controls" class="right-align">
                      <button class="border round transparent-border" @click="update({ id: item.id, visibility: 'change' })">
                        <i class="material-icons">{{ item.visibility ? 'visibility' : 'visibility_off' }}</i>
                      </button>
                      <Modal
                        title="Rename playlist"
                        button=" "
                        icon="edit"
                        position="center"
                        padding="no-padding"
                      >
                        <PlaylistForm
                          :id="item.id"
                          :name="item.name"
                          title="Save"
                          icon="save"
                          :action="update"
                        />
                      </Modal>
                      <Modal
                        title="Invite user(s) in playlist"
                        icon="share"
                        position="medium"
                        padding="no-padding"
                        button=" "
                      >
                        <PlaylistInviteForm path="permissions" :playlist="item" :items="users" />
                      </Modal>
                      <button class="border round transparent-border" @click="remove(item)">
                        <i class="material-icons">delete</i>
                      </button>
                    </nav>
                  </div>
                </div>
              </div>
            </div>
            <div v-show="show === item.id" class="playlist-list card table-card">
              <Modal
                v-if="controls"
                :key="item.id"
                title="Add track(s) in playlist"
                icon="add"
                button-classes="small responsive upper grey3 small-margin"
                position="center"
              >
                <div id="Add-tracks">
                  <PlaylistInviteForm path="tracks" :playlist="item" :items="tracks" />
                </div>
              </Modal>
              <FileList :user="true" :playlist="item" class="no-scroll small-padding" />
            </div>
          </div>
        </transition>
      </div>
    </div>
  </div>
  <div v-if="controls" class="add-btn">
    <Modal
      title="Add new playlist"
      icon="add"
      position="center medium"
      button-classes="small responsive upper round grey3"
      padding="newplaylist"
    >
      <PlaylistForm
        title="Create new playlist"
        icon="add"
        :action="create"
      />
    </Modal>
  </div>
</template>

<script>
import { mapState, mapActions } from 'vuex';

import FileList from '../FileList.vue';
import Modal from '../Base/Modal.vue';
import PlaylistForm from '../PlaylistForm.vue';
import PlaylistInviteForm from '../PlaylistInviteForm.vue';

export default {
  el: '#Playlist',
  name: 'AudioPlayerPlaylists',
  components: {
    FileList,
    Modal,
    PlaylistForm,
    PlaylistInviteForm,
  },
  props: { controls: Boolean },
  data() {
    return { show: false };
  },
  computed: mapState({
    tracks: (state) => state.tracks.items,
    users: (state) => state.users.items,
    playlists: (state) => state.playlists.items,
  }),
  methods: {
    ...mapActions('tracks', [
      'select', 'remove',
    ]),
    ...mapActions('playlists', ['create', 'update', 'remove']),
  },
  created() {
    this.$store.dispatch('playlists/getAll');
    this.$store.dispatch('tracks/getAll');
  },
  updated() {
    this.$store.dispatch('playlists/update');
  },
};
</script>

<style lang="scss" scoped>
  #Playlist {
    max-height: calc(100vh - var(--height) - 50px - 12em);
  }

  .add-btn {
    background-color: #252526;

    height: auto;
    padding: 8rem 0 8rem 0;
  }

  .flex-item {
    scrollbar-color: #858585;

    &::-webkit-scrollbar-track {
      background-color: #323237;
      border-radius: 3rem;
    }

    &::-webkit-scrollbar {
      background-color: #323237;
      border-radius: 3rem;
      width: 5rem;
    }

    &::-webkit-scrollbar-thumb {
      background-color: #858585;
      border-radius: 3em;
    }
  }
  .playlist {
    margin: 0 0 8rem 0;
    overflow: hidden;

    .playlist-header {
      background-color: #2a2a2d;
      margin-bottom: 0;
    }

    i {
      color: #626161;
      font-size: 16rem;
    }

    p {
      color: #72646f;

      &:first-of-type {
        margin-top: 1rem;
      }
    }

    button.border::after {
      background-image: none;
    }

    button:hover {
      i {
        color: #ffffff;
        font-size: 20rem;
      }
    }
  }

  .fade-enter-active, .fade-leave-active {
    transition: opacity .5s;
  }

  .fade-enter, .fade-leave-to {
    opacity: 0;
  }

  .playlist-list {
    background-color: #232323;
    margin-top: 0;
  }

  .table-card {
    background-color: #232323;
    border-radius: 3rem;
    border-top-left-radius: none;
    border-top-right-radius: none;
    padding-top: 0;
  }

  .playlists-items {
    height: auto;
    width: 100%;

    align-content: space-between;
    display: flex;
    flex-direction: column;
  }

  @media screen and (orientation: portrait) {
    #Playlist {
      max-height: calc(100vh - var(--height) - 50px - 12em);
    }

    .row {
      flex-flow: wrap;
    }

    .absolute {
      position: relative;
    }

    .playlist-header {
      .col {
        display: inline-grid;
      }

      h6 {
        width: 100%;
        word-break: break-all;
      }

      p {
        width: 100%;
        word-break: keep-all;
      }
    }
  }
</style>
