<template>
  <div class="info">
    <h4 class="title upper white-text">About</h4>
    <p class="white-text">
      Mach1 preserves traditional audio engineering best practices enabling the artist to be in full creative control.
      We are not just looking to the masters of the past,
      but connecting and expanding on their core values and motivations, making sure that we bring ourselves, as craftsmen, into emerging and new mediums.
    </p>
    <p class="white-text paragraph">
      Defending craft matters. Without it, our work and innovations are just research and development for the existing repressive system.
    </p>
    <p class="white-text paragraph">
      A Renaissance of sound is happening as sound quality is critical for maintaining immersion and our openness
      to this fundamental change should not create footholds that undermine the craft in service of the technical.
    </p>
    <p class="white-text paragraph">
      Unlike other spatial formats, with Mach1 Spatial all surround and spatial rendered sound field formats are ingestible without alteration to the sound field.
      Mach1 Spatial achieves a perfect 1:1 with what the audio producer or engineer created. Mach1 Spatial is transparent there is no processing or filtering effects
      to simulate directionality at the expense of quality. With Mach1 your creative mix is the technical mix. We want to help build the world that values, artists, sound and craftsmanship.
    </p>
    <div class="large-divider"></div>
    <div class="row">
      <div class="col s12">
        <h2 class="title upper white-text">Follow us:</h2>
        <a href="https://www.instagram.com/poweredbymach1/">
          <img class="social-icon top" src="../assets/icons8-instagram.svg">
        </a>
        <a href="https://www.twitter.com/poweredbymach1">
          <img class="social top" src="../assets/icons8-twitter.svg">
        </a>
        <a href="https://join.slack.com/t/spatialaudio/shared_invite/enQtNjk0ODE4NjQ4NjExLWQ5YWUyNWQ4NWEwMDEwZmJiNmI5MzBhYjM3OTE3NTYxYzdjZDE2YTlhZDI4OGY0ZjdkNmM1NzgxNjI5OGU4ZWE">
          <img class="social top" src="../assets/icons8-slack-new.svg">
        </a>
        <a href="https://www.youtube.com/channel/UCqoFv8OnTYjkwjHeo6JDUFg">
          <img class="social top" src="../assets/icons8-youtube.svg">
        </a>
      </div>
    </div>
  </div>
</template>

<script>

export default {
  name: 'UsersAddForm',
  components: {
    // FormInput,
    // FormButton,
  },
  props: {
    title: String,
    icon: String,
    item: {
      type: Object,
      required: false,
    },

    action: Function,
  },
  data() {
    return {
      user: {},
      focused: {},
    };
  },
  methods: {
    select({ target: { name }, type }) {
      if (type === 'focus') {
        this.focused[name] = true;
      } else if (type === 'blur' && this.user[name] === '') {
        this.focused[name] = false;
      }
    },
  },
};
</script>

<style lang="scss" scoped>
 .social-icon {
   margin-left: 0;
   width: 20rem;

 }
 .social {
   width: 20rem;
   margin-left: 21rem;
 }
 h2 {
   font-size: 24rem;
   padding-bottom: 13rem;
 }
 p {
   font-size: 19rem;
   text-align: justify;
   margin-top: 0;
 }
 .paragraph {
   padding-top: 21.5rem;
 }
 .large-divider {
    border-bottom: 1rem solid #55555c;
  }
</style>
