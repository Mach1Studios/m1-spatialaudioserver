<template>
  <FormSelect name="" placeholder="" select-skin="dark" :options="unbindedItems" @change="addItem" />
  <div class="invite flex-item scroll">
    <table class="table-invite flex-item">
      <tbody>
        <tr v-for="(item, index) in bindedItems" :key="item">
          <td>
            <p class="medium-text">{{ index + 1 }}</p>
          </td>
          <td class="small-width">
            <p class="medium-text">{{ item.name }}</p>
          </td>
          <td>
            <nav class="right-align">
              <button class="border transparent-border" @click="del(item.id)">
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
import { mapActions } from 'vuex';
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
  data() {
    return {};
  },
  computed: {
    bindedItems() {
      return _
        .chain(this.items)
        .filter(({ id }) => this.playlist[this.path].indexOf(id) !== -1)
        .map(({ id, name, email }) => ({ id, name: name || email }))
        .value();
    },
    unbindedItems() {
      return _
        .chain(this.items)
        .filter(({ id }) => this.playlist[this.path].indexOf(id) === -1)
        .map(({ id, name, email }) => ({ id, name: name || email }))
        .value();
    },
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
  .flex-item {
    overflow-x: hidden;

    &::-webkit-scrollbar-track
    {
      border-radius: 3em;
      background-color: #ffffff;
    }

    &::-webkit-scrollbar
    {
      width: 7px;
      background-color: #ffffff;
    }

    &::-webkit-scrollbar-thumb
    {
      border-radius: 3em;
      background-color: #858585;
    }
  }
  .invite {
    p {
      color: #ffffff;
    }
    i {
      font-size: 16px;
      color: #626161;
    }
    button {
      width: 100%;
      padding: 0;
      margin: 16rem 0 16rem 0;
      &:hover {
        i {
          color: #ffffff;
        }
      }
    }
    button:focus::after, button:hover::after {
      background: none;
    }
    .table-invite {
      padding-right: 16rem;
      td {
        border-bottom: 1px #212121 solid;
      }
    }
  }
</style>
