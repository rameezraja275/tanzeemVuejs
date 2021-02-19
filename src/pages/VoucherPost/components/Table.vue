<template>
  <div class="container pt-8">
    <v-snackbar
      v-model="snackbar"
      :timeout="2500"
      top
      :color="snackBarColor"
    ></v-snackbar>
    <v-data-table
      :headers="headers"
      :items="voucherGroup"
      sort-by="Acc Code"
      class="elevation-1"
    >
      <template v-slot:top>
        <v-toolbar flat>
          <v-toolbar-title>{{
            isEditMode ? "Edit Vouchers" : "Add Voucher"
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
                v-model="voucherPostDate"
                label="Date Picker"
                prepend-icon="mdi-calendar"
                readonly
                v-bind="attrs"
                v-on="on"
              ></v-text-field>
            </template>
            <v-date-picker
              v-model="voucherPostDate"
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

          <VoucherForm
            :editedItem="editedItem"
            :close="close"
            :save="save"
            :dialog="dialog"
            :formTitle="formTitle"
          />
          <DeleteAlert
            :dialogDelete="dialogDelete"
            :closeDelete="closeDelete"
            :deleteItemConfirm="deleteItemConfirm"
          />
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
        >Done</v-btn
      >
      <v-btn
        @click="onDelete"
        :loading="delLoading"
        :disabled="delLoading"
        color="error"
        >Delete</v-btn
      >
    </div>
  </div>
</template>

<script>
import VoucherForm from "./VoucherForm.vue";
import DeleteAlert from "./alert.vue";
import AccountTypes from "../../../utils/accountTypes";
import {
  addUpdateVouchers,
  deleteVouchers,
  getVoucherByGroupId
} from "../actions";
export default {
  components: { VoucherForm, DeleteAlert },
  data: () => ({
    voucherType: 1,
    dialog: false,
    dialogDelete: false,
    mutationLoading: false,
    headers: [
      {
        text: "Acc Code",
        align: "start",
        sortable: false,
        value: "acc_code_id"
      },
      { text: "A/C No", value: "acc_no_id" },
      { text: "Narration", value: "narration" },
      { text: "Dr", value: "dr", sortable: false },
      { text: "Cr", value: "cr", sortable: false },
      { text: "Actions", value: "actions", sortable: false }
    ],
    voucherGroup: [],
    editedIndex: -1,
    menu2: false,
    editedItem: {
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
    snackbar: false
  }),

  computed: {
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
        this.onClear();
      }
      getVoucherByGroupId(this);
    }
  },
  created() {
    this.initialize();
    getVoucherByGroupId(this);
  },
  methods: {
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
      this.editedIndex = this.voucherGroup.indexOf(item);
      this.editedItem = Object.assign({}, item);
      this.dialog = true;
    },

    deleteItem(item) {
      this.editedIndex = this.voucherGroup.indexOf(item);
      this.editedItem = Object.assign({}, item);
      this.dialogDelete = true;
    },

    deleteItemConfirm() {
      this.voucherGroup.splice(this.editedIndex, 1);
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
    }
  }
};
</script>
