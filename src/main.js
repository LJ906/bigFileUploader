import Vue from 'vue'
import App from './App.vue'
import router from './router';
// import $ from 'jquery'
// import uploader from 'vue-simple-uploader'
import iView from 'iview';
import 'iview/dist/styles/iview.css';
import uploader from '@/components/bigfileuploaderorigin'


Vue.use(iView);
Vue.use(uploader);



Vue.config.productionTip = false

new Vue({
  render: h => h(App),
  router,
}).$mount('#app')
