<template>
  <div class="container pt-8">
    <snack-bar
      :closeSnackbar="closeSnackbar"
      :snackbarModel="snackbar"
      :snackBarColor="snackBarColor"
      :snackbarText="message"
    ></snack-bar>

    <v-data-table
      :loading="tableLoading"
      :headers="headers"
      :items="voucherGroup"
      sort-by="Acc Code"
      class="elevation-1"
    >
      <template v-slot:top>
        <v-toolbar flat>
          <v-toolbar-title>{{
            isEditMode ? "Edit Vouchers" : "Vouchers"
          }}</v-toolbar-title>
          <v-divider class="mx-4" inset vertical></v-divider>
          <v-spacer></v-spacer>
          <v-menu
            class="ma-5"
            v-model="menu2"
            :close-on-content-click="false"
            :nudge-right="40"
            transition="scale-transition"
            offset-y
            min-width="auto"
          >
            <template v-slot:activator="{ on, attrs }">
              <v-text-field
                ref="voucherDate"
                v-on:blur="dateOutOfFocus"
                v-model="voucherPostDate"
                label="Voucher Date"
                prepend-icon="mdi-calendar"
                readonly
                v-bind="attrs"
                v-on="on"
              ></v-text-field>
            </template>
            <v-date-picker
              v-model="voucherPostDate"
              :max="new Date().toISOString().substr(0, 10)"
              @input="menu2 = false"
            ></v-date-picker>
          </v-menu>

          <v-select
            class="ma-5"
            v-model="voucherType"
            :items="accountTypes"
            label="Voucher Type"
            item-text="name"
            item-value="id"
          ></v-select>
          <v-dialog v-model="dialog" max-width="500px" persistent>
            <template v-slot:activator="{ on, attrs }">
              <v-btn
                color="primary"
                class="mb-2"
                v-bind="attrs"
                v-on="on"
                :disabled="voucherType && voucherPostDate ? false : true"
              >
                <span
                  >A<span class="text-lowercase">dd </span>V<span
                    class="text-lowercase"
                    >oucher</span
                  ></span
                >
              </v-btn>
            </template>
            <VoucherForm
              :editedItem="editedItem"
              :close="close"
              :save="save"
              :formTitle="formTitle"
              :setAccCode="setAccCode"
            />
          </v-dialog>
          <v-dialog v-model="dialogDelete" max-width="500px">
            <DeleteAlert
              :closeDelete="closeDelete"
              :deleteItemConfirm="deleteItemConfirm"
              :delLoading="delLoading"
            />
          </v-dialog>
        </v-toolbar>
      </template>
      <template v-slot:[`item.actions`]="{ item }">
        <v-icon small class="mr-2" @click="editItem(item)">
          mdi-pencil
        </v-icon>
        <v-icon small @click="deleteItem(item)">
          mdi-delete
        </v-icon>
      </template>
      <template v-slot:no-data>
        <h4>No Vouchers found</h4>
      </template>
    </v-data-table>

    <div class="text-right mx-5 my-5">
      <v-btn
        class="mr-4"
        @click="onSubmit"
        :loading="mutationLoading"
        :disabled="mutationLoading || voucherGroup == 0"
        color="primary"
        >S<span class="text-lowercase">ave</span></v-btn
      >
      <v-btn
        @click="deleteWholeVoucher"
        :disabled="delLoading || voucherGroup == 0 || !voucherGroupId"
        color="error"
        >D<span class="text-lowercase">elete</span></v-btn
      >
    </div>
  </div>
</template>

<script>
import VoucherForm from "./VoucherForm.vue";
import DeleteAlert from "./alert.vue";
import AccountTypes from "../../../utils/accountTypes";
import snackBarComp from "../../../components/snackBar";
import {
  addUpdateVouchers,
  deleteVouchers,
  getVoucherByGroupId
} from "../actions";
import { mapActions, mapState } from "vuex";

export default {
  props: ["addNewVoucherToList", "removeFromList"],
  components: { VoucherForm, DeleteAlert, "snack-bar": snackBarComp },
  data: () => ({
    tableLoading: false,
    voucherType: null,
    dialog: false,
    dialogDelete: false,
    mutationLoading: false,
    headers: [
      {
        text: "A/C Code",
        align: "start",
        sortable: false,
        value: "acc_code"
      },
      { text: "A/C No", value: "acc_no_id", sortable: false },
      { text: "Narration", value: "narration", sortable: false },
      { text: "DR", value: "dr", sortable: false },
      { text: "CR", value: "cr", sortable: false },
      { text: "Actions", value: "actions", sortable: false }
    ],
    voucherGroup: [],
    editedIndex: -1,
    menu2: false,
    editedItem: {
      acc_code: "",
      acc_code_id: "",
      acc_no_id: "",
      narration: "",
      dr: "",
      cr: ""
    },
    voucherPostDate: new Date().toISOString().substr(0, 10),
    defaultItem: {
      acc_code_id: "",
      acc_no_id: "",
      narration: "",
      dr: "",
      cr: ""
    },
    accountTypes: AccountTypes,
    delLoading: false,

    // for snackbar
    message: null,
    snackBarColor: null,
    snackbar: false,

    itemToDelete: null
  }),

  computed: {
    ...mapState({
      focusOnDate: state => state.auth_module.focusOnDate
    }),
    formTitle() {
      return this.editedIndex === -1 ? "Add Voucher" : "Edit Voucher";
    },
    isEditMode() {
      return this.voucherGroupId ? true : false;
    },
    voucherGroupId() {
      return this.$route.params.vpid;
    }
  },

  watch: {
    dialog(val) {
      val || this.close();
    },
    dialogDelete(val) {
      val || this.closeDelete();
    },
    $route: function(newRoute, oldRoute) {
      if (newRoute.params.vpid == undefined) {
        this.tableLoading = false;
        this.voucherPostDate = new Date().toISOString().substr(0, 10);
        this.voucherType = null;
        this.onClear();
      } else {
        getVoucherByGroupId(this);
      }
    },
    focusOnDate(val) {
      if (val) {
        this.$refs.voucherDate.focus();
      }
    }
  },
  created() {
    this.initialize();
    if (this.$route.params.vpid) {
      getVoucherByGroupId(this);
    }
  },
  methods: {
    ...mapActions(["changeFocusOnDate"]),
    dateOutOfFocus() {
      this.changeFocusOnDate(false);
    },
    deleteWholeVoucher() {
      this.dialogDelete = true;
    },
    initialize() {
      this.voucherGroup = [];
    },
    onClear() {
      this.voucherGroup = [];
    },
    onSubmit() {
      addUpdateVouchers(this);
    },
    async onDelete() {
      deleteVouchers(this);
    },
    editItem(item) {
      this.dialog = true;
      this.editedItem = item;
      this.editedIndex = this.voucherGroup.indexOf(item);
      console.log(this.editedIndex, "index");
    },

    deleteItem(item) {
      this.dialogDelete = true;
      this.itemToDelete = item;
    },

    deleteItemConfirm() {
      if (this.itemToDelete) {
        this.editedIndex = this.voucherGroup.indexOf(this.itemToDelete);
        this.editedItem = Object.assign({}, this.itemToDelete);
        this.voucherGroup.splice(this.editedIndex, 1);
      } else {
        this.onDelete();
      }
      this.closeDelete();
    },

    close() {
      this.dialog = false;
      this.$nextTick(() => {
        this.editedItem = Object.assign({}, this.defaultItem);
        this.editedIndex = -1;
      });
    },

    closeDelete() {
      this.dialogDelete = false;
      this.$nextTick(() => {
        this.editedItem = Object.assign({}, this.defaultItem);
        this.editedIndex = -1;
      });
    },

    save() {
      if (this.editedIndex > -1) {
        Object.assign(this.voucherGroup[this.editedIndex], this.editedItem);
      } else {
        this.voucherGroup.push(this.editedItem);
      }
      this.close();
    },

    closeSnackbar() {
      this.snackbar = false;
    },

    setAccCode(code) {
      this.editedItem.acc_code = code;
    }
  }
};
</script>
