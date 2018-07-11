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
@import '../public/css-reset.css';
@import url("https://fonts.googleapis.com/css?family=Monoton");
@import url("https://fonts.googleapis.com/css?family=Comfortaa");
@import url("https://fonts.googleapis.com/css?family=Roboto");

html {
  height: 100%;
  background: #111;
}

body {
  font-family: Roboto;
  color: #fff;
  font-size: calc(.6rem + 1vw);
}

h1 {
  font-family: "Monoton";
  font-weight: 400;
  text-align: center;
  font-size: 5em;
}

h2, h3 {
  font-family: "Comfortaa";
  font-weight: 400;
  text-align: center;
  font-size: 5em;
}

h2, h3 {
  font-family: "Comfortaa";
  font-weight: 400;
}


.menu-container {
  list-style-type: none;
  text-align: center;
  overflow: hidden;
}

.menu-item {
  display: inline-block;
  background: #333;
}

.text-input {
  overflow: auto;
  font-family: "Comfortaa";
  color: #777;
  font-size: 1.5em;
  font-weight: 700;
  padding: .25em .5em;
  background: #333;
  border: 1px solid #fff;
  border-radius: 15px;
}

.text-input:focus {
  outline: none;
  background: #fff;
}

@media screen and (min-width: 900px) {
  .menu-item:hover {
    cursor: pointer;
    background: #0ff;
    transition: background-color 3s ease;
  }
}
</style>
