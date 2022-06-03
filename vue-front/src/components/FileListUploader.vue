<template>
  <div class="file-uploader">
    <!-- <div class="row no-wrap">
      <div class="col">
        <button class="button small no-margin responsive round grey3">
          <input type="file" name="resume" multiple @change="changeFile" @click="typeOfFiles = 'standart'">
          <i class="material-icons-outlined">audiotrack</i>
          <span class="small-text upper">Select Audio Track</span>
        </button>
      </div>
      <div class="col min">
        <p class="bold upper white-text center-align">or</p>
      </div>
      <div class="col">
        <button class="button small no-margin responsive round grey3">
          <input type="file" name="resume" multiple @change="changeFile" @click="typeOfFiles = 'mach1'">
          <img class="btn-img" src="../assets/logo-btn.svg">
          <span class="small-text upper">Select MACH1 Formats audio track</span>
        </button>
      </div>
    </div> -->
    <button class="button small no-margin responsive round grey3 btn-uploader">
      <input type="file" name="resume" multiple @change="changeFile" @click="typeOfFiles = 'standart'">
      <i class="material-icons-outlined">audiotrack</i>
      <span class="small-text upper">Select Audio Track</span>
    </button>
    <details v-if="typeOfFiles === 'standart'">
      <summary class="card flat transparent no-padding">
        <div class="row no-wrap middle-align settings">
          <div class="col min">
            <i class="material-icons-outlined large">settings_suggest</i>
          </div>
          <div class="col">
            <h4 class="bold">
              Settings
            </h4>
            <div class="small-text">
              <span>set default input and output formats options</span>
            </div>
          </div>
        </div>
      </summary>
      <div class="card flat transparent no-padding">
        <FormSelect
          v-model="inputFormat"
          name="defaultInput"
          placeholder="SELECT INPUT FORMAT"

          select-skin="dark"
          :options="inputFormats"
          @change="changeInputFormat"
        />
        <FormSelect
          v-model="outputFormat"
          name="defaultOutput"
          placeholder="SELECT OUTPUT FORMAT"

          select-skin="dark"
          :options="outputFormats"
          @change="changeOutputFormat"
        />
        <div class="row">
          <div class="col s12">
            <label class="checkbox">
              <input type="checkbox">
              <span class="upper">Apply automatically to selected tracks</span>
            </label>
          </div>
          <div class="col s6">
            <button class="button small responsive round grey3" @click="updateDefaultFormats({ input: inputFormat, output: outputFormat })">
              <i class="material-icons-outlined">save</i>
              <span class="small-text upper">save as default</span>
            </button>
          </div>
          <div class="col s6">
            <button class="button small responsive round grey3" @click="applyDefaultFormatsForTracks({ inputFormat, outputFormat })">
              <i class="material-icons-outlined">double_arrow</i>
              <span class="small-text upper">apply to selected tracks</span>
            </button>
          </div>
        </div>
      </div>
    </details>
    <div class="small-padding">
      <label class="switch">
        <input
          type="checkbox"
          :checked="forceStandart"
          @click="forceStandart = !forceStandart"
        >
        <span class="small-text upper white-text">for MACH1 Formats audio track</span>
      </label>
    </div>
    <div>
      <!-- <div v-show="validated"> -->
      <div class="flex-item scroll">
        <table class="table-uploader flex-item">
          <thead>
            <th><abbr title="#">#</abbr></th>
            <th><abbr title="NAME">NAME</abbr></th>
            <th><abbr title="CHANNELS">CHANNELS</abbr></th>
            <th v-if="typeOfFiles === 'standart' && !forceStandart">
              <abbr title="INPUT">INPUT</abbr>
            </th>
            <th v-if="typeOfFiles === 'standart' && !forceStandart">
              <abbr title="OUTPUT">OUTPUT</abbr>
            </th>
            <th />
          </thead>
          <tbody>
            <tr v-for="(item, index) in files" :key="item">
              <td>
                <p class="medium-text">{{ index + 1 }}</p>
              </td>
              <td class="audioname">
                <p class="medium-text">{{ item.name }}</p>
              </td>
              <td>
                <p class="medium-text">{{ item.numberOfChannels }}</p>
              </td>
              <td>
                <FormSelect
                  v-if="typeOfFiles === 'standart' && !forceStandart"
                  v-model="item.inputFormat"

                  name="inputFormat"
                  :options="filteredInputFormats(item.numberOfChannels)"
                  select-skin="dark"
                  @change="changeInputFormat"
                />
              </td>
              <td>
                <FormSelect
                  v-if="typeOfFiles === 'standart' && !forceStandart"
                  v-model="item.outputFormat"

                  name="outputFormat"
                  :options="outputFormats"
                  select-skin="dark"
                  @change="changeOutputFormat"
                />
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
    <!-- </div> -->
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

      typeOfFiles: 'standart',
      forceStandart: false,
    };
  },
  computed: {
    ...mapState({
      defaultInput: (state) => state.uploads.defaultInput,
      defaultOutput: (state) => state.uploads.defaultOutput,
      defaultApply: (state) => state.uploads.defaultApply,
      files: (state) => state.uploads.files,
      // validated: (state) => state.formats.item.validated,
    }),
    ...mapGetters('uploads', ['inputFormats', 'outputFormats']),
  },
  methods: {
    ...mapActions('tracks', { request: 'upload' }),
    ...mapActions('uploads', ['applyDefaultFormatsForTracks', 'updateDefaultFormats', 'validateAudio']),
    ...mapActions(['toast']),
    ...mapMutations(['loader']),
    ...mapMutations('uploads', { remove: 'removeFile' }),
    changeInputFormat(event) {
      this.inputFormat = event.target.value;
    },
    changeOutputFormat(event) {
      this.outputFormat = event.target.value;
    },
    async changeFile(event) {
      const { files } = event.target;

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
    filteredInputFormats(numberOfChannels) {
      return _.filter(this.inputFormats, (format) => format.numberOfChannels === numberOfChannels);
    },
  },
  mounted() {
    this.inputFormat = this.defaultInput;
    this.outputFormat = this.defaultOutput;
  },
};
</script>

<style lang="scss" scoped>
  .settings {
    padding-bottom: 16rem;
    padding-top: 16rem;
    h4 {
      font-size: 21rem;
      margin: 0;
    }
    color: #e0e0e0;
    i {
      color: #e0e0e0;
      font-size: 30rem;
    }
    span {
      color: #55555c;
      font-weight: bold;
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
  .button button {
    color: #252526;
  }
  .table-uploader {
    margin-top: 16rem;
    overflow: hidden;

    width: 100%;
    height: auto;
    max-height: 15vh; // note important for playlist scroll
    max-width: 100%;
    th:nth-of-type(1) {
      width: 2%;
    }
    th {
      padding: 8rem 0 8rem 0;
      width: 10%;
    }
    th:nth-of-type(1n+4) {
      text-align: center;
      padding: 8rem 8rem 8rem 8rem;
      width: 40%;
    }
    abbr {
      color: #ffffff;
    }
    tbody{
      width: 100%;
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
      border-bottom: 1px #55555c solid;
      p {
        color: #ffffff;
        text-align: left;
      }
    }
  }
  table td {
    width: fit-content;
  }
  details {
    margin: 16rem 0 0 0;
  }
  .flex-item {
    &::-webkit-scrollbar-track
    {
      border-radius: 3em;
      background-color: #e0e0e0;
    }

    &::-webkit-scrollbar-thumb
    {
      border-radius: 3em;
      background-color: #858585;
    }
  }
  .checkbox {
    span {
      color: #e0e0e0;
      font-weight: bold;
    }
  }
  .btn-img {
    margin-right: 4rem;
  }
  @media screen and (orientation: portrait) {
    .btn-group {
      flex-flow: column;
    }

    .row.no-wrap.btn-group>.col {
      width: 100%;
    }
    .file-uploader {
      overflow-y: scroll;
      padding: 0 8rem 0 8rem;
    }
    .checkbox {
      white-space: break-spaces;
    }
    .table-uploader {
      width: 250%;
      max-width: 250%;
    }
  }
</style>
