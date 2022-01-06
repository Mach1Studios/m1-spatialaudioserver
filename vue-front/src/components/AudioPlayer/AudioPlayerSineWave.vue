<template>
  <div>
    <canvas :ref="refLink" class="visualizer" width="400" height="50"></canvas>
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
      bufferSize: 128,
      frame: {
        sliceWidth: 2,
        sliceHeight: 2,
      },
      container: {
        height: 50,
        width: 128,
      },
      provider: {
        ctx: null,
      },
      channelsBuffer: {
        left: null,
        right: null,
      },
    };
  },

  computed: {
    ...mapState('audio', { audio: 'context', source: 'source', analyser: 'gainNodesAnalyser' }),
    ...mapState('dash', ['isActiveStream']),
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

  mounted() {
    const id = this.refLink;

    this.provider.ctx = this.$refs[id].getContext('2d');

    // this.$refs[id].width = this.container.width;
    // this.$refs[id].height = this.container.height;
    //
    this.container.height = this.$refs[id].height;
    this.container.width = this.$refs[id].width;

    this.frame.sliceHeight = this.container.height / 256;
    this.frame.sliceWidth = this.container.width / this.bufferSize;

    // console.log('slice=', this.frame.sliceHeight);

    this.startWaveAnimation();
  },
  unmounted() {
    cancelAnimationFrame(this.animationFrame);
  },

  methods: {
    async startWaveAnimation() {
      const drawLine = (audioBuffer, color = '#FFFFFF') => {
        const { height, width } = this.container;
        this.provider.ctx.strokeStyle = color;

        this.provider.ctx.beginPath();

        let x = 0;
        this.provider.ctx.moveTo(x, 24);
        _.each(audioBuffer, (value) => {
          this.provider.ctx.lineTo(x, value * this.frame.sliceHeight);

          x += this.frame.sliceWidth;
        });
        this.provider.ctx.lineTo(width, height / 2);
        this.provider.ctx.stroke();
        this.provider.ctx.closePath();
      };
      const animate = () => {
        this.animationFrame = requestAnimationFrame(animate);

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
        drawLine(this.channelsBuffer.right, '#4B3C53');
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
};
</script>
<style lang="scss" scoped>
  canvas {
    background: transparent;
  }

  canvas .visualizer {
    max-width: 200px;
    max-height: 100px;

    background: transparent;
  }
</style>
