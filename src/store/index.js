import Vuex from "vuex";
import Vue from "vue";
import auth_module from "./modules/auth_module";

// Load vuex
Vue.use(Vuex);

// Create store
export default new Vuex.Store({
  modules: {
    auth_module
  }
});
