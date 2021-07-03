<template lang="html">
  <div v-show="isActiveStream === true">
    <h4 class="label">AUDIO PREVIEW</h4>
    <div class="field is-horizontal" v-for="channel in channels" :key="channel">
      <div class="field-label is-normal">
        <label class="label">Channel {{channel + 1}}</label>
      </div>
      <div class="field-body">
        <div class="field">
          <div class="control">
            <!-- <canvas ref="wave" class="visualizer" width="200" height="100"></canvas> -->
            <input class="slider is-fullwidth is-circle" step="1" min="0" max="100" value="50" type="range" @change="changeVolume(channel, $event.target.value)">
          </div>
        </div>
      </div>

    </div>
  </div>
  <div class="channel-spinner" v-show="isActiveStream === false">
    <div class="spinner">
      Initialization{{spinner}}
    </div>
  </div>
</template>

<script>
import { mapActions, mapGetters, mapState } from 'vuex';

const wait = (sec) => new Promise((resolve) => {
  setTimeout(resolve, sec * 1000);
});

export default {
  name: 'AudioPlayerControls',
  data() {
    return { spinner: '' };
  },
  computed: {
    ...mapGetters('audio', { channels: 'listOfChannels', isActiveChannels: 'isActiveChannels' }),
    ...mapState('audio', { audio: 'context', source: 'source' }),
    ...mapState('dash', ['player', 'isActiveStream']),
  },
  created() {
    setInterval(() => {
      if (this.spinner === '...') {
        this.spinner = '';
      } else {
        this.spinner = `${this.spinner}.`;
      }
    }, 400);
  },
  methods: {
    ...mapActions('audio', ['createGainNodes']),
    changeVolume(channel, value) {
      if (this.gainNodes) {
        this.gainNodes[channel].gain.value = Number(value) / 200;
      }
    },
    async init() {
      if (this.isActiveStream && this.isActiveChannels) {
        return this.createGainNodes();
      }
      await wait(2);
      return this.init();
    },
  },
  mounted() {
    this.init();
  },
};
</script>

<style lang="scss" scoped>
  .spinner {
    position: relative;
    float: left;
    left: 45%;
  }
</style>
