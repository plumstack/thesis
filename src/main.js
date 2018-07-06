import Vue from 'vue';
import VueRouter from 'vue-router';
import store from './store/store';

import App from './App.vue';
import Splash from '../src/components/Splash.vue';
import Room from '../src/components/Room.vue';
import Login from '../src/components/Login.vue';

Vue.config.productionTip = false;

Vue.use(VueRouter);

const routes = [
  { path: '/', component: Splash },
  { path: '/room/:roomId', component: Room, props: true },
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
