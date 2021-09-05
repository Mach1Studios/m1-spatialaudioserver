<template>
  <div class="no-margin" :class="paddingSize">
    <div @click="open">
      <slot name="button">
        <button class="round border transparent-border default-modal-btn" :class="buttonClasses">
          <i v-show="icon" class="material-icons">{{icon}}</i>
          <span class="small-text">{{button || title}}</span>
        </button>
      </slot>
    </div>

    <div v-show="active" class="overlay active dark" @click="close"></div>

    <div class="modal round" :class="currentPosition">
      <nav>
        <button class="transparent round absolute right close" @click="close">
          <i class="material-icons">highlight_off</i>
        </button>
      </nav>

      <div :class="titleClasses">
        <slot name="header">
          <h4 class="title center-align large-text">{{title}}</h4>
        </slot>
        <slot></slot>
      </div>

      <div class="large-width absolute center bottom">
        <slot name="footer"></slot>
      </div>
    </div>
  </div>
</template>
<script>
export default {
  name: 'Modal',
  props: {
    button: String,
    buttonClasses: String,
    icon: String,
    padding: String,
    position: String,
    title: String,
    titleClasses: String,
  },
  data() {
    return {
      active: false,
    };
  },
  computed: {
    currentPosition() {
      const { active, position } = this;
      return {
        active,
        [position]: true,
      };
    },
    paddingSize() {
      const { padding } = this;
      return {
        [padding]: true,
      };
    },
  },
  methods: {
    close() {
      this.active = false;
    },
    open() {
      this.active = true;
    },
  },
};
</script>

<style lang="scss" scoped>
  .title {
    font-style: normal;
    font-weight: bold;

    line-height: 1.17;
    letter-spacing: -0.5px;
    text-transform: uppercase;
  }

  .default-modal-btn {
    i {
      font-size: 14px;
      color: #4d4d4d;
    }
    span {
      color: #1c1c1c;
      font-size: 14px;
    }

    &:hover {
      i {
        font-size: 18px;
      }
    }
  }

  .close {
    padding-top: 16px;
    padding-right: 0;
    i {
      color: #1c1c1c;
    }
  }

  td>nav>div>button {
    min-height: 24rem;
    max-height: 24rem;
  }
</style>
