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
            @click="newUser()"
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
          <div>
            <v-row justify="center">
              <v-dialog
                v-model="dialogPopUp"
                fullscreen
                hide-overlay
                transition="dialog-bottom-transition"
                scrollable
              >
                <pop-up
                  :hideOrShowForm="hideOrShowForm"
                  :dialogPopUp="dialogPopUp"
                  :accountHoldersData="accountHoldersData"
                  :editAccountDetails="editAccountDetails"
                  :isReadOnly="isReadOnly"
                  :disableBtn="disableBtn"
                ></pop-up>
              </v-dialog>
            </v-row>
          </div>
        </v-toolbar>
      </template>
      <template v-slot:item.actions="{ item }">
        <v-icon small class="mr-2" @click="editItem(item)">
          mdi-pencil
        </v-icon>
        <v-icon small class="mr-2" @click="deleteItem(item)">
          mdi-delete
        </v-icon>
        <v-icon size="20" @click="showCompleteInfo(item)">
          mdi-account-details
        </v-icon>
      </template>
    </v-data-table>
  </div>
</template>

<script>
import {
  fetchAccountHolders,
  deleteAccountHolder,
  getAccountHolderById
} from "../VoucherPost/actions/index";
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
      { text: "Cellphone Number", value: "cell" },
      { text: "Gender", value: "gender" },
      { text: "National Id", value: "cnic" },
      { text: "Account Id", value: "id" },
      { text: "Actions", value: "actions", sortable: false }
    ],
    accountHoldersData: [],

    // for edit
    editAccountDetails: null,
    editId: null,

    // for del
    id: null,

    // for show complete details
    isReadOnly: false,

    // in form
    disableBtn: false
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
      this.id = this.accountHoldersData[this.editedIndex].id;
      this.accountHoldersData.splice(this.editedIndex, 1);
      deleteAccountHolder(this);
      this.closeDelete();
    },

    closeDelete() {
      this.dialogDelete = false;
      console.log(this.dialogDelete);
    },

    editItem(item) {
      this.disableBtn = false;
      this.isReadOnly = false;
      this.editedIndex = this.accountHoldersData.indexOf(item);
      this.editId = this.accountHoldersData[this.editedIndex].id;
      getAccountHolderById(this);
    },

    hideOrShowForm(data) {
      this.dialogPopUp = data;
    },

    showCompleteInfo(item) {
      this.disableBtn = true;
      this.editedIndex = this.accountHoldersData.indexOf(item);
      this.editId = this.accountHoldersData[this.editedIndex].id;
      this.isReadOnly = true;
      getAccountHolderById(this);
    },

    newUser() {
      this.disableBtn = false;
      this.isReadOnly = false;
      this.dialogPopUp = true;
    }
  }
};
</script>
