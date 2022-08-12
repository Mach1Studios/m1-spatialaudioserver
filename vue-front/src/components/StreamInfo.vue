<template>
  <div class="dash">
    <div class="dash-header">
      <h4>DASH STREAM INFO</h4>
    </div>
    <div class="flex-item scroll">
      <table class="table-dash border center-align">
        <tbody>
          <tr>
            <td>
              <p class="medium-text bold">Stream:</p>
            </td>
            <td>
              <p class="medium-text info">{{ info.url }}</p>
            </td>
          </tr>
          <tr>
            <td>
              <p class="medium-text bold">Number of audio channels:</p>
            </td>
            <td>
              <p class="medium-text info">{{ channels }}</p>
            </td>
          </tr>
          <tr>
            <td>
              <p class="medium-text bold">Audio Bitrate:</p>
            </td>
            <td>
              <p class="medium-text info">{{ info.audioBitRate }} Kbps</p>
            </td>
          </tr>
          <tr>
            <td>
              <p class="medium-text bold">Buffer Level:</p>
            </td>
            <td>
              <p class="medium-text info">{{ info.audioBufferLevel }} secs</p>
            </td>
          </tr>
          <tr>
            <td>
              <p class="medium-text bold">Update Period:</p>
            </td>
            <td>
              <p class="medium-text info">{{ info.minimumUpdatePeriod }} sec</p>
            </td>
          </tr>
          <tr>
            <td>
              <p class="medium-text bold">Suggestion Delay:</p>
            </td>
            <td>
              <p class="medium-text info">{{ info.suggestedPresentationDelay }} sec</p>
            </td>
          </tr>
          <tr>
            <td>
              <p class="medium-text bold">Profiles:</p>
            </td>
            <td>
              <p class="medium-text info">{{ info.profiles }}</p>
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
    ...mapState('stream', ['info']),
  },
};
</script>

<style lang="scss" scoped>
  .dash {
    margin-bottom: 0;
    max-height: 40vh;
    padding-bottom: 0;

    h4 {
      color: #ffffff;
      font-size: 18rem;
    }
  }

  .dash-header {
    height: 25rem;
    margin-bottom: 8rem;
  }

  .flex-item {
    height: auto;
    max-height: 35vh;

    &::-webkit-scrollbar-track {
      background-color: #323237;
      border-radius: 3rem;
    }

    &::-webkit-scrollbar {
      background-color: #323237;
      border-radius: 3rem;
      width: 5rem;
    }

    &::-webkit-scrollbar-thumb {
      background-color: #858585;
      border-radius: 3em;
    }

    scrollbar-color: #858585 #323237;
    scrollbar-width: thin;
  }

  .table-dash {
    border-radius: 0.3rem;

    td {
      border-color: #252526;
      padding-left: 0;
      text-align: left;
      vertical-align: middle;

      cursor: pointer;

      p {
        color: #ffffff;
      }

      p.info {
        color: #ffffff;
      }
    }
  }

  .table-dash td p .info {
    color: #626161;
  }

  @media screen and (orientation: portrait) {
    .dash {
      padding-bottom: 5rem;
    }

    .dash-header {
      padding: 10rem 0 0 0;
    }

    .flex-item {
      height: auto;
      max-height: calc((100vh - 2 * var(--height) + 50px - 12em - 30rem) / 2 );
    }
  }
</style>
