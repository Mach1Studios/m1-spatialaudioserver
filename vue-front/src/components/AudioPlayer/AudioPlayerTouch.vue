<template>
  <div id="main">
    <div id="touchstats">
      <div class="background-img">
        <img id="touchstats:back" src="../../assets/touch-compass.svg">
      </div>
      <div class="cardBottom">
        <div id="touchstats:card" class="card touch">
          <div class="txt">
            FRONT
          </div>
        </div>
      </div>
    </div>
  </div>
</template>
<script>
import { mapState, mapActions } from 'vuex';

export default {
  name: 'AudioPlayerTouch',
  computed: mapState({
    tracks: (state) => state.controls.items,
  }),
  methods: {
    ...mapActions('controls', [
      'select',
    ]),
  },
};
</script>
<style lang="scss" scoped>
  #main {
    max-height: 90vh;
  }

  #touchstats {
    height: auto;
    max-height: calc(100vh - 10vh - var(--height) - 3em);

    position: fixed;
    left: 50%;
    top: 50%;

    margin: 0;
    transform: translate(-50%,-50%);
  }

  .background-img img {
    height: auto;
    opacity: 0.6;
    max-height: calc(100vh - 10vh - 2 * var(--height) - 3em);
  }

  .cardBottom {
    top: 50%;
    left: 50%;
    position: absolute;

    height: 22.857em;
    width: 34.286em;

    transform: translate(-50%, -50%);

    perspective: 1000px;
    transition: 0.4s;

    .card {
      top: 50%;
      left: 50%;
      position: absolute;

      height: 100%;
      width: 100%;

      margin: 0 auto;
      transform-origin: center center;
      transform: translate(-50%, -50%);

      border: 10px solid var(--additional);
      transition: 0.2s;
    }

    .touch {
      background-color: var(--secondary-highlight-color);
    }

    .card .txt {
      top: 50%;
      left: 50%;
      position: absolute;

      padding: 10px;
      transform: translate(-50%, -50%);

      border: 3px solid;
      color: var(--additional);

      font-size: 40px;
      text-align: center;
    }
  }
  @media screen and (orientation: portrait) {
    #touchstats {
      height: auto;
      width: 95vw;
    }

    .background-img img {
      height: auto;
      width: 95vw;
    }

    .cardBottom {
      height: calc(((100vh - 2 * var(--height) - 3em) * 2 ) / 3);
      width: calc(100vh - 2 * var(--height) - 3em);

      .card {
        height: 45%;
        width: 45%;
      }

      .card .txt {
        font-size: 20px;
      }
    }
  }
</style>
