<template>
  <v-card max-width="500" tile>
    <v-list shaped>
      <v-subheader>Vouchers</v-subheader>
      <div class="px-5">
        <v-btn block plain @click="addNewVoucherPost()" class="primary">
          <span
            >A<span class="text-lowercase">dd </span>N<span
              class="text-lowercase"
              >ew </span
            >V<span class="text-lowercase">oucher</span></span
          >
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
              label="Filter by date"
              prepend-icon="mdi-calendar"
              readonly
              v-bind="attrs"
              v-on="on"
            ></v-text-field>
          </template>
          <v-date-picker
            v-model="filterDate"
            @input="menu2 = false"
            :max="new Date().toISOString().substr(0, 10)"
          ></v-date-picker>
        </v-menu>
      </div>
      <v-list-item-group v-model="selectedItem" color="primary">
        <v-progress-linear
          :active="loading"
          :indeterminate="loading"
          bottom
          color="#1976d2"
        ></v-progress-linear>
        <p
          v-if="!vouchersGroups.length && !loading"
          class="ml-5"
          style="color: black;"
        >
          No Vouchers to show!
        </p>
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
import { mapActions } from "vuex";
import { getVoucherByDate } from "../actions/index";
export default {
  props: ["vouchersGroups", "voucherGroupsList"],
  data: () => ({
    loading: false,
    selectedItem: 1,
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
  },
  methods: {
    ...mapActions(["changeFocusOnDate"]),
    addNewVoucherPost() {
      if (this.$route.params.vpid) {
        this.$router.push({ path: "/voucherpost" });
      }
      this.changeFocusOnDate(true);
    }
  }
};
</script>
