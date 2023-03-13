<template>
  <div v-show="isLoading" class="overlay active dark preloader">
    <div class="load">
      <div class="load-animation">
        <div class="animation-line">
          <div class="line line-1" />
          <div class="line line-2" />
          <div class="line line-3" />
          <div class="line line-4" />
          <div class="line line-5" />
        </div>
        <div class="animation-circle" />
      </div>
      <p class="load-title">{{ title }}...</p>
      <p class="load-description">{{ description }}</p>
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
    background: #1c1c1cb5;
    filter: contrast(5);

    height: 100vh;
    width: 100vw;

    position: fixed;
    display: flex;
    z-index: 500;
    left: 0;
    top: 0;
  }

  .load-animation {
    display: flex;
    position: fixed;

    height: 85vh;
    width: 100vw;

    left: 0;
    top: 0;
  }

  .load-title {
    color: var(--additional-light-color);

    font-size: 16rem;
    font-weight: 600;
    line-height: 1.125;
    text-transform: uppercase;

    top: 55%;
    margin: 0 auto;
    position: absolute;

    width: 100%;

    z-index: 500;
  }

  .load-description {
    width: 100%;

    top: 58%;
    margin: 0 auto;
    position: absolute;

    z-index: 500;

    color: var(--secondary-accent-color);
    font-size: 12rem;
    font-weight: 400;
    text-transform: uppercase;
  }

  .animation-line {
    height: 165rem;
    width: calc((var(--boxSize) + var(--gutter)) * 5);

    display: flex;
    justify-content: space-between;
    left: 50%;
    position: absolute;
    top: 50%;
    transform: translate(-50%, -50%);

    filter: blur(1px);

    --boxSize: 10rem;
    --gutter: 10rem;
  }

  .line {
    animation-duration: 1.2s;
    animation-iteration-count: infinite;
    animation-timing-function: ease-in-out;

    height: 100%;
    width: var(--boxSize);

    background: var(--additional-light-color);

    border-radius: none;
    transform: scaleY(.4);
  }

  .line-4 {
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

  .animation-circle {
    display: flex;

    height: 165rem;
    margin: auto;
    width: 165rem;

    border: 8rem solid var(--additional-light-color);
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
