<template>
  <div class="hello">
    <h1>{{ msg }}</h1>
  </div>
</template>

<script>
export default {
  name: 'HelloWorld',
  props: {
    msg: String,
  },
};
</script>

<style scoped>
h1 {
  font-family: "Comic Sans MS";
  color: orange;
  text-align: center;
}
</style>
