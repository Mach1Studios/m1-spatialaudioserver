<template>
  <div class="overlay dark" :class="{ active: isActive }">
    <div class="audio-player-overlay" />
  </div>
  <details class="audio-player-debug" @toggle="open">
    <div class="row no-margin">
      <div class="col s12 m6 l6">
        <StreamInfo />
      </div>
      <div class="col s12 m6 l6">
        <Debug />
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
  data() {
    return { isActive: false };
  },
  computed: { ...mapState({ items: (state) => state.logs.history }) },
  methods: {
    ...mapActions('logs', ['flush']),
    open() {
      this.isActive = !this.isActive;
    },
  },
};
</script>
<style lang="scss" scoped>
  .audio-player-debug {
    margin-bottom: 0;
    padding-bottom: 0;

    z-index: 101;
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

  .audio-player-overlay {
    background: #1c1c1cb5;
    height: 100vh;
    width: 100vw;

    left: 0;
    position: fixed;
    top: 0;

    filter: contrast(5) blur(10px);
  }
  @media screen and (orientation: portrait) {
    .row {
      height: auto;
      max-height: calc(100vh - 2 * var(--height) + 50px + 6em );
    }

    .audio-player-debug {
      .row>.col {
        padding: 0;
      }
    }
  }
</style>
