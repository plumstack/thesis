<template>
  <div id="app">
    <NavBar />
    <router-view></router-view>
  </div>
</template>

<script>
import NavBar from './components/NavBar.vue';

export default {
  name: 'App',

  components: {
    NavBar,
  },
};
</script>

<style>
@import url("https://fonts.googleapis.com/css?family=Monoton");
@import url("https://fonts.googleapis.com/css?family=Comfortaa");
@import url("https://fonts.googleapis.com/css?family=Roboto");

html {
  height: 100%;
  background: #111;
}

body {
  margin: 0;
  font-family: Roboto;
  font-size: calc(.8rem + 1vw);
}

h1, h2, h3 {
  font-family: "Comfortaa";
  font-weight: 400;
}

.menu-container {
  list-style-type: none;
  text-align: center;
  padding: 0;
  margin: 0;
  overflow: hidden;
}

.menu-item {
  display: inline-block;
  color: #fff;
  background: #333;
}

@media screen and (min-width: 900px) {
  .menu-item:hover {
    cursor: pointer;
    background: #0ff;
    transition: background-color 5s ease;
  }
}
</style>
