import Vue from "vue";
const Utils = {
  install(Vue) {
    let timeout = null;
    const TIMER = 500;
    Object.assign(Vue.prototype, {
      $delay: cb => {
        clearTimeout(timeout);
        timeout = setTimeout(cb, TIMER);
      }
    });
  }
};
Vue.use(Utils);
export default Utils;
