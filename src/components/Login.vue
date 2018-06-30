<template>
  <div class="login">
    <form id="loginForm" action="http://localhost:8082/auth/spotify" method="GET">
      <h1
        onclick="javascript:document.getElementById('loginForm').submit();"
        >Login with Spotify</h1>
    </form>
  </div>
</template>

<script>
export default {
  name: 'Login',
  methods: {
    authSpot() {
      this.$router.push({ path: '/auth/spotify' });
    },
  },
};
</script>

<style scoped>
h1 {
  font-family: 'Montserrat', sans-serif;
  margin-left: auto;
  margin-right: auto;
  color: #fff;
  font-size: 2vw;
  font-weight: 600;
  text-align: center;
  border: 2px solid #fff;
  border-radius: 200px;
  padding: 16px 48px 18px;
  width: 30%;
}
h1:hover {
  color: #1ed760;
  background-color: #ffffff;
}
</style>
