<template>
  <div class="large-width small-padding">
    <div v-if="admin"></div>
    <table class="list-table border">
      <tbody>
        <tr v-for="item in items" :key="item" :class="{ 'on-play': track.id === item.id }" @click="play">
          <td>
            <p class="medium-text">{{item.number}}</p>
          </td>
          <td class="small-width" @click="select(item.id)">
            <p class="medium-text">{{item.name}}</p>
          </td>
          <td>
            <nav class="right-align">
              <button class="border round transparent-border">
                <i class="material-icons-outlined">info</i>
                <div class="card dropdown right no-wrap">
                  <p>created: "2021-10-02T20:20:02.254+03:00"</p>
                  <p>id: "f08ce45d-991f-45f3-8238-af3204d462a4"</p>
                  <p>mimetype: "audio/wav"</p>
                  <p>name: "m1-debug-shrtpt-m1spatial.wav"</p>
                  <p>originalname: "m1-debug-shrtpt-m1spatial.wav"</p>
                  <p>prepared: "false"</p>
                  <p>size: "12701536"</p>
                  <p>updated: "2021-10-02T20:20:02.254+03:00"</p>
                </div>
              </button>
              <div class="info popup"></div>
              <span class="disabled">
                <i class="material-icons">{{item.prepared ? 'mood' : 'mood_bad'}}</i>
              </span>
              <button class="border round transparent-border">
                <i class="material-icons">repeat</i>
                <!-- <i class="material-icons">keyboard_return</i> -->
              </button>
              <Modal
                title="Rename track"
                button=" "
                icon="edit"
                position="center"
                padding="no-padding"
                v-if="admin"
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

import Modal from './Modal.vue';
import PlaylistForm from './PlaylistForm.vue';

export default {
  name: 'FileList',
  components: {
    Modal,
    PlaylistForm,
  },
  props: {
    admin: Boolean,
    user: Boolean,
    playlist: Object,
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
  methods: {
    ...mapActions('tracks', ['remove', 'select', 'update']),
  },
};
</script>

<style lang="scss" scoped>
  .disabled {
    i {
      color: #4d4d4d;
      background: transparent;
      font-size: 16px;
      cursor: default;
    }
  }

  .large-width {
    max-width: fill-available !important;
  }

  tr.on-play {
    background: linear-gradient(90deg,hsla(0,0%,94.9%,.1),#f2f2f2 17px);
    p {
      color: #72646f;
      font-weight: bold;
    }
    i {
      color: #72646f;
    }
  }

  .list-table {
    p {
      color: #1c1c1c;
    }
    i {
      color: #4d4d4d;
    }
    td {
      vertical-align: middle;
      .disabled ~ i, p {
        cursor: pointer;
      }
    }
    th {
      vertical-align: middle;
    }
    tr:hover {
      background: linear-gradient(90deg,hsla(0,0%,94.9%,.1),#f2f2f2 17px);
    }
    td:last-child {
      padding-right: 13px;
    }
    button {
      i {
        font-size: 16px;
      }
    }
    button:hover {
      i {
        font-size: 20px;
        color: #1c1c1c;
      }
    }
    button.border::after {
      background-image: none;
    }
  }
</style>
