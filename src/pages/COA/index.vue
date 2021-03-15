<template>
  <div class="flex" style="height:100%;">
    <Tree
      :parentAccounts="getAccountParents"
      :loading="loading"
      :getParents="getParents"
    />
    <Form
      :readOnlySTatus="readOnlySTatus"
      :addInParentArray="addInParentArray"
      :removeItemFromArray="removeItemFromArray"
    />
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
      loading: false,
      newId: null
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
          // this.getAccountParents = result.data.getAccountParents;
          this.getAccountParents = result.data.getAccountParents.map(
            account => {
              return {
                ...account,
                children: []
              };
            }
          );
          this.loading = false;
        }
      } catch (error) {
        this.loading = false;
      }
    },
    addInParentArray(data, editMode) {
      if (!editMode) {
        this.getAccountParents.forEach(element => {
          if (element.id == data.acc_parent) {
            element.children.push(data);
          }
        });
      } else {
        this.getAccountParents.forEach(element => {
          if (element.children) {
            for (let i = 0; i < element.children.length; i++) {
              if (element.children[i].id === data.id) {
                element.children.splice(i, 1, data);
              }
            }
          }
        });
        console.log(this.getAccountParents, data);
      }
    },
    removeItemFromArray(ID) {
      this.getAccountParents.forEach(element => {
        if (element.children) {
          for (let i = 0; i < element.children.length; i++) {
            if (element.children[i].id == ID) {
              element.children.splice(i, 1);
            }
          }
        }
      });
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
