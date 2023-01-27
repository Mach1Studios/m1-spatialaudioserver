<template>
  <FormSelect
    name=""
    placeholder=""
    class="playlist-select"
    select-skin="dark"
    :options="unbindedItems"
    @change="addItem"
  />
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

    &::-webkit-scrollbar-track {
      background-color: var(--secondary-highlight-color);
      border-radius: 3em;
    }

    &::-webkit-scrollbar {
      background-color: var(--secondary-highlight-color);
      width: 7px;
    }

    &::-webkit-scrollbar-thumb {
      background-color: var(--primary-color);
      border-radius: 3em;
    }
  }

  .invite {
    p {
      color: var(--secondary-highlight-color);
    }

    i {
      color: var(--primary-highlight-color);
      font-size: 16px;
    }

    button {
      margin: 16rem 0 16rem 0;
      padding: 0;

      width: 100%;

      &:hover {
        i {
          color: var(--secondary-highlight-color);
        }
      }
    }

    button:focus::after, button:hover::after {
      background: none;
    }

    .table-invite {
      padding-right: 16rem;

      td {
        border-bottom: 1px var(--additional-dark-color) solid;
      }
    }
  }
</style>
