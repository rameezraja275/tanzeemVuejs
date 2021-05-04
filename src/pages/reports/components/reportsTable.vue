<template>
  <div class="mt-10 container">
    <div>
      <Filters
        v-on:emitFetchedReports="receivedDataForTable($event)"
        v-on:tableLoadingStatus="changeTableLoaderStatus($event)"
      />
      <div v-if="reportsArr.length !== 0">
        <v-data-table
          :loading="tableLoading"
          :headers="tableOf"
          :items="reportsArr"
          class="elevation-1"
        >
          <template v-slot:no-data>
            <h4>No reports found</h4>
          </template>
          <template v-slot:[`item.diffOfCrDr`]="{ item }">
            <v-icon color="green">{{ item.icon }}</v-icon
            ><span style="color:red;">{{ item.diffOfCrDr }}</span>
          </template>
        </v-data-table>
      </div>
    </div>
  </div>
</template>

<script>
import Filters from "../components/filterReports";
export default {
  components: {
    Filters
  },
  computed: {
    tableOf() {
      var temp = null;
      if (this.reportOf == 200) {
        temp = [...this.headersForTrialBlnc];
      } else {
        temp = [...this.headers];
      }
      return temp;
    }
  },
  data() {
    return {
      headers: [
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
      tableLoading: false,
      reportsArr: [],
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
      console.log(temp, "data");
      this.reportsArr = [...temp];
    },
    changeTableLoaderStatus(status) {
      this.tableLoading = status;
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
