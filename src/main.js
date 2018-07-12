import Vue from 'vue';
import VueRouter from 'vue-router';
import io from 'socket.io-client';
import store from './store/store';

import App from './App.vue';
import Splash from '../src/components/Splash.vue';
import Room from '../src/components/NewRoom.vue';
import Login from '../src/components/Login.vue';


Vue.config.productionTip = false;

const SERVER_URL = 'http://10.30.23.191:8082';
const socket = io.connect(SERVER_URL, {
  secure: false,
  reconnection: true,
  reconnectionDelay: 1000,
  reconnectionDelayMax: 5000,
  reconnectionAttempts: Infinity,
});

Vue.use(VueRouter);

const routes = [
  { path: '/', component: Splash },
  {
    path: '/room/:roomId',
    component: Room,
    props: true,
    beforeEnter(_, __, next) {
      if (!Vue.prototype.$socket) {
        Vue.prototype.$socket = socket;
      }
      next();
    },
  },
  { path: '/login', component: Login },
];

const router = new VueRouter({
  routes,
});

new Vue({
  render: (h) => h(App),
  router,
  store,
}).$mount('#app');

export default router;
