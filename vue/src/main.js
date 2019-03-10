// The Vue build version to load with the `import` command
// (runtime-only or standalone) has been set in webpack.base.conf with an alias.
import Vue from 'vue'
import App from './App'
import router from './router'
import ElementUI from 'element-ui';
import 'element-ui/lib/theme-chalk/index.css';
import echarts from 'echarts';
Vue.prototype.$echarts = echarts;
import axios from 'axios';
Vue.use(ElementUI);
Vue.prototype.$axios = axios;
Vue.config.productionTip = false;
Vue.prototype.$setHeight = function () {
    let w = window.innerWidth || document.documentElement.clientWidth || document.body.clientWidth;
    let h = window.innerHeight || document.documentElement.clientHeight || document.body.clientHeight;
    this.$refs.warp.style.width = w + 'px';
    this.$refs.warp.style.minwidth = 768 + 'px';
    this.$refs.warp.style.minHeight = h + 'px';
};
Vue.prototype.$getData = function (url, data, method, callback) {
    axios({
        // url: "api" + url,
        url,
        method,
        data,
    }).then(callback)
};

/* eslint-disable no-new */
new Vue({
    el: '#app',
    router,
    components: {
        App
    },
    template: '<App/>'
});