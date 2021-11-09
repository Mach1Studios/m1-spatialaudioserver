<template>
  <div class="container max">
    <div class="row">
      <div class="col s3">
        <div class="card transparent playlist">
          <Modal
            title="Playlists"
            icon="play_arrow"
            position="left"
            buttonClasses="small grey-light-3 large-width small-space no-padding no-margin"
            padding="no-margin"
          >
            <AudioPlayerPlaylists class="modal-playlist" :admin="true"/>
          </Modal>
        </div>
      </div>
      <div class="col s6"></div>
      <div class="col s3"></div>
    </div>
  </div>
  <div class="">
    <AudioPlayerTouch/>
  </div>
  <div class="row absolute bottom dark">
    <div class="card">
      <AudioPlayer skin="dark" class="dark-player"/>
    </div>
  </div>
</template>

<script>
import { mapGetters, mapState, mapActions } from 'vuex';

import { Mach1DecoderProxy } from 'mach1spatial-decode';

import AudioPlayer from '../components/AudioPlayer/AudioPlayer.vue';
import AudioPlayerTouch from '../components/AudioPlayer/AudioPlayerTouch.vue';
import Modal from '../components/Modal.vue';
import AudioPlayerPlaylists from '../components/AudioPlayer/AudioPlayerPlaylists.vue';

const wait = (sec) => new Promise((resolve) => {
  setTimeout(resolve, sec * 1000);
});

const mousemoveListener = (event) => {
  window.mouseX = (event.clientX) / window.innerWidth;
  window.mouseY = (event.clientY) / window.innerHeight;
};

export default {
  components: {
    AudioPlayer,
    AudioPlayerPlaylists,
    AudioPlayerTouch,
    Modal,
  },
  data() {
    return { isMount: false };
  },
  computed: {
    ...mapGetters('audio', { channels: 'listOfChannels', isActiveChannels: 'isActiveChannels' }),
    ...mapState('audio', { audio: 'context', source: 'source' }),
    ...mapState('dash', ['player', 'isActiveStream']),
  },
  mounted() {
    window.addEventListener('mousemove', mousemoveListener, false);
    this.decoder = new Mach1DecoderProxy(null, { debug: false });
    this.isMount = true;

    this.loop();
    this.init();
  },
  beforeUnmount() {
    window.removeEventListener('mousemove', mousemoveListener, false);

    this.isMount = false;
    this.decoder = null;
  },
  methods: {
    ...mapActions('audio', ['createGainNodes', 'updateVolume']),
    changeVolume(channel, volume) {
      this.updateVolume({ channel, volume });
    },
    loop() {
      if (!this.isMount) return;

      const map = (value, x1, y1, x2, y2) => ((value - x1) * (y2 - x2)) / (y1 - x1) + x2;
      requestAnimationFrame(this.loop);

      const yaw = map(window.mouseX, 0, 1, -180, 180);
      const pitch = map(window.mouseY, 0, 1, 45, -45);
      const roll = 0;

      const rotateX = `rotateX(${parseInt(-pitch, 10)}deg)`;
      const rotateY = `rotateY(${parseInt(-yaw, 10)}deg)`;

      const transform = `translate(-50%, -50%) ${rotateX} ${rotateY}`;
      document.getElementById('touchstats:card').style.transform = transform;

      const decoded = this.decoder.decode({ yaw, pitch, roll });

      if (decoded && decoded.length > 0) {
        for (let i = 0; i < decoded.length; i += 1) {
          this.changeVolume(i, decoded[i]);
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
    padding-top: 0;
  }
  .modal-playlist {
    margin-top: 32px;
  }
  .dark .card{
    background-color: #1c1c1c;
    z-index: 600;
    border-radius: 0;
  }
</style>
