<template>
  <div class="container max">
    <div class="row">
      <div class="col s2">
        <!-- <div class="card">
          <AudioPlayerRadioControls/>
        </div> -->
        <div class="card transparent playlist">
          <Modal position="top" title="Playlist">
            <FileList/>
          </Modal>
        </div>
      </div>
      <div class="col s10">
        <div class="card">
          <AudioPlayer/>
        </div>
      </div>
      <div class="col s5">
        <!-- <div class="card">
          <AudioPlayerSliders/>
        </div> -->
      </div>
    </div>
  </div>
  <div class="">
    <AudioPlayerTouch/>
  </div>
</template>

<script>
// import _ from 'lodash';
import { mapGetters, mapState, mapActions } from 'vuex';

import {
  // Mach1SoundPlayer,
  Mach1DecoderProxy,
} from 'mach1spatial-decode';

// import AudioPlayerRadioControls from '../components/AudioPlayerRadioControls.vue';
import AudioPlayer from '../components/AudioPlayer.vue';
// import AudioPlayerSliders from '../components/AudioPlayerSliders.vue';
import AudioPlayerTouch from '../components/AudioPlayerTouch.vue';
import Modal from '../components/Modal.vue';
import FileList from '../components/FileList.vue';

const wait = (sec) => new Promise((resolve) => {
  setTimeout(resolve, sec * 1000);
});

export default {
  components: {
    // AudioPlayerRadioControls,
    AudioPlayer,
    // AudioPlayerSliders,
    AudioPlayerTouch,
    Modal,
    FileList,
  },
  computed: {
    ...mapGetters('audio', { channels: 'listOfChannels', isActiveChannels: 'isActiveChannels' }),
    ...mapState('audio', { audio: 'context', source: 'source' }),
    ...mapState('dash', ['player', 'isActiveStream']),
  },
  mounted() {
    this.decoder = new Mach1DecoderProxy();

    window.addEventListener('mousemove', (event) => {
      window.mouseX = (event.clientX) / window.innerWidth;
      window.mouseY = (event.clientY) / window.innerHeight;
    }, false);
    this.loop();
    this.init();
  },
  methods: {
    ...mapActions('audio', ['createGainNodes', 'updateVolume']),
    changeVolume(channel, volume) {
      this.updateVolume({ channel, volume });
    },
    loop() {
      const map = (value, x1, y1, x2, y2) => ((value - x1) * (y2 - x2)) / (y1 - x1) + x2;
      requestAnimationFrame(this.loop);

      window.yaw = map(window.mouseX, 0, 1, -180, 180);
      window.pitch = map(window.mouseY, 0, 1, 45, -45);
      window.roll = 0;

      const rotateX = `rotateX(${parseInt(-window.pitch, 10)}deg)`;
      const rotateY = `rotateY(${parseInt(-window.yaw, 10)}deg)`;

      const transform = `translate(-50%, -50%) ${rotateX} ${rotateY}`;
      document.getElementById('touchstats:card').style.transform = transform;

      const decoded = this.decoder.decode(window);

      if (decoded && decoded.length > 0) {
        for (let i = 0; i < decoded.length; i += 1) {
          const value = Number(decoded[i]) || 0;
          if (value) this.changeVolume(i, value);
        }
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
};
</script>
<style lang="scss" scoped>
  .playlist {
    box-shadow: none;
  }
</style>
