<template lang="html">
  <div class="dash">
    <h4 class="title">DASH Stream Info</h4>
    <table class="table border large center-align">
      <tbody>
        <tr>
          <td>
            <p>Stream:</p>
          </td>
          <td>
            <p>{{url}}</p>
          </td>
        </tr>
        <tr>
          <td>
            <p>Number of audio channels</p>
          </td>
          <td>
            <p>{{channels}}</p>
          </td>
        </tr>
        <tr>
          <td>
            <p>Audio Bitrate</p>
          </td>
          <td>
            <p>{{info.audioBitRate}} Kbps</p>
          </td>
        </tr>
        <tr>
          <td>
            <p>Buffer Level</p>
          </td>
          <td>
            <p>{{info.audioBufferLevel}} secs</p>
          </td>
        </tr>
        <tr>
          <td>
            <p>Update Period</p>
          </td>
          <td>
            <p>{{info.minimumUpdatePeriod}} sec</p>
          </td>
        </tr>
        <tr>
          <td>
            <p>Suggestion Delay</p>
          </td>
          <td>
            <p>{{info.suggestedPresentationDelay}} sec</p>
          </td>
        </tr>
        <tr>
          <td>
            <p>Profiles</p>
          </td>
          <td>
            <p>{{info.profiles}}</p>
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
    ...mapState('dash', ['url', 'info']),
  },
};
</script>

<style lang="css" scoped>
  .dash .title {
    font-style: normal;
    font-weight: bold;
    font-size: 1rem;
    line-height: 1.17;
    letter-spacing: -0.5px;
  }
  .table td {
    vertical-align: middle;
    text-align: left;
    cursor: pointer;
  }
  .table {
    border-radius: 0.3rem;
  }
  .table-button {
    background: transparent;
    border: none;
  }
</style>
