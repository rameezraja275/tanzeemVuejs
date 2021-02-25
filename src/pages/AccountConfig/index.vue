<template>
  <div class="mt-10 container">
    <snack-bar
      :snackbarModel="snackBarModel"
      :snackBarColor="snackBarColor"
      :snackbarText="snackBarText"
      :closeSnackbar="closeSnackbar"
    ></snack-bar>

    <v-data-table
      :headers="headers"
      :loading="tableLoading"
      :items="accountHoldersData"
      sort-by="calories"
      class="elevation-1"
    >
      <template v-slot:top>
        <v-toolbar flat>
          <v-toolbar-title>Account Holders</v-toolbar-title>
          <v-divider class="mx-4" inset vertical></v-divider>
          <v-spacer></v-spacer>
          <v-btn color="primary" dark class="mb-2" @click="newUser()">
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
                  :disableAndReadonly="disableAndReadonly"
                  :editedIndex="editedIndex"
                  :updateList="updateList"
                ></pop-up>
              </v-dialog>
            </v-row>
          </div>
        </v-toolbar>
      </template>
      <template v-slot:[`item.actions`]="{ item }">
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
} from "../AccountConfig/actions/actions";
import popup from "./fullScreen-popup";
import snackBarComp from "../../components/snackBar";

export default {
  // name:"Account config",
  components: {
    "pop-up": popup,
    "snack-bar": snackBarComp
  },
  data: () => ({
    dialogPopUp: false,
    // dialog: false,
    dialogDelete: false,
    headers: [
      {
        text: "Account Holders Name",
        align: "start",
        sortable: false,
        value: "first_name",
        width: 400
      },
      { text: "Cellphone Number", value: "cell", sortable: false },
      { text: "Gender", value: "gender", sortable: false },
      { text: "National Id", value: "cnic", sortable: false },
      { text: "Account Id", value: "id", sortable: false },
      { text: "Actions", value: "actions", sortable: false }
    ],
    accountHoldersData: [],

    // for edit
    editAccountDetails: null,

    // for del
    id: null,

    // in form
    disableAndReadonly: false,

    editedIndex: -1,

    // for snackbar
    snackBarModel: false,
    snackBarText: null,
    snackBarColor: null,

    tableLoading: false
  }),

  computed: {
    formTitle() {
      return this.editedIndex === -1 ? "New Item" : "Edit Item";
    }
  },

  watch: {
    // dialog(val) {
    //   val || this.close();
    // },
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
      this.id = item.id;
      this.dialogDelete = true;
    },

    deleteItemConfirm() {
      deleteAccountHolder(this, this.editedIndex);
      this.closeDelete();
    },

    removeItemFromList(deleteIndex) {
      this.accountHoldersData.splice(deleteIndex, 1);
    },

    closeDelete() {
      this.dialogDelete = false;
      this.$nextTick(() => {
        this.editedIndex = -1;
      });
    },

    editItem(item) {
      this.editedIndex = this.accountHoldersData.indexOf(item);
      this.disableAndReadonly = false;
      getAccountHolderById(this, item.id);
    },

    hideOrShowForm(data) {
      this.dialogPopUp = data;
    },

    showCompleteInfo(item) {
      this.disableAndReadonly = true;
      getAccountHolderById(this, item.id);
    },

    newUser() {
      this.editedIndex = -1;
      this.disableAndReadonly = false;
      this.dialogPopUp = true;
    },

    closeSnackbar() {
      this.snackBarModel = false;
    },

    updateList(editedIndex, data) {
      this.$set(this.accountHoldersData, editedIndex, data);
    }
  }
};
</script>
