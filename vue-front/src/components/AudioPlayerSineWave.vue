<template>
  <div>
    <canvas ref="wave" class="visualizer" width="200" height="100"></canvas>
  </div>
</template>
<script>
import { mapState } from 'vuex';

const AudioContext = window.AudioContext || window.webkitAudioContext;

export default {
  name: 'AudioPlayerSineWave',

  data() {
    return {
      log: 0,
      container: {
        height: 0,
        width: 0,
      },
      provider: {
        analyser: null,
        ctx: null,
      },
    };
  },

  computed: {
    ...mapState('dash', ['source']),
  },

  mounted() {
    const audio = new AudioContext();
    audio.createGain = audio.createGain || audio.createGainNode;
    const gain = audio.createGain();
    const distortion = audio.createWaveShaper();
    const biquadFilter = audio.createBiquadFilter();
    const convolver = audio.createConvolver();

    this.provider.analyser = audio.createAnalyser();
    this.provider.ctx = this.$refs.wave.getContext('2d');

    this.container.width = '400' || this.$refs.wave.parentElement.clientWidth;
    this.container.height = '100' || this.$refs.wave.parentElement.clientHeight;

    this.$refs.wave.width = this.container.width;
    this.$refs.wave.height = this.container.height;

    // console.log('this.$refs.wave', this.$refs.wave);

    const source = audio.createMediaElementSource(this.source);

    source.connect(distortion);
    distortion.connect(biquadFilter);
    biquadFilter.connect(gain);
    convolver.connect(gain);
    gain.connect(this.provider.analyser);
    this.provider.analyser.connect(audio.destination);

    this.start();
  },

  methods: {
    start() {
      const { height, width } = this.container;

      this.provider.analyser.fftSize = 512;
      this.bufferLength = this.provider.analyser.fftSize;
      this.itemsFromBuff = new Uint8Array(this.bufferLength);

      console.log(this.itemsFromBuff);

      this.provider.ctx.clearRect(0, 0, width, height);

      this.animate();
    },

    animate() {
      if (this.log <= 512) {
        console.log('before requestAnimationFrame()');
      }
      requestAnimationFrame(this.animate);
      const { height, width } = this.container;
      this.provider.ctx.clearRect(0, 0, width, height);

      this.provider.analyser.getByteTimeDomainData(this.itemsFromBuff);

      this.provider.ctx.fillStyle = 'rgb(200, 200, 200)';
      this.provider.ctx.fillRect(0, 0, width, height);

      this.provider.ctx.lineWidth = 2;
      this.provider.ctx.strokeStyle = 'rgb(0, 0, 0)';

      this.provider.ctx.beginPath();

      const sliceWidth = Number.parseFloat((width * 1.0) / this.bufferLength).toFixed(0);
      let x = 0;

      for (let i = 0; i < this.bufferLength; i += 1) {
        const v = this.itemsFromBuff[i] / 128;
        const y = Number.parseFloat((v * height) / 2).toFixed(0);

        if (i === 0) {
          this.provider.ctx.moveTo(x, y);
        } else {
          this.provider.ctx.lineTo(x, y);
        }
        if (this.log <= 512) {
          console.log(x, y);

          this.log += 1;
        }

        x += Number(sliceWidth);
      }

      this.provider.ctx.lineTo(width, height / 2);
      this.provider.ctx.stroke();
    },
  },
};
</script>
<style lang="scss" scoped>
canvas .visualizer {
  max-width: 200px;
  max-height: 100px;
}
</style>
