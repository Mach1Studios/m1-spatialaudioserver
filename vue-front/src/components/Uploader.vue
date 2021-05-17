<template lang="html">
  <div class="file is-boxed uploader">
    <label class="file-label">
      <input class="file-input" type="file" name="resume">
      <span class="file-cta">
        <div class="waveContainer">
          <div class="wave wave1"></div>
          <div class="wave wave2"></div>
          <div class="wave wave3"></div>
          <div class="wave wave4"></div>
          <div class="wave wave5"></div>
        </div>
        <span class="file-icon">
          <!-- <img src="../assets/sound-waves.svg"> -->
        </span>
        <span class="file-label">
          <p>CHOOSE A FILE...</p>
        </span>
      </span>
    </label>
  </div>
</template>

<script>
export default {};
</script>

<style lang="css" scoped>

  p {
    font-style: normal;
    font-weight: bold;
    font-size: 1rem;
    line-height: 1.17;
    letter-spacing: -0.5px;
    width: 100%;
  }
  @keyframes quiet {
  25%{
    transform: scaleY(.6);
  }
  50%{
    transform: scaleY(.4);
  }
  75%{
    transform: scaleY(.8);
  }
}

@keyframes normal {
  25%{
    transform: scaleY(1);
  }
  50%{
    transform: scaleY(.4);
  }
  75%{
    transform: scaleY(.6);
  }
}
@keyframes loud {
  25%{
    transform: scaleY(1);
  }
  50%{
    transform: scaleY(.4);
  }
  75%{
    transform: scaleY(1.2);
  }
}

.waveContainer{
  display: flex;
  justify-content: space-between;
  height: 32px;
  --boxSize: 3px;
  --gutter: 2px;
  width: calc((var(--boxSize) + var(--gutter)) * 5);
}

.wave{
  transform: scaleY(.4);
  height: 100%;
  width: var(--boxSize);
  background: #1c1c1c;
  animation-duration: 1.2s;
  animation-timing-function: ease-in-out;
  animation-iteration-count: infinite;
  border-radius: 8px;
}

.wave1{
  animation-name: quiet;
}

.wave2{
  animation-name: normal;
}

.wave3{
  animation-name: quiet;
}

.wave4{
  animation-name: loud;
}

.wave5{
  animation-name: quiet;
}
</style>
