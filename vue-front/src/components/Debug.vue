<template>
  <div class="player-debug">
    <div class="row no-wrap header-debug">
      <div class="col max">
        <h4>PLAYER DEBUG</h4>
      </div>
      <div class="col min">
        <nav>
          <button class="transparent nav-btn middle-align">
            <i class="material-icons">file_download</i><span class="right-align bold upper">download</span>
          </button>
          <button class="transparent nav-btn middle-align" @click="flush">
            <i class="material-icons">cached</i><span class="right-align bold upper">clear all</span>
          </button>
        </nav>
      </div>
    </div>
    <div class="flex-item scroll">
      <div class="responsive" v-for="item in items" :key="item">
        <a :class="[item.type === 'info' ? 'info' : 'error']" class="chip upper small-chip">{{item.type}}</a>
        <a class="chip small-chip timestamp">{{item.timestamp}}</a>
        <div class="log">
          <details class="card transparent flat">
            <summary class="none">
              <div class="row no-wrap middle-align responsive">
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
</template>
<script>
import { mapState, mapActions } from 'vuex';

export default {
  name: 'AudioPlayerDebug',
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
    margin-top: 0;
    padding-top: 0;
    height: 35vh;
    &::-webkit-scrollbar-track
    {
      border-radius: 3em;
      background-color: #1d1d1e;
    }

    &::-webkit-scrollbar
    {
      width: 7px;
      background-color: #1d1d1e;
    }

    &::-webkit-scrollbar-thumb
    {
      border-radius: 3em;
      background-color: #858585;
    }
    scrollbar-color: #858585 #1d1d1e;
  }
  .player-debug {
    margin-bottom: 0;
    padding-bottom: 0;
    max-height: 40vh;
    h4 {
      font-size: 18rem;
      color: #ffffff;
    }
  }

  .scroll {
    overflow-y: scroll;
    overflow-x: hidden;
  }
  p {
    color: white;
  }
  .header-debug{
    height: 25rem;
    margin-bottom: 8rem;
    .col {
      height: inherit;

      nav {
        height: inherit;

        .button, button {
          height: inherit;
        }
      }
    }
  }
  .chip {
    height: 100%;
    min-height: inherit;
    background: transparent;
  }
  .small-chip {
    margin: 0 6rem 6rem 0;
    height: 20rem;
    background: #00000029;
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
    span {
      color: #a9a9a9;
      vertical-align: top;
      font-size: 14rem;
    }
    i {
      vertical-align: baseline;
      margin-right: 4rem;
      color: #a9a9a9;
      // font-size: 16px;
      font-size: 14rem;
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
    margin: 0 8rem 6rem 0;
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
    margin-bottom: 0;
  }
  summary::-webkit-details-marker {
    display: none;
  }

  /* SCSS for Large (lg) screen */
  @media only screen and (max-width: 992px) {
    body {
      overflow-y: scroll;
    }
  }

  /* SCSS for Medium (md) screen */
  @media only screen and (max-width: 800px) {
    body {
      overflow-y: scroll;
    }
  }

  /* SCSS for Medium (md) screen */
  @media only screen and (max-width: 768px) {
    body {
      overflow-y: scroll;
    }
  }

  /* SCSS for Medium (md) screen */
  @media only screen and (max-width: 600px) {
    body {
      overflow-y: scroll;
    }
  }

  /* SCSS for Extra Small (xs) screen */
  @media only screen and (max-width: 414px) {
    body {
      overflow-y: scroll;
    }
  }

  /* SCSS for Extra Small (xs) screen */
  @media only screen and (max-width: 394px) {
    body {
      overflow-y: scroll;
    }
  }

  /* SCSS for Extra Small (xs) screen */
  @media only screen and (max-width: 375px) {
    .nav-btn {
      margin-left: 0;
      margin-right: 0;
      padding-left: 0;
      padding-right: 0;
      // vertical-align: middle;
      span {
        display: none;
      }
      i {
        vertical-align: baseline;
      }
    }
    .row > .col{
      padding-left: 2rem;
      padding-right: 2rem;
    }
  }

  /* SCSS for Extra Small (xs) screen */
  @media only screen and (max-width: 360px) {
    body {
      overflow-y: scroll;
    }
  }

  /* SCSS for Extra Small (xs) screen */
  @media only screen and (max-width: 320px) {
    body {
      overflow-y: scroll;
    }
  }

  /* SCSS for Extra Small (md) & Landscap screen */
  @media only screen and (max-width: 823px) and (min-width:801px) {
    .nav-btn {
      margin-left: 0;
      margin-right: 0;
      padding-left: 0;
      padding-right: 0;
      // vertical-align: middle;
      span {
        display: none;
      }
      i {
        vertical-align: baseline;
      }
    }
    .row > .col{
      padding-left: 2rem;
      padding-right: 2rem;
    }
  }

  /* SCSS for Small (sm) & Landscap screen */
  @media only screen and (max-width: 667px) and (min-width:601px) {
    body {
      overflow-y: scroll;
    }
  }

  /* SCSS for Small (sm) & Landscap Mobile screen */
  @media only screen and (max-width: 568px){
    body {
      overflow-y: scroll;
    }
  }
</style>
