<template>
  <div class="player">
    <vue-plyr>
      <audio controls crossorigin playsinline ref="player"></audio>
    </vue-plyr>
  </div>
</template>

<script>
import { mapState, mapActions } from 'vuex';
import dashjs from 'dashjs';

export default {
  name: 'Player',
  computed: mapState('dash', ['info', 'url', 'settings']),
  methods: {
    ...mapActions('dash', ['start', 'updateChannels', 'updateInfo']),
  },
  mounted() {
    const player = dashjs.MediaPlayer().create();
    // player.updateSettings(this.settings);
    player.initialize(this.$refs.player, this.url, true);
    this.start(player);

    player.on(dashjs.MediaPlayer.events.MANIFEST_LOADED, ({ data }) => {
      const audioAdaptationSet = data.Period.AdaptationSet_asArray.find((elem) => elem.contentType === 'audio');
      const numChannels = Number(audioAdaptationSet.Representation_asArray[0].AudioChannelConfiguration.value);

      this.updateChannels(numChannels);

      const { profiles, minimumUpdatePeriod, suggestedPresentationDelay } = data;
      this.updateInfo({ profiles, minimumUpdatePeriod, suggestedPresentationDelay });
    });

    player.on(dashjs.MediaPlayer.events.ERROR, (error) => {
      console.log('error', error);
    });
  },

};
</script>

<style scoped>
  .hidden {
    display: none;
  }
  .player {
    --plyr-color-main: #7a7a7a;
    --plyr-audio-controls-background: #ffffff;
    --plyr-audio-control-color: #1c1c1c;
    --plyr-audio-control-color-hover: #1c1c1c;
    --plyr-audio-control-background-hover: #dbdbdb;
    --plyr-progress-loading-background: yellow;
  }
</style>
