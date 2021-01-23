<template>
  <div>
    <v-data-table
      :headers="headers"
      :items="voucherGroup"
      sort-by="Acc Code"
      class="elevation-1"
    >
      <template v-slot:top>
        <v-toolbar flat>
          <v-toolbar-title>Voucher Post</v-toolbar-title>
          <v-divider class="mx-4" inset vertical></v-divider>
          <v-spacer></v-spacer>
          <v-menu
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
                label="Picker without buttons"
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
            v-model="accType"
            :items="accountTypes"
            label="Account Type"
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
    <v-btn
      @click="onSubmit"
      :loading="mutationLoading"
      :disabled="mutationLoading"
      >Done</v-btn
    >
  </div>
</template>

<script>
import VoucherForm from "./VoucherForm.vue";
import DeleteAlert from "./alert.vue";
import AccountTypes from "../../../utils/accountTypes";
import {
  UPDATE_POST_VOUCHER,
  ADD_POST_VOUCHER,
  GET_VOUCHERS_BY_GROUPID
} from "../../../graphql/quries";
export default {
  components: { VoucherForm, DeleteAlert },
  data: () => ({
    accType: 1,
    dialog: false,
    dialogDelete: false,
    isEditMode: true,
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
    accountTypes: AccountTypes
  }),

  computed: {
    formTitle() {
      return this.editedIndex === -1 ? "Add Voucher" : "Edit Voucher";
    }
  },

  watch: {
    dialog(val) {
      val || this.close();
    },
    dialogDelete(val) {
      val || this.closeDelete();
    },
    $route: function(newCode, oldCode) {
      this.getVoucherByGroupId();
    }
  },

  created() {
    this.initialize();
  },

  methods: {
    initialize() {
      this.voucherGroup = [];
    },
    async getVoucherByGroupId() {
      const result = await this.$apollo.query({
        query: GET_VOUCHERS_BY_GROUPID,
        variables: {
          id: Number(this.$route.params.vpid)
        }
      });
      this.voucherGroup = result.data.getAccountVouchers;
    },
    async onSubmit() {
      this.mutationLoading = true;
      const variables = {
        voucher_date: this.voucherPostDate,
        voucher_type: this.accType,
        data: this.voucherGroup
      };
      try {
        const result = await this.$apollo.mutate({
          mutation: this.isEditMode ? UPDATE_POST_VOUCHER : ADD_POST_VOUCHER,
          variables: this.isEditMode
            ? {
                ...variables,
                acc_master_id: Number(this.$route.params.vpid)
              }
            : {
                ...variables
              }
        });
        if (result.errors) {
          throw result.errors[0].message;
        }
      } catch (e) {
        this.message = e;
      }
      this.mutationLoading = false;
    },
    editItem(item) {
      this.editedIndex = this.voucherGroup.indexOf(item);
      this.editedItem = Object.assign({}, item);
      this.dialog = true;
    },

    deleteItem(item) {
      console.log("item", item);
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
