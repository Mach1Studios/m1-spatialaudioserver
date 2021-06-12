<template lang="html">
  <div class="header">
    <nav class="navbar" role="navigation" aria-label="main navigation">
    <div class="navbar-brand">
      <a class="navbar-item" href="">
        <img src="../assets/logo-bg.svg">
      </a>
    </div>

    <div class="navbar-start">
      <a class="navbar-item home">
        <router-link to="/">Home</router-link>
      </a>
      <a class="navbar-item home">
        <router-link to="/spatialaudioplayer">Spatial Audio Player</router-link>
      </a>
    </div>

      <div class="navbar-end">
        <div class="navbar-item">
          <div class="buttons">
            <a class="button">
              <strong>Log in</strong>
            </a>
          </div>
        </div>
      </div>
  </nav>
</div>
</template>

<script>
export default {};
</script>

<style lang="scss" scoped>
  nav {
    background-color: #1a1a1a;
  }
  .button {
    font-weight: 500;
    background-color: transparent;
    border: 1px solid #626161;
    color: #626161;
    padding: 4px 20px;
    text-align: center;
    text-decoration: none;
    display: inline-block;
    font-size: 0.8em;
    cursor: pointer;
    border-radius: 0;
  }
  .button:focus {
    outline-color: #fefefe;
    color: #fefefe;
  }
  .button:hover {
    border: 1px solid #fefefe;
    color: #fefefe;
  }
  .home {
    color: #626161;
    font-weight: 500;
  }
  .home:focus {
    color: #fefefe;
    background-color: transparent;
    font-size: 1em;
    font-weight: 500;
  }
  .home:hover {
    color: #fefefe;
    background-color: transparent;
    font-size: 1em;
    font-weight: 500;
  }
</style>
