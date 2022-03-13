<template>
  <div class="file-uploader">
    <div class="card round flat grey4">
      <button class="button small no-margin responsive round grey3">
          <input type="file" name="resume" @change="changeFile" multiple>
          <i class="material-icons-outlined">audiotrack</i>
          <span class="small-text upper">Select Audio Track</span>
      </button>
      <div v-show="validated">
        <details>
          <summary class="card flat transparent">
            <div class="row no-wrap middle-align">
              <div class="col min">
                <i class="material-icons-outlined">settings_suggest</i>
              </div>
              <div class="col">
                <div>Settings</div>
                <div class="small-text">set default input and output formats options</div>
              </div>
            </div>
          </summary>
          <div class="card flat transparent">
            <FormSelect name="" placeholder="SELECT INPUT FORMAT" style="color: #1c1c1c;" :options="inputFormats" :defaultValue="defaultInput" @change="changeInputFormat"/>
            <FormSelect name="" placeholder="SELECT OUTPUT FORMAT" :options="outputFormats" :defaultValue="defaultOutput" @change="changeOutputFormat"/>
            <button class="button small responsive round grey3" @change="switchdefaultInputEnable, switchdefaultOutputEnable">
              <i class="material-icons-outlined">save</i>
              <span class="small-text upper">save</span>
            </button>
          </div>
        </details>
        <div class="flex-item scroll">
          <table class="table-uploader flex-item space">
            <thead>
              <th>#</th>
              <th>NAME</th>
              <th>INPUT</th>
              <th>OUTPUT</th>
              <th></th>
            </thead>
            <tbody>
              <tr v-for="(item, index) in files" :key="item">
                <td>
                  <p class="medium-text">{{ index + 1 }}</p>
                </td>
                <td class="audioname">
                  <p class="medium-text">{{item.name}}</p>
                </td>
                <td>
                  <FormSelect name="" :options="inputFormats" :defaultValue="defaultInput" @change="changeInputFormat"/>
                  <!-- <p class="medium-text">{{inputFormat}}</p> -->
                </td>
                <td>
                  <FormSelect name="" :options="outputFormats" :defaultValue="defaultOutput" @change="changeOutputFormat"/>
                  <!-- <p class="medium-text">{{outputFormat}}</p> -->
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
        <!-- <FormSelect name="" placeholder="SELECT INPUT FORMAT" :options="inputFormats" :defaultValue="defaultInput" @change="changeInputFormat"/>
        <label class="switch">
          <input type="checkbox" @change="switchdefaultInputEnable">
          <span>set this option as default</span>
        </label>
        <FormSelect name="" placeholder="SELECT OUTPUT FORMAT" :options="outputFormats" :defaultValue="defaultOutput" @change="changeOutputFormat"/>
        <label class="switch">
          <input type="checkbox" @change="switchdefaultOutputEnable">
          <span>set this option as default</span>
        </label> -->
      </div>
  </div>
  <button class="button small responsive round grey3" @click="upload">
      <i class="material-icons-outlined">file_upload</i>
      <span class="small-text">UPLOAD</span>
  </button>
</div>
</template>

<!-- <template>
  <div>
    <div class="card round flat grey-light-5">
      <button class="button small no-margin responsive round grey-light-3">
          <input type="file" name="resume" @change="changeFile" multiple>
          <i class="material-icons-outlined">audiotrack</i>
          <span class="small-text">Select Audio Track</span>
      </button>
      <div v-show="validated">
        <FormSelect name="" placeholder="SELECT INPUT FORMAT" :options="inputFormats" :defaultValue="defaultInput" @change="changeInputFormat"/>
        <label class="switch">
          <input type="checkbox" @change="switchdefaultInputEnable">
          <span>set this option as default</span>
        </label>
        <FormSelect name="" placeholder="SELECT OUTPUT FORMAT" :options="outputFormats" :defaultValue="defaultOutput" @change="changeOutputFormat"/>
        <label class="switch">
          <input type="checkbox" @change="switchdefaultOutputEnable">
          <span>set this option as default</span>
        </label>
      </div>
      <div class="flex-item scroll">
        <table class="table-uploader border flex-item">
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
  <button class="button small responsive round grey-light-3" @click="upload">
      <i class="material-icons-outlined">file_upload</i>
      <span class="small-text">UPLOAD</span>
  </button>
</div>
</template> -->

<script>
import {
  mapState, mapActions, mapGetters, mapMutations,
} from 'vuex';
import _ from 'lodash';

import FormSelect from './Form/Select.vue';

export default {
  name: 'FileListUploader',
  components: { FormSelect },
  data() {
    return {
      inputFormat: null,
      outputFormat: null,

      defaultInputEnable: false,
      defaultOutputEnable: false,

      files: [],
    };
  },
  computed: {
    ...mapState({
      defaultInput: (state) => state.formats.defaultInput,
      defaultOutput: (state) => state.formats.defaultOutput,
      // validated: (state) => state.formats.item.validated,
    }),
    ...mapGetters('formats', ['inputFormats', 'outputFormats', 'validated']),
  },
  methods: {
    ...mapActions('tracks', { request: 'upload' }),
    ...mapActions(['toast']),
    ...mapActions('formats', ['updateDefaultFormats', 'validateAudio']),
    ...mapMutations(['loader']),
    changeInputFormat(event) {
      this.inputFormat = event.target.value;

      if (this.defaultInputEnable) {
        this.updateDefaultFormats({ input: this.inputFormat });
      }
    },
    changeOutputFormat(event) {
      this.outputFormat = event.target.value;

      if (this.defaultOutputEnable) {
        this.updateDefaultFormats({ output: this.outputFormat });
      }
    },
    switchdefaultInputEnable() {
      this.defaultInputEnable = !this.defaultInputEnable;

      this.updateDefaultFormats({
        input: this.defaultInputEnable
          ? _.get(this, 'inputFormat', null)
          : null,
      });
    },
    switchdefaultOutputEnable() {
      this.defaultOutputEnable = !this.defaultOutputEnable;

      this.updateDefaultFormats({
        output: this.defaultOutputEnable
          ? _.get(this, 'outputFormat', null)
          : null,
      });
    },
    remove(item) {
      this.files = _.filter(this.files, (file) => file.name !== item.name);
    },
    async changeFile(event) {
      const { files } = event.target;
      this.files = _.union(this.files, files);

      _.each(this.files, (file) => {
        this.validateAudio(file);
      });
    },
    async upload() {
      if (this.files.length === 0) {
        this.toast({ error: new Error('Please, select sound file!') });
      }
      this.loader({ enable: true });

      // eslint-disable-next-line
      for (const file of this.files) {
        // eslint-disable-next-line
        await this.request({
          file,
          inputFormat: this.inputFormat,
          outputFormat: this.outputFormat,
        });
      }
      this.loader({ enable: false });
    },
  },
};
</script>

<style lang="scss" scoped>
  .table-uploader {
    margin-top: 16rem;
    overflow-y: scroll;
    height: auto;
    max-height: 15vh; // note important for playlist scroll
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
      padding: 0 8rem 0 0;
      border-bottom: 1px #212121 solid;
      &:nth-child(3){
        width: 50%;
      }
      &:nth-child(4) {
        width: 50%;

      }
      p {
        color: #1c1c1c;
        text-align: justify;
      }
    }
  }
  .button {
    margin: 16rem 0 16rem 0;

    i {
      font-size: 16px;
      color: #4d4d4d;
    }
    span {
      color: #1c1c1c;
    }
  }
  details {
    margin: 16rem 0 16rem 0;
  }
  .field>select {
    background-color: #1c1c1c;
  }
  .button button {
    color: #1c1c1c;
  }
  label {
    font-size: 12rem;
    color: #5e5e5e;
  }
  .flex-item {
    &::-webkit-scrollbar-track
    {
      border-radius: 3em;
      background-color: #e0e0e0;
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
