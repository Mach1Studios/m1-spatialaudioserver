<template>
  <div class="large-width playlist-form">
    <FormInput name="name" placeholder="Name" type="text" v-model="playlist.name"/>
    <div>
      <FormButton v-if="!playlistId" title="Add Playlist" icon="add" @click="add()"/>
      <FormButton v-else title="Save" icon="save" @click="save()"/>
    </div>
  </div>
</template>

<script>
import { mapActions } from 'vuex';

import FormButton from './Form/Button.vue';
import FormInput from './Form/Input.vue';

export default {
  name: 'PlaylistForm',
  props: {
    playlistId: String,
    name: String,
  },
  components: {
    FormButton,
    FormInput,
  },
  data() {
    return {
      playlist: {
        id: '',
        name: '',
      },
      focused: {},
    };
  },
  methods: {
    ...mapActions('playlists', ['create', 'update']),
    select({ target: { name }, type }) {
      if (type === 'focus') {
        this.focused[name] = true;
      } else if (type === 'blur' && this.playlist[name] === '') {
        this.focused[name] = false;
      }
    },
    add() {
      this.create(this.playlist);
    },
    save() {
      this.update(this.playlist);
    },
  },
  created() {
    const { playlistId, name } = this;
    if (playlistId && name) {
      this.playlist.id = playlistId;
      this.playlist.name = name;
    }
  },
};
</script>

<style lang="scss" scoped>
  .playlist-form {
    .title {
      font-style: normal;
      font-weight: bold;

      line-height: 1.17;
      letter-spacing: -0.5px;
      text-transform: uppercase;
    }
    i {
      font-size: 16px;
      color: #4d4d4d;
    }
    input {
      &:focus {
        border-color: #1c1c1c;
      }
    }
    select{
      &:focus {
        border-bottom: 2rem solid #1c1c1c;
      }
    }
    span {
      color: #1c1c1c;
    }
    i {
      font-size: 16px;
      color: #4d4d4d;
    }
    button {
      width: 100%;
      padding: 0;
      margin: 16rem 0 16rem 0;
    }
  }
</style>
