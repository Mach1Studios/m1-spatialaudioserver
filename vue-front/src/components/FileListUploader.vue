<template>
  <div class="file-uploader">
    <div class="card round flat grey4">
      <button class="button small no-margin responsive round grey3">
          <input type="file" name="resume" @change="changeFile" multiple>
          <i class="material-icons-outlined">audiotrack</i>
          <span class="small-text upper">Select Audio Track</span>
      </button>
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
          <FormSelect name="" placeholder="SELECT INPUT FORMAT" selectSkin="light" :options="inputFormats" :defaultValue="defaultInput" @change="changeInputFormat"/>
          <FormSelect name="" placeholder="SELECT OUTPUT FORMAT" selectSkin="light" :options="outputFormats" :defaultValue="defaultOutput" @change="changeOutputFormat"/>
          <div class="row">
            <div class="col s6">
              <button class="button small responsive round grey3" @change="switchDefaultInputEnable, switchDefaultOutputEnable">
                <i class="material-icons-outlined">save</i>
                <span class="small-text upper">save as default</span>
              </button>
            </div>
            <div class="col s6">
              <button class="button small responsive round grey3" @change="switchDefaultInputEnable, switchDefaultOutputEnable">
                <i class="material-icons-outlined">double_arrow</i>
                <span class="small-text upper">apply to selected tracks</span>
              </button>
            </div>
          </div>
        </div>
      </details>
      <div>
      <!-- <div v-show="validated"> -->
        <div class="flex-item scroll">
          <table class="table-uploader flex-item space">
            <thead>
              <th><abbr title="#">#</abbr></th>
              <th><abbr title="NAME">NAME</abbr></th>
              <th><abbr title="CHANNELS">CHANNELS</abbr></th>
              <th><abbr title="INPUT">INPUT</abbr></th>
              <th><abbr title="OUTPUT">OUTPUT</abbr></th>
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
                  <p class="medium-text">{{item.numberOfChannels}}</p>
                </td>
                <td>
                  <FormSelect name="" :options="inputFormats" selectSkin="light" :defaultValue="defaultInput" @change="changeInputFormat"/>
                </td>
                <td>
                  <FormSelect name="" :options="outputFormats" selectSkin="light" :defaultValue="defaultOutput" @change="changeOutputFormat"/>
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
  </div>
  <button class="button small responsive round grey3" @click="upload">
      <i class="material-icons-outlined">file_upload</i>
      <span class="small-text">UPLOAD</span>
  </button>
</div>
</template>

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

      // files: [],
    };
  },
  computed: {
    ...mapState({
      defaultInput: (state) => state.uploads.defaultInput,
      defaultOutput: (state) => state.uploads.defaultOutput,
      files: (state) => state.uploads.files,
      // validated: (state) => state.formats.item.validated,
    }),
    ...mapGetters('uploads', ['inputFormats', 'outputFormats', 'validated']),
  },
  methods: {
    ...mapActions('tracks', { request: 'upload' }),
    ...mapActions('uploads', ['updateDefaultFormats', 'validateAudio']),
    ...mapActions(['toast']),
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
    switchDefaultInputEnable() {
      this.defaultInputEnable = !this.defaultInputEnable;

      this.updateDefaultFormats({
        input: this.defaultInputEnable
          ? _.get(this, 'inputFormat', null)
          : null,
      });
    },
    switchDefaultOutputEnable() {
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
      // this.files = _.union(this.files, files);
      _.each(_.union(this.files, files), (file) => {
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
    display: block;
    overflow-x: hidden;

    width: 100%;
    .audioname {
    }
    tbody{
        width: 100%;
        display: table;
    }
    button {
      &:hover {
        i {
          font-size: 20px;
          color: #252526;
        }
      }
    }
    button.border::after {
      background-image: none;
    }

    td {
      padding: 0 8rem 0 0;
      border-bottom: 1px #b1b1b1 solid;
      p {
        color: #252526;
        text-align: center;
        &:nth-child(1){
          text-align: left;
        }
        &:nth-child(2) {
          text-align: left;
        }
      }
    }
    abbr {
      text-align: center;
    }
  }
  .button {
    margin: 16rem 0 16rem 0;

    i {
      font-size: 16px;
      color: #626161;
    }
    span {
      color: #252526;
    }
  }
  details {
    margin: 16rem 0 16rem 0;
  }
  .field>select {
    background-color: #252526;
  }
  .button button {
    color: #252526;
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
      // background-color: #fafafa;
    }

    &::-webkit-scrollbar-thumb
    {
      border-radius: 3em;
      background-color: #858585;
    }
  }
</style>
