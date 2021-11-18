<template>
  <div class="container no-padding no-margin">
    <div v-if="admin"></div>
    <table class="list-table border">
      <tbody>
        <tr v-for="(item, index) in items" :key="item" :class="{ 'on-play': track.id === item.id }" @click="play">
          <td>
            <p class="medium-text">{{ index + 1 }}</p>
          </td>
          <td @click="select(item.id)" class="audio-name">
            <p class="medium-text">{{item.name}}</p>
          </td>
          <td>
            <nav class="right-align">
              <button class="border round transparent-border" @mouseleave.stop="active = null" @click.stop="active = item.id">
                <i class="material-icons-outlined">info</i>
              </button>
              <div class="card dropdown round no-wrap medium-padding" :class="{ active: active === item.id}">
                <p class="info"><b>ID: </b>{{item.id}}</p>
                <p class="info"><b>CREATED: </b>{{item.created}}</p>
                <p class="info"><b>MIMETYPE: </b>{{item.mimetype}}</p>
                <p class="info"><b>NAME: </b>{{item.name}}</p>
                <p class="info"><b>ORIGINAL NAME: </b>{{item.originalname}}</p>
                <p class="info"><b>PREPARED: </b>{{item.prepared}}</p>
                <p class="info"><b>SIZE: </b>{{item.size}}</p>
                <p class="info"><b>UPDATED: </b>{{item.updated}}</p>
                <p class="info"><b>LISTENED: </b>1</p>
              </div>
              <!-- <div class="info popup"></div> -->
              <button class="border round transparent-border" @click="reload(item)">
                <i class="material-icons">cached</i>
              </button>
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
  data() {
    return { active: '' };
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
    ...mapActions('tracks', ['reload', 'remove', 'select', 'update']),
  },
};
</script>

<style lang="scss" scoped>
  i {
    color: #4d4d4d;
    cursor: pointer;
    font-size: 16px;
  }
  .disabled {
    i {
      cursor: default;
    }
  }
  .container > * {
    position: sticky;
    top: 20px;
    left: 0;
    bottom: 20px;
    right: 0;
    overflow-y: scroll;
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
    .audio-name {
      width: 30%;
      word-break: break-all;
    }
    p {
      color: #1c1c1c;
       text-align: justify;
    }
    td {
      .disabled ~ i, p {
        cursor: pointer;
      }
      &:last-child {
        padding-right: 13px;
      }
    }
    th {
      vertical-align: middle;
    }
    tr:hover {
      background: linear-gradient(90deg,hsla(0,0%,94.9%,.1),#f2f2f2 17px);
    }
    button {
      &:hover {
        i {
          font-size: 20px;
          color: #1c1c1c;
        }
      }
    }
    button.border::after {
      background-image: none;
    }
  }
  .info {
    border-bottom: 1px #dfdfdf dotted;
  }
</style>
