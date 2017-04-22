import Vue from 'vue'
import App from '../App.vue'
import VueRouter from 'vue-router'

Vue.use(VueRouter)

const Test1 = { template: '<div>test1</div>' }
const Test2 = { template: '<div>test2</div>' }

const routes = [
  { path: '/', component: App },
  { path: '/test1', component: Test1 },
  { path: '/test2', component: Test2 }
]

const router = new VueRouter({
  routes: routes
})

new Vue({
  el: '#app',
  router
})
