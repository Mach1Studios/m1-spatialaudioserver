<template>
  <div class="invite">
    <FormSelect name="" placeholder="" :options="unbindedItems" @change="addItem"/>
    <table class="list-table border">
      <tbody>
        <tr v-for="item in bindedItems" :key="item">
          <td>
            <p class="medium-text">{{item.number}}</p>
          </td>
          <td class="small-width">
            <p class="medium-text">{{item.name}}</p>
          </td>
          <td>
            <nav class="right-align">
              <button class="border round transparent-border"  @click="del(item.id)">
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

import FormSelect from './Form/Select.vue';

export default {
  name: 'PlaylistInviteForm',
  components: {
    FormSelect,
  },
  props: {
    playlist: Object,
    path: String,
    items: {
      type: Array,
    },
  },
  computed: {
    ...mapState({
      tracks: (state) => state.tracks.items,
    }),
    bindedItems() {
      return _.filter(this.items, ({ id }) => this.playlist[this.path].indexOf(id) !== -1);
    },
    unbindedItems() {
      return _.filter(this.items, ({ id }) => this.playlist[this.path].indexOf(id) === -1);
    },
  },
  data() {
    return {};
  },
  methods: {
    ...mapActions('playlists', ['addItemToPlaylist', 'removeItemFromPlaylist']),
    del(itemId) {
      this.removeItemFromPlaylist({ id: this.playlist.id, [this.path]: _.xor(this.playlist[this.path], [itemId]) });
    },
    addItem(event) {
      this.addItemToPlaylist({ id: this.playlist.id, [this.path]: _.union(this.playlist[this.path], [event.target.value]) });
    },
  },
};
</script>

<style lang="scss" scoped>
  .invite {
    .title {
      font-style: normal;
      font-weight: bold;

      line-height: 1.17;
      letter-spacing: -0.5px;
      text-transform: uppercase;
    }
    i {
      font-size: 16px;
      color: #4d4d4d;
    }
    input {
      &:focus {
        border-color: #1c1c1c;
      }
    }
    select{
      &:focus {
        border-bottom: 2rem solid #1c1c1c;
      }
    }
    span {
      color: #1c1c1c;
    }
    i {
      font-size: 16px;
      color: #4d4d4d;
    }
    button {
      width: 100%;
      padding: 0;
      margin: 16rem 0 16rem 0;
    }
  }
</style>
