<template>
  <div class="waveform-container">
    <canvas :ref="refLink" class="visualizer" height="50" />
  </div>
</template>
<script>
import _ from 'lodash';
import { mapState } from 'vuex';

const wait = (sec) => new Promise((resolve) => {
  setTimeout(resolve, sec);
});

export default {
  name: 'AudioPlayerSineWave',

  props: {
    channel: Number,
    lineColor: String,
  },

  data() {
    return {
      animationFrame: null,
      resizeObserver: null,
      bufferSize: 64,
      frame: {
        sliceWidth: 2,
        sliceHeight: 2,
      },
      container: {
        height: 50,
        width: 128,
      },
      provider: { ctx: null },
      channelsBuffer: {
        left: null,
        right: null,
      },

      // DEBUG: animation
      duration: 60 * 1,
      start: 0,
    };
  },

  computed: {
    ...mapState('audio', { audio: 'context', source: 'source', analyser: 'gainNodesAnalyser' }),
    ...mapState('stream', ['isActiveStream']),
    leftChannel() {
      return this.channel * 2;
    },
    rightChannel() {
      return this.channel * 2 + 1;
    },
    refLink() {
      return `sinewave-${this.channel}`;
    },
  },

  methods: {
    async startWaveAnimation() {
      const drawLine = (audioBuffer, color = '#FFFFFF') => {
        const { height, width } = this.container;
        this.provider.ctx.strokeStyle = color;

        this.provider.ctx.beginPath();

        let x = 0;
        let step = 0;
        // let y = 0;
        //
        const amplitude = 10;
        const frequency = 10;
        // const step = 4;
        this.provider.ctx.moveTo(x, 25);
        this.provider.ctx.lineTo(x = width / 20, height / 2);
        _.each(audioBuffer, (value) => {
          // this.provider.ctx.lineTo(x, value * this.frame.sliceHeight);
          //
          // x += this.frame.sliceWidth;

          // this.provider.ctx.arc(x + value / 2, height, width / 2, Math.PI, 0);
          const offsetY = step * amplitude * Math.sin((value - 100) * frequency * step);

          // console.log(offsetY);
          this.provider.ctx.lineTo(x, height / 2 + offsetY);
          x += this.frame.sliceWidth;

          if (x < width / 2) {
            step += 0.01;
          } else {
            step -= 0.01;
          }
        });

        // while (x < width) {
        //   y = height / 2 + amplitude * Math.sin((x + 4) / frequency);
        //   this.provider.ctx.lineTo(x, y);
        //   x += 4;
        // }
        // this.provider.ctx.lineTo(x = (width * 19) / 20, height / 2);

        this.provider.ctx.lineTo(width, height / 2);
        this.provider.ctx.stroke();
        this.provider.ctx.closePath();
      };
      const animate = () => {
        this.start += 1;
        // console.log(this.channelsBuffer.left);
        // if (this.duration === this.start) {
        //   debugger;
        // }
        const { height, width } = this.container;
        this.provider.ctx.clearRect(0, 0, width, height);

        this.analyser[this.leftChannel].getByteTimeDomainData(this.channelsBuffer.left);
        this.analyser[this.rightChannel].getByteTimeDomainData(this.channelsBuffer.right);

        this.provider.ctx.fillRect(0, 0, width, height);
        this.provider.ctx.fillStyle = 'rgba(0, 0, 0, 0)';

        this.provider.ctx.lineWidth = 1;
        // this.provider.ctx.lineJoin = 'round';
        // this.provider.ctx.miterLimit = 256;

        drawLine(this.channelsBuffer.left);
        // drawLine(this.channelsBuffer.right, '#4B3C53');
        //
        this.animationFrame = requestAnimationFrame(animate);
      };

      if (this.isActiveStream && this.analyser[this.leftChannel] && this.analyser[this.rightChannel]) {
        this.analyser[this.leftChannel].fftSize = this.bufferSize;
        this.analyser[this.rightChannel].fftSize = this.bufferSize;

        this.channelsBuffer.left = new Uint8Array(this.analyser[this.leftChannel].fftSize);
        this.channelsBuffer.right = new Uint8Array(this.analyser[this.rightChannel].fftSize);

        return animate();
      }

      await wait(100);
      return this.startWaveAnimation();
    },
  },

  mounted() {
    const id = this.refLink;
    const canvas = this.$refs[id];
    const container = canvas.parentElement;

    this.provider.ctx = canvas.getContext('2d');

    // Set canvas dimensions based on container
    const updateCanvasSize = () => {
      const rect = container.getBoundingClientRect();
      if (rect.width > 0) {
        canvas.width = rect.width;
        canvas.height = 50;
        this.container.width = rect.width;
        this.container.height = 50;

        this.frame.sliceHeight = this.container.height / 256;
        this.frame.sliceWidth = (this.container.width * 9) / (this.bufferSize * 10);
      }
    };

    // Watch for container resize
    this.resizeObserver = new ResizeObserver(() => {
      updateCanvasSize();
    });
    this.resizeObserver.observe(container);

    // Initial size - use nextTick to ensure layout is complete
    this.$nextTick(() => {
      updateCanvasSize();
      this.startWaveAnimation();
    });
  },
  unmounted() {
    cancelAnimationFrame(this.animationFrame);
    if (this.resizeObserver) {
      this.resizeObserver.disconnect();
    }
  },
};
</script>
<style lang="scss" scoped>
  .waveform-container {
    width: 100%;
    min-width: 0;
    display: flex;
    align-items: center;
  }

  canvas.visualizer {
    width: 100%;
    height: 50px;
    max-height: 100px;
    background: transparent;
    display: block;
  }
</style>
