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
import axios from 'axios';

const url = 'http://localhost:8082';

function getLogin() {
  return {
    method: 'GET',
    url: `${url}/auth/spotify`,
  };
}

export default {
  name: 'Login',
  methods: {
    loginSpot() {
      console.log('Trying to login');
      axios(getLogin()).catch(console.log);
    },
    authSpot() {
      this.$router.push({ path: '/auth/spotify' });
    },
  },
};
</script>

<style scoped>
h1 {
  font-family: 'Montserrat', sans-serif;
  align: center;
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
