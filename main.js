import App from './App'
import api from './ajax/api/index.js'
// #ifndef VUE3
import Vue from 'vue'
import './uni.promisify.adaptor'
Vue.config.productionTip = false
App.mpType = 'app'

// 挂载API到Vue原型上
Vue.prototype.$api = api

const app = new Vue({
  ...App
})
app.$mount()
// #endif

// #ifdef VUE3
import { createSSRApp } from 'vue'
export function createApp() {
  const app = createSSRApp(App)
  
  // Vue3中挂载API
  app.config.globalProperties.$api = api
  
  return {
    app
  }
}
// #endif