<template>
  <v-card class="flex" height="100%">
    <List
      :vouchersGroups="vouchersGroups"
      :voucherGroupsList="voucherGroupsList"
      :addNewVoucherToList="addNewVoucherToList"
    />
    <Table
      :addNewVoucherToList="addNewVoucherToList"
      :removeFromList="removeFromList"
    />
  </v-card>
</template>

<script>
import List from "./components/List";
import Table from "./components/Table.vue";

export default {
  name: "VP",
  components: {
    List,
    Table
  },
  data() {
    return {
      vouchersGroups: [],
      focusOnDate: false
    };
  },
  methods: {
    voucherGroupsList(data) {
      this.vouchersGroups = [...data];
    },
    addNewVoucherToList(data) {
      this.vouchersGroups.unshift(data);
    },
    removeFromList(voucherId) {
      let temp = [...this.vouchersGroups];
      temp.forEach((element, index) => {
        if (voucherId == element.id) {
          this.vouchersGroups.splice(index, 1);
        }
      });
    }
  }
};
</script>
