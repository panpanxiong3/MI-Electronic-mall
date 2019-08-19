import Vue from 'vue'
import Router from 'vue-router'
import List from '@/views/commodyList'
import cartList from "../views/cartList";
Vue.use(Router)

export default new Router({
  routes: [
    {
      path: '/',
      name: 'List',
      component: List
    },
    {
      path:'/cart',
      name: 'cartList',
      component: cartList
    }
  ]
})
