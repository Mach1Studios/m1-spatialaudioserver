<template>
  <details class="debug">
    <div class="row">
      <div class="col s6">
        <StreamInfo/>
      </div>
      <div class="col s6">
        <div class="row no-wrap">
          <div class="col max">
            <p class="white-text">PLAYER DEBUG</p>
          </div>
          <div class="col min">
            <nav>
              <button class="responsive transparent space nav-btn">
                <p class="right-align bold upper small-text"><i class="material-icons">file_download</i>download</p>
              </button>
              <button class="responsive transparent space nav-btn" @click="flush">
                <p class="right-align bold upper small-text"><i class="material-icons">cached</i>clear all</p>
              </button>
            </nav>
          </div>
        </div>
        <div class="flex-item scroll">
          <div class="responsive row no-margin" v-for="item in items" :key="item">
            <a :class="[item.type === 'info' ? 'info' : 'error']" class="chip upper small-chip">{{item.type}}</a>
            <a class="chip small-chip timestamp">{{item.timestamp}}</a>
            <div class="log">
              <details class="card transparent flat">
                <summary class="none">
                  <div class="row no-wrap middle-align">
                    <div class="col">
                      <a class="chip responsive left-align small-padding">
                        <i :class="[item.type === 'info' ? 'info' : 'error']" class="material-icons">arrow_right_alt</i><p class="message">{{item.message}}</p>
                      </a>
                    </div>
                    <div class="col min" v-if="item.data">
                      <i class="material-icons">more_vert</i>
                    </div>
                  </div>
                </summary>
                <p class="data">{{item.data}}</p>
              </details>
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
import { mapState, mapActions } from 'vuex';

import StreamInfo from '../StreamInfo.vue';

export default {
  name: 'AudioPlayerDebug',
  components: {
    StreamInfo,
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
    margin-top: 4rem;
    margin-right: 6rem;
    margin-left: 0;
    padding-left: 0;
    height: 100%;
    min-height: inherit;
    background: transparent;
  }
  .small-chip {
    height: 20rem;
    background: transparent;
  }
  .timestamp {
    color: #625B71;
    font-weight: bold;
  }
  .chip::after{
    background-image: none;
  }
  .scroll {
    overflow-x: hidden;
  }
  .message {
    font-family: 'Courier Prime', monospace;
    color: #a9a9a9;
    width: 95%;
    word-break: break-all;
  }
  .info {
    color: #cddc39;
  }
  .error {
    color: red;
  }
  .nav-btn {
    margin-top: 0;
    p {
      color: #a9a9a9;
    }
    i {
      margin-right: 4rem;
      color: #a9a9a9;
      font-size: 16px;
    }
  }
  button{
    &:after {
      background-image: none;
    }
  }
  .log {
    background-color: #252526;
    border-radius: 6rem;
    margin-right: 8rem;
  }
  details {
    .card {
      margin-left: 0;
      padding: 0rem;
      border-radius: 6rem;
      margin-top: 0;
    }
  }
  .data {
    font-family: 'Courier Prime', monospace;
    color: #eaeaea;
    margin-left: 8rem;
    padding-bottom: 8rem;
  }
  .download {
    margin: 0;
    font-size: 18px;
    color: #a9a9a9;
  }
  details, summary {
    color: #ffffff;
  }
  summary {
    list-style: none;
  }
  summary::-webkit-details-marker {
    display: none;
  }
</style>
