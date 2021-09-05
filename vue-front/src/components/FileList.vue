<template>
  <div class="large-width">
    <div v-if="admin"></div>
    <table class="list-table border">
      <tbody>
        <tr v-for="item in tracks" :key="item" :class="{ 'on-play': track.id === item.id }" @click="play">
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
              </button>
              <span class="disabled">
                <i class="material-icons">mood</i>
                <!-- <i class="small grey-dark-4-text">mood_bad</i> -->
              </span>
              <button class="border round transparent-border">
                <i class="material-icons">repeat</i>
                <!-- <i class="material-icons">keyboard_return</i> -->
              </button>
              <Modal
                icon="edit"
                position="center"
                padding="no-padding"
              >
              <PlaylistTrackEditForm/>
              </Modal>
              <!-- <button v-if="admin" class="border round transparent-border">
                <i class="material-icons">edit</i>
              </button> -->
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
import Modal from './Modal.vue';
import PlaylistTrackEditForm from './PlaylistTrackEditForm.vue';

export default {
  name: 'FileList',
  components: {
    Modal,
    PlaylistTrackEditForm,
  },
  props: { admin: Boolean, user: Boolean },

  computed: mapState({
    tracks: (state) => state.tracks.items,
    track: (state) => state.tracks.track,
  }),
  methods: {
    ...mapActions('tracks', [
      'select', 'remove',
    ]),
  },
  created() {
    this.$store.dispatch('tracks/getAll');
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
  tr.on-play {
    // box-shadow: inset 1.1em 0 0 0 #b0b0b0;
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
      }
    }
  }
  #Playlist table {
    margin-left: 13px;
  }
</style>
