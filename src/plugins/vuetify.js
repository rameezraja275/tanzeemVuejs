import Vue from "vue";
import Vuetify from "vuetify/lib/framework";
import "@mdi/font/css/materialdesignicons.css"; // Ensure you are using css-loader
// import "material-design-icons-iconfont/dist/material-design-icons.css"; // Ensure you are using css-loader
// import Vuetify from "vuetify/lib";

// import Vuetify from 'vuetify/lib'

// import "vuetify/dist/vuetify.min.css";

Vue.use(Vuetify, {
  icons: {
    iconfont: "mdi" // default - only for display purposes
  }
});

export default new Vuetify({});
