<template>
  <div class="flex" style="height:100%;">
    <Tree :parentAccounts="getAccountParents" :loading="loading" />
    <Form :readOnlySTatus="readOnlySTatus" />
  </div>
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
      getAccountParents: [],
      readOnlySTatus: true,
      loading: false
    };
  },
  methods: {
    async getParents() {
      this.loading = true;
      try {
        const result = await this.$apollo.mutate({
          mutation: GET_ACCOUNTS_PARENTS
        });
        if (result.errors) {
          throw result.errors[0].message;
        } else {
          this.getAccountParents = result.data.getAccountParents;
          this.loading = false;
        }
      } catch (error) {
        console.log("error in get parents");
        this.loading = false;
      }
    }
  },
  // apollo: {
  //   getAccountParents: {
  //     query: GET_ACCOUNTS_PARENTS
  //   }
  // }
  created() {
    this.getParents();
  }
};
</script>
