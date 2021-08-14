<template>
  <div style="width: 100%; padding: 40px 30px;">
    <v-card elevation="1" class="mb-10">
      <SnackBar
        :snackbarModel="snackbarModel"
        :snackBarColor="snackBarColor"
        :snackbarText="snackbarText"
        :closeSnackbar="closeSnackbar"
      />
      <v-sheet max-width="100%">
        <div class="py-4 px-3">
          <p class="py-1 headline">Reports</p>
        </div>
        <validation-observer ref="observer" v-slot="{ invalid }">
          <form class="d-flex flex-column align-center pb-4" autocomplete="off">
            <v-row style="min-width: 60%">
              <v-col style="max-width:355px" class="mx-auto">
                <validation-provider
                  v-slot="{ errors }"
                  name="Loan A/C No"
                  rules="required"
                >
                  <v-autocomplete
                    v-model="dataFromInputs.loan_Ac_No"
                    :loading="getLoanAccountsLoading"
                    :items="loanAccounts"
                    required
                    :error-messages="errors"
                    :item-text="accountNameNdCode"
                    item-value="id"
                    label="Loan A/C No"
                    v-on:change="fetchLoanHistoryItems"
                  ></v-autocomplete>
                </validation-provider>
              </v-col>
              <v-col style="max-width:355px" class="mx-auto">
                <validation-provider
                  v-slot="{ errors }"
                  name="Loan History"
                  rules="required"
                >
                  <v-autocomplete
                    v-model="dataFromInputs.selected_loan"
                    :loading="loanHistoryLoading"
                    :items="loanHistory"
                    required
                    :error-messages="errors"
                    :item-text="loanAmountNdId"
                    item-value="id"
                    label="Loan History"
                  ></v-autocomplete>
                </validation-provider>
              </v-col>
            </v-row>
            <v-btn
              width="150px"
              depressed
              color="primary"
              @click="applyFilters"
              :disabled="invalid"
              :loading="btnLoading"
              >Show</v-btn
            >
          </form>
        </validation-observer>
      </v-sheet>
    </v-card>

    <Table
      :currentHeaderForTable="headersForLoanLedger"
      :isDefaultFooterHidden="false"
      :itemsForTable="itemsForLoanLedger"
      :isTableTitleHidden="true"
      :isTableLoading="tableLoading"
    />
  </div>
</template>

<script>
import SnackBar from "../../../../components/snackBar.vue";
import Table from "../dataTable.vue";

import {
  fetchReportsLoanLedger,
  getLoanAccounts,
  fetchLoanHistory
} from "../../actions/actions";
import { required, digits, min_value } from "vee-validate/dist/rules";
import {
  extend,
  ValidationObserver,
  ValidationProvider,
  setInteractionMode
} from "vee-validate";
setInteractionMode("eager");

extend("digits", {
  ...digits,
  message: "{_field_} needs to be {length} digits. ({_value_})"
});
extend("required", {
  ...required,
  message: "{_field_} can not be empty"
});

export default {
  components: {
    ValidationProvider,
    ValidationObserver,
    SnackBar,
    Table
  },
  data() {
    return {
      dataFromInputs: {},
      btnLoading: false,
      snackbarModel: false,
      snackBarColor: "",
      snackbarText: "",

      loanHistoryLoading: false,
      loanHistory: [],

      loanAccounts: [],
      getLoanAccountsLoading: false,

      itemsForLoanLedger: [],
      tableLoading: false,

      headersForLoanLedger: [
        { text: "Date", value: "date", sortable: false },
        { text: "Markup %", value: "markup_percentage", sortable: false },
        { text: "No. of days", value: "markup_days", sortable: false },
        { text: "Principle DR", value: "principal", sortable: false },
        { text: "Principle CR", value: "cr", sortable: false },
        { text: "Principle Blnc", value: "principal", sortable: false },
        { text: "Service Charges DR", value: "principal", sortable: false },
        { text: "Service Charges CR", value: "cr", sortable: false },
        { text: "Service Charges Blnc", value: "principal", sortable: false }
      ]
    };
  },
  methods: {
    applyFilters() {
      fetchReportsLoanLedger(this);
    },
    prepareAndRenderDataInTable(data) {
      data[0].date = data[0].issue_date;
      data.forEach((element, index) => {
        element.cr = 0;
        if (index > 0) {
          element.date = element.deposit_date;
        }
      });
      this.itemsForLoanLedger = data;
    },
    tableLoadingStatus(status) {
      this.tableLoading = status;
    },
    closeSnackbar() {
      this.snackbarModel = false;
    },
    fetchLoanHistoryItems() {
      fetchLoanHistory(this);
    },
    accountNameNdCode(item) {
      return `${item.acc_code} - ${item.acc_name}`;
    },
    loanAmountNdId(item) {
      return `${item.id} - ${item.loan_amount}`;
    }
  },
  watch: {
    $route() {
      this.dataFromInputs = {};
    }
  },
  created() {
    getLoanAccounts(this);
  }
};
</script>

<style scoped>
.headline {
  border-right: 2px solid rgb(214, 214, 214);
  width: 110px;
}
</style>
