<template>
  <v-card max-width="500" height="100%">
    <div>
      <v-sheet class="pa-4 lighten-2 rounded-0" width="250">
        <v-btn block plain @click="addNew" class="primary">
          <span
            >A<span class="text-lowercase">dd </span>N<span
              class="text-lowercase"
              >ew </span
            >A<span class="text-lowercase">ccount </span></span
          >
        </v-btn>
      </v-sheet>
      <v-progress-linear
        :active="loading"
        :indeterminate="loading"
        bottom
        color="#1976d2"
      ></v-progress-linear>
      <v-card-text>
        <v-treeview
          :active.sync="active"
          :items="items"
          :load-children="getChilds"
          :open.sync="open"
          ref="treeReference"
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
import { mapActions } from "vuex";

export default {
  props: ["parentAccounts", "loading"],
  data: () => ({
    active: [],
    open: [],
    true: false,

    newArray: []
  }),
  methods: {
    ...mapActions(["changeFocusOnAccInput"]),
    async getChilds(item) {
      const result = await this.$apollo.query({
        query: GET_ACCOUNTS_CHILDS,
        variables: {
          acc_parent: item.id
        }
      });
      const children = result.data.getAccountChilds;
      let childNode;
      const key = item.id;
      const parentNode = this.$refs.treeReference.nodes[key];
      children.map(child => {
        childNode = { ...parentNode, item: child, vnode: null };
        this.$refs.treeReference.nodes[child.id] = childNode;
        if (child.acc_type == 1) {
          item.children.push({ ...child, children: [] });
        } else {
          item.children.push({ ...child });
        }
      });
    },
    addNew() {
      if (this.$route.params.acccode) {
        this.$router.push({ path: "/coa" });
      }
      this.changeFocusOnAccInput(true);
    }
  },
  computed: {
    items() {
      return this.parentAccounts;
    }
  },
  watch: {
    parentAccounts() {
      this.items;
    }
  }
};
</script>
