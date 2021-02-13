<template>
  <div class="mt-10 container">
    <v-snackbar
      v-model="snackbarModel"
      top
      :color="snackBarColor"
      :timeout="snackbarTime"
    >
      {{ snackbarText }}
    </v-snackbar>
    <v-data-table
      :headers="headers"
      :items="loanInstalments"
      sort-by="calories"
      class="elevation-1"
    >
      <template v-slot:top>
        <v-toolbar flat>
          <v-toolbar-title>Loan Instalments</v-toolbar-title>
          <v-divider class="mx-4" inset vertical></v-divider>
          <v-spacer></v-spacer>
          <v-dialog v-model="dialog" max-width="1000px" persistent>
            <template v-slot:activator="{ on, attrs }">
              <v-btn color="primary" dark class="mb-2" v-bind="attrs" v-on="on">
                New Loan Instalment
              </v-btn>
            </template>

            <v-card>
              <validation-observer ref="observer" v-slot="{ invalid }">
                <form @submit.prevent="submit">
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
                              <validation-provider
                                v-slot="{ errors }"
                                name="Deposit Date"
                                rules="required"
                              >
                                <v-text-field
                                  v-model="dataFromInputs.deposit_date"
                                  label="Deposit Date"
                                  readonly
                                  prepend-icon="mdi-calendar"
                                  :disabled="disableAndReadonly"
                                  v-bind="attrs"
                                  v-on="on"
                                  required
                                  :error-messages="errors"
                                ></v-text-field>
                              </validation-provider>
                            </template>
                            <v-date-picker
                              v-model="dataFromInputs.deposit_date"
                              @input="menu = false"
                            ></v-date-picker>
                          </v-menu>
                        </v-col>
                        <v-col cols="12" sm="6" md="6">
                          <validation-provider
                            v-slot="{ errors }"
                            name="Payment Type"
                            rules="required"
                          >
                            <v-radio-group
                              row
                              v-model="dataFromInputs.deposit_type"
                              required
                              label="Payment Type:"
                              :error-messages="errors"
                              :readonly="disableAndReadonly"
                            >
                              <v-radio
                                label="Cash"
                                :value="1"
                                class="ml-4"
                              ></v-radio>
                              <v-radio label="Transfer" :value="2"></v-radio>
                            </v-radio-group>
                          </validation-provider>
                        </v-col>
                      </v-row>

                      <v-row>
                        <v-col cols="12" sm="6" md="4">
                          <validation-provider
                            v-slot="{ errors }"
                            name="Transfer A/C Code"
                            :rules="
                              dataFromInputs.deposit_type == 2
                                ? 'required'
                                : null
                            "
                          >
                            <v-autocomplete
                              v-model="dataFromInputs.transfer_acc_code_id"
                              :items="getChildsOfSelected"
                              :disabled="dataFromInputs.deposit_type == 1"
                              :item-text="transferCodeNname"
                              item-value="id"
                              :readonly="disableAndReadonly"
                              label="Transfer A/C Code"
                              :required="dataFromInputs.deposit_type == 2"
                              :error-messages="errors"
                            ></v-autocomplete>
                          </validation-provider>
                        </v-col>
                        <v-col cols="12" sm="6" md="4">
                          <validation-provider
                            v-slot="{ errors }"
                            name="Transfer A/C No"
                            :rules="
                              dataFromInputs.deposit_type == 2
                                ? 'required'
                                : null
                            "
                          >
                            <v-autocomplete
                              v-model="dataFromInputs.transfer_acc_no_id"
                              :items="accountChilds"
                              :disabled="dataFromInputs.deposit_type == 1"
                              :item-text="transferNoNname"
                              item-value="id"
                              :readonly="disableAndReadonly"
                              :required="dataFromInputs.deposit_type == 2"
                              :error-messages="errors"
                              label="Transfer A/C No"
                            ></v-autocomplete>
                          </validation-provider>
                        </v-col>
                      </v-row>

                      <v-row>
                        <v-col cols="12" sm="6" md="4">
                          <validation-provider
                            v-slot="{ errors }"
                            name="Loan A/C No"
                            rules="required"
                          >
                            <v-autocomplete
                              v-model="dataFromInputs.loan_acc_no_id"
                              :items="loanAccounts"
                              :item-text="loanCodeNdName"
                              item-value="id"
                              :readonly="disableAndReadonly"
                              label="Loan A/C No"
                              required
                              :error-messages="errors"
                            ></v-autocomplete>
                          </validation-provider>
                        </v-col>
                        <v-col cols="12" sm="6" md="4">
                          <validation-provider
                            v-slot="{ errors }"
                            name="Deposit Amount"
                            rules="required"
                          >
                            <v-text-field
                              v-model="dataFromInputs.deposit_amount"
                              label="Deposit Amount"
                              type="number"
                              :readonly="disableAndReadonly"
                              required
                              :error-messages="errors"
                            ></v-text-field>
                          </validation-provider>
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
                    <v-btn
                      color="success"
                      depressed
                      @click="submit"
                      :loading="submitLoading"
                      :disabled="invalid"
                    >
                      Submit
                    </v-btn>
                  </v-card-actions>
                </form>
              </validation-observer>
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
  fetchMarkUpDetails,
  addNewLoanInstalment,
  fetchLoanInstalments,
  deleteLoanInstalment
} from "../actions/action";

import { required } from "vee-validate/dist/rules";
import {
  extend,
  ValidationObserver,
  ValidationProvider,
  setInteractionMode
} from "vee-validate";

setInteractionMode("eager");

extend("required", {
  ...required,
  message: "{_field_} can not be empty"
});

export default {
  components: {
    ValidationProvider,
    ValidationObserver
  },
  data: () => ({
    dialog: false,
    dialogDelete: false,
    headers: [
      {
        text: "Date",
        align: "start",
        sortable: false,
        value: "deposit_date"
      },
      { text: "Loan A/C No", value: "loan_acc_no_id", sortable: false },
      { text: "Loan A/C", value: "firstName", sortable: false },
      { text: "Deposit Amount", value: "deposit_amount", sortable: false },
      { text: "Markup Amount", value: "markup_amount", sortable: false },
      { text: "Actions", value: "actions", sortable: false }
    ],
    loanInstalments: [],
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

    receivedMarkupData: {},

    // for snackbars
    snackbarTime: 2500,
    snackBarColor: null,
    snackbarText: null,
    snackbarModel: false,

    // submit btn loading
    submitLoading: false,

    // for delete
    deleteId: null
  }),

  computed: {
    getEndDate() {
      var date = new Date();
      var dd = date.getDate();
      var mm = date.getMonth() + 1;
      var yy = date.getFullYear();
      var finalDate = null;
      if (mm == 0) {
        mm = 12;
      }
      if (mm < 10) {
        finalDate = `${yy}-0${mm}-${dd}`;
      } else {
        finalDate = `${yy}-${mm}-${dd}`;
      }
      return finalDate;
    },

    formTitle() {
      return this.editedIndex === -1 ? "New Instalment" : "Edit Instalment";
    },
    getChildsOfSelected() {
      if (this.dataFromInputs.transfer_acc_code_id) {
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
    },
    setMarkupData() {
      this.markupDetails = {
        deposit_date: this.dataFromInputs.deposit_date,
        loan_acc_no_id: this.dataFromInputs.loan_acc_no_id
      };
    },
    loanCodeNdName(item) {
      return `${item.acc_code} - ${item.acc_name}`;
    },
    transferCodeNname(item) {
      return `${item.acc_name} - ${item.acc_code}`;
    },
    transferNoNname(item) {
      return `${item.acc_name} - ${item.acc_code}`;
    },
    editItem(item) {
      this.editedIndex = this.loanInstalments.indexOf(item);
      this.editedItem = Object.assign({}, item);
      this.dialog = true;
    },

    deleteItem(item) {
      this.editedIndex = this.loanInstalments.indexOf(item);
      this.editedItem = Object.assign({}, item);
      this.deleteId = item.id;
      this.dialogDelete = true;
    },

    deleteItemConfirm() {
      this.loanInstalments.splice(this.editedIndex, 1);
      deleteLoanInstalment(this, this.deleteId);
      this.closeDelete();
    },

    close() {
      this.dialog = false;
      this.clear();
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
        Object.assign(this.loanInstalments[this.editedIndex], this.editedItem);
      } else {
        this.loanInstalments.push(this.editedItem);
      }
      addNewLoanInstalment(this);
    },

    clear() {
      this.dataFromInputs = {
        deposit_amount: "",
        deposit_date: "",
        deposit_type: "",
        loan_acc_no_id: "",
        markup_amount: "",
        markup_days: "",
        markup_receiveable: "",
        principal: "",
        transfer_acc_code_id: "",
        transfer_acc_no_id: ""
      };
      this.receivedMarkupData = {
        markup_days: "",
        markup_amount: "",
        markup_receiveable: "",
        principal: ""
      };
      // this.$refs.observer.reset();
    }
  },

  created() {
    fetchAccounts(this);
    fetchLoanInstalments(this);
  }
};
</script>
