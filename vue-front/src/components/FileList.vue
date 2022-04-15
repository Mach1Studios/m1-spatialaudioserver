<template>
  <div class="flex-item scroll">
    <!-- <div v-if="admin"></div> -->
    <table class="table-list flex-item">
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
              <Popup :active="active === item.id" :items="item" @mouseleave.stop="active = null" @click.stop="active = item.id"/>
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
  methods: { ...mapActions('tracks', ['reload', 'remove', 'select', 'update']) },
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
  }
  i {
    cursor: pointer;

    color: #4d4d4d;
    font-size: 16px;
  }
  .disabled {
    i {
      cursor: default;
    }
  }
  tr {
    width: inherit;
  }
  tr.on-play {
    background:linear-gradient(90deg,hsla(0,0%,100%,0%),#0000001f);
    p {
      color: #72646f;
      font-weight: bold;
    }
    i {
      color: #72646f;
    }
  }
  .table-list {
    display: block;
    overflow: hidden;
    width: 100%;
    tbody{
        width: 100%;
        display: table;
    }

    .audio-name {
      width: 100%;
      word-break: break-all;
    }
    p {
      color: #ffffff;
      text-align: justify;
    }
    td {
      border-bottom: 1px #212121 solid;
      .disabled ~ i, p {
        cursor: pointer;
      }
      &:last-child {
        padding-right: 13px;
      }
    }
    tr {
      vertical-align: middle;
    }
    tr:hover {
      background:linear-gradient(90deg,hsla(0,0%,100%,0%),#0000001f);
    }
    button {
      &:hover {
        i {
          font-size: 20px;
          color: #ffffff;
        }
      }
    }
    button.border::after {
      background-image: none;
    }
  }

  @media screen and (orientation: portrait) {
    #FileList {
      table.border td {
        border: none;
      }
      .table-list {
        .audio-name {
          width: 85%;
          word-break: keep-all;
        }
        td:not(:nth-child(3)){
          display: inline-table;
        }
        td{
          display: grid;
        }
      }
    }
  }
</style>
