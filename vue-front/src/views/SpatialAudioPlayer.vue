<template>
  <div class="max-size">
    <main class="max responsive no-scroll">
      <div class="grid">
        <div class="col s12 m4 l4">
          <div id="Playlists-list" class="playlist">
            <article class="transparent playlists-card">
              <FormButton class="playlist-btn" title="Playlists" icon="play_arrow" @click="showPlaylist = !showPlaylist" />
              <Transition>
                <div v-show="showPlaylist">
                  <article class="front round playlist-card">
                    <h4 class="title large-text center-align">
                      PLAYLISTS
                    </h4>
                    <AudioPlayerPlaylists />
                  </article>
                </div>
              </Transition>
            </article>
          </div>
        </div>
        <div class="col s12">
          <AudioPlayerTouch />
        </div>
      </div>
    </main>
    <div class="grid responsive dark-player-card absolute bottom">
      <div class="audioplayer-debug s12">
        <article class="transparent">
          <AudioPlayerDebug />
        </article>
      </div>
      <div class="audioplayer s12">
        <article class="transparent">
          <AudioPlayer class="dark-player" />
        </article>
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
  .max-size {
    height: 90vh;
  }

  .title {
    color: var(--secondary-highlight-color);
    font-size: 18rem;
    font-style: normal;
    letter-spacing: 0.5px;
    line-height: 1.17;

    margin-bottom: 8rem;
    margin-top: 8rem;
    padding-bottom: 8rem;
  }

  .playlist {
    box-shadow: none;

    padding-left: 0;
    padding-top: 0;
  }

  .dark-player-card {
    background-color: var(--primary-dark-color);
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

    article {
      padding-top: 0;
    }
  }

  .playlist-btn {
    margin-top: 0;
  }

  .playlists-card {
    padding-top: 0;
  }

  .playlist-card {
    padding-bottom: 56rem;
  }

  .audioplayer-debug {
    padding: 0 55rem 0 55rem;
    article {
      padding-top: 0;
      padding-bottom: 0;
    }
  }

  .audioplayer {
    article {
      padding-bottom: 8rem;
    }
  }

  main {
    padding-left: 55rem;
    padding-right: 55rem;
  }

  article {
    background-color: var(--secondary-dark-color);
  }

  @media screen and (orientation: portrait) {
    main {
      padding-bottom: calc(10vh - 50px - 3em);
      padding-left: 8rem;
      padding-right: 8rem;
      padding-top: auto;
      z-index: 98;
    }

    .playlist-card {
      padding-bottom: 16rem;
    }

    .audioplayer {
      padding-left: 8rem;
      padding-right: 8rem;
    }
    .audioplayer-debug {
      padding: 0 8rem 0 8rem;

      z-index: 99;
    }
  }
</style>
