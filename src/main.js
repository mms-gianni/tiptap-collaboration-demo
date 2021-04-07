
import Vue from 'vue'
import App from './App.vue'
import 'bootstrap/dist/css/bootstrap.css'
import 'bootstrap-vue/dist/bootstrap-vue.css'
import BootstrapVue from 'bootstrap-vue'

Vue.use(BootstrapVue);
Vue.config.productionTip = false
Vue.http.headers.common['Access-Control-Allow-Origin'] = true

new Vue({
  render: h => h(App),
}).$mount('#app')
