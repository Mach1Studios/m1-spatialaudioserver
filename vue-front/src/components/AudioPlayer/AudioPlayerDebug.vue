<template>
  <details class="audio-player-debug">
    <div class="row no-margin">
      <div class="col s12 m6 l6">
        <StreamInfo/>
      </div>
      <div class="col s12 m6 l6">
        <Debug/>
      </div>
    </div>
    <summary>
      <p class="bold">DEBUG PLAYER<i class="material-icons-outlined white-text">expand_more</i></p>
    </summary>
  </details>
</template>
<script>
import { mapState, mapActions } from 'vuex';

import StreamInfo from '../StreamInfo.vue';
import Debug from '../Debug.vue';

export default {
  name: 'AudioPlayerDebug',
  components: {
    StreamInfo,
    Debug,
  },
  computed: { ...mapState({ items: (state) => state.logs.history }) },
  methods: { ...mapActions('logs', ['flush']) },
};
</script>
<style lang="scss" scoped>
  .audio-player-debug {
    margin-bottom: 0;
    padding-bottom: 0;
  }
  details, summary {
    color: #ffffff;
  }
  summary {
    list-style: none;
    margin-bottom: 0;
    p {
      font-size: var(--default-font-size);
      padding: 4rem 0 0 0;
    }
  }
  summary::-webkit-details-marker {
    display: none;
  }

  @media screen and (orientation: portrait) {
    .row {
      max-height: calc(100vh - 2 * var(--height) + 50px + 6em );
      height: auto;
    }
    .audio-player-debug {
      .row>.col {
        padding: 0;
      }
    }
  }

  // @media screen and (orientation: landscape) {
  //   .row {
  //     height: calc(100vh - var(--height) - 50px - 6em );
  //   }
  //   .debug {
  //     .row>.col {
  //       padding: 0;
  //     }
  //   }
  // }
</style>
