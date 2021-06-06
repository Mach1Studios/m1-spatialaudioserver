<template lang="html">
  <div v-show="isLoading">
    <div class="preloader">
      <div class="ball ball-1"></div>
      <div class="ball ball-2"></div>
      <div class="ball ball-3"></div>
    </div>
    <h4 class="load">{{title}}...</h4>
  </div>
</template>
<script>
export default {
  name: 'Preloader',
  props: {
    title: String,
    isLoading: Boolean,
  },
};
</script>
<style lang="scss" scoped>
  .load {
    color: antiquewhite;
    font-size: 1rem;
    font-weight: 600;
    line-height: 1.125;
    z-index: 0;
    text-transform: uppercase;
    position: absolute;
    top: 60%;
    left: 0;
    width: 100%;
    height: 100%;
  }
  .preloader {
    position: absolute;
    top: 0;
    left: 0;
    width: 100%;
    height: 100%;
    filter: blur(10px) contrast(20);
    background: #1c1c1cb5;
  }

  .ball {
    position: absolute;
    width: 120px;
    height: 120px;
    top: 50%;
    left: 50%;
    transform: translate(-50%, -50%) rotate(0deg);
    transform-origin: 66px center;
    margin-left: 40px;
  }

  .ball:before {
    content: '';
    width: 68px;
    height: 68px;
    position: absolute;
    top: 50%;
    left: -10px;
    transform: translateY(-50%);
    border-radius: 100%;
    background: yellow;
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
