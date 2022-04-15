<template>
  <div class="max-size">
    <div class="container max">
      <div class="row">
        <div class="col s12 m6 l4">
          <div class="card transparent playlist">
            <Modal
              title="Playlists"
              icon="play_arrow"
              position="left"
              buttonClasses="small responsive upper round grey3"
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
    <div>
      <AudioPlayerTouch/>
    </div>
    <div class="row no-space dark absolute bottom">
      <div class="card flat audioplayer-debug" v-if="isAdmin">
        <AudioPlayerDebug/>
      </div>
      <div class="card flat transparent audioplayer">
        <AudioPlayer skin="dark" class="dark-player"/>
      </div>
    </div>
  </div>
</template>

<script>
import _ from 'lodash';
import { mapGetters, mapState, mapActions } from 'vuex';

import { Mach1DecoderProxy } from 'mach1spatial-decode';

import AudioPlayer from '../components/AudioPlayer/AudioPlayer.vue';
import AudioPlayerDebug from '../components/AudioPlayer/AudioPlayerDebug.vue';
import AudioPlayerPlaylists from '../components/AudioPlayer/AudioPlayerPlaylists.vue';
import AudioPlayerTouch from '../components/AudioPlayer/AudioPlayerTouch.vue';
import Modal from '../components/Base/Modal.vue';

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
    AudioPlayerDebug,
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
    ...mapState('auth', ['profile']),

    isAdmin() {
      return _.get(this, 'profile.user.role') === 'admin';
    },
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
    ...mapActions('logs', { log: 'createMessage' }),
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
      this.log({
        message: `Mach1DecoderProxy decoded values: ${decoded}`,
        data: { decoded, pitch, roll, yaw },
      });

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
  .audioplayer-debug {
    padding-top: 0;
    padding-bottom: 0;
  }
  .max-size {
    height: 100vh;
  }
  .playlist {
    box-shadow: none;
    padding-top: 0;
  }
  .modal-playlist {
    margin: 32rem 0 0 0;
  }
  .dark .card {
    background-color: #1c1c1c;
    border-radius: 0;
  }
  .audioplayer {
    z-index: 600;
    .dark-player {
      width: 100%;
    }
    box-shadow: none;
    padding-top: 0;
  }
  @media screen and (orientation: portrait) {
    .container {
      padding-top: auto;
      padding-left: 8rem;
      padding-right: 8rem;
      padding-bottom: calc(10vh - 50px - 3em);
    }
    .modal-playlist {
      padding: 8rem 0 0 0;
    }
  }
</style>
