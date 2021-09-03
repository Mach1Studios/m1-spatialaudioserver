<template lang="html">
  <div class="large-width rename-playlist">
    <h4 class="title center-align large-text">Rename Playlist</h4>
    <div class="field label border">
      <input name="name" type="text" autocomplete="off" @focus="select" @blur="select">
      <label>New name</label>
    </div>
    <div>
      <button class="border round transparent-border small-space grey-light-3">
        <i class="material-icons">save</i>
        <span class="small-text">Save</span>
      </button>
    </div>
  </div>
</template>

<script>

export default {
  name: 'PlaylistEditForm',
};
</script>

<style lang="scss" scoped>
  .rename-playlist {
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
