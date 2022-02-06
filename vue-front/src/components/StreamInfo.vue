<template>
  <div class="dash">
    <div class="dash-header">
      <h4>DASH STREAM INFO</h4>
    </div>
    <div class="flex-item scroll">
      <table class="table border center-align">
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

<style lang="scss" scoped>
  .flex-item {
    height: 35vh;
    &::-webkit-scrollbar-track
    {
      border-radius: 3em;
      background-color: #1d1d1e;
    }

    &::-webkit-scrollbar
    {
      width: 7px;
      background-color: #1d1d1e;
    }

    &::-webkit-scrollbar-thumb
    {
      border-radius: 3em;
      background-color: #858585;
    }
    scrollbar-color: #858585 #1d1d1e;
  }
  .dash-header {
    height: 25rem;
    margin-bottom: 8rem;
  }
  .table td {
    vertical-align: middle;
    text-align: left;
    cursor: pointer;
    border-color: #252526;
    padding-left: 0;
    p {
      color: #ffffff;
    }
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
    h4 {
      font-size: 18rem;
      color: #ffffff;
    }
  }
</style>
