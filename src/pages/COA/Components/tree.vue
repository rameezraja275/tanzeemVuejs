<template>
  <v-card max-width="500" height="100%">
    <div>
      <v-sheet class="pa-4 lighten-2 rounded-0" width="250">
        <v-btn block plain to="/coa" class="primary">
          Add New Account
        </v-btn>
      </v-sheet>
      <v-card-text>
        <v-treeview
          :active.sync="active"
          :items="items"
          :load-children="getChilds"
          :open.sync="open"
          activatable
          open-on-click
          transition
        >
          <template v-slot:prepend="{ item }">
            <v-btn text :to="{ path: `/coa/${item.acc_code}` }">
              <span> {{ item.acc_name }} </span>
            </v-btn>
          </template>
        </v-treeview>
      </v-card-text>
    </div>
  </v-card>
</template>

<script>
import { GET_ACCOUNTS_CHILDS } from "../../../graphql/quries";
export default {
  props: ["parentAccounts"],
  data: () => ({
    active: [],
    open: [],
    true: false
  }),
  methods: {
    async getChilds(item) {
      const result = await this.$apollo.query({
        query: GET_ACCOUNTS_CHILDS,
        variables: {
          acc_parent: item.id
        }
      });
      const children = result.data.getAccountChilds;
      children.map(child => {
        if (child.acc_type == 1) {
          item.children.push({ ...child, children: [] });
        } else {
          item.children.push({ ...child });
        }
      });
    }
  },
  computed: {
    items() {
      const newArray = this.parentAccounts.map(account => {
        return {
          ...account,
          children: []
        };
      });
      return newArray;
    }
  }
};
</script>
