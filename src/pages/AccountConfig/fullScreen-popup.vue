<template>
  <div>
    <v-row justify="center">
      <v-dialog
        v-model="dialogPopUp"
        fullscreen
        hide-overlay
        transition="dialog-bottom-transition"
        scrollable
      >
        <v-card tile>
          <v-toolbar flat dark color="primary">
            <v-btn icon dark @click="dialogPopUp = false">
              <v-icon>mdi-close</v-icon>
            </v-btn>
            <v-toolbar-title>Create new account</v-toolbar-title>
            <v-spacer></v-spacer>
          </v-toolbar>

          <new-form
            :dialogPopUp="dialogPopUp"
            :accountHoldersData="accountHoldersData"
            :editAccountDetails="editAccountDetails"
          ></new-form>
        </v-card>
      </v-dialog>
    </v-row>
  </div>
</template>

<script>
import form from "./form";

export default {
  props: ["dialogPopUp", "accountHoldersData", "editAccountDetails"],
  components: {
    "new-form": form
  },
  data() {
    return {
      notifications: false,
      sound: true,
      widgets: false,
      items: [
        {
          title: "Click Me"
        },
        {
          title: "Click Me"
        },
        {
          title: "Click Me"
        },
        {
          title: "Click Me 2"
        }
      ]
    };
  }
};
</script>
