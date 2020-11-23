import "core-js";
import "regenerator-runtime/runtime";
import Vue from "vue";
import "./plugins/utils";
import App from "./App.vue";
import router from "./router";
import vuetify from "./plugins/vuetify";
import "roboto-fontface/css/roboto/roboto-fontface.css";
import "@mdi/font/css/materialdesignicons.css";
import "@/assets/style.scss";
import { createProvider } from "./vue-apollo";
import localTestQuery from "@/graphql/localTest.query.gql";

const apolloProvider = createProvider();
Vue.config.productionTip = false;
Vue.config.silent = true;
apolloProvider.clients.defaultClient.cache.writeQuery({
  query: localTestQuery,
  data: {
    fetchLocalUser: {
      __typename: "User",
      name: "Test"
    }
  }
});
new Vue({
  router,
  vuetify,
  apolloProvider: apolloProvider,
  render: h => h(App)
}).$mount("#app");
