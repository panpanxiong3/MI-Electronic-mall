// The Vue build version to load with the `import` command
// (runtime-only or standalone) has been set in webpack.base.conf with an alias.
import Vue from 'vue'
import App from './App'
import router from './router'
import vueLazyLoad from 'vue-lazyload';
import infiniteScroll from 'vue-infinite-scroll';
import  VueCookie from 'vue-cookie';
import  {currency} from "./util/currency";

// Tell Vue to use the plugin
Vue.use(VueCookie);
Vue.config.productionTip = false
Vue.use(infiniteScroll);
Vue.use(vueLazyLoad,{
  loading:'/static/loading-svg/loading-balls.svg'
});

Vue.filter("currency",currency);

/* eslint-disable no-new */
new Vue({
  el: '#app',
  router,
  components: { App },
  template: '<App/>'
})
