<template>
  <div class="debug">
    <div class="row no-wrap debug-header responsive">
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
          <details class="card transparent flat" @click.prevent :open="details === item.id">
            <summary class="none">
              <div class="row no-wrap middle-align">
                <div class="col max">
                  <a class="chip responsive left-align small-padding">
                    <i :class="[item.type === 'info' ? 'info' : 'error']" class="material-icons">arrow_right_alt</i><p class="message">{{item.message}}</p>
                  </a>
                </div>
                <div class="col min" v-if="item.data" @click="open(item.id)">
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
  data() {
    return { details: null };
  },
  computed: { ...mapState({ items: (state) => state.logs.history }) },
  methods: {
    ...mapActions('logs', ['flush']),
    open(id) {
      this.details = this.details ? null : id;
    },
  },
};
</script>
<style lang="scss" scoped>
  @import url('https://fonts.googleapis.com/css2?family=Courier+Prime&display=swap');
  .flex-item {
    margin-top: 0;
    padding-top: 0;
    max-height: 35vh;
    height: auto;

    scrollbar-color: #858585 #323237;
    scrollbar-width: thin;

    &::-webkit-scrollbar-track
    {
      border-radius: 3rem;
      background-color: #323237;
    }
    &::-webkit-scrollbar
    {
      width: 5rem;
      border-radius: 3rem;
      background-color: #323237;
    }
    &::-webkit-scrollbar-thumb
    {
      border-radius: 3em;
      background-color: #858585;
    }
  }
  .debug {
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
  .debug-header {
    height: 25rem;
    margin: 0 0 8rem 0;
    .col {
      height: inherit;
      padding-left: 0;

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
  }
  .small-chip {
    margin: 1rem 6rem 6rem 6rem;
    height: 20rem;
    box-shadow: var(--shadow-1);
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
    color: #eaeaea;
    width: 100%;
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
      color: #ffffff;
      vertical-align: top;
      font-size: 14rem;
    }
    i {
      vertical-align: baseline;
      margin-right: 4rem;
      color: #ffffff;
      font-size: 18rem;
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

    .chip {
      background: transparent;
    }
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
    padding: 0 0 8rem 35rem;
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
  @media screen and (orientation: portrait) {
    .nav-btn {
      margin-left: 0;
      margin-right: 0;
      padding-left: 0;
      span {
        display: none;
      }
      i {
        vertical-align: baseline;
        color: #ffffff;
        font-size: 18rem;
      }
    }
    .debug-header {
      padding: 10rem 0 10rem 0;
    }
    .flex-item {
      max-height: calc((100vh - 2 * var(--height) + 50px - 12em - 20rem) / 2 );
      height: auto;
    }
  }
  // @media screen and (orientation: landscape) {
  //   .player-debug {
  //     padding-bottom: 10rem;
  //   }
  //   .nav-btn {
  //     margin-left: 0;
  //     margin-right: 0;
  //     padding-left: 0;
  //     span {
  //       display: none;
  //     }
  //     i {
  //       vertical-align: baseline;
  //       color: #ffffff;
  //       font-size: 18rem;
  //     }
  //   }
  //   .header-debug {
  //     padding: 0 0 10rem 0;
  //   }
  //   .flex-item {
  //     max-height: calc(100vh - 2 * var(--height) - 50px - 6em);
  //     height: auto;
  //   }
  // }
</style>
