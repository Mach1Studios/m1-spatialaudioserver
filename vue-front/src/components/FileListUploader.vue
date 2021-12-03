<template>
  <div class="field medium-margin medium-padding">
    <button class="round medium border grey-light-3 transparent-border black-text absolute center middle">
        <input type="file" name="resume" @change="upload">
        <span>
          <p class="medium-text">CHOOSE A FILE...</p>
        </span>
    </button>
  </div>
</template>

<script>
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
      const [file] = $event.target.files;

      await this.request(file);
      this.loader({ enable: false });
    },
  },
};
</script>

<style lang="scss" scoped>
  p {
    width: 100%;

    color: #1c1c1c;
    font-style: normal;
    font-weight: bold;

    line-height: 1.17;
    letter-spacing: -0.3px;
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
  //   width: calc((var(--boxSize) + var(--gutter)) * 5);
  //   height: 35px;
  //
  //   justify-content: space-between;
  //   --boxSize: 2px;
  //   --gutter: 2px;
  // }
  //
  // .wave {
  //   height: 100%;
  //   width: var(--boxSize);
  //
  //   transform: scaleY(.4);
  //
  //   background: #1c1c1c;
  //   border-radius: 8px;
  // }
  //
  // button:hover .wave {
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
