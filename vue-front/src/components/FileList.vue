<template lang="html">
  <div class="large-width">
    <div v-if="admin"></div>
    <table class="list-table border">
      <tbody>
        <tr v-for="item in tracks" :key="item">
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
              </button>
              <button v-if="admin" class="border round transparent-border">
                <i class="material-icons">edit</i>
              </button>
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

export default {
  name: 'FileList',
  props: { admin: Boolean, user: Boolean },

  computed: mapState({
    tracks: (state) => state.tracks.items,
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

  #Playlist {
    .list-table {
      margin-left: 13px;
    }
  }
</style>
