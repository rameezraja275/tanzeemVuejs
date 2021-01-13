import Vue from "vue";
import App from "./App.vue";
import "./registerServiceWorker";
import router from "./router";
import store from "./store";
import VueApollo from "vue-apollo";
import apolloClient from "./graphql/Apollo";

Vue.use(VueApollo);

const apolloProvider = new VueApollo({
  defaultClient: apolloClient
});

Vue.config.productionTip = false;

new Vue({
  router,
  apolloProvider: apolloProvider,
  store,
  render: h => h(App)
}).$mount("#app");
