<template>
  <v-card class="flex" height="100%">
    <ReportLists />
    <ReportsTable :currentHeaderForTable="currentHeaderForTable" />
  </v-card>
</template>

<script>
import ReportsTable from "./components/reportsTable.vue";
import ReportLists from "./components/reportLists.vue";
export default {
  components: {
    ReportsTable,
    ReportLists
  },
  data() {
    return {
      headersForAccLedger: [
        {
          text: "Date",
          align: "start",
          sortable: false,
          value: "voucher_date"
        },
        {
          text: "A/C No",
          align: "start",
          sortable: false,
          value: "acc_no_id"
        },
        { text: "A/C Title", value: "acc_code_name", sortable: false },
        { text: "Narration", value: "narration", sortable: false },
        { text: "DR", value: "dr", sortable: false },
        { text: "CR", value: "cr", sortable: false },
        { text: "Balance", value: "balance", sortable: false }
      ],
      headersForTrialBlnc: [
        { text: "A/C title", value: "acc_name", sortable: false },
        { text: "DR", value: "dr", sortable: false },
        { text: "CR", value: "cr", sortable: false },
        {
          text: "Out of balance",
          value: "diffOfCrDr",
          sortable: false,
          width: "320px"
        }
      ],
      headersForBlncSheet: [
        { text: "A/C title", value: "acc_name", sortable: false },
        { text: "DR", value: "dr", sortable: false },
        { text: "CR", value: "cr", sortable: false },
        { text: "Total Asset", value: "total", sortable: false }
      ],
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
  computed: {
    currentHeaderForTable() {
      let temp = [];
      let reportOf = this.$route.params.reportId;
      if (reportOf == 200) {
        temp = [...this.headersForTrialBlnc];
      } else if (reportOf == 300) {
        temp = [...this.headersForBlncSheet];
      } else if (reportOf == 400) {
        temp = [...this.headersForLoanLedger];
      } else {
        temp = [...this.headersForAccLedger];
      }
      return temp;
    }
  }
};
</script>

<style></style>
