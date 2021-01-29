<template>
  <v-card class="flex">
    <List />
    <Table />
  </v-card>
</template>

<script>
import List from "./components/List";
import Table from "./components/Table.vue";

export default {
  name: "VP",
  components: {
    List,
    Table
  }
};
</script>
