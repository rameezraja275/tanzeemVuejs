<template>
  <div style="height:100%;">
    <v-card class="flex" height="100%">
      <v-navigation-drawer v-model="drawer" :mini-variant.sync="mini" permanent>
        <v-list-item class="px-2">
          <v-list-item-avatar>
            <v-avatar color="accent" size="42">
              <span class="white--text headline">{{
                currentUser.name.split("")[0].toUpperCase()
              }}</span>
            </v-avatar>
          </v-list-item-avatar>

          <v-list-item-title>{{ currentUser.name }}</v-list-item-title>
          <v-btn icon @click.stop="mini = !mini">
            <v-icon>mdi-chevron-left</v-icon>
          </v-btn>
        </v-list-item>

        <v-divider></v-divider>

        <v-list dense>
          <v-list-item
            v-for="item in items"
            :key="item.title"
            :to="item.to"
            link
            @click="checkForSignOut(item.title)"
          >
            <v-icon :color="colorOfSignOut(item)">{{ item.icon }}</v-icon>

            <v-list-item-content
              class="ml-5"
              v-bind:class="{
                signOut: item.title === 'Sign Out' ? true : false
              }"
            >
              <v-list-item-title>{{ item.title }}</v-list-item-title>
            </v-list-item-content>
          </v-list-item>
        </v-list>
      </v-navigation-drawer>
      <slot />
    </v-card>
  </div>
</template>

<script>
import localStorage from "../../utils/localStorageService";
const localStorageService = localStorage.getService();
export default {
  data() {
    return {
      drawer: true,
      items: [
        { title: "Dashboard", icon: "mdi-monitor-dashboard", to: "/" },
        {
          title: "Chart Of Accounts",
          icon: "mdi-file-table-box-multiple-outline",
          to: "/coa"
        },
        // { title: "Post Voucher", icon: "mdi-account-circle-outline", to: "/voucherpost" },
        {
          title: "Post Voucher",
          icon: "mdi-credit-card-plus-outline",
          to: "/voucherpost"
        },
        {
          title: "Account Holders",
          icon: "mdi-account-group-outline",
          to: "/accountconfig"
        },
        { title: "Loan", icon: "mdi-account-cash-outline", to: "/loan" },
        {
          title: "Loan Instalment",
          icon: "mdi-cash-plus",
          to: "/loanInstalment"
        },
        { title: "Sign Out", icon: "mdi-exit-to-app" }
      ],
      mini: true
    };
  },
  methods: {
    checkForSignOut(title) {
      if (title == "Sign Out") {
        this.signOut();
      }
    },
    signOut() {
      location.reload();
      return window.localStorage.clear();
    },
    colorOfSignOut(item) {
      if (item.title === "Sign Out") {
        return "red";
      } else {
        return "rgba(0, 0, 0, 0.54)";
      }
    }
  },
  computed: {
    currentUser() {
      return localStorageService.getCurrentUser();
    }
  }
};
</script>

<style>
.flex {
  display: flex !important;
  height: 100vh;
}
.mL-5 {
  margin-left: 5px;
}

.signOut {
  color: red;
}
</style>
