<template>
  <v-card class="flex" height="100%">
    <ReportLists />
    <ReportsTable />
  </v-card>
</template>

<script>
import ReportsTable from "./components/reportsTable.vue";
import ReportLists from "./components/reportLists.vue";
export default {
  components: {
    ReportsTable,
    ReportLists
  }
};
</script>

<style></style>
