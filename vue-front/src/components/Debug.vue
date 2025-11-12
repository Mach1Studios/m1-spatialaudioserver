<template>
  <div class="debug">
    <div class="grid no-wrap debug-header">
      <div class="col max">
        <h4>PLAYER DEBUG</h4>
      </div>
      <div class="col absolute right">
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
      <div v-for="item in items" :key="item">
        <div class="grid row">
          <div class="col">
            <p :class="[item.type === 'info' ? 'info-chip' : 'error-chip']" class="small-chip">{{ item.type }}</p>
          </div>
          <div class="col">
            <p class="small-chip timestamp">{{ item.timestamp }}</p>
          </div>
        </div>
        <div class="log">
          <details :open="details === item.id" @click.prevent>
            <summary class="none">
              <div class="grid row no-wrap middle-align">
                <div class="col max">
                  <a class="chip responsive left-align small-padding">
                    <i :class="[item.type === 'info' ? 'info-chip' : 'error-chip']" class="material-icons small">arrow_right_alt</i><p class="message">{{ item.message }}</p>
                  </a>
                </div>
                <div v-if="item.data" class="col min" @click="open(item.id)">
                  <i class="material-icons">more_vert</i>
                </div>
              </div>
            </summary>
            <p class="data left-align">{{ item.data }}</p>
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
    height: auto;
    max-height: 35vh;

    margin-top: 0;
    padding-top: 0;

    scrollbar-color: var(--primary-color) var(--secondary-color);
    scrollbar-width: thin;

    &::-webkit-scrollbar-track {
      background-color: var(--secondary-color);
      border-radius: 0;
    }

    &::-webkit-scrollbar {
      background-color: var(--secondary-color);
      border-radius: 0;
      width: 5rem;
    }

    &::-webkit-scrollbar-thumb {
      background-color: var(--primary-color);
      border-radius: 0;
    }
  }

  .debug {
    max-height: 40vh;

    margin-bottom: 0;
    padding-bottom: 0;

    h4 {
      color: var(--secondary-highlight-color);
      font-size: 18rem;
    }
  }

  .scroll {
    overflow-x: hidden;
    overflow-y: scroll;
  }

  p {
    color: white;
  }

  button{
    &:after {
      background-image: none;
    }
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
    background: transparent;
    box-shadow: var(--shadow-3);

    height: 20rem;
    text-transform: uppercase;
    margin: 1rem 6rem 6rem 6rem;
  }

  .timestamp {
    color: #625B71;
    font-weight: bold;
  }

  .chip::after{
    background-image: none;
  }

  .message {
    color: var(--secondary-light-color);

    font-family: 'Courier Prime', monospace;
    word-break: break-all;

    width: 100%;
  }

  .info-chip {
    color: var(--secondary-accent-color);
  }

  .error-chip {
    color: #ff0000;
  }

  .nav-btn {
    margin-top: 0;

    span {
      color: var(--additional-light-color);
      font-size: 14rem;
      vertical-align: top;
    }

    i {
      color: var(--additional-light-color);
      font-size: 18rem;

      margin-right: 4rem;
      vertical-align: baseline;
    }
  }

  .log {
    background-color: #19191a;

    border-radius: 0;
    margin: 0 8rem 6rem 0;

    .chip {
      background: transparent;
    }
  }

  .data {
    color: var(--secondary-light-color);
    font-family: 'Courier Prime', monospace;

    padding: 0 0 8rem 35rem;
  }

  details, summary {
    color: var(--secondary-highlight-color);
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
        color: var(--additional-light-color);
        font-size: 18rem;

        vertical-align: baseline;
      }
    }

    .debug-header {
      padding: 10rem 0 10rem 0;
    }

    .flex-item {
      height: auto;
      max-height: calc((100vh - 2 * var(--height) + 50px - 12em - 20rem) / 2 );
    }
  }
</style>
