import Vue from 'vue';
import VueRouter from 'vue-router';
import App from './App.vue';

import HelloWorld from '../src/components/HelloWorld.vue';
import Room from '../src/components/Room.vue';

Vue.config.productionTip = false;

Vue.use(VueRouter);

const routes = [
  { path: '/', component: HelloWorld },
  { path: '/room/:roomId', component: Room },
];

const router = new VueRouter({
  routes,
});

new Vue({
  render: h => h(App),
  router,
}).$mount('#app');
