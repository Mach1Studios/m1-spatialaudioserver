<template lang="html">
  <div class="padding margin">
    <div class="left-align">
      <img src="../assets/sound-waves.svg" class="circle extra">
    </div>
    <div class="list">
      <h4 class="left-align title">Playlist</h4>
      <table class="table border large">
        <!-- <thead>
          <tr>
            <th><abbr title="#">#</abbr></th>
            <th><abbr title="NAME">NAME</abbr></th>
            <th><abbr title="DURATION">DURATION</abbr></th>
            <th><abbr title="STATUS">STATUS</abbr></th>
            <th><abbr title="INFO">INFO</abbr></th>
            <th v-if="admin"><abbr title="REMOVE"></abbr></th>
          </tr>
        </thead> -->
        <tbody>
          <tr v-for="item in tracks" :key="item" @click="select(item.name)">
            <td>
              <p>{{item.id}}</p>
            </td>
            <td>
              <p>{{item.name}}</p>
            </td>
            <td>
              <p>{{item.duration}}</p>
            </td>
            <td>
              <i class="grey-dark-4-text">mood</i>
            </td>
            <td>
              <i class="grey-dark-4-text">mood_bad</i>
            </td>
          </tr>
        </tbody>
      </table>
    </div>
  </div>
</template>

<script>
import { mapState, mapActions } from 'vuex';

export default {
  name: 'AudioPlayerPlaylist',
  props: { admin: Boolean },
  // data() {
  //   return { admin: false };
  // },
  computed: mapState({
    tracks: (state) => state.tracks.items,
  }),
  methods: {
    ...mapActions('tracks', [
      'select',
    ]),
  },
  created() {
    this.$store.dispatch('tracks/getAll');
  },
};
</script>

<style lang="css" scoped>
  .list .title {
    font-style: normal;
    font-weight: bold;
    font-size: 1rem;
    line-height: 1.17;
    letter-spacing: -0.5px;
    text-transform: uppercase;
  }
  .table abbr {
    font-style: normal;
    font-weight: bold;
    font-size: 1rem;
    line-height: 1.17;
    letter-spacing: -0.5px;
    width: 100%;
  }
  .table td {
    vertical-align: middle;
    cursor: pointer;
  }
  .table th {
    vertical-align: middle;
  }
  .table {
    border-radius: 0.3rem;
  }
</style>
