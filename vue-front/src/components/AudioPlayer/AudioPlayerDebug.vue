<template>
  <details class="debug">
    <div class="row">
      <div class="col s6">
        <StreamInfo/>
      </div>
      <div class="col s6">
        <p class="white-text">PLAYER DEBUG</p>
        <div class="flex-item scroll">
          <div class="small-margin" v-for="item in items" :key="item">
            <div class="responsive row">
              <a class="chip upper info small-chip">{{item.type}}</a>
              <a class="chip small-chip timestamp">{{item.timestamp}}</a>
              <div class="">
                <a class="chip responsive left-align message small-padding"><i class="material-icons info">arrow_right_alt</i><p class="message-info">{{item.message}}</p></a>
              </div>
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
  @import url('https://fonts.googleapis.com/css2?family=Courier+Prime&display=swap');
  .flex-item {
    height: 35vh;
    &::-webkit-scrollbar-track
    {
      border-radius: 3em;
      background-color: #323237;
    }

    &::-webkit-scrollbar
    {
      width: 7px;
      background-color: #323237;
    }

    &::-webkit-scrollbar-thumb
    {
      border-radius: 3em;
      height: 7em;
      background-color: #858585;
    }
  }
  .debug {
    margin-bottom: 0;
    padding-bottom: 0;
    max-height: 40vh;
  }
  .scroll {
    overflow-y: scroll;
    overflow-x: hidden;
  }
  p {
    color: white;
  }
  .chip {
    margin: 4rem;
    height: 100%;
    min-height: inherit;
  }
  .small-chip {
    height: 20rem;
  }
  .timestamp {
    color: #625B71;
    font-weight: bold;
  }
  .message {
    background-color: #252526;
  }
  .chip::after{
    background-image: none;
  }
  .scroll {
    overflow-x: hidden;
  }
  .message-info {
    font-family: 'Courier Prime', monospace;
    color: #d4d4d4;
    width: 95%;
    word-break: break-all;
  }
  .info {
    color: #cddc39;
  }
  .error {
    color: red;
  }
</style>
