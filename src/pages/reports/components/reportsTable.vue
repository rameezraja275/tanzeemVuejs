<template>
  <div class="mt-10 container">
    <div>
      <component
        v-on:emitFetchedReports="receivedDataForTable($event)"
        v-on:tableLoadingStatus="changeTableLoaderStatus($event)"
        class="mb-2"
        v-bind:is="currentFiltersCompToUse"
      >
      </component>
      <v-card>
        <v-card-title v-if="reportOf == 500">
          Income
        </v-card-title>
        <v-spacer></v-spacer>
        <v-data-table
          :loading="tableLoading"
          :hide-default-footer="reportOf == 300 || reportOf == 500"
          :headers="
            reportOf != 500 ? currentHeaderForTable : currentHeaderForTable[0]
          "
          :items="reportOf != 500 ? reportsArr : reportsArrIncomeProfitLoss"
          class="elevation-1"
        >
          <template v-slot:top v-if="reportOf == 300">
            <v-toolbar flat>
              <v-toolbar-title>Assets</v-toolbar-title>
              <v-divider class="mx-4" inset vertical></v-divider>
              <v-spacer></v-spacer>
            </v-toolbar>
          </template>
          <template v-slot:no-data>
            <h4>No reports found</h4>
          </template>
          <template v-slot:[`item.diffOfCrDr`]="{ item }">
            <v-icon color="green">{{ item.icon }}</v-icon
            ><span style="color:red;">{{ item.diffOfCrDr }}</span>
          </template>
        </v-data-table>
        <!-- Needed another data table if report is for balance sheet-->
        <v-data-table
          v-if="reportOf == 300 || reportOf == 500"
          :loading="tableLoading"
          hide-default-footer
          :headers="
            reportOf != 500 ? currentHeaderForTable : currentHeaderForTable[1]
          "
          :items="
            reportOf == 500 ? reportsArrExpenditureProfitLoss : reportsArr
          "
          class="elevation-1 mt-2"
        >
          <v-card-title v-if="reportOf == 500">
            Expenditure
          </v-card-title>
          <v-spacer></v-spacer>
          <template v-slot:top>
            <v-toolbar flat>
              <v-toolbar-title>Liabilities</v-toolbar-title>
              <v-divider class="mx-4" inset vertical></v-divider>
              <v-spacer></v-spacer>
            </v-toolbar>
          </template>
          <template v-slot:no-data>
            <h4>No reports found</h4>
          </template>
          <template v-slot:[`item.diffOfCrDr`]="{ item }">
            <v-icon color="green">{{ item.icon }}</v-icon
            ><span style="color:red;">{{ item.diffOfCrDr }}</span>
          </template>
        </v-data-table>

        <!-- loan ledger reports -->
        <!-- <v-data-table
          v-if="reportOf == 400 && reportsArr.length > 0"
          :loading="tableLoading"
          :hide-default-footer="reportOf == 400"
          :headers="currentHeaderForTable"
          :items="reportsArr"
          class="elevation-1"
        >
          <template v-slot:no-data>
            <h4>No reports found</h4>
          </template>
        </v-data-table> -->
      </v-card>
    </div>
  </div>
</template>

<script>
import FilterAcLedger from "../components/filters/filter-account-ledger.vue";
import FilterBlncSheet from "../components/filters/filter-balance-sheet.vue";
import FilterTrialBlnc from "../components/filters/filter-trial-balance.vue";
import FilterLoanLedger from "../components/filters/filter-loan-ledger.vue";

export default {
  components: {
    FilterAcLedger,
    FilterBlncSheet,
    FilterTrialBlnc,
    FilterLoanLedger
  },
  props: ["currentHeaderForTable"],
  data() {
    return {
      tableLoading: false,
      reportsArr: [],
      reportsArrIncomeProfitLoss: [
        { acc_name: "Bf Surplus", amount: 0 },
        { acc_name: "MISE. Income", amount: 7000 },
        { acc_name: "Bank Profit On Pls Accounts", amount: 26843 },
        { acc_name: "Bank Profit On Investment", amount: 67203 },
        { acc_name: "Total:", total: 101049 }
      ],
      reportsArrExpenditureProfitLoss: [
        { acc_name: "Audit Fee (provision)", amount: 5000 },
        { acc_name: "Bank charges", amount: 100 },
        { acc_name: "AGM Expenses", amount: 1300 },
        { acc_name: "Deprsciation Expences", amount: 0 },
        { acc_name: "Loans Write Off", amount: 0 },
        { acc_name: "Total Expenditure:", total: 6400 }
      ],
      reportOf: ""
    };
  },
  methods: {
    receivedDataForTable(data) {
      let temp = [...data];
      if (this.reportOf == 100 || !this.reportOf || this.reportOf == 200) {
        let balance = null;
        let balanceForCr = null;
        let balanceForDr = null;
        temp[0].dr !== 0 ? (balance = temp[0].dr) : (balance = temp[0].cr);
        temp.forEach(element => {
          if (this.reportOf == 200) {
            if (
              element.acc_nature === "Asset" ||
              element.acc_nature === "Expense"
            ) {
              element.dr = element.balance;
              element.cr = 0;
            } else {
              element.cr = element.balance;
              element.dr = 0;
            }
          } else {
            if (element.narration !== "Opening Balance") {
              balance = balance + element.dr - element.cr;
              element.balance = balance;
            } else {
              element.balance = balance;
            }
          }
          balanceForCr = balanceForCr + element.cr;
          balanceForDr = balanceForDr + element.dr;
        });
        if (this.reportOf == 200) {
          var difference = balanceForCr - balanceForDr;

          if (difference !== 0) {
            temp.push({ diffOfCrDr: balanceForCr - balanceForDr });
          } else {
            temp.push({ diffOfCrDr: "", icon: "mdi-check" });
          }
        }
      }
      this.reportsArr = [...temp];
    },
    changeTableLoaderStatus(status) {
      this.tableLoading = status;
    }
  },
  computed: {
    currentFiltersCompToUse() {
      let temp = null;
      if (this.reportOf == 100 || !this.reportOf) {
        temp = "FilterAcLedger";
      } else if (this.reportOf == 200) {
        temp = "FilterTrialBlnc";
      } else if (this.reportOf == 300) {
        temp = "FilterBlncSheet";
      } else if (this.reportOf == 400) {
        temp = "FilterLoanLedger";
      }
      return temp;
    }
  },
  watch: {
    $route(val) {
      this.reportOf = val.params.reportId;
      this.reportsArr = [];
    }
  },
  created() {
    this.reportOf = this.$route.params.reportId;
  }
};
</script>

<style></style>
