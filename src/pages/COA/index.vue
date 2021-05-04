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
      :groupAccounts="groupAccounts"
      :slctLoadingAcParents="slctLoadingAcParents"
    />
  </div>
</template>

<script>
import Tree from "./Components/tree";
import Form from "./Components/form";
import { GET_ACCOUNTS_PARENTS, GET_ACCOUNTS } from "../../graphql/quries";
import { GROUP_ACCOUNTS } from "../../utils/constants";

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
      newId: null,

      groupAccounts: [],
      slctLoadingAcParents: 0
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
      console.log(data, "data to add");
      // if (!editMode) {
      //   this.getAccountParents.forEach(element => {
      //     this.dfs(element, data.acc_parent, false, data, editMode);
      //   });
      // } else {
      //   this.getAccountParents.forEach(element => {
      //     if (element.children) {
      //       this.dfs(element, data.id, false, data, editMode);
      //     }
      //   });
      // }
      this.getAccountParents.forEach(element => {
        if (!editMode) {
          if (element.id === data.acc_parent) {
            element.children.push(data);
            this.groupAccounts.push(data);
          }
          {
            this.dfs(element, data.acc_parent, false, data, editMode);
          }
        } else {
          this.dfs(element, data.id, false, data, editMode);
        }
      });
    },
    removeItemFromArray(ID) {
      // this.groupAccounts.forEach(element => {
      //   if(element)
      // })
      this.getAccountParents.forEach(element => {
        this.dfs(element, ID, true);
        // if (element.children.id === ID) {
        //   console.log("found element", ID);
        //   // for (let i = 0; i < element.children.length; i++) {
        //   //   if (element.children[i].id == ID) {
        //   //     element.children.splice(i, 1);
        //   //   }
        //   // }
        // }
      });
    },
    dfs(node, id, fromDelete, data, editMode) {
      if (node.id === id) {
        return true;
      }
      if (node.children) {
        var length = node.children.length;
        for (var i = 0; i < length; i++) {
          var foundNode = this.dfs(
            node.children[i],
            id,
            fromDelete,
            data,
            editMode
          );
          if (foundNode) {
            if (node.children[i].id === id) {
              if (fromDelete) {
                node.children.splice(i, 1);
              }
              if (data && !editMode) {
                node.children[i].children.push(data);
              }
              if (data && editMode) {
                node.children.splice(i, 1, data);
              }
            }
            return foundNode;
          }
        }
      }
      return null;
    }
  },
  apollo: {
    getAccounts: {
      query: GET_ACCOUNTS,
      variables: {
        acc_type: GROUP_ACCOUNTS
      },
      result({ data }) {
        this.groupAccounts = data.getAccounts;
      },
      error(error) {
        var temp = error.toString();
        this.message = temp;
      },
      loadingKey: "slctLoadingAcParents"
    }
  },
  created() {
    this.getParents();
  }
};
</script>
