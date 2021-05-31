<template lang="html">
  <div class="table-container is-flex is-flex-direction-column is-justify-content-space-between">
    <table class="table is-striped is-narrow is-hoverable is-fullwidth">
      <thead>
        <tr>
          <th><abbr title="#">#</abbr></th>
          <th><abbr title="NAME">NAME</abbr></th>
          <th><abbr title="DURATION">DURATION</abbr></th>
          <th><abbr title="STATUS">STATUS</abbr></th>
          <th><abbr title="INFO">INFO</abbr></th>
          <th><abbr title="REMOVE"></abbr></th>
        </tr>
      </thead>
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
            <button class="button is-medium table-button">
              <span class="icon is-large">
                <ion-icon name="happy-sharp"></ion-icon>
              </span>
            </button>
          </td>
          <td>
            <button class="button is-medium table-button">
              <span class="icon is-large">
                <ion-icon name="information-sharp"></ion-icon>
              </span>
            </button>
          </td>
          <td>
            <button class="button is-medium table-button">
              <span class="icon is-large">
                <ion-icon name="trash-sharp"></ion-icon>
              </span>
            </button>
          </td>
        </tr>
      </tbody>
    </table>
  </div>
</template>

<script>
import { mapState, mapActions } from 'vuex';

export default {
  name: 'AudioFiles',
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
  .table-button {
    background: transparent;
    border: none;
  }
</style>
