<template>
  <div class="flex-item scroll">
    <!-- <div v-if="admin"></div> -->
    <table class="table-list flex-item">
      <tbody>
        <tr v-for="(item, index) in items" :key="item" :class="{ 'on-play': track.id === item.id }" @click="play">
          <td>
            <p class="medium-text">{{ index + 1 }}</p>
          </td>
          <td class="audio-name" @click="select(item.id)">
            <p class="medium-text">{{ item.name }}</p>
          </td>
          <td>
            <nav>
              <Popup :active="active === item.id" :items="item" @mouseleave.stop="active = null" @click.stop="active = item.id" />
              <button class="border round transparent-border" @click="reload(item)">
                <i class="material-icons">cached</i>
              </button>
              <button class="border round transparent-border">
                <i class="material-icons">repeat</i>
                <!-- <i class="material-icons">keyboard_return</i> -->
              </button>
              <Modal
                v-if="admin"
                title="Rename track"
                button=" "
                icon="edit"
                position="center medium"
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
              <button v-if="admin" class="border round transparent-border" @click="remove(item.id)">
                <i class="material-icons">delete</i>
              </button>
            </nav>
          </td>
        </tr>
      </tbody>
    </table>
  </div>
</template>

<script>

import { mapState, mapActions } from 'vuex';
import _ from 'lodash';

import Modal from './Base/Modal.vue';
import Popup from './Base/Popup.vue';
import PlaylistForm from './PlaylistForm.vue';

export default {
  name: 'FileList',
  components: {
    Modal,
    PlaylistForm,
    Popup,
  },
  props: {
    admin: Boolean,
    user: Boolean,
    playlist: Object,
  },
  data() {
    return { active: '' };
  },
  computed: {
    ...mapState({
      tracks: (state) => state.tracks.items,
      track: (state) => state.tracks.track,
    }),
    isPlaylist() {
      return this.playlist && this.playlist.id;
    },
    items() {
      return this.isPlaylist ? _.filter(this.tracks, (track) => this.playlist.tracks.indexOf(track.id) !== -1) : this.tracks;
    },
  },
  methods: { ...mapActions('tracks', ['reload', 'remove', 'select', 'update']) },
};
</script>

<style lang="scss" scoped>
  .flex-item {
    scrollbar-color: var(--primary-color);

    &::-webkit-scrollbar-track {
      background-color: var(--secondary-color);
      border-radius: 3rem;
    }

    &::-webkit-scrollbar {
      background-color: var(--secondary-color);
      border-radius: 3rem;

      width: 5rem;
    }

    &::-webkit-scrollbar-thumb {
      background-color: var(--primary-color);
      border-radius: 3em;
    }
  }

  i {
    color: var(--primary-highlight-color);
    font-size: 16px;

    cursor: pointer;
  }

  .table-list {
    display: block;
    overflow: hidden;

    width: 100%;

    tbody {
      display: table;
      width: 100%;
    }

    .audio-name {
      width: 100%;
      word-break: break-all;
    }

    p {
      color: var(--secondary-highlight-color);
      text-align: justify;
    }

    td {
      border-bottom: 1px var(--additional-dark-color) solid;

      &:last-child {
        padding-right: 13px;
      }
    }

    tr {
      vertical-align: middle;
      width: inherit;
    }

    tr:hover {
      background: linear-gradient(90deg,hsla(0,0%,100%,0%),#0000001f);
    }

    tr.on-play {
      background: linear-gradient(90deg,hsla(0,0%,100%,0%),#0000001f);

      p {
        color: var(--primary-accent-color);
        font-weight: bold;
      }

      i {
        color: var(--primary-accent-color);
      }
    }

    button {
      &:hover {
        i {
          color: var(--secondary-highlight-color);
          font-size: 20px;
        }
      }
    }

    button.border::after {
      background-image: none;
    }
  }

  @media screen and (orientation: portrait) {
    #FileList {
      .table-list {
        .audio-name {
          width: 85%;
          word-break: keep-all;
        }

        td {
          border: none;
          display: grid;
        }

        td:not(:nth-child(3)) {
          display: inline-table;
        }
      }
    }

    nav>:not(.dropdown,.badge) {
      padding-right: 8rem;
    }
  }
</style>
