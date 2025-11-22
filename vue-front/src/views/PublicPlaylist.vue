<template>
  <div class="max-size">
    <main class="max responsive no-scroll">
      <div class="grid">
        <div class="col s12 m12 l12">
          <article class="round center-align" v-if="loading">
            <div class="large-space"></div>
            <progress class="circle large"></progress>
            <h5>Loading playlist...</h5>
          </article>

          <article class="round" v-else-if="error">
            <div class="large-space"></div>
            <i class="extra">error</i>
            <h5>{{ error }}</h5>
            <p>This playlist may be private or doesn't exist.</p>
          </article>

          <article class="round" v-else-if="playlist">
            <div class="playlist-header">
              <h3 class="playlist-title">
                {{ playlist.name }}
              </h3>
              <p class="playlist-info">
                {{ playlist.tracks.length }} track{{ playlist.tracks.length !== 1 ? 's' : '' }}
              </p>
            </div>

            <div class="track-list">
              <div
                v-for="(track, index) in playlist.tracks"
                :key="track.id"
                class="track-item"
                :class="{ 'active': currentTrackIndex === index }"
                @click="selectTrack(index)"
              >
                <div class="track-number">
                  {{ index + 1 }}
                </div>
                <div class="track-info">
                  <div class="track-name">
                    {{ track.name }}
                  </div>
                  <div class="track-description">
                    {{ track.description }}
                  </div>
                </div>
                <button class="circle transparent" @click.stop="playTrack(index)">
                  <i v-if="currentTrackIndex === index && isPlaying">pause</i>
                  <i v-else>play_arrow</i>
                </button>
              </div>
            </div>
          </article>
        </div>
        <div class="col s12">
          <AudioPlayerTouch v-if="playlist && !loading" />
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
import { mapGetters, mapState, mapActions } from 'vuex';
import { Mach1DecoderProxy } from 'mach1spatial-decode';

import AudioPlayer from '../components/AudioPlayer/AudioPlayer.vue';
import AudioPlayerDebug from '../components/AudioPlayer/AudioPlayerDebug.vue';
import AudioPlayerTouch from '../components/AudioPlayer/AudioPlayerTouch.vue';

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
    AudioPlayerTouch,
  },
  data() {
    return {
      isMount: false,
      playlist: null,
      loading: true,
      error: null,
      currentTrackIndex: 0,
      isPlaying: false,
    };
  },
  computed: {
    ...mapGetters('audio', { channels: 'listOfChannels', isActiveChannels: 'isActiveChannels' }),
    ...mapState('audio', { audio: 'context', source: 'source' }),
    ...mapState('stream', ['player', 'isActiveStream']),
  },
  methods: {
    ...mapActions('audio', ['createGainNodes', 'updateVolume']),
    ...mapActions('stream', ['updateInfo']),

    async loadPlaylist() {
      try {
        this.loading = true;
        this.error = null;

        const playlistId = this.$route.params.id;
        const response = await fetch(`/api/playlists/public/${playlistId}`, {
          method: 'GET',
          mode: 'cors',
          credentials: 'include',
        });

        if (!response.ok) {
          if (response.status === 403) {
            throw new Error('This playlist is private');
          } else if (response.status === 404) {
            throw new Error('Playlist not found');
          } else {
            throw new Error('Failed to load playlist');
          }
        }

        this.playlist = await response.json();

        // Load first track automatically
        if (this.playlist.tracks.length > 0) {
          this.selectTrack(0);
        }
      } catch (err) {
        this.error = err.message;
        console.error('Error loading playlist:', err);
      } finally {
        this.loading = false;
      }
    },

    selectTrack(index) {
      if (!this.playlist || !this.playlist.tracks[index]) return;

      this.currentTrackIndex = index;
      const track = this.playlist.tracks[index];

      // Update stream info
      this.updateInfo({
        url: track.id,
        type: 'dash',
        processing: true,
      });
    },

    playTrack(index) {
      this.selectTrack(index);
      // The AudioPlayer component will handle actual playback
    },

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
      const card = document.getElementById('touchstats:card');
      if (card) {
        card.style.transform = transform;
      }

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
  async mounted() {
    window.addEventListener('mousemove', mousemoveListener, false);
    this.decoder = new Mach1DecoderProxy(null, { debug: false });
    this.isMount = true;

    await this.loadPlaylist();

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

.playlist-header {
  text-align: center;
  padding: 2rem 0;
  border-bottom: 1px solid rgba(255, 255, 255, 0.1);
  margin-bottom: 2rem;
}

.playlist-title {
  color: var(--secondary-highlight-color);
  font-size: 2rem;
  font-weight: bold;
  margin-bottom: 0.5rem;
}

.playlist-info {
  color: rgba(255, 255, 255, 0.6);
  font-size: 1rem;
}

.track-list {
  display: flex;
  flex-direction: column;
  gap: 0.5rem;
}

.track-item {
  display: flex;
  align-items: center;
  padding: 1rem;
  background: rgba(255, 255, 255, 0.05);
  border-radius: 0;
  cursor: pointer;
  transition: all 0.2s ease;

  &:hover {
    background: rgba(255, 255, 255, 0.1);
  }

  &.active {
    background: rgba(var(--secondary-highlight-rgb), 0.2);
    border-left: 3px solid var(--secondary-highlight-color);
  }
}

.track-number {
  width: 40px;
  text-align: center;
  color: rgba(255, 255, 255, 0.5);
  font-weight: bold;
}

.track-info {
  flex: 1;
  margin: 0 1rem;
}

.track-name {
  color: var(--secondary-highlight-color);
  font-weight: 500;
  margin-bottom: 0.25rem;
}

.track-description {
  color: rgba(255, 255, 255, 0.5);
  font-size: 0.875rem;
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

.audioplayer-debug {
  padding: 0 55rem 0 55rem;

  article {
    padding-top: 0;
    padding-bottom: 0;
  }
}

article {
  background-color: var(--secondary-dark-color);
  border-radius: 0 !important;
}

main {
  padding-left: 55rem;
  padding-right: 55rem;
}

@media screen and (max-width: 768px) {
  main {
    padding-left: 1rem;
    padding-right: 1rem;
  }

  .audioplayer,
  .audioplayer-debug {
    padding-left: 1rem;
    padding-right: 1rem;
  }
}
</style>
