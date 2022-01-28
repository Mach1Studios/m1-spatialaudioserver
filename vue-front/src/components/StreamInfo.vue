<template>
  <div class="dash">
    <p>DASH STREAM INFO</p>
    <div class="flex-item scroll">
      <table class="table border center-align">
        <!-- <thead>
          <th>DASH STREAM INFO</th>
        </thead> -->
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
  .flex-item {
    height: 35vh;
    &::-webkit-scrollbar-track
    {
      border-radius: 3em;
      background-color: #323237;
    }

    &::-webkit-scrollbar
    {
      width: 7px;
      background-color: #323237;
    }

    &::-webkit-scrollbar-thumb
    {
      border-radius: 3em;
      height: 7em;
      background-color: #858585;
    }
  }
  .table td {
    vertical-align: middle;
    text-align: left;
    cursor: pointer;
    border-color: #252526;
  }

  .table {
    border-radius: 0.3rem;
  }

  .table-button {
    background: transparent;

    border: none;
  }
  .dash {
    margin-bottom: 0;
    padding-bottom: 0;
    max-height: 40vh;
  }
</style>
