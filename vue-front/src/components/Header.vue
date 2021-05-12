<template lang="html">
  <div class="header">
    <nav class="navbar" role="navigation" aria-label="main navigation">
    <div class="navbar-brand">
      <a class="navbar-item" href="">
        <img src="../assets/logo-bg.svg">
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
  <!-- <div id="nav">
    <router-link to="/">Home</router-link> |
    <router-link to="/about">About</router-link>
  </div>
  <router-view/> -->
</template>

<script>
export default {};
</script>

<style lang="css" scoped>
  nav {
    background-color: #1a1a1a;
  }
  .button {
    font-weight: 400;
    background-color: transparent;
    border: 1px solid #626161;
    color: #626161;
    padding: 4px 20px;
    text-align: center;
    text-decoration: none;
    display: inline-block;
    font-size: .8em;
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
</style>
