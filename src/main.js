// The Vue build version to load with the `import` command
// (runtime-only or standalone) has been set in webpack.base.conf with an alias.
import Vue from "vue";
import App from "./App";
import router from "./router";
import store from "./store";

import Antd from "ant-design-vue";
import "ant-design-vue/dist/antd.css";

import { message } from "ant-design-vue";
Vue.prototype.$message = message;
message.config({
  // duration: 2,// 持续时间
  top: `90px`, // 到页面顶部距离
  maxCount: 2 // 最大显示数, 超过限制时，最早的消息会被自动关闭
});

Vue.use(Antd);

import ECharts from "vue-echarts";
import "echarts/lib/chart/bar";
import "echarts/lib/chart/line";
import "echarts/lib/chart/pie";
import "echarts/lib/component/tooltip";
import "echarts/lib/component/legend";
import "echarts/lib/component/markPoint";
import "echarts/lib/component/markLine";
import "echarts/lib/component/graphic";
Vue.component("v-chart", ECharts);

import Viewer from "v-viewer";
import "viewerjs/dist/viewer.css";

Vue.use(Viewer, {
  defaultOptions: {
    zIndex: 9999,
    inline: false,
    button: true,
    navbar: false,
    title: false,
    toolbar: true,
    tooltip: false,
    movable: true,
    zoomable: true,
    rotatable: true,
    scalable: false,
    transition: false,
    fullscreen: false,
    keyboard: false
  }
});

router.beforeEach((to, from, next) => {
  if (to.path == "/user/login" || to.path == "/user/forgetpwd") {
    next();
  } else {
    let getToken = localStorage.getItem("token");
    let getName = localStorage.getItem("orgName");
    if (getToken) {
      next();
      window.document.title = getName;
    } else {
      next("/user/login");
      window.document.title = "医生工作站";
    }
  }
});

Vue.config.productionTip = false;

/* eslint-disable no-new */
new Vue({
  el: "#app",
  router,
  store,
  components: { App },
  template: "<App/>"
});
