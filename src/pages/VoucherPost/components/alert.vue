<template>
  <v-card>
    <p
      style="font-size:20px;text-align:center;padding-top:10px;margin-bottom:0px;"
    >
      Are you sure you want to delete this item?
    </p>
    <v-card-actions>
      <v-spacer></v-spacer>
      <v-btn
        color="blue darken-1"
        text
        @click="closeDelete"
        style="font-size: 14px"
        >Cancel</v-btn
      >
      <v-btn
        color="blue darken-1"
        text
        @click="deleteItemConfirm"
        :loading="delLoading"
        style="font-size: 14px"
        >OK</v-btn
      >
      <v-spacer></v-spacer>
    </v-card-actions>
  </v-card>
</template>

<script>
export default {
  props: ["closeDelete", "deleteItemConfirm", "delLoading"]
};
</script>
