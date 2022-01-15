<template>
  <details class="debug">
    <div class="row">
      <div class="col s6">
        <StreamInfo/>
      </div>
      <div class="col s6 scroll">
        <p class="white-text">PLAYER DEBUG</p>

        <div class="" v-for="item in items" :key="item">
          <div class="responsive row info">
            <a class="chip upper lime-text">{{item.type}}</a>
            <a class="chip">{{item.timestamp}}</a>
            <div class="">
              <a class="chip responsive left-align message"><i class="material-icons lime-text">arrow_right_alt</i>{{item.message}}</a>
            </div>
          </div>
        </div>
      </div>
    </div>
    <summary class="medium-text">
      DEBUG PLAYER
      <i class="material-icons-outlined white-text">expand_more</i>
    </summary>
  </details>
</template>
<script>
/* eslint-disable */

import { mapState, mapActions } from 'vuex';

import StreamInfo from '../StreamInfo.vue';

export default {
  name: 'AudioPlayerDebug',
  components: {
    StreamInfo,
  },
  computed: mapState({
    items: (state) => state.logs.history,
  }),
};
</script>
<style lang="scss" scoped>
  .debug {
    margin-bottom: 0;
    padding-bottom: 0;
  }
  p {
    color: white;
  }
  .info {
    background-color: #625B71;
    border-radius: 1em;
  }
  .chip {
    margin: 4rem;
    height: 20rem;
    min-height: 30rem;

  }
  .message {
    background-color: #252526;
    color: #ffffff;
  }
  .chip::after{
    content: "";
    background-image: none;
  }
</style>
