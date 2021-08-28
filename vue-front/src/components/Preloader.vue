<template lang="html">
  <div class="overlay active dark" v-show="isLoading">
    <div class="preloader">
      <div class="ball ball-1"></div>
      <div class="ball ball-2"></div>
      <div class="ball ball-3"></div>
    </div>
    <h4 class="load-title">{{title}}...</h4>
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
</style>
