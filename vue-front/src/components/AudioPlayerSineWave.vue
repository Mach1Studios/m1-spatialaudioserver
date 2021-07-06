<template>
  <div>
    <canvas :ref="refLink" class="visualizer" width="200" height="100"></canvas>
  </div>
</template>
<script>
import _ from 'lodash';
import { mapGetters, mapState } from 'vuex';

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
      bufferSize: 64,
      frame: {
        sliceWidth: 2,
        sliceHeight: 0.1,
      },
      container: {
        height: 0,
        width: 0,
      },
      provider: {
        ctx: null,
      },
    };
  },

  computed: {
    ...mapGetters('audio', { channels: 'listOfChannels', isActiveChannels: 'isActiveChannels' }),
    ...mapState('audio', { audio: 'context', source: 'source', analyser: 'gainNodesAnalyser' }),
    ...mapState('dash', ['isActiveStream']),

    refLink() {
      return `sinewave-${this.channel}`;
    },
  },

  mounted() {
    console.log('line', this.lineColor);
    const id = this.refLink;
    this.provider.ctx = this.$refs[id].getContext('2d');

    this.container.width = 128;
    this.container.height = 50;

    this.$refs[id].width = this.container.width;
    this.$refs[id].height = this.container.height;

    this.frame.sliceHeight = this.container.height / 256;

    this.start();
  },

  methods: {
    async start() {
      if (this.isActiveStream && this.isActiveChannels) {
        const { height, width } = this.container;

        this.analyser[this.channel].fftSize = this.bufferSize;
        this.bufferLength = this.analyser[this.channel].fftSize;
        this.itemsFromBuff = new Uint8Array(this.bufferLength);

        this.provider.ctx.clearRect(0, 0, width, height);

        return this.animate();
      }

      await wait(2000);
      return this.start();
    },

    async animate() {
      // await wait(40);
      requestAnimationFrame(this.animate);

      const { height, width } = this.container;
      this.provider.ctx.clearRect(0, 0, width, height);

      this.analyser[this.channel].getByteTimeDomainData(this.itemsFromBuff);
      this.provider.ctx.fillRect(0, 0, width, height);

      this.provider.ctx.fillStyle = 'rgba(0, 0, 0, 0)';

      this.provider.ctx.lineWidth = 1;
      this.provider.ctx.strokeStyle = this.lineColor;

      this.provider.ctx.beginPath();

      let x = 0;
      this.provider.ctx.moveTo(x, 24);
      _.each(this.itemsFromBuff, (value) => {
        this.provider.ctx.lineTo(x, value * this.frame.sliceHeight);

        x += this.frame.sliceWidth;
      });

      this.provider.ctx.lineTo(width, height / 2);
      this.provider.ctx.stroke();
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
