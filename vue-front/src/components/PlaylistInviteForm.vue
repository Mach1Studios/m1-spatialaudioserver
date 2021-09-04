<template lang="html">
  <div class="large-width invite">
    <h4 class="title center-align large-text">Invite users to playlist</h4>
    <div>
      <button class="border round transparent-border small-space grey-light-3">
        <i class="material-icons">send</i>
        <span class="small-text">Invite</span>
      </button>
    </div>
  </div>
</template>

<script>

export default {
  name: 'PlaylistInviteForm',
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
