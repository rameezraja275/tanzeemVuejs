<template>
  <v-card tile>
    <v-toolbar flat dark color="primary">
      <v-btn icon dark @click="closePopup()">
        <v-icon>mdi-close</v-icon>
      </v-btn>
      <v-toolbar-title>Create new account</v-toolbar-title>
      <v-spacer></v-spacer>
    </v-toolbar>

    <new-form
      :accountHoldersData="accountHoldersData"
      :editAccountDetails="editAccountDetails"
      :dialogPopUp="dialogPopUp"
      :isReadOnly="isReadOnly"
      :disableBtn="disableBtn"
    ></new-form>
  </v-card>
</template>

<script>
import form from "./form";

export default {
  props: [
    "hideOrShowForm",
    "accountHoldersData",
    "editAccountDetails",
    "dialogPopUp",
    "isReadOnly",
    "disableBtn"
  ],
  components: {
    "new-form": form
  },
  methods: {
    closePopup() {
      this.hideOrShowForm(false);
      console.log(this.disableBtn, "btn");
    }
  }
};
</script>
