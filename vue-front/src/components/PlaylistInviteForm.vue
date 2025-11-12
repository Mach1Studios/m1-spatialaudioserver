<template>
  <div class="flex-item scroll">
    <table class="table-list flex-item">
      <tbody>
        <tr v-for="(item, index) in unbindedItems" :key="item.id">
          <td>
            <p class="audio-number medium-text">{{ index + 1 }}</p>
          </td>
          <td class="audio-name">
            <p class="medium-text">{{ item.name }}</p>
          </td>
          <td>
            <nav>
              <button class="border round transparent-border" @click="addItem(item.id)">
                <i class="material-icons">add</i>
              </button>
            </nav>
          </td>
        </tr>
        <tr v-if="unbindedItems.length === 0">
          <td colspan="3" class="no-tracks">
            <p class="medium-text">All available tracks have been added to this playlist.</p>
          </td>
        </tr>
      </tbody>
    </table>
  </div>
</template>

<script>
import { mapActions } from 'vuex';
import _ from 'lodash';

export default {
  name: 'PlaylistInviteForm',
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
    unbindedItems() {
      return _
        .chain(this.items)
        .filter(({ id }) => this.playlist[this.path].indexOf(id) === -1)
        .map(({ id, name, email }) => ({ id, name: name || email }))
        .value();
    },
  },
  methods: {
    ...mapActions('playlists', ['addItemToPlaylist']),
    addItem(itemId) {
      this.addItemToPlaylist({ id: this.playlist.id, [this.path]: _.union(this.playlist[this.path], [itemId]) });
    },
  },
};
</script>

<style lang="scss" scoped>
  .flex-item.scroll {
    overflow-x: hidden;
    overflow-y: auto;
    scrollbar-color: var(--primary-color);

    &::-webkit-scrollbar-track {
      background-color: var(--secondary-color);
      border-radius: 0;
    }

    &::-webkit-scrollbar {
      background-color: var(--secondary-color);
      border-radius: 0;

      width: 5rem;
    }

    &::-webkit-scrollbar-thumb {
      background-color: var(--primary-color);
      border-radius: 0;
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

    .audio-number {
      cursor: pointer;
    }

    .audio-name {
      width: 100%;
      word-break: break-all;
      cursor: pointer;
    }

    p {
      color: var(--secondary-highlight-color);
      text-align: justify;
    }

    td {
      border-bottom: 1px var(--additional-dark-color) solid;

      &:last-child {
        padding-left: 0;
        padding-right: 13px;
      }

      &.no-tracks {
        text-align: center;
        padding: 20px;
      }
    }

    tr {
      vertical-align: middle;
      width: inherit;
    }

    tr:hover {
      background: linear-gradient(90deg,hsla(0,0%,100%,0%),#0000001f);
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
    .table-list {
      .audio-name {
        width: 85%;
        word-break: keep-all;
      }

      td {
        border: none;
        display: grid;

        &:last-child {
          padding-left: 8rem;
        }
      }

      td:not(:nth-child(3)) {
        display: inline-table;
      }
    }

    nav>:not(.dropdown,.badge) {
      padding-right: 8rem;
    }
  }
</style>
