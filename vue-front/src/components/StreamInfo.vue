<template>
  <div class="dash">
    <h4 class="title large-text upper">DASH Stream Info</h4>
    <table class="table border large center-align">
      <tbody>
        <tr>
          <td>
            <p class="medium-text bold">Stream:</p>
          </td>
          <td>
            <p class="medium-text">{{info.url}}</p>
          </td>
        </tr>
        <tr>
          <td>
            <p class="medium-text bold">Number of audio channels:</p>
          </td>
          <td>
            <p class="medium-text">{{channels}}</p>
          </td>
        </tr>
        <tr>
          <td>
            <p class="medium-text bold">Audio Bitrate:</p>
          </td>
          <td>
            <p class="medium-text">{{info.audioBitRate}} Kbps</p>
          </td>
        </tr>
        <tr>
          <td>
            <p class="medium-text bold">Buffer Level:</p>
          </td>
          <td>
            <p class="medium-text">{{info.audioBufferLevel}} secs</p>
          </td>
        </tr>
        <tr>
          <td>
            <p class="medium-text bold">Update Period:</p>
          </td>
          <td>
            <p class="medium-text">{{info.minimumUpdatePeriod}} sec</p>
          </td>
        </tr>
        <tr>
          <td>
            <p class="medium-text bold">Suggestion Delay:</p>
          </td>
          <td>
            <p class="medium-text">{{info.suggestedPresentationDelay}} sec</p>
          </td>
        </tr>
        <tr>
          <td>
            <p class="medium-text bold">Profiles:</p>
          </td>
          <td>
            <p class="medium-text">{{info.profiles}}</p>
          </td>
        </tr>
      </tbody>
    </table>
  </div>
</template>
<script>
import { mapState } from 'vuex';

export default {
  name: 'StreamInfo',
  computed: {
    ...mapState('audio', ['channels']),
    ...mapState('dash', ['info']),
  },
};
</script>

<style lang="css" scoped>
  .dash .title {
    font-style: normal;
    font-weight: bold;

    line-height: 1.17;
    letter-spacing: -0.5px;
  }

  .table td {
    vertical-align: middle;
    text-align: left;
    cursor: pointer;
    border-bottom: 1px #dfdfdf dotted;
  }

  .table {
    border-radius: 0.3rem;
  }

  .table-button {
    background: transparent;

    border: none;
  }
  table {
    border-spacing: 2px;
  }
</style>
