<template>
  <div id="main">
    <div id="touchstats" style="margin:0;position:fixed;top:50%;left:50%;transform:translate(-50%,-50%);width:50vw;height:auto;">
      <div class="background">
        <img id="touchstats:back" src="https://demo.mach1.tech/img/touch-compass.svg"/>
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

  .background img {
    width: 40vw;
    height: auto;

    opacity: 0.6;
  }

  .cardBottom {
    width: 480px;
    height: 320px;
    position: absolute;

    top: 50%;
    left: 50%;
    transform: translate(-50%, -50%);

    transition: 0.4s;
    perspective: 1000px;
    .card {
      width: 100%;
      height: 100%;
      position: absolute;

      top: 50%;
      left: 50%;
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
      top: 50%;
      left: 50%;

      transform: translate(-50%, -50%);
      padding: 10px;

      color: #000;
      border: 3px solid;

      font-size: 40px;
      text-align: center;
    }
  }
</style>
