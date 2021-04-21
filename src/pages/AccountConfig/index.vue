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
      class="elevation-1"
    >
      <template v-slot:top>
        <v-toolbar flat>
          <v-toolbar-title>Account Holders</v-toolbar-title>
          <v-divider class="mx-4" inset vertical></v-divider>
          <v-spacer></v-spacer>
          <v-btn color="primary" dark class="mb-2" @click="newUser()">
            <span
              >N<span class="text-lowercase">ew </span>A<span
                class="text-lowercase"
                >ccount</span
              ></span
            >
          </v-btn>
          <v-dialog v-model="dialogDelete" max-width="500">
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
                  :loading="deleteBtnLoading"
                  style="font-size: 14px"
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
                  :clearEditAccObj="clearEditAccObj"
                  :slctLoadingOnAcHolders="slctLoadingOnAcHolders"
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
        text: "A/C Title",
        align: "start",
        sortable: false,
        value: "first_name",
        width: 400
      },
      { text: "A/C No", value: "acc_no", sortable: false },
      { text: "Contact No", value: "cell", sortable: false },
      { text: "Gender", value: "gender", sortable: false },
      { text: "CNIC", value: "cnic", sortable: false },
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

    tableLoading: false,

    // for autocomplete loader
    slctLoadingOnAcHolders: false,

    deleteBtnLoading: false
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
    },

    clearEditAccObj() {
      this.editAccountDetails = {
        guarantors: []
      };
    }
  }
};
</script>
