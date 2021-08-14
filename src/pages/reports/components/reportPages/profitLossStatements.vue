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
                <v-menu
                  v-model="menu"
                  :close-on-content-click="false"
                  :nudge-right="40"
                  transition="scale-transition"
                  offset-y
                  min-width="auto"
                >
                  <template v-slot:activator="{ on, attrs }">
                    <validation-provider
                      v-slot="{ errors }"
                      name="Start date"
                      rules="required"
                    >
                      <v-text-field
                        ref="startDate"
                        v-model="startDate"
                        label="As On"
                        prepend-inner-icon="mdi-calendar"
                        readonly
                        v-bind="attrs"
                        v-on="on"
                        required
                        :error-messages="errors"
                      ></v-text-field>
                    </validation-provider>
                  </template>
                  <v-date-picker
                    v-model="startDate"
                    :max="new Date().toISOString().substr(0, 10)"
                    @input="menu = false"
                  ></v-date-picker>
                </v-menu>
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
      :currentHeaderForTable="headersForProfitLoss"
      :isDefaultFooterHidden="true"
      :itemsForTable="itemsForIncomeProfitLossStatement"
      tableTitle="Income"
      :isTableLoading="tableLoading"
    />
    <Table
      :currentHeaderForTable="headersForProfitLoss"
      :isDefaultFooterHidden="true"
      :itemsForTable="itemsForExpenditureProfitLossStatement"
      :isTableTitleHidden="false"
      tableTitle="Expenditure"
      :isTableLoading="tableLoading"
    />

    <v-card class="mt-5">
      <v-card-title style="font-size: 20px">Net Income:</v-card-title>
      <v-card-text>
        <div class="caption">
          <span
            :style="
              netIncome > 0
                ? `color:green; font-size:16px; `
                : `color: red; font-size:16px;`
            "
            >{{ netIncome !== null ? netIncome : "~" }}</span
          >
          Rs
        </div>
      </v-card-text>
    </v-card>
  </div>
</template>

<script>
import SnackBar from "@/components/snackBar.vue";
import { fetchProfitLossStatements } from "../../actions/actions";
import { required, digits, min_value } from "vee-validate/dist/rules";
import Table from "../dataTable.vue";
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
      menu: null,
      startDate: new Date().toISOString().substr(0, 10),
      btnLoading: false,
      snackbarModel: false,
      snackBarColor: "",
      snackbarText: "",
      itemsForIncomeProfitLossStatement: [],
      itemsForExpenditureProfitLossStatement: [],
      tableLoading: false,
      netIncome: null,

      headersForProfitLoss: [
        {
          text: "A/C title",
          value: "account_name",
          sortable: false,
          width: "50%"
        },
        {
          text: "Amount",
          value: "account_balance",
          sortable: false,
          width: "50%"
        }
      ]
    };
  },
  methods: {
    applyFilters() {
      fetchProfitLossStatements(this);
    },
    prepareAndRenderDataInTable(data) {
      let profitLossIncome = [];
      let profitLossExpenditure = [];
      let profitLossIncomeTotal = 0;
      let profitLossExpenditureTotal = 0;
      data.forEach(element => {
        if (element.account_nature == "Income") {
          profitLossIncome.push(element);
          profitLossIncomeTotal =
            profitLossIncomeTotal + element.account_balance;
        } else {
          profitLossExpenditure.push(element);
          profitLossExpenditureTotal =
            profitLossExpenditureTotal + element.account_balance;
        }
      });
      profitLossIncome.push({ account_balance: profitLossIncomeTotal });
      profitLossExpenditure.push({
        account_balance: profitLossExpenditureTotal
      });
      this.netIncome = profitLossIncomeTotal + profitLossExpenditureTotal;
      this.itemsForIncomeProfitLossStatement = profitLossIncome;
      this.itemsForExpenditureProfitLossStatement = profitLossExpenditure;
    },
    tableLoadingStatus(status) {
      this.tableLoading = status;
    },
    closeSnackbar() {
      this.snackbarModel = false;
    }
  },
  watch: {
    $route() {
      this.startDate = new Date().toISOString().substr(0, 10);
    }
  }
};
</script>

<style scoped>
.headline {
  border-right: 2px solid rgb(214, 214, 214);
  width: 110px;
}
</style>
