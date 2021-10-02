<template>
  <div id="Playlist" class="large-width">
    <div v-if="controls" class="add-new-playlist">
      <Modal
        title="Add new playlist"
        icon="add"
        position="center"
        buttonClasses="small absolute center middle grey-light-3"
        padding="medium-padding"
      >
        <PlaylistForm
          title="Create new playlist"
          icon="add"
          :action="create"
        />
      </Modal>
    </div>
    <div v-for="item in playlists" :key="item">
      <transition name="fade">
        <div class="playlists">
          <div class="card flat grey-light-4">
            <div class="row no-wrap">
              <div class="col min">
                <img src="../../assets/playlist.svg" class="circle large">
              </div>
              <div class="col" @click="show = (show === item.id) ? show = false : show = item.id">
                <h6 class="bold no-margin">{{item.name}}</h6>
                <p>Last upload: music.wav</p>
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
          <div v-show="show === item.id" class="card flat grey-light-5 list">
            <Modal
              title="Add track(s) in playlist"
              icon="add"
              buttonClasses="small small-space large-width small-margin grey-light-3"
              position="center"
              v-if="controls"
              :key="item.id"
            >
              <PlaylistInviteForm path="tracks" :playlist="item" :items="tracks"/>
            </Modal>
            <FileList :user="true" :playlist="item"/>
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
    button.border::after {
      background-image: none;
    }
    button:hover {
      i {
        font-size: 20px;
        color: #1c1c1c;
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
    padding-bottom: 16px;
  }

  .list {
    margin-top: 0;
  }
</style>
