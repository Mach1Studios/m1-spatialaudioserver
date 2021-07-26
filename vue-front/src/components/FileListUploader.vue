<template lang="html">
  <div class="field medium-margin medium-padding">
    <button class="round large border grey-light-3 transparent-border black-text absolute center middle">
        <input type="file" name="resume" @change="upload">
        <div class="waveContainer">
          <div class="wave wave1"></div>
          <div class="wave wave2"></div>
          <div class="wave wave3"></div>
          <div class="wave wave4"></div>
          <div class="wave wave5"></div>
        </div>
        <span><p>CHOOSE A FILE...</p></span>
    </button>
  </div>
</template>

<script>
import _ from 'lodash';
import { mapActions, mapMutations } from 'vuex';

export default {
  name: 'FileListUploader',
  data() {
    return { file: null };
  },
  methods: {
    ...mapActions('tracks', {
      request: 'upload',
    }),
    ...mapMutations(['loader']),
    async upload($event) {
      this.loader({ enable: true });
      const { files } = $event.target;
      const form = new FormData();

      _.each(files, (file) => {
        form.append('file', file, file.name);
      });

      await this.request(form);
      this.loader({ enable: false });
    },
  },
};
</script>

<style lang="scss" scoped>
  p {
    width: 100%;

    font-style: normal;
    font-weight: bold;
    font-size: 0.9rem;

    line-height: 1.17;
    letter-spacing: -0.3px;
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

  .waveContainer {
    display: flex;
    width: calc((var(--boxSize) + var(--gutter)) * 5);
    height: 35px;

    justify-content: space-between;
    --boxSize: 2px;
    --gutter: 2px;
  }

  .wave {
    height: 100%;
    width: var(--boxSize);

    transform: scaleY(.4);

    background: #1c1c1c;
    border-radius: 8px;
  }

  button:hover .wave {
    transform: scaleY(.4);
    animation-duration: 1.2s;
    animation-timing-function: ease-in-out;
    animation-iteration-count: infinite;
  }

  .wave1 {
    animation-name: quiet;
  }

  .wave2 {
    animation-name: normal;
  }

  .wave3 {
    animation-name: quiet;
  }

  .wave4 {
    animation-name: loud;
    background: transparent;
  }

  .wave5 {
    animation-name: quiet;
  }
</style>
