
import Vue from 'vue';
import ElementUI from 'element-ui';
import 'element-ui/lib/theme-chalk/index.css';
import App from "./App";
import route from "./router"
import './assets/reset.css'
import myStore from "./store/index"
Vue.config.productionTip = false;
Vue.use(ElementUI);
new Vue({
  el: '#app',
  router: route,
  store: myStore,
  render: h => h(App)
});