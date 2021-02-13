<template>
  <div class="mt-10 container">
    <v-data-table
      :headers="headers"
      :items="desserts"
      sort-by="calories"
      class="elevation-1"
    >
      <template v-slot:top>
        <v-toolbar flat>
          <v-toolbar-title>My CRUD</v-toolbar-title>
          <v-divider class="mx-4" inset vertical></v-divider>
          <v-spacer></v-spacer>
          <v-dialog v-model="dialog" max-width="1000px" persistent>
            <template v-slot:activator="{ on, attrs }">
              <v-btn color="primary" dark class="mb-2" v-bind="attrs" v-on="on">
                New Loan Instalment
              </v-btn>
            </template>
            <v-card>
              <v-card-title>
                <span class="headline">{{ formTitle }}</span>
              </v-card-title>

              <v-card-text>
                <v-container>
                  <v-row>
                    <v-col cols="12" sm="6" md="4">
                      <v-menu
                        v-model="menu"
                        :close-on-content-click="false"
                        :nudge-right="40"
                        transition="scale-transition"
                        offset-y
                        min-width="auto"
                      >
                        <template v-slot:activator="{ on, attrs }">
                          <v-text-field
                            v-model="dataFromInputs.deposit_date"
                            label="Deposit Date"
                            readonly
                            prepend-icon="mdi-calendar"
                            :disabled="disableAndReadonly"
                            v-bind="attrs"
                            v-on="on"
                            required
                          ></v-text-field>
                        </template>
                        <v-date-picker
                          v-model="dataFromInputs.deposit_date"
                          @input="menu = false"
                        ></v-date-picker>
                      </v-menu>
                    </v-col>
                    <v-col cols="12" sm="6" md="6">
                      <v-radio-group
                        row
                        v-model="dataFromInputs.deposit_type"
                        required
                        label="Payment Type:"
                        :readonly="disableAndReadonly"
                      >
                        <v-radio label="Cash" :value="1" class="ml-4"></v-radio>
                        <v-radio label="Transfer" :value="2"></v-radio>
                      </v-radio-group>
                    </v-col>
                  </v-row>

                  <v-row>
                    <v-col cols="12" sm="6" md="4">
                      <v-autocomplete
                        v-model="dataFromInputs.transfer_acc_code_id"
                        :items="getChildsOfSelected"
                        :disabled="dataFromInputs.deposit_type == 1"
                        :item-text="transferCodeNname"
                        item-value="id"
                        :readonly="disableAndReadonly"
                        label="Transfer A/C Code"
                      ></v-autocomplete>
                    </v-col>
                    <v-col cols="12" sm="6" md="4">
                      <v-autocomplete
                        v-model="dataFromInputs.transfer_acc_no_id"
                        :items="accountChilds"
                        :disabled="dataFromInputs.deposit_type == 1"
                        :item-text="transferNoNname"
                        item-value="id"
                        :readonly="disableAndReadonly"
                        label="Transfer A/C No"
                      ></v-autocomplete>
                    </v-col>
                  </v-row>

                  <v-row>
                    <v-col cols="12" sm="6" md="4">
                      <v-autocomplete
                        v-model="dataFromInputs.loan_acc_no_id"
                        :items="loanAccounts"
                        item-text="acc_code"
                        item-value="id"
                        :readonly="disableAndReadonly"
                        label="Loan A/C No"
                        required
                      ></v-autocomplete>
                    </v-col>
                    <v-col cols="12" sm="6" md="4">
                      <v-text-field
                        v-model="dataFromInputs.deposit_amount"
                        label="Deposit Amount"
                        type="number"
                        :readonly="disableAndReadonly"
                      ></v-text-field>
                    </v-col>
                  </v-row>

                  <v-row>
                    <v-col cols="12" sm="6" md="4">
                      <v-text-field
                        v-model="receivedMarkupData.markup_days"
                        label="Markup Days"
                        type="number"
                        readonly
                      ></v-text-field>
                    </v-col>
                    <v-col cols="12" sm="6" md="4">
                      <v-text-field
                        v-model="receivedMarkupData.markup_amount"
                        label="Markup Amount"
                        type="number"
                        readonly
                      ></v-text-field>
                    </v-col>
                    <v-col cols="12" sm="6" md="4">
                      <v-text-field
                        v-model="receivedMarkupData.markup_receiveable"
                        label="Markup Receiveable"
                        type="number"
                        readonly
                      ></v-text-field>
                    </v-col>
                  </v-row>

                  <v-row>
                    <v-col cols="12" sm="6" md="4">
                      <v-text-field
                        v-model="receivedMarkupData.penalty_days"
                        label="Penalty Days"
                        type="number"
                        readonly
                      ></v-text-field>
                    </v-col>
                    <v-col cols="12" sm="6" md="4">
                      <v-text-field
                        v-model="receivedMarkupData.penalty_amount"
                        label="Penalty Charge"
                        type="number"
                        readonly
                      ></v-text-field>
                    </v-col>
                  </v-row>

                  <v-row>
                    <v-col cols="12" sm="6" md="4">
                      <v-text-field
                        v-model="receivedMarkupData.principal"
                        label="Principal"
                        type="number"
                        readonly
                      ></v-text-field>
                    </v-col>
                  </v-row>

                  <v-row>
                    <v-textarea
                      label="Narration"
                      v-model="dataFromInputs.narration"
                      :readonly="disableAndReadonly"
                      rows="1"
                      class="mx-3"
                    ></v-textarea>
                  </v-row>
                </v-container>
              </v-card-text>

              <v-card-actions>
                <v-spacer></v-spacer>
                <v-btn color="blue darken-1" text @click="close">
                  Cancel
                </v-btn>
                <v-btn color="success" depressed @click="submit">
                  Submit
                </v-btn>
              </v-card-actions>
            </v-card>
          </v-dialog>
          <v-dialog v-model="dialogDelete" max-width="500px">
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
        </v-toolbar>
      </template>
      <template v-slot:[`item.actions`]="{ item }">
        <v-icon small class="mr-2" @click="editItem(item)"> mdi-pencil </v-icon>
        <v-icon small @click="deleteItem(item)"> mdi-delete </v-icon>
      </template>
    </v-data-table>
  </div>
</template>

<script>
import {
  fetchAccounts,
  fetchAccountChilds,
  fetchMarkUpDetails
} from "../actions/action";

export default {
  data: () => ({
    dialog: false,
    dialogDelete: false,
    headers: [
      {
        text: "Dessert (100g serving)",
        align: "start",
        sortable: false,
        value: "name"
      },
      { text: "Calories", value: "calories" },
      { text: "Fat (g)", value: "fat" },
      { text: "Carbs (g)", value: "carbs" },
      { text: "Protein (g)", value: "protein" },
      { text: "Actions", value: "actions", sortable: false }
    ],
    desserts: [],
    editedIndex: -1,
    editedItem: {
      name: "",
      calories: 0,
      fat: 0,
      carbs: 0,
      protein: 0
    },
    defaultItem: {
      name: "",
      calories: 0,
      fat: 0,
      carbs: 0,
      protein: 0
    },

    dataFromInputs: {},

    disableAndReadonly: false,

    // date picker
    menu: false,

    // group accounts
    allGroupAccounts: null,
    accountChilds: null,
    loanAccounts: null,

    // readonly section of form
    receivedInsData: null,

    markupDetails: null,

    receivedMarkupData: {}
  }),

  computed: {
    formTitle() {
      return this.editedIndex === -1 ? "New Instalment" : "Edit Instalment";
    },
    getChildsOfSelected() {
      if (
        this.dataFromInputs.transfer_acc_code_id !== null ||
        this.dataFromInputs.transfer_acc_code_id !== ""
      ) {
        fetchAccountChilds(this, this.dataFromInputs.transfer_acc_code_id);
      }
      return this.allGroupAccounts;
    },
    detectChangeInLoanACcode() {
      return this.dataFromInputs.loan_acc_no_id;
    },
    detectChangeInDate() {
      return this.dataFromInputs.deposit_date;
    }
  },

  watch: {
    dialog(val) {
      val || this.close();
    },
    dialogDelete(val) {
      val || this.closeDelete();
    },
    detectChangeInLoanACcode(val) {
      if (val && this.dataFromInputs.deposit_date) {
        this.setMarkupData();
        fetchMarkUpDetails(this);
      }
    },
    detectChangeInDate(val) {
      if (val && this.dataFromInputs.loan_acc_no_id) {
        this.setMarkupData();
        fetchMarkUpDetails(this);
      }
    },
    receivedMarkupData(val) {
      this.changeData();
    }
  },

  methods: {
    changeData() {
      this.dataFromInputs.markup_days = this.receivedMarkupData.markup_days;
      this.dataFromInputs.markup_amount = this.receivedMarkupData.markup_amount;
      this.dataFromInputs.markup_receiveable = this.receivedMarkupData.markup_receiveable;
      this.dataFromInputs.principal = this.receivedMarkupData.principal;
      console.log(this.dataFromInputs);
    },
    setMarkupData() {
      this.markupDetails = {
        deposit_date: this.dataFromInputs.deposit_date,
        loan_acc_no_id: this.dataFromInputs.loan_acc_no_id
      };
    },
    transferCodeNname(item) {
      return `${item.acc_name} - ${item.acc_code}`;
    },
    transferNoNname(item) {
      return `${item.acc_name} - ${item.acc_code}`;
    },
    editItem(item) {
      this.editedIndex = this.desserts.indexOf(item);
      this.editedItem = Object.assign({}, item);
      this.dialog = true;
    },

    deleteItem(item) {
      this.editedIndex = this.desserts.indexOf(item);
      this.editedItem = Object.assign({}, item);
      this.dialogDelete = true;
    },

    deleteItemConfirm() {
      this.desserts.splice(this.editedIndex, 1);
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

    submit() {
      if (this.editedIndex > -1) {
        Object.assign(this.desserts[this.editedIndex], this.editedItem);
      } else {
        this.desserts.push(this.editedItem);
      }
      console.log(this.dataFromInputs, "data before sending");
      this.close();
    }
  },

  created() {
    fetchAccounts(this);
  }
};
</script>
