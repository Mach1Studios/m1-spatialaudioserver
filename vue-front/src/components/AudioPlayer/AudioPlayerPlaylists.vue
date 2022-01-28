<template>
  <div id="Playlist">
    <div v-if="controls" class="add-new-playlist">
      <Modal
        title="Add new playlist"
        icon="add"
        position="center"
        buttonClasses="small responsive round grey-light-3"
        padding="medium-margin"
      >
        <PlaylistForm
          title="Create new playlist"
          icon="add"
          :action="create"
        />
      </Modal>
    </div>
    <div class="playlists-items">
      <div v-for="item in playlists" :key="item">
        <transition name="fade">
          <div class="playlists scroll">
            <div class="playlist-header">
              <div class="row">
                <div class="col s2 m1 l1">
                  <img src="../../assets/playlist.svg" class="circle large">
                </div>
                <div class="col s10 m11 l5" @click="show = (show === item.id) ? show = false : show = item.id">
                  <h6 class="bold no-margin white-text">{{item.name}}</h6>
                  <p>Last upload: music.wav</p>
                </div>
                <div class="col s12 m12 l6">
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
                      position="center"
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
            </div>
            <div v-show="show === item.id" class="playlist-list">
              <Modal
                title="Add track(s) in playlist"
                icon="add"
                buttonClasses="small medium-margin grey-light-3 small-space large-btn"
                position="center"
                v-if="controls"
                :key="item.id"
              >
              <div id="Add-tracks">
                <PlaylistInviteForm path="tracks" :playlist="item" :items="tracks"/>
              </div>
              </Modal>
              <FileList :user="true" :playlist="item" class="no-scroll"/>
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
  name: 'AudioPlayerPlaylists',
  el: '#Playlist',
  components: {
    FileList,
    Modal,
    PlaylistForm,
    PlaylistInviteForm,
  },
  props: {
    controls: Boolean,
  },
  data() {
    return {
      show: false,
    };
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
  // .dark-card {
  //   background-color: #323237;
  // }

  .playlists {
    margin-bottom: 16rem;
    // margin-right: 8rem;
    // margin-left: 8rem;
    .playlist-header {
      background-color: #323237;
      padding: 8rem;
      margin-bottom: 0;
    }
    i {
      font-size: 16rem;
      color: #4d4d4d;
    }
    p {
      font-size: 14rem;
      color: #72646f;

      &:first-of-type {
        margin-top: 2px;
      }
    }
    .card {
      border-radius: 0;
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

  .add-new-playlist {
    padding-bottom: 16rem;
  }

  .playlist-list {
    margin-top: 0;
  }
  .playlists-items{
    background-color: #232323;
    overflow-x: hidden;
    height: auto;
    max-height: 67vh; // note important for playlist scroll
    max-width: 100%;

    display: flex;
    flex-direction: column;
    align-content: space-between;
    &::-webkit-scrollbar-track
    {
      border-radius: 3em;
      background-color: #323237;
    }

    &::-webkit-scrollbar
    {
      width: 7px;
      background-color: #323237;
    }

    &::-webkit-scrollbar-thumb
    {
      border-radius: 3em;
      background-color: #858585;
    }
  }
  /* SCSS for Extra Small (xs) screen */
  @media only screen and (max-width: 375px) {
    /* Write your code here */
    .playlist-header {

    }
  }
</style>
