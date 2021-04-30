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
          :headers="headers"
          :items="reportsArr"
          class="elevation-1"
        >
          <template v-slot:no-data>
            <h4>No reports found</h4>
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
  data() {
    return {
      headers: [
        {
          text: "A/C No",
          align: "start",
          sortable: false,
          value: "acc_no_id"
        },
        { text: "A/C Title", value: "acc_code_name", sortable: false },
        { text: "Narration", value: "narration", sortable: false },
        { text: "DR", value: "dr", sortable: false },
        { text: "CR", value: "cr", sortable: false }
        // { text: "Balance", value: "balance", sortable: false },
      ],
      tableLoading: false,
      reportsArr: []
    };
  },
  methods: {
    receivedDataForTable(data) {
      this.reportsArr = [...data];
    },
    changeTableLoaderStatus(status) {
      this.tableLoading = status;
    }
  }
};
</script>

<style></style>
