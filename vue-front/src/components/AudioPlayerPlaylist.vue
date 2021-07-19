<template lang="html">
  <div class="large-width list">
    <div class="left-align">
      <img src="../assets/noonpacific.jpg" class="circle extra">
    </div>
    <h4 class="left-align title">Playlist</h4>
    <table class="playlist-table border">
      <tbody>
        <tr v-for="item in tracks" :key="item" @click="select(item.id)">
          <td>
            <p>{{item.number}}</p>
          </td>
          <td class="small-width">
            <p>{{item.name}}</p>
          </td>
          <td>
            <nav class="right-align">
                <i class="small grey-dark-4-text material-icons-outlined">info</i>
                <i class="small grey-dark-4-text">mood</i>
                <!-- <i class="small grey-dark-4-text">mood_bad</i> -->
                <!-- <p>{{item.duration}}</p> -->
                <i class="small grey-dark-4-text">repeat</i>
                <i class="small grey-dark-4-text">play_circle</i>
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

<style lang="scss" scoped>
  .list .title {
    font-style: normal;
    font-weight: bold;
    font-size: 1rem;

    line-height: 1.17;
    letter-spacing: -0.5px;
    text-transform: uppercase;
  }

  .playlist-table td {
    vertical-align: middle;
    cursor: pointer;
  }

  .playlist-table th {
    vertical-align: middle;
  }

  .playlist-table {
    border-radius: 0.3rem;
  }

  .playlist-table tr:hover {
    background: linear-gradient(90deg,hsla(0,0%,94.9%,.1),#f2f2f2 17px);
  }

  .playlist-table td:last-child {
    padding-right: 10px;
  }
  .playlist-table td:last-child:hover {
    padding-right: 15px;
  }
</style>
