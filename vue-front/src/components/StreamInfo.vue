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
  @media screen and (orientation: portrait) {
    .flex-item {
      height: auto;
    }
  }
  // /* SCSS for Extra Small (xs) screen */
  // @media only screen and (max-width: 375px) {
  //   .flex-item {
  //     height: 30vh;
  //   }
  //   .dash {
  //     padding-bottom: 5rem;
  //   }
  //   .dash-header {
  //     padding-bottom: 10rem;
  //     padding-top: 10rem;
  //   }
  // }
  // /* SCSS for Extra Small (md) & Landscap screen */
  // @media only screen and (max-width: 823px) and (min-width:801px) {
  //   .flex-item {
  //     height: 17vh;
  //   }
  //   .dash-header {
  //     padding-top: 10rem;
  //   }
  // }
  // /* SCSS for Small (sm) & Landscap Mobile screen */
  // @media only screen and (max-width: 568px) and (min-width: 414px){
  //   .flex-item {
  //     height: 35vh;
  //   }
  // }
  // /* SCSS for Extra Small (md) & Landscap screen */
  // @media only screen and (max-width: 1080px) and (min-width:823px) {
  //   .flex-item {
  //     height: 34vh;
  //   }
  // }
</style>
