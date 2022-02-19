<template>
  <details class="debug">
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
  .debug {
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
    }
  }
  summary::-webkit-details-marker {
    display: none;
  }
  @media screen and (orientation: portrait) {
    .row {
      max-height: calc(100vh - 2 * var(--height) + 50px + 12em );
      height: auto;
    }
    .debug {
      .row>.col {
        padding: 0;
      }
    }
  }
  // @media only screen and (max-width: 375px) {
  //   .debug {
  //     .row>.col {
  //       padding: 0;
  //     }
  //   }
  // }
  // @media only screen and (max-width: 823px) and (min-width:801px) {
  //   .debug {
  //     .row>.col {
  //       padding: 0;
  //     }
  //   }
  // }
  // /* SCSS for Small (sm) & Landscap Mobile screen */
  // @media only screen and (max-width: 568px){
  //   .debug {
  //     .row>.col {
  //       padding: 0;
  //     }
  //   }
  // }
  // /* SCSS for Extra Small (md) & Landscap screen */
  // @media only screen and (max-width: 1080px) and (min-width:823px) {
  //   .debug {
  //     .row>.col {
  //       padding: 0;
  //     }
  //   }
  // }
</style>
