<template>
  <v-card>
    <v-card-title class="headline"
      >Are you sure you want to delete this item?</v-card-title
    >
    <v-card-actions>
      <v-spacer></v-spacer>
      <v-btn color="blue darken-1" text @click="closeDelete">Cancel</v-btn>
      <v-btn color="blue darken-1" text @click="deleteItemConfirm">OK</v-btn>
      <v-spacer></v-spacer>
    </v-card-actions>
  </v-card>
</template>

<script>
export default {
  props: ["closeDelete", "deleteItemConfirm"]
};
</script>
