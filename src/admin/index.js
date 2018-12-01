import Vue from 'vue'
import App from './App.vue'
import ElementUI from 'element-ui'
import 'element-ui/lib/theme-chalk/index.css'
import axios from 'axios'

import router from './router'
import store from './store'

// import mock from './mock'
// mock;
Vue.config.productionTip = false
Vue.config.env = {}
Vue.use(ElementUI)



let http = axios.create()
http.defaults.timeout = 2500;
// http.interceptors.request.use(request => {
//   if (store.state.token) {
//     request.headers.Authorization = store.state.token;
//   }
//   return request;
// }, error => {
//   Vue.prototype.$message({
//     message: error,
//     type: "warning"
//   });
//   return Promise.reject(error);
// })
http.interceptors.response.use((response) => {
  if (response.data && response.data.error) {
    Vue.prototype.$message({
      message: response.data.error,
      type: "warning"
    });
  }
  return response.data
}, (error) => {
  Vue.prototype.$message({
    message: error.response.data,
    type: "warning"
  });
  return Promise.reject(error.response.data)
});

Vue.prototype.$http = http // 类似于vue-resource的调用方法


router.beforeEach((to, from, next) => {
  /* 路由发生变化修改页面title */
  if (to.name) document.title = to.name + " - 管理后台"

  // if (!store.state.token) {
  //   window.location.href = '/login.html'
  // } else {
  //   next()
  // }
  next();
});

new Vue({
  store,
  router,
  render: h => h(App)
}).$mount('#app')
