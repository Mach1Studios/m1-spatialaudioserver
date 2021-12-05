<template>
  <div class="medium-margin medium-padding">
    <div class="card round flat grey-light-5">
      <button class="button no-margin small round border transparent-border small-space grey-light-3">
          <input type="file" name="resume" @change="changeFile" multiple>
          <i class="material-icons-outlined">audiotrack</i>
          <span class="small-text">Select Audio Track</span>
      </button>
      <FormSelect name="" placeholder="SELECT INPUT FORMAT" :options="items" @change="changeInputFormat"/>
      <label class="switch">
        <input type="checkbox">
        <span>set this option as default</span>
      </label>
      <FormSelect name="" placeholder="SELECT OUTPUT FORMAT" :options="items" @change="changeOutputFormat"/>
      <label class="switch">
        <input type="checkbox">
        <span>set this option as default</span>
      </label>
      <div class="flex-item scroll">
        <table class="list-table border flex-item">
          <tbody>
            <tr v-for="(item, index) in files" :key="item">
              <td>
                <p class="medium-text">{{ index + 1 }}</p>
              </td>
              <td class="audioname">
                <p class="medium-text">{{item.name}}</p>
              </td>
              <td>
                <p class="medium-text">{{inputFormat}}</p>
              </td>
              <td>
                <p class="medium-text">{{outputFormat}}</p>
              </td>
              <td>
                <nav class="right-align">
                  <button class="button border round transparent-border" @click="remove(item)">
                    <i class="material-icons">delete</i>
                  </button>
                </nav>
              </td>
            </tr>
          </tbody>
        </table>
    </div>
  </div>
  <button class="button small border round transparent-border small-space grey-light-3">
      <input type="file" name="resume" @change="upload">
      <i class="material-icons-outlined">file_upload</i>
      <span class="small-text">UPLOAD</span>
  </button>
</div>
</template>

<script>
import { mapState, mapActions, mapMutations } from 'vuex';
import _ from 'lodash';

import FormSelect from './Form/Select.vue';

export default {
  name: 'FileListUploader',
  components: {
    FormSelect,
  },
  data() {
    return {
      inputFormat: null,
      outputFormat: null,
      files: [],
    };
  },
  computed: {
    ...mapState({
      items: (state) => state.formats.items,
    }),
  },
  methods: {
    ...mapActions('tracks', { request: 'upload' }),
    ...mapMutations(['loader']),
    changeInputFormat(event) {
      this.inputFormat = event.target.value;
    },
    changeOutputFormat(event) {
      this.outputFormat = event.target.value;
    },
    remove(item) {
      this.files = _.filter(this.files, (file) => file.name !== item.name);
    },
    async changeFile(event) {
      const { files } = event.target;
      // this.files = _.unionBy(this.files, files, 'name');
      this.files = _.union(this.files, files);
    },
    async upload(event) {
      this.loader({ enable: true });
      const [file] = event.target.files;

      await this.request(file);
      this.loader({ enable: false });
    },
  },
};
</script>

<style lang="scss" scoped>
  .list-table {
    margin-top: 16rem;
    overflow-y: scroll;
    height: auto;
    max-height: 45vh; // note important for playlist scroll
    max-width: 100%;

    display: flex;
    flex-direction: column;
    align-content: space-between;
    display: block;
    overflow-x: hidden;
    .audio-name {
      width: 30%;
      word-break: break-all;
    }
    button {
      &:hover {
        i {
          font-size: 20px;
          color: #1c1c1c;
        }
      }
    }
    button.border::after {
      background-image: none;
    }
    td {
      padding: 0;
      &:last-child {
        padding-right: 13px;
      }
      p {
        color: #1c1c1c;
        text-align: justify;
      }
    }
    tr {
      // vertical-align: middle;
    }
  }
  .button {
    width: 100%;
    padding: 0;
    margin: 16rem 0 16rem 0;

    i {
      font-size: 16px;
      color: #4d4d4d;
    }
    span {
      color: #1c1c1c;
    }
  }
  .flex-item {
    // flex-shrink: 2;
    // flex-basis: 20%;
    &::-webkit-scrollbar-track
    {
      border-radius: 3em;
      background-color: #fafafa;
    }

    &::-webkit-scrollbar
    {
      width: 7px;
      background-color: #fafafa;
    }

    &::-webkit-scrollbar-thumb
    {
      border-radius: 3em;
      background-color: #858585;
    }
  }
  .switch {
    filter: grayscale(100%) !important;
    text-transform: uppercase;
    span {
      font-size: 12rem;
    }
  }
  .switch input:focus, .switch input:active, .switch input:hover {
    background: none;
  }

  // @keyframes quiet {
  //   25%{
  //     transform: scaleY(.6);
  //   }
  //   50%{
  //     transform: scaleY(.4);
  //   }
  //   75%{
  //     transform: scaleY(.8);
  //   }
  // }
  //
  // @keyframes normal {
  //   25%{
  //     transform: scaleY(1);
  //   }
  //   50%{
  //     transform: scaleY(.4);
  //   }
  //   75%{
  //     transform: scaleY(.6);
  //   }
  // }
  //
  // @keyframes loud {
  //   25%{
  //     transform: scaleY(1);
  //   }
  //   50%{
  //     transform: scaleY(.4);
  //   }
  //   75%{
  //     transform: scaleY(1.2);
  //   }
  // }
  //
  // .waveContainer {
  //   display: flex;
  //   width: calc((var(--boxSize) + var(--gutter)) * 5);
  //   height: 35px;
  //
  //   justify-content: space-between;
  //   --boxSize: 2px;
  //   --gutter: 2px;
  // }
  //
  // .wave {
  //   height: 100%;
  //   width: var(--boxSize);
  //
  //   transform: scaleY(.4);
  //
  //   background: #1c1c1c;
  //   border-radius: 8px;
  // }
  //
  // button:hover .wave {
  //   transform: scaleY(.4);
  //   animation-duration: 1.2s;
  //   animation-timing-function: ease-in-out;
  //   animation-iteration-count: infinite;
  // }
  //
  // .wave1 {
  //   animation-name: quiet;
  // }
  //
  // .wave2 {
  //   animation-name: normal;
  // }
  //
  // .wave3 {
  //   animation-name: quiet;
  // }
  //
  // .wave4 {
  //   animation-name: loud;
  //   background: transparent;
  // }
  //
  // .wave5 {
  //   animation-name: quiet;
  // }
</style>
