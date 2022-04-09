<template>
  <div id="Playlist">
    <div v-if="controls" class="playlist-mdl-btn">
      <Modal
        title="Add new playlist"
        icon="add"
        position="center"
        button-classes="small responsive upper round grey3"
        padding="medium-margin"
      >
        <PlaylistForm
          title="Create new playlist"
          icon="add"
          :action="create"
        />
      </Modal>
    </div>
    <div class="playlists-items flex-item scroll">
      <div v-for="item in playlists" :key="item">
        <transition name="fade">
          <!-- <details class="playlist">
            <summary class="card playlist-header" @click="show = (show === item.id) ? show = false : show = item.id">
              <div class="row no-wrap middle-align">
                <div class="col min">
                  <img src="../../assets/playlist.svg" class="circle small">
                </div>
                <div class="col">
                  <h6 class="bold no-margin white-text top-align">{{item.name}}</h6>
                  <div class="small-text">Last upload: music.wav</div>
                </div>
                <div class="col min">
                  <nav v-if="controls" class="right-align">
                    <button class="border round transparent-border" @click="update({ id: item.id, visibility: 'change' })">
                      <i class="material-icons">{{item.visibility ? 'visibility' : 'visibility_off'}}</i>
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
                      <PlaylistInviteForm path="permissions" :playlist="item" :items="users"/>
                    </Modal>
                    <button class="border round transparent-border" @click="remove(item)">
                      <i class="material-icons">delete</i>
                    </button>
                  </nav>
                </div>
              </div>
            </summary>
            <div class="card table-card">
              <div v-show="show === item.id" class="playlist-list">
                <Modal
                  title="Add track(s) in playlist"
                  icon="add"
                  buttonClasses="small responsive round upper grey3 small-margin"
                  position="center"
                  v-if="controls"
                  :key="item.id"
                >
                <div id="Add-tracks">
                  <PlaylistInviteForm path="tracks" :playlist="item" :items="tracks"/>
                </div>
                </Modal>
                <FileList :user="true" :playlist="item" class="no-scroll small-padding"/>
              </div>
            </div>
          </details> -->

          <div class="playlist">
            <div class="card playlist-header">
              <div class="row no-wrap">
                <div class="col min">
                  <img src="../../assets/playlist.svg" class="circle medium">
                </div>
                <div class="col" @click="show = (show === item.id) ? show = false : show = item.id">
                  <h6 class="bold no-margin white-text top-align">
                    {{ item.name }}
                  </h6>
                  <div class="small-text">
                    Last upload: music.wav
                  </div>
                </div>
                <!-- <div class="col s7 m5 l6" @click="show = (show === item.id) ? show = false : show = item.id">
                  <h6 class="bold no-margin white-text">{{item.name}}</h6>
                  <p>Last upload: music.wav</p>
                </div> -->
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
};
</script>

<style lang="scss" scoped>
  .flex-item {
    &::-webkit-scrollbar-track
    {
      border-radius: 3rem;
      background-color: #323237;
    }

    &::-webkit-scrollbar
    {
      width: 5rem;
      border-radius: 3rem;
      background-color: #323237;
    }

    &::-webkit-scrollbar-thumb
    {
      border-radius: 3em;
      background-color: #858585;
    }
    scrollbar-color: #858585 #323237;
    scrollbar-width: auto;
  }
  .playlist {
    // padding: 0 8rem 8rem 8rem;
    margin: 0 8rem 8rem 8rem;

    .playlist-header {
      // padding: 16rem 0 0 16rem;
      background-color: #323237;
      margin-bottom: 0;
    }
    i {
      font-size: 16rem;
      color: #626161;
    }
    p {
      font-size: 14rem;
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
        font-size: 20rem;
        color: #ffffff;
      }
    }
  }

  .fade-enter-active, .fade-leave-active {
    transition: opacity .5s;
  }

  .fade-enter, .fade-leave-to {
    opacity: 0;
  }

  .playlist-mdl-btn {
    padding-bottom: 16rem;
  }

  .playlist-list {
    margin-top: 0;
    background-color: #232323;
  }
  .table-card {
    background-color: #232323;
    padding-top: 0;
    border-radius: 3rem;
    border-top-right-radius: none;
    border-top-left-radius: none;
  }
  .playlists-items {
    overflow-x: hidden;
    height: auto;
    // max-height: 57vh; // note important for playlist scroll
    max-height: calc(100vh - 2 * var(--height) - 50px - 12em);
    max-width: 100%;

    display: flex;
    flex-direction: column;
    align-content: space-between;
  }

  @media screen and (orientation: portrait) {
    #Playlist {
      .playlists-items {
        max-height: calc(100vh - 2 * var(--height) - 50px - 8em);

      }
      // max-height: calc(100vh - var(--height) - 50px - 6em - 10vh);
    }
    .row {
      flex-flow: wrap;
    }
    .absolute {
      position: relative;
    }
    .playlist-header {
      col {
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
  // @media screen and (orientation: landscape) {
  //   #Playlist {
  //     .playlists-items {
  //       max-height: calc((100vh - 2 * var(--height) - 50px - 10em - 10vh) / 1.4);
  //     }
  //     .playlist-mdl-btn {
  //       padding: 0 0 0 8rem;
  //     }
  //   }
  // }
</style>
