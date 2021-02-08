<template>
  <div>
    <v-card class="flex">
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
          >
            <v-list-item-icon>
              <v-icon>{{ item.icon }}</v-icon>
            </v-list-item-icon>

            <v-list-item-content class="ml-5">
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
        { title: "Dashboard", icon: "mdi-home-city", to: "/" },
        { title: "Chart of accounts", icon: "mdi-home-city", to: "/coa" },
        { title: "Post Voucher", icon: "mdi-account", to: "/voucherpost" },
        {
          title: "Account Holders",
          icon: "mdi-account-group-outline",
          to: "/accountconfig"
        },
        { title: "Loan", icon: "mdi-home-city", to: "/loan" }
      ],
      mini: true
    };
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
</style>
