<template>
  <div class="overlay active dark" v-show="isLoading">
    <div class="preloader">
      <div class="ball ball-1"></div>
      <div class="ball ball-2"></div>
      <div class="ball ball-3"></div>
    </div>
    <!-- <div class="preloader">

      <div class="waveContainer">
         <div class="wave wave1"></div>
         <div class="wave wave2"></div>
         <div class="wave wave3"></div>
         <div class="wave wave4"></div>
         <div class="wave wave5"></div>
      </div>
    </div> -->
    <p class="load-title">{{title}}...</p>
    <p class="load-description small-text">{{description}}</p>
  </div>
</template>
<script>
export default {
  name: 'Preloader',
  props: {
    title: String,
    description: String,
    isLoading: Boolean,
  },
};
</script>
<style lang="scss" scoped>
  .preloader {
    position: fixed;
    width: 100vw;
    height: 100vh;

    top: 0;
    left: 0;

    background: #1c1c1cb5;
    z-index: 500;
    filter: blur(10px) contrast(5);
    // filter: blur(2px) contrast(5);
  }

  .load-title {
    position: absolute;
    width: 100%;

    top: 60%;
    left: 0;

    z-index: 500;

    color: #fff7eb;
    font-size: 16px;
    font-weight: 600;
    line-height: 1.125;
    text-transform: uppercase;
  }

  .load-description {
    position: absolute;
    width: 100%;

    top: 63%;
    left: 0;

    z-index: 500;

    color: #fff7eb;
    font-weight: 200;
    text-transform: uppercase;
  }

  .ball {
    position: absolute;
    width: 120px;
    height: 120px;

    top: 50%;
    left: 50%;
    margin-left: 40px;

    transform: translate(-50%, -50%) rotate(0deg);
    transform-origin: 66px center;
  }

  .ball:before {
    content: '';
    position: absolute;
    width: 68px;
    height: 68px;

    top: 50%;
    left: -10px;

    background: #eeef5d;

    transform: translateY(-50%);
    border-radius: 100%;
  }

  .ball-1 {
    margin-left: -50px;
  }

  .ball-2 {
    margin-left: 25px;
    transform: translateY(-50%) rotate(180deg);
    margin-left: -100px;
    animation: rotate-1 1.7s linear infinite;

    z-index: 2;
  }

  @keyframes rotate-1 {
    0% {
      margin-left: -18px;
      transform: translateY(-50%) rotate(0deg);
      transform-origin: 66px center;
    }
    25% {
      margin-left: -25px;
      transform: translateY(-50%) rotate(-180deg);
      transform-origin: 66px center;
    }
    50% {
      margin-left: -33px;
      transform: translateY(-50%) rotate(-360deg);
      transform-origin: 66px center;
    }
    50.1% {
      transform-origin: -12px center;
    }
    75% {
      margin-left: -36px;
      transform: translateY(-50%) rotate(-180deg);
      transform-origin: -12px center;
    }
    75.01 {
      margin-left: -66px;
      transform: translateY(-50%) rotate(-180deg);
      transform-origin: -12px center;
    }
    100% {
      margin-left: -18px;
      transform: translateY(-50%) rotate(0deg);
      transform-origin: -12px center;
    }
  }

  .ball-3 {
    margin-left: 120px;
  }

  // @keyframes quiet {
  //   25%{
  //     transform: scaleY(.6);
  //   }
  //   50%{
  //     transform: scaleY(.4);
  //   }
  //   75%{
  //     transform: scaleY(.8);
  //   }
  // }
  //
  // @keyframes normal {
  //   25%{
  //     transform: scaleY(1);
  //   }
  //   50%{
  //     transform: scaleY(.4);
  //   }
  //   75%{
  //     transform: scaleY(.6);
  //   }
  // }
  //
  // @keyframes loud {
  //   25%{
  //     transform: scaleY(1);
  //   }
  //   50%{
  //     transform: scaleY(.4);
  //   }
  //   75%{
  //     transform: scaleY(1.2);
  //   }
  // }
  //
  // .waveContainer {
  //   display: flex;
  //   position: absolute;
  //   width: 10%;
  //
  //   top: 35%;
  //   left: 45%;
  //   right: 45%;
  //
  //   z-index: 500;
  //
  //   // width: calc((var(--boxSize) + var(--gutter)) * 5);
  //   height: 25vh;
  //
  //   justify-content: space-between;
  //   // --boxSize: 2px;
  //   // --gutter: 2px;
  // }
  //
  // .wave {
  //   height: 100%;
  //   width: 20rem;
  //
  //   transform: scaleY(.4);
  //
  //   background: #fff7eb;
  //   border-radius: 8px;
  // }
  //
  // .wave {
  //   transform: scaleY(.4);
  //   animation-duration: 1.2s;
  //   animation-timing-function: ease-in-out;
  //   animation-iteration-count: infinite;
  // }
  //
  // .wave1 {
  //   animation-name: quiet;
  // }
  //
  // .wave2 {
  //   animation-name: normal;
  // }
  //
  // .wave3 {
  //   animation-name: quiet;
  // }
  //
  // .wave4 {
  //   animation-name: loud;
  //   background: transparent;
  // }
  //
  // .wave5 {
  //   animation-name: quiet;
  // }
</style>
