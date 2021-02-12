<template>
  <div class="mt-10 container">
    <v-snackbar v-model="deleteAlert" top color="green" :timeout="snackbarTime">
      {{ deleteSuccess }}
    </v-snackbar>

    <v-snackbar v-model="snackbar" top color="red" :timeout="snackbarTime">
      {{ text }}
    </v-snackbar>

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
                ></pop-up>
              </v-dialog>
            </v-row>
          </div>
        </v-toolbar>
      </template>
      <template v-slot:[`item.actions`]="{ item }">
        <v-icon small class="mr-2" v-if="!editingMode" @click="editItem(item)">
          mdi-pencil
        </v-icon>
        <v-progress-circular
          v-if="loading"
          indeterminate
          size="15"
          width="1"
          class="mr-2"
        ></v-progress-circular>
        <v-icon small class="mr-2" v-if="!deleteMode" @click="deleteItem(item)">
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

    // for del
    id: null,

    // in form
    disableAndReadonly: false,

    editingMode: false,
    loading: false,
    deleteMode: false,
    editedIndex: -1,

    // delete alert
    deleteAlert: false,
    deleteSuccess: "Deleted successfully!",

    snackbar: false,
    snackbarTime: 2500,
    text: "There seems to be an error, please try again!"
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
      this.loading = true;
      this.deleteMode = true;
      this.editedIndex = this.accountHoldersData.indexOf(item);
      this.id = item.id;
      this.dialogDelete = true;
    },

    deleteItemConfirm() {
      this.loading = false;
      this.deleteMode = false;
      this.accountHoldersData.splice(this.editedIndex, 1);
      deleteAccountHolder(this);
      this.closeDelete();
    },

    closeDelete() {
      this.dialogDelete = false;
      this.loading = false;
      this.deleteMode = false;
      this.$nextTick(() => {
        this.editedIndex = -1;
      });
    },

    editItem(item) {
      this.editingMode = true;
      this.loading = true;
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
    }
  }
};
</script>
