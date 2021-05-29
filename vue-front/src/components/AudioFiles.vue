<template lang="html">
  <table class="table is-striped is-narrow is-hoverable is-fullwidth">
    <thead>
      <tr>
        <th><abbr title="#">#</abbr></th>
        <th><abbr title="NAME">NAME</abbr></th>
        <th><abbr title="DURATION">DURATION</abbr></th>
        <th><abbr title="STATUS">STATUS</abbr></th>
        <!-- <th><abbr title="INFO">INFO</abbr></th> -->
        <!-- <th><abbr title="REMOVE"></abbr></th> -->
      </tr>
    </thead>
    <tbody>
      <!-- <tr>
        <th>
          <p>1</p>
        </th>
        <td>
          <p>Follow - In Death It Ends</p>
        </td>
        <td>
          <p>5:24</p>
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
      </tr> -->
      <tr v-for="item in items" :key="item" @click="select(item.name)">
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
        <!-- <td>
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
        </td> -->
      </tr>
    </tbody>
  </table>
</template>

<script>
import { mapState, mapActions } from 'vuex';

export default {
  name: 'AudioFiles',
  computed: mapState({
    tracks: (state) => state.tracks,
  }),
  data() {
    return {
      items: [
        { id: 1, name: 'test.wav', duration: 'repeat' },
        { id: 2, name: 'm1-debug-visual.wav', duration: 'repeat' },
        { id: 3, name: 'm1-debug-shrtpt-m1spatial.wav', duration: 'repeat' },
      ],
    };
  },
  methods: {
    ...mapActions('tracks', [
      // 'addProductToCart',
    ]),
    async select(name) {
      this.$store.dispatch('tracks/getAll');
      await fetch(`http://localhost:8080/play?sound=${name}`);
    },
    // async
  },
  created() {
    this.$store.dispatch('tracks/getAll');
  },
};
</script>

<style lang="css" scoped>
  abbr {
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
