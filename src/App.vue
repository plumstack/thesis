<template>
  <div id="app">
    <HelloWorld msg="Hello Joseph"/>
  </div>
</template>

<script>
import HelloWorld from './components/HelloWorld.vue';

export default {
  name: 'app',
  components: {
    HelloWorld,
  },
};
</script>

<style>
body {
  background: blue;
}
</style>
