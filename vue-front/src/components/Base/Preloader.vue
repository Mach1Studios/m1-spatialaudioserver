<template>
  <div class="overlay active dark preloader" v-show="isLoading">
    <div class="load">
      <div class="load-animation">
        <div class="animation-line">
          <div class="line line-1"></div>
          <div class="line line-2"></div>
          <div class="line line-3"></div>
          <div class="line line-4"></div>
          <div class="line line-5"></div>
        </div>
        <div class="animation-circle"></div>
      </div>
      <p class="load-title">{{title}}...</p>
      <p class="load-description">{{description}}</p>
    </div>
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
    z-index: 601;
  }
  .load {
    display: flex;
    position: fixed;
    width: 100vw;
    height: 100vh;

    top: 0;
    left: 0;

    background: #1c1c1cb5;
    z-index: 500;
    filter: contrast(5);
  }
  .load-animation {
    display: flex;
    top: 0;
    left: 0;
    position: fixed;
    width: 100vw;
    height: 85vh;
  }

  .load-title {
    position: absolute;
    width: 100%;

    top: 55%;
    margin: 0 auto;

    z-index: 500;

    color: #fff7eb;
    font-size: 16rem;
    font-weight: 600;
    line-height: 1.125;
    text-transform: uppercase;
  }

  .load-description {
    position: absolute;
    width: 100%;

    top: 58%;
    margin: 0 auto;

    z-index: 500;

    color: yellow;
    font-size: 12rem;
    font-weight: 400;
    text-transform: uppercase;
  }

  .animation-line{
    display: flex;
    position: absolute;
    top: 50%;
    left: 50%;
    transform: translate(-50%, -50%);
    filter: blur(1px);
    width: 100%;
    justify-content: space-between;
    height: 165rem;
    --boxSize: 10rem;
    --gutter: 10rem;
    width: calc((var(--boxSize) + var(--gutter)) * 5);
  }

  .line{
    transform: scaleY(.4);
    height: 100%;
    width: var(--boxSize);
    background: #fff7eb;
    animation-duration: 1.2s;
    animation-timing-function: ease-in-out;
    animation-iteration-count: infinite;
    border-radius: none;
  }

  .line-4{
    visibility: hidden;
  }

  @keyframes rotate {
     from {
         transform: rotate(0deg);
     }
     to {
         transform: rotate(360deg);
     }
  }

  @-webkit-keyframes rotate {
     from {
         -webkit-transform: rotate(0deg);
     }
     to {
         -webkit-transform: rotate(360deg);
     }
  }

  .animation-circle {
    display: flex;

    width: 165rem;
    height: 165rem;
    margin: auto;

    border: 8rem solid #fff7eb;
    border-radius: 50%;
    border-right-color: transparent;
    border-bottom-color: transparent;
    -webkit-transition: all 0.5s ease-in;
    -webkit-animation-name: rotate;
    -webkit-animation-duration: 1.0s;
    -webkit-animation-iteration-count:  infinite;
    -webkit-animation-timing-function: linear;

    transition: all 0.5s ease-in;
    animation-name: rotate;
    animation-duration: 1.0s;
    animation-iteration-count:  infinite;
    animation-timing-function: linear;
    filter: blur(2px);
  }
</style>
