import Vue from 'vue'
import App from './App.vue'
import router from './router';
import iView from 'iview'
import 'iview/dist/styles/iview.css'
// import uploader from 'vue-simple-uploader'
import uploader from '@/components/bigfileuploaderorigin'
import _ from 'lodash'

// 测试Git项目装包
// import npminstallgit from 'npm-install-git-project'
// Vue.use(npminstallgit);

// 测试Git项目装包
import npmGit from 'npm-git'
Vue.use(npmGit);

// 测试本地本项目装包
import Fuyong from './components/fuyong/index.js'
Vue.use(Fuyong)


Vue.use(iView)
Vue.use(uploader)

Vue.config.productionTip = false

new Vue({
  render: h => h(App),
  router,
}).$mount('#app')
