<template>
  <v-card max-width="500" tile>
    <v-list shaped>
      <v-subheader>Vouchers</v-subheader>
      <div class="px-5">
        <v-btn block plain to="/voucherpost" class="primary">
          Add New Vouchers
        </v-btn>
        <v-menu
          v-model="menu2"
          :close-on-content-click="false"
          :nudge-right="40"
          transition="scale-transition"
          offset-y
          min-width="auto"
        >
          <template v-slot:activator="{ on, attrs }">
            <v-text-field
              v-model="filterDate"
              label="Picker without buttons"
              prepend-icon="mdi-calendar"
              readonly
              v-bind="attrs"
              v-on="on"
            ></v-text-field>
          </template>
          <v-date-picker
            v-model="filterDate"
            @input="menu2 = false"
          ></v-date-picker>
        </v-menu>
      </div>
      <v-list-item-group v-model="selectedItem" color="primary">
        <v-list-item
          v-for="(voucherGroup, i) in vouchersGroups"
          :key="i"
          :to="{ path: `/voucherpost/${voucherGroup.id}` }"
        >
          <v-list-item-content>
            <v-list-item-title
              v-text="`Voucher # ${voucherGroup.id}`"
            ></v-list-item-title>
          </v-list-item-content>
        </v-list-item>
      </v-list-item-group>
    </v-list>
  </v-card>
</template>

<script>
import { getVoucherByDate } from "../actions/index";
export default {
  data: () => ({
    selectedItem: 1,
    vouchersGroups: [],
    menu2: false,
    filterDate: new Date().toISOString().substr(0, 10)
  }),
  created() {
    getVoucherByDate(this);
  },
  watch: {
    filterDate: {
      handler(newItem, oldItem) {
        getVoucherByDate(this);
      },
      deep: true
    }
  }
};
</script>
