<template>
  <div class="max-size">
    <div class="container max">
      <div class="row">
        <div class="col s12 m6 l4">
          <div id="Playlists-list" class="card transparent playlist">
            <FormButton title="Playlists" icon="play_arrow" @click="showPlaylist = !showPlaylist" />
            <Transition>
              <div v-show="showPlaylist" class="card round show-playlists">
                <AudioPlayerPlaylists />
              </div>
            </Transition>
          </div>
        </div>
        <div class="col s6" />
        <div class="col s3" />
      </div>
    </div>
    <div>
      <AudioPlayerTouch />
    </div>
    <div class="row no-space dark absolute bottom">
      <div v-if="isAdmin" class="card flat audioplayer-debug">
        <AudioPlayerDebug />
      </div>
      <div class="card flat transparent audioplayer">
        <AudioPlayer skin="dark" class="dark-player" />
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
import FormButton from '../components/Form/Button.vue';

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
    FormButton,
  },
  data() {
    return { isMount: false, showPlaylist: false };
  },
  computed: {
    ...mapGetters('audio', { channels: 'listOfChannels', isActiveChannels: 'isActiveChannels' }),
    ...mapState('audio', { audio: 'context', source: 'source' }),
    ...mapState('stream', ['player', 'isActiveStream']),
    ...mapState('auth', ['profile']),

    isAdmin() {
      return _.get(this, 'profile.user.role') === 'admin';
    },
  },
  methods: {
    ...mapActions('audio', ['createGainNodes', 'updateVolume']),
    // ...mapActions('logs', { log: 'createMessage' }),
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
      // this.log({
      //   message: `Mach1DecoderProxy decoded values: ${decoded}`,
      //   data: { decoded, pitch, roll, yaw },
      // });

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
};
</script>
<style lang="scss" scoped>
  .v-enter-active,
  .v-leave-active {

    animation: move 3s ease infinite;
    }

    @keyframes move {
      50% {
         transform: translate(100px, 0px);
      }
    }

  .v-enter-from,
  .v-leave-to {
    opacity: 0;
  }
  .container {
    padding-left: 55rem;
    padding-right: 55rem;
  }

  .audioplayer-debug {
    padding: 0 55rem 0 55rem;
  }

  .max-size {
    height: 100vh;
  }

  .playlist {
    box-shadow: none;

    padding-left: 0;
    padding-top: 0;
  }

  .dark .card {
    background-color: #1c1c1c;
    border-radius: 0;
  }

  .audioplayer {
    box-shadow: none;

    padding-left: 55rem;
    padding-right: 55rem;
    padding-top: 0;

    z-index: 600;

    .dark-player {
      width: 100%;
    }
  }
  .card {
    background-color: #252526;
  }

  .show-playlists {

  }

  @media screen and (orientation: portrait) {
    .container {
      padding-bottom: calc(10vh - 50px - 3em);
      padding-left: 8rem;
      padding-right: 8rem;
      padding-top: auto;
    }

    .audioplayer {
      padding-left: 8rem;
      padding-right: 8rem;
    }
  }
</style>
