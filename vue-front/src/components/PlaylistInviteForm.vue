<template>
  <div class="large-width invite">
    <FormSelect name="" placeholder="Role"/>
    <FormButton title="Invite" icon="send" @click="send()"/>
  </div>
</template>

<script>
// import { mapActions } from 'vuex';

import FormButton from './Form/Button.vue';
import FormSelect from './Form/Select.vue';

export default {
  name: 'PlaylistInviteForm',
  components: {
    FormButton,
    FormSelect,
  },
  data() {
    return {
    };
  },
  methods: {
  },
};
</script>

<style lang="scss" scoped>
  .invite {
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
