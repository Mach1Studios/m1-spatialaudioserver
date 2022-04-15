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
  .dash {
    margin-bottom: 0;
    padding-bottom: 0;
    max-height: 40vh;
    h4 {
      font-size: 18rem;
      color: #ffffff;
    }
  }
  .dash-header {
    height: 25rem;
    margin-bottom: 8rem;
  }
  .flex-item {
    max-height: 35vh;
    height: auto;
    &::-webkit-scrollbar-track
    {
      border-radius: 3rem;
      background-color: #323237;
    }

    &::-webkit-scrollbar
    {
      width: 5rem;
      border-radius: 3rem;
      background-color: #323237;
    }

    &::-webkit-scrollbar-thumb
    {
      border-radius: 3em;
      background-color: #858585;
    }

    scrollbar-color: #858585 #323237;
    scrollbar-width: thin;
  }
  .table-dash {
    border-radius: 0.3rem;
    td {
      vertical-align: middle;
      text-align: left;
      cursor: pointer;
      border-color: #252526;
      padding-left: 0;
      p {
        color: #ffffff;
      }
    }
  }
  @media screen and (orientation: portrait) {
    .dash {
      padding-bottom: 5rem;
    }
    .dash-header {
      padding: 10rem 0 0 0;
    }
    .flex-item {
      max-height: calc((100vh - 2 * var(--height) + 50px - 12em - 30rem) / 2 );
      height: auto;
    }
  }
  // @media screen and (orientation: landscape) {
  //   .dash {
  //     padding-bottom: 10rem;
  //   }
  //   .dash-header {
  //     padding: 0 0 10rem 0;
  //   }
  //   .flex-item {
  //     max-height: calc(100vh - 2 * var(--height) - 50px - 6em);
  //     height: auto;
  //   }
  // }
</style>
