import Vue from 'vue';
import VueRouter from 'vue-router';

import App from './App.vue';
import Splash from '../src/components/Splash.vue';
import Room from '../src/components/Room.vue';
import Login from '../src/components/Login.vue';

Vue.config.productionTip = false;

Vue.use(VueRouter);

const routes = [
  { path: '/', component: Splash },
  { path: '/room/:roomId', component: Room },
  { path: '/login', component: Login },
];

const router = new VueRouter({
  routes,
});

new Vue({
  render: (h) => h(App),
  router,
}).$mount('#app');
