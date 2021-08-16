<template>
  <div class="mt-2">
    <v-card>
      <v-data-table
        :loading="isTableLoading"
        :hide-default-footer="isDefaultFooterHidden"
        :headers="currentHeaderForTable"
        :items="itemsForTable"
        class="elevation-1"
      >
        <template v-slot:top v-if="!isTableTitleHidden">
          <v-toolbar flat>
            <v-toolbar-title>{{ tableTitle }}</v-toolbar-title>
            <v-divider class="mx-4" inset vertical></v-divider>
            <v-spacer></v-spacer>
          </v-toolbar>
        </template>
        <template v-slot:no-data>
          <h4 class="font-weight-medium">No reports to show</h4>
        </template>
        <template v-slot:[`item.diffOfCrDr`]="{ item }">
          <v-icon color="green">{{ item.icon }}</v-icon
          ><span :style="item.diffOfCrDr == 0 ? `color:green;` : `color:red;`"
            >{{ item.diffOfCrDr }}
            <span class="caption">{{ item.diffOfCrDr ? "Rs" : "" }}</span></span
          >
        </template>
        <template v-slot:[`item.total_amount`]="{ item }">
          <span :style="item.total_amount > 0 ? `color: green;` : `color:red;`"
            >{{ item.total_amount }}
            <span class="caption">{{
              item.total_amount ? "Rs" : ""
            }}</span></span
          >
        </template>
      </v-data-table>
    </v-card>
  </div>
</template>

<script>
export default {
  props: [
    "currentHeaderForTable",
    "isDefaultFooterHidden",
    "itemsForTable",
    "isTableTitleHidden",
    "tableTitle",
    "isTableLoading"
  ]
};
</script>
