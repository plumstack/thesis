import Vue from 'vue';
import VueRouter from 'vue-router';
import VueSocket from 'vue-socket.io';
import store from './store/store';

import App from './App.vue';
import Splash from '../src/components/Splash.vue';
import Room from '../src/components/NewRoom.vue';
import Login from '../src/components/Login.vue';

Vue.config.productionTip = false;

const SERVER_URL = 'http://10.30.23.191:8082';

Vue.use(VueRouter);

const routes = [
  { path: '/', component: Splash },
  {
    path: '/room/:roomId',
    component: Room,
    props: true,
    beforeEnter(_, __, next) {
      if (!Vue.prototype.$socket) {
        Vue.use(VueSocket, SERVER_URL);
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
