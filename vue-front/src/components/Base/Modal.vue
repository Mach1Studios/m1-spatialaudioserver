<template>
  <div class="no-margin" :class="paddingSize">
    <div @click="open">
      <slot name="button">
        <button class="round border transparent-border default-mdl-btn" :class="buttonClasses">
          <i v-if="icon" class="material-icons fill">{{ icon }}</i>
          <span class="small-text">{{ button || title }}</span>
        </button>
      </slot>
    </div>

    <div v-show="currentPosition.active" class="active dark overlay" @click="close" />

    <div v-show="currentPosition.active" class="modal round no-scroll" :class="currentPosition">
      <nav>
        <button class="transparent round absolute right close" @click="close">
          <i class="material-icons">highlight_off</i>
        </button>
      </nav>

      <div :class="titleClasses">
        <slot name="header">
          <h4 class="title center-align large-text">
            {{ title }}
          </h4>
        </slot>
        <slot :close="close" />
      </div>

      <div class="large-width absolute center bottom">
        <slot name="footer" />
      </div>
    </div>
  </div>
</template>
<script>
import { mapMutations, mapState } from 'vuex';

export default {
  name: 'Modal',
  props: {
    button: String,
    buttonClasses: String,
    icon: {
      type: String,
      required: false,
    },
    padding: String,
    position: String,
    title: String,
    titleClasses: String,
  },
  computed: {
    ...mapState({ active: (state) => state.modalVisibility }),
    currentPosition() {
      const { active, position } = this;
      return {
        active: active !== null && this.title === active,
        [position]: true,
      };
    },
    paddingSize() {
      const { padding = 'no-padding' } = this;
      return { [padding]: true };
    },
  },
  methods: {
    ...mapMutations(['setModalVisibility']),
    close() {
      this.setModalVisibility();
    },
    open() {
      this.setModalVisibility(this.title);
    },
  },
};
</script>

<style lang="scss" scoped>
  .title {
    color: var(--secondary-highlight-color);

    font-weight: bold;
    line-height: 1.17;
    font-style: normal;
    letter-spacing: -0.5px;
    text-transform: uppercase;
  }

  .default-mdl-btn {
    margin: 0;

    i {
      color: var(--primary-highlight-color);
      font-size: 16px;
    }

    span {
      color: var(--primary-dark-color);
      font-size: 14px;
    }
  }

  .special-mdl-btn {
    i {
      color: var(--secondary-highlight-color);
      font-size: 16px;
    }

    span {
      color: var(--secondary-highlight-color);
      font-size: 14px;
    }
  }

  .close {
    padding-right: 0;
    padding-top: 16px;

    i {
      color: var(--secondary-highlight-color);
      font-size: 20px;
    }
  }
  button.border::after {
    background-image: none;
  }

  .active {
    animation: none;
  }

  nav {
    button:hover {
      background-color: transparent;

      i {
        color: var(--secondary-highlight-color);
        font-size: 20px;
      }
    }
  }

  .modal {
    background-color: var(--secondary-dark-color);
    max-height: 74vh;
  }

  .button:focus::after, .button:hover::after, button:focus::after, button:hover::after {
    background: none;
  }

  .modal.medium {
    height: auto;
  }

  @media screen and (orientation: portrait) {
    .modal {
      box-sizing: content-box;
    }
  }
</style>
