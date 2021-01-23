<template>
  <v-card class="flex">
    <Tree :parentAccounts="getAccountParents" />
    <router-view />
  </v-card>
</template>

<script>
import Tree from "./Components/tree";
import { GET_ACCOUNTS_PARENTS } from "../../graphql/quries";

export default {
  name: "COA",
  components: {
    Tree
  },
  data() {
    return {
      getAccountParents: []
    };
  },
  apollo: {
    getAccountParents: {
      query: GET_ACCOUNTS_PARENTS
    }
  }
};
</script>
