<template>
  <v-card max-width="500" tile>
    <v-list shaped>
      <v-subheader>Vouchers</v-subheader>
      <v-list-item-group v-model="selectedItem" color="primary">
        <v-list-item v-for="(voucherGroup, i) in vouchersGroups" :key="i">
          <v-list-item-content>
            <router-link :to="{ path: `/voucherpost/${voucherGroup.id}` }">
              <v-list-item-title
                v-text="`Voucher # ${voucherGroup.id}`"
              ></v-list-item-title>
            </router-link>
          </v-list-item-content>
        </v-list-item>
      </v-list-item-group>
    </v-list>
  </v-card>
</template>

<script>
import { GET_VOUCHER_POST } from "../../../graphql/quries";
export default {
  data: () => ({
    selectedItem: 1,
    vouchersGroups: []
  }),
  methods: {
    async getChilds(item) {
      const result = await this.$apollo.query({
        query: GET_VOUCHER_POST,
        variables: {
          voucher_date: "2019-10-11"
        }
      });
      this.vouchersGroups = result.data.getGroupVouchers;
    }
  },
  created() {
    this.getChilds();
  }
};
</script>
