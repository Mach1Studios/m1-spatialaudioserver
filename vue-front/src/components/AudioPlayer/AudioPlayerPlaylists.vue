<template>
  <div id="Playlist" class="flex-item scroll">
    <div class="playlists-items">
      <div v-for="item in playlists" :key="item">
        <transition name="fade">
          <div class="playlist flex-item">
            <article class="playlist-header no-round">
              <div class="grid middle-align">
                <div class="col s12 m2 l2" @click="show = (show === item.id) ? show = false : show = item.id">
                  <div class="grid">
                    <div class="col s2">
                      <img src="../../assets/playlist3.svg" class="playlist-img">
                    </div>
                    <div class="col s10">
                      <h6 class="bold no-margin white-text top-align">
                        {{ item.name }}
                      </h6>
                      <div>
                        <p class="no-margin small-text left-align">Last upload: music.wav</p>
                      </div>
                    </div>
                  </div>
                </div>

                <div v-if="controls" class="col s12 m10 l10 absolute right">
                  <nav class="no-space">
                    <button class="border round transparent-border" @click="update({ id: item.id, visibility: 'change' })">
                      <i class="material-icons">{{ item.visibility ? 'visibility' : 'visibility_off' }}</i>
                    </button>
                    <Modal
                      title="Rename playlist"
                      button=" "
                      icon="edit"
                      position="medium"
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
            </article>
            <article v-show="show === item.id" class="playlist-list no-padding no-round">
              <div class="grid">
                <div class="col s12">
                  <Modal
                    v-if="controls"
                    :key="item.id"
                    title="Add track(s) in playlist"
                    icon="add"
                    button-classes="small responsive upper transparent special-mdl-btn small-margin"
                    position="center medium"
                  >
                    <div id="Add-tracks">
                      <PlaylistInviteForm path="tracks" :playlist="item" :items="tracks" />
                    </div>
                  </Modal>
                </div>
                <div class="col s12 no-padding no-margin">
                  <FileList :user="true" :playlist="item" class="no-scroll playlist-filelist" />
                </div>
              </div>
            </article>
          </div>
        </transition>
      </div>
    </div>
  </div>
  <div v-if="controls" class="playlist-add-btn">
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
    max-height: calc(90vh - var(--height) - 50px - 12em);
  }

  .flex-item {
    // scrollbar-color: var(--primary-color);

    &::-webkit-scrollbar-track {
      border-radius: 3rem;
      background-color: var(--secondary-color);
    }

    &::-webkit-scrollbar {
      width: 5rem;
      border-radius: 3rem;
      background-color: var(--secondary-color);
    }

    &::-webkit-scrollbar-thumb {
      border-radius: 3em;
      background-color: var(--primary-color);
    }
  }

  .playlists-items {
    width: 100%;
    height: auto;

    display: flex;
    flex-direction: column;
    align-content: space-between;
  }

  .playlist {
    overflow: hidden;
    margin: 0 0 8rem 0;

    border-bottom: 1rem solid var(--additional-dark-color);
    box-shadow: 0 5px 5px -5px var(--additional-dark-color);

    .playlist-header {
      margin-bottom: 0;
      background: linear-gradient(90deg,hsla(0,0%,100%,0%),#0000001f);

      cursor: pointer;

      .playlist-img {
        height: 50rem;
      }
    }

    i {
      font-size: 16rem;
      color: var(--primary-highlight-color);
    }

    p {
      color: var(--primary-accent-color);

      &:first-of-type {
        margin-top: 1rem;
      }
    }

    button.border::after {
      background-image: none;
    }

    button:hover {
      i {
        font-size: 20rem;
        color: var(--secondary-highlight-color);
      }
    }
  }

  .playlist-list {
    right: 0;
    margin-top: 0;
    padding-top: 0;

    border-radius: 3rem;
    border-top-left-radius: none;
    border-top-right-radius: none;

    background: var(--secondary-dark-color);

    .playlist-filelist {
      padding: 0 0 0 8rem;
    }
  }

  .playlist-add-btn {
    height: auto;
    padding: 8rem 0 8rem 0;

    background-color: var(--secondary-dark-color);
  }

  @media screen and (orientation: portrait) {
    #Playlist {
      max-height: calc(90vh - var(--height) - 50px - 10em + 6rem);
    }

    .absolute {
      position: relative;
    }

    nav {
      margin-right: 0;
      margin-left: 35rem;
    }

    .playlist-header {
      padding-left: 8rem;

      h6 {
        width: 100%;
        word-break: keep-all;
      }

      p {
        width: 100%;
        word-break: keep-all;
      }
    }
  }
</style>
