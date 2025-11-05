<template>
  <div class="info">
    <h4 class="title upper white-text">
      About
    </h4>
    <p class="white-text">
      <strong>M1 Spatial Audio Server</strong> is a frontend and backend solution for serving custom streaming spatial audio players with included web playback capabilities.
      Built around <a href="https://www.mach1.tech/spatial" target="_blank" class="link">Mach1 Spatial</a>, this server leverages the Mach1Decode API and Mach1Transcode API to unify playback of all multichannel and spatial audio formats.
    </p>
    <p class="white-text paragraph">
      Quickly build and deploy hosted spatial audio experiences and streams designed around Mach1 Spatial technology.
      The platform includes an admin dashboard for managing spatial mixes, allowing easy upload and playlist management, plus a spatial player for immersive audio playback.
    </p>
    <p class="white-text paragraph">
      Learn more about the project: 
      <a href="https://github.com/mach1studios/m1-spatialaudioserver" target="_blank" class="link">GitHub Repository</a> | 
      <a href="https://github.com/Mach1Studios/m1-spatialaudio-client-ios" target="_blank" class="link">iOS Client</a>
    </p>
    <div class="large-divider" />
    <div class="row">
      <div class="col s12">
        <h2 class="title upper white-text">
          Follow us:
        </h2>
        <a href="https://www.instagram.com/poweredbymach1/" target="_blank" title="Instagram">
          <img class="social-icon top" src="../assets/icons8-instagram.svg" alt="Instagram">
        </a>
        <a href="https://www.twitter.com/poweredbymach1" target="_blank" title="Twitter">
          <img class="social top" src="../assets/icons8-twitter.svg" alt="Twitter">
        </a>
        <a href="https://discord.gg/qfZcZWanAY" target="_blank" title="Discord">
          <img class="social top" src="../assets/icons8-discord.svg" alt="Discord">
        </a>
        <a href="https://www.youtube.com/channel/UCqoFv8OnTYjkwjHeo6JDUFg" target="_blank" title="YouTube">
          <img class="social top" src="../assets/icons8-youtube.svg" alt="YouTube">
        </a>
        <a href="https://github.com/Mach1Studios/" target="_blank" title="GitHub">
          <img class="social top" src="../assets/icons8-github.svg" alt="GitHub">
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
   margin-left: 21rem;
   width: 20rem;
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
    border-bottom: 1rem solid var(--additional-accent-color);
  }

 .link {
   color: var(--secondary-accent-color);
   text-decoration: underline;
   
   &:hover {
     color: var(--secondary-highlight-color);
   }
 }
</style>
