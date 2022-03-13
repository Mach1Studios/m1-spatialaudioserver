<template>
  <div id="main">
    <div id="touchstats">
      <div class="background-img">
        <img id="touchstats:back" src="../../assets/touch-compass.svg"/>
      </div>
      <div class="cardBottom">
        <div id="touchstats:card" class="card touch">
          <div class="txt">FRONT</div>
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
    position: fixed;

    left: 50%;
    top: 50%;
    max-height: calc(100vh - var(--height) - 3em);
    height: auto;

    margin: 0;

    transform: translate(-50%,-50%);
  }

  .background-img img {
    max-height: calc(100vh - 2 * var(--height) - 3em);
    height: auto;

    opacity: 0.6;
  }

  .cardBottom {
    position: absolute;

    left: 50%;
    top: 50%;
    height: 22.857em;
    width: 34.286em;

    transform: translate(-50%, -50%);

    transition: 0.4s;
    perspective: 1000px;
    .card {
      position: absolute;

      left: 50%;
      top: 50%;
      height: 100%;
      width: 100%;

      margin: 0 auto;
      transform-origin: center center;
      transform: translate(-50%, -50%);

      transition: 0.2s;
      border: 10px solid #000;
    }
    .touch {
      background-color: white;
    }
    .card .txt {
      position: absolute;

      left: 50%;
      top: 50%;

      transform: translate(-50%, -50%);
      padding: 10px;

      color: #000;
      border: 3px solid;

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
