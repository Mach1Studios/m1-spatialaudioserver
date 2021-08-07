<template lang="html">
  <div class="large-width">
    <div v-if="admin" class="list"></div>
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
              <button class="border round transparent-border black-text">
                <i class="material-icons-outlined">info</i>
              </button>
              <button class="border round transparent-border black-text">
                <i>mood</i>
              </button>
                <!-- <i class="small grey-dark-4-text">mood_bad</i> -->
              <button class="border round transparent-border black-text">
                <i>repeat</i>
              </button>
              <button class="border round transparent-border black-text">
                <i>play_circle</i>
              </button>
              <button v-if="admin" class="border round transparent-border black-text" @click="remove(item.id)">
                <i>delete</i>
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
  .list-table td {
    vertical-align: middle;
    cursor: pointer;
  }

  .list-table th {
    vertical-align: middle;
  }

  .list {
    margin-top: -32px;
  }

  .list-table {
    border-radius: 0.3rem;
    margin-top: 32px;
  }

  .list-table tr:hover {
    background: linear-gradient(90deg,hsla(0,0%,94.9%,.1),#f2f2f2 17px);
  }

  .list-table td:last-child {
    padding-right: 13px;
  }
  .list-table button {
    i {
      font-size: 16px;
    }
  }
  .list-table button:hover {
    i {
      font-size: 20px;
    }
  }
</style>
