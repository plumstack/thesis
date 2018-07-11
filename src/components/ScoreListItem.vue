<template>
        <td>
            {{username}}, Score: {{score}}
        </td>
</template>

<script>
export default {
  name: 'ScoreListItem',
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

</style>
