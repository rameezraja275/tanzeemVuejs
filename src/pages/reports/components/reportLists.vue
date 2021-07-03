<template>
  <v-card min-width="220" tile>
    <v-list shaped>
      <h4 class="mt-4 pa-4">Reports</h4>
      <v-list-item-group v-model="selectedItem" color="primary" class="pl-2">
        <!-- <div class="mx-auto">
          <v-btn color="primary" class="ml-4 my-3">Custom Report</v-btn>
        </div> -->
        <template v-for="(item, index) in items">
          <v-list-item :key="item.text" :to="{ path: `/reports/${item.id}` }">
            <v-list-item-content>
              <v-list-item-title v-text="item.text"></v-list-item-title>
            </v-list-item-content>
          </v-list-item>
          <v-divider v-if="index < items.length - 1" :key="index"></v-divider>
        </template>
      </v-list-item-group>
    </v-list>
  </v-card>
</template>

<script>
export default {
  data() {
    return {
      items: [
        { text: "Account Ledger", id: 100 },
        { text: "Trial Balance", id: 200 },
        { text: "Balance sheet", id: 300 },
        { text: "Loan Ledger", id: 400 }
      ],
      selectedItem: ""
    };
  }
};
</script>

<style></style>
