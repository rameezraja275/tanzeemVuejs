<template>
  <v-card class="flex" height="100%">
    <ReportLists />
    <component v-bind:is="currentFiltersCompToUse"> </component>
  </v-card>
</template>

<script>
import ReportLists from "./components/reportLists.vue";
import AccountLedger from "./components/reports/accountLedger.vue";
import BalanceSheet from "./components/reports/balanceSheet.vue";
import LoanLedger from "./components/reports/loanLedger.vue";
import ProfitLossStatements from "./components/reports/profitLossStatements.vue";
import TrialBalance from "./components/reports/trialBalance.vue";
export default {
  components: {
    ReportLists,
    AccountLedger,
    BalanceSheet,
    LoanLedger,
    ProfitLossStatements,
    TrialBalance
  },
  data() {
    return {
      reportOf: this.$route.params.reportId
    };
  },
  computed: {
    currentFiltersCompToUse() {
      let temp = null;
      if (this.reportOf == 100 || !this.reportOf) {
        temp = "AccountLedger";
      } else if (this.reportOf == 200) {
        temp = "TrialBalance";
      } else if (this.reportOf == 300) {
        temp = "BalanceSheet";
      } else if (this.reportOf == 400) {
        temp = "LoanLedger";
      } else if (this.reportOf == 500) {
        temp = "ProfitLossStatements";
      }
      return temp;
    }
  },
  watch: {
    $route(val) {
      this.reportOf = val.params.reportId;
    }
  }
};
</script>
