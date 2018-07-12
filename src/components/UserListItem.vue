<template>
  <div class="user">
    {{username}} <span>{{score}}</span>
  </div>
</template>

<script>
export default {
  name: 'UserListItem',
  props: ['username', 'score'],
  data() {
    return {
    };
  },
  methods: {
  },
};
</script>

<style scoped>
span {
  float: right;
}
.user {
  font-size: .75em;
}
</style>
