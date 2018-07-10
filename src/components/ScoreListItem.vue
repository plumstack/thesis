<template>
        <td>
            {{score[0]}}, Score: {{score[1]}}
        </td>
</template>

<script>
export default {
  name: 'ScoreListItem',
  props: ['score'],
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
