<template>
  <div class="mt-10 container">
    <v-data-table
      :headers="headers"
      :items="accountHoldersData"
      sort-by="calories"
      class="elevation-1"
    >
      <template v-slot:top>
        <v-toolbar flat>
          <v-toolbar-title>Account Holders</v-toolbar-title>
          <v-divider class="mx-4" inset vertical></v-divider>
          <v-spacer></v-spacer>
          <v-btn
            color="primary"
            dark
            class="mb-2"
            v-bind="attrs"
            v-on="on"
            @click="dialogPopUp = true"
          >
            New Account
          </v-btn>
          <v-dialog v-model="dialogDelete" max-width="500">
            <v-card>
              <v-card-title class="headline"
                >Are you sure you want to delete this item?</v-card-title
              >
              <v-card-actions>
                <v-spacer></v-spacer>
                <v-btn color="blue darken-1" text @click="closeDelete"
                  >Cancel</v-btn
                >
                <v-btn color="blue darken-1" text @click="deleteItemConfirm"
                  >OK</v-btn
                >
                <v-spacer></v-spacer>
              </v-card-actions>
            </v-card>
          </v-dialog>
          <pop-up
            :dialogPopUp="dialogPopUp"
            :accountHoldersData="accountHoldersData"
          ></pop-up>
        </v-toolbar>
      </template>
      <template v-slot:item.actions="{ item }">
        <v-icon small class="mr-2" @click="editItem(item)">
          mdi-pencil
        </v-icon>
        <v-icon small @click="deleteItem(item)">
          mdi-delete
        </v-icon>
      </template>
      <template v-slot:no-data>
        <v-btn color="primary" @click="initialize">
          Reset
        </v-btn>
      </template>
    </v-data-table>
  </div>
</template>

<script>
import { fetchAccountHolders } from "../VoucherPost/actions/index";
import popup from "./fullScreen-popup";

export default {
  // name:"Account config",
  components: {
    "pop-up": popup
  },
  data: () => ({
    dialogPopUp: false,
    dialog: false,
    dialogDelete: false,
    headers: [
      {
        text: "Account Holders Name",
        align: "start",
        sortable: false,
        value: "first_name",
        width: 400
      },
      { text: "Account Code", value: "acc_code" },
      { text: "Cellphone", value: "cell" },
      { text: "Gender", value: "gender" },
      { text: "National Id", value: "cnic" },
      { text: "Account Id", value: "id" }
    ],
    accountHoldersData: []
  }),

  computed: {
    formTitle() {
      return this.editedIndex === -1 ? "New Item" : "Edit Item";
    }
  },

  watch: {
    dialog(val) {
      val || this.close();
    },
    dialogDelete(val) {
      val || this.closeDelete();
    }
  },

  created() {
    this.initialize();
    fetchAccountHolders(this);
  },

  methods: {
    initialize() {
      this.accountHoldersData = [];
    },

    deleteItem(item) {
      this.editedIndex = this.accountHoldersData.indexOf(item);
      this.dialogDelete = true;
    },

    deleteItemConfirm() {
      this.accountHoldersData.splice(this.editedIndex, 1);
      this.closeDelete();
    },

    closeDelete() {
      this.dialogDelete = false;
    }
  }
};
</script>
