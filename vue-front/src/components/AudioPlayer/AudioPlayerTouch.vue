<template>
  <div id="main">
    <div id="touchstats" style="">
      <div class="background">
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
    position:fixed;

    left:50%;
    top:50%;
    height:auto;
    width:50vw;

    margin:0;
    transform:translate(-50%,-50%);
  }

  .background img {
    height: auto;
    width: 40vw;

    opacity: 0.6;
  }

  .cardBottom {
    position: absolute;

    left: 50%;
    top: 50%;
    height: 320px;
    width: 480px;

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
</style>
