import Vue from "vue";
import App from "./App.vue";
import "./registerServiceWorker";
import router from "./router";
// import store from "./store";
import VueApollo from "vue-apollo";
import apolloClient from "./graphql/Apollo";
import vuetify from "./plugins/vuetify";
import "vuetify/dist/vuetify.min.css";
// import Vue from 'vue';
// import Vuex from 'vuex';

Vue.use(VueApollo);
// Vue.use(Vuex);

const apolloProvider = new VueApollo({
  defaultClient: apolloClient
});

Vue.config.productionTip = false;

new Vue({
  router,
  apolloProvider,
  // store,
  vuetify,
  render: h => h(App)
}).$mount("#app");
