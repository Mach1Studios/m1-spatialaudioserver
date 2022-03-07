<template>
  <details class="debug">
    <div class="row no-margin">
      <div class="col s12 l6">
        <StreamInfo/>
      </div>
      <div class="col s12 l6">
        <Debug/>
      </div>
    </div>
    <summary>
      <p class="medium-text bold">DEBUG PLAYER<i class="material-icons-outlined white-text">expand_more</i></p>
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
  computed: {
    ...mapState({
      items: (state) => state.logs.history,
    }),
  },
  methods: {
    ...mapActions('logs', ['flush']),
  },
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
  }
  summary::-webkit-details-marker {
    display: none;
  }
</style>
