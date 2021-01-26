<template>
  <v-card class="flex">
    <Tree :parentAccounts="getAccountParents" />
    <Form />
  </v-card>
</template>

<script>
import Tree from "./Components/tree";
import Form from "./Components/form";
import { GET_ACCOUNTS_PARENTS } from "../../graphql/quries";

export default {
  name: "COA",
  components: {
    Tree,
    Form
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
