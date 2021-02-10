<template>
  <div class="mt-10 container">
    <!-- add new response -->
    <snack-bars
      :model1="snackbarSuccessLoan"
      :model2="snackbarFailedLoan"
      :successText="successTextNewLoan"
      :failedText="failedTextNewLoan"
    ></snack-bars>
    <!-- edit response -->
    <snack-bars
      :model1="snackbarSuccessEdit"
      :model2="snackbarFailedEdit"
      :successText="successTextNewEdit"
      :failedText="failedTextNewEdit"
    ></snack-bars>
    <!-- delete response -->
    <snack-bars
      :model1="snackbarSuccessDelete"
      :model2="snackbarFailedDelete"
      :successText="successTextDelete"
      :failedText="failedTextDelete"
    ></snack-bars>

    <v-data-table
      :headers="headers"
      :loading="loaderOn"
      :items="loanAccountDetails"
      sort-by="calories"
      class="elevation-1"
    >
      <template v-slot:top>
        <v-toolbar flat>
          <v-toolbar-title>Loans Issued</v-toolbar-title>
          <v-divider class="mx-4" inset vertical></v-divider>
          <v-spacer></v-spacer>
          <v-dialog v-model="dialog" max-width="900px">
            <template v-slot:activator="{ on, attrs }">
              <v-btn
                color="primary"
                dark
                class="mb-2"
                v-bind="attrs"
                v-on="on"
                v-on:click="newLoanRequired"
              >
                New Loan
              </v-btn>
            </template>

            <!-- FORRMMM -->
            <v-card>
              <validation-observer ref="observer" v-slot="{ invalid }">
                <form @submit.prevent="submit">
                  <v-card-title>
                    <span class="headline text--secondary">{{
                      formTitle
                    }}</span>
                  </v-card-title>
                  <v-window v-model="step">
                    <v-window-item :value="1">
                      <v-card-text>
                        <v-row>
                          <v-col cols="12" sm="6" md="4">
                            <validation-provider
                              v-slot="{ errors }"
                              name="Loan Amount"
                              rules="required"
                            >
                              <v-text-field
                                v-model="dataFromInputs.loan_amount"
                                label="Loan Amount"
                                :readonly="disableAndReadonly"
                                required
                                :error-messages="errors"
                              ></v-text-field>
                            </validation-provider>
                          </v-col>
                          <v-col cols="12" sm="6" md="4">
                            <validation-provider
                              v-slot="{ errors }"
                              name="Markup Percentage"
                              rules="required"
                            >
                              <v-text-field
                                v-model="dataFromInputs.markup_percentage"
                                label="Markup Percentage"
                                :readonly="disableAndReadonly"
                                required
                                :error-messages="errors"
                              ></v-text-field>
                            </validation-provider>
                          </v-col>
                          <v-col cols="12" sm="6" md="4">
                            <validation-provider
                              v-slot="{ errors }"
                              name="Issue Duration"
                              rules="required"
                            >
                              <v-text-field
                                v-model="dataFromInputs.issue_duration"
                                label="Issue Duration"
                                :readonly="disableAndReadonly"
                                required
                                :error-messages="errors"
                              ></v-text-field>
                            </validation-provider>
                          </v-col>
                        </v-row>

                        <v-row>
                          <v-col cols="12" sm="6" md="4">
                            <p>Account Type:</p>
                            <!-- add v-model on radio group -->
                            <validation-provider
                              v-slot="{ errors }"
                              name="Account Type"
                              rules="required"
                            >
                              <v-radio-group
                                row
                                v-model="dataFromInputs.loan_type"
                                required
                                :error-messages="errors"
                                :readonly="disableAndReadonly"
                              >
                                <v-radio label="Cash" :value="1"></v-radio>
                                <v-radio label="Transfer" :value="2"></v-radio>
                              </v-radio-group>
                            </validation-provider>
                          </v-col>
                          <v-col cols="12" sm="6" md="4">
                            <validation-provider
                              v-slot="{ errors }"
                              name="Transfer Account Code ID"
                              :rules="
                                dataFromInputs.loan_type == 2
                                  ? 'required'
                                  : null
                              "
                            >
                              <v-text-field
                                v-model="dataFromInputs.transfer_acc_code_id"
                                :disabled="dataFromInputs.loan_type == 1"
                                :readonly="disableAndReadonly"
                                label="Transfer Account Code ID"
                                :required="dataFromInputs.loan_type == 2"
                                :error-messages="errors"
                              ></v-text-field>
                            </validation-provider>
                          </v-col>
                          <v-col cols="12" sm="6" md="4">
                            <validation-provider
                              v-slot="{ errors }"
                              name="Transfer Account Number ID"
                              :rules="
                                dataFromInputs.loan_type == 2
                                  ? 'required'
                                  : null
                              "
                            >
                              <v-text-field
                                v-model="dataFromInputs.transfer_acc_no_id"
                                :disabled="dataFromInputs.loan_type == 1"
                                label="Transfer Account Number ID"
                                :readonly="disableAndReadonly"
                                :required="dataFromInputs.loan_type == 2"
                                :error-messages="errors"
                              ></v-text-field>
                            </validation-provider>
                          </v-col>
                        </v-row>

                        <v-row>
                          <v-col cols="12" sm="6" md="4">
                            <validation-provider
                              v-slot="{ errors }"
                              name="Loan Account Number ID"
                              rules="required"
                            >
                              <v-autocomplete
                                v-model="dataFromInputs.loan_acc_no_id"
                                :items="loanAccounts"
                                item-text="acc_code"
                                item-value="id"
                                :readonly="disableAndReadonly"
                                label="Loan Account Number ID"
                                required
                                :error-messages="errors"
                              ></v-autocomplete>
                            </validation-provider>
                          </v-col>
                        </v-row>

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
                                  name="Issue Date"
                                  rules="required"
                                >
                                  <v-text-field
                                    v-model="dataFromInputs.issue_date"
                                    label="Issue Date"
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
                                v-model="dataFromInputs.issue_date"
                                @input="menu = false"
                              ></v-date-picker>
                            </v-menu>
                          </v-col>
                          <v-col cols="12" sm="6" md="4">
                            <v-menu
                              v-model="menu2"
                              :close-on-content-click="false"
                              :nudge-right="40"
                              transition="scale-transition"
                              offset-y
                              min-width="auto"
                            >
                              <template v-slot:activator="{ on, attrs }">
                                <validation-provider
                                  v-slot="{ errors }"
                                  name="Maturity Date"
                                  rules="required"
                                >
                                  <v-text-field
                                    v-model="dataFromInputs.maturity_date"
                                    label="Maturity Date"
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
                                v-model="dataFromInputs.maturity_date"
                                @input="menu2 = false"
                              ></v-date-picker>
                            </v-menu>
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
                      </v-card-text>
                    </v-window-item>

                    <!-- guaranto info -->
                    <v-window-item :value="2">
                      <v-card-text>
                        <span
                          >Please enter your <strong>guarantors</strong> account
                          details</span
                        >
                        <v-row>
                          <v-col cols="12" sm="6" md="4">
                            <validation-provider
                              v-slot="{ errors }"
                              name="Guarantors Name"
                              rules="required"
                            >
                              <v-text-field
                                v-model="guarantor1.guarantor_name"
                                label="Guarantors Name"
                                :readonly="disableAndReadonly"
                                required
                                :error-messages="errors"
                              ></v-text-field>
                            </validation-provider>
                          </v-col>
                          <v-col cols="12" sm="6" md="4">
                            <validation-provider
                              v-slot="{ errors }"
                              name="Account Number ID"
                              rules="required"
                            >
                              <v-autocomplete
                                v-model="guarantor1.acc_no_id"
                                :items="accountHoldersData"
                                :readonly="disableAndReadonly"
                                item-text="first_name"
                                item-value="id"
                                label="Account Number ID"
                                required
                                :error-messages="errors"
                              ></v-autocomplete>
                            </validation-provider>
                          </v-col>
                          <v-col cols="12" sm="6" md="4">
                            <validation-provider
                              v-slot="{ errors }"
                              name="Guarantor CNIC"
                              rules="required"
                            >
                              <v-text-field
                                v-model="guarantor1.cnic"
                                label="Guarantor CNIC"
                                :readonly="disableAndReadonly"
                                required
                                :error-messages="errors"
                              ></v-text-field>
                            </validation-provider>
                          </v-col>
                        </v-row>

                        <v-row>
                          <v-col cols="12" sm="6" md="4">
                            <validation-provider
                              v-slot="{ errors }"
                              name="Guarantor Contact"
                              rules="required"
                            >
                              <v-text-field
                                v-model="guarantor1.contact"
                                label="Guarantor Contact"
                                :readonly="disableAndReadonly"
                                required
                                :error-messages="errors"
                              ></v-text-field>
                            </validation-provider>
                          </v-col>
                        </v-row>

                        <span>Please enter second guarantors info</span>
                        <v-row>
                          <v-col cols="12" sm="6" md="4">
                            <validation-provider
                              v-slot="{ errors }"
                              name="Guarantors Name"
                              rules="required"
                            >
                              <v-text-field
                                v-model="guarantor2.guarantor_name"
                                label="Guarantors Name"
                                :readonly="disableAndReadonly"
                                required
                                :error-messages="errors"
                              ></v-text-field>
                            </validation-provider>
                          </v-col>
                          <v-col cols="12" sm="6" md="4">
                            <validation-provider
                              v-slot="{ errors }"
                              name="Account Number ID"
                              rules="required"
                            >
                              <v-autocomplete
                                v-model="guarantor2.acc_no_id"
                                :items="accountHoldersData"
                                :readonly="disableAndReadonly"
                                item-text="first_name"
                                item-value="id"
                                label="Account Number ID"
                                required
                                :error-messages="errors"
                              ></v-autocomplete>
                            </validation-provider>
                          </v-col>
                          <v-col cols="12" sm="6" md="4">
                            <v-text-field
                              v-model="guarantor2.cnic"
                              :readonly="disableAndReadonly"
                              label="Guarantor CNIC"
                            ></v-text-field>
                          </v-col>
                        </v-row>

                        <v-row>
                          <v-col cols="12" sm="6" md="4">
                            <validation-provider
                              v-slot="{ errors }"
                              name="Guarantor Contact"
                              rules="required"
                            >
                              <v-text-field
                                v-model="guarantor2.contact"
                                label="Guarantor Contact"
                                required
                                :readonly="disableAndReadonly"
                                :error-messages="errors"
                              ></v-text-field>
                            </validation-provider>
                          </v-col>
                        </v-row>
                      </v-card-text>
                    </v-window-item>

                    <v-card-actions>
                      <v-btn :disabled="step === 1" text @click="step--">
                        Back
                      </v-btn>
                      <v-btn color="blue darken-1" text @click="close">
                        Cancel
                      </v-btn>
                      <v-spacer></v-spacer>
                      <v-btn
                        color="success"
                        @click="submit"
                        depressed
                        :disabled="!invalid && onNextPage ? false : true"
                        :loading="submitLoading"
                      >
                        Submit
                      </v-btn>
                      <v-btn
                        :disabled="step === 3"
                        color="primary"
                        depressed
                        @click="nextPage"
                      >
                        Next
                      </v-btn>
                    </v-card-actions>
                  </v-window>
                </form>
              </validation-observer>
            </v-card>
          </v-dialog>

          <!-- Delete dialog -->
          <v-dialog v-model="dialogDelete" max-width="500px">
            <v-card>
              <div class="pt-6 text-center">
                <p style="font-size: 23px;">
                  Are you sure you want to delete this item?
                </p>
              </div>
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
        <v-icon small class="mr-2" @click="editItem(item)">
          mdi-pencil
        </v-icon>
        <v-icon small @click="deleteItem(item)">
          mdi-delete
        </v-icon>
        <v-icon size="20" class="ml-2" @click="showCompleteInfo(item)">
          mdi-account-details
        </v-icon>
      </template>
    </v-data-table>
  </div>
</template>

<script>
import {
  fetchLoanIssues,
  deleteLoanIssue,
  addNewLoanIssue,
  fetchLoanIssuesById,
  updateLoanIssue,
  getDetailAccounts
} from "../action/action";
import { fetchAccountHolders } from "../../AccountConfig/actions/actions";
import { required } from "vee-validate/dist/rules";
import {
  extend,
  ValidationObserver,
  ValidationProvider,
  setInteractionMode
} from "vee-validate";
import snackbars from "../../../components/snackBars";

setInteractionMode("eager");

extend("required", {
  ...required,
  message: "{_field_} can not be empty"
});

export default {
  components: {
    ValidationProvider,
    ValidationObserver,
    "snack-bars": snackbars
  },
  data: () => ({
    dialog: false,
    dialogDelete: false,
    headers: [
      { text: "Loan Issue Date", value: "issue_date", sortable: false },
      {
        text: "Loan Account Number Id",
        value: "loan_acc_no_id",
        sortable: false
      },
      { text: "Loan Amount", value: "loan_amount" },
      {
        text: "Markup Percentage",
        value: "markup_percentage",
        sortable: false
      },
      { text: "Actions", value: "actions", sortable: false }
    ],
    loanAccountDetails: [],
    editedIndex: -1,
    editedItem: {
      id: "",
      issue_date: "",
      loan_type: "",
      transfer_acc_code_id: "",
      transfer_acc_no_id: "",
      loan_acc_no_id: "",
      loan_amount: "",
      markup_percentage: "",
      issue_duration: "",
      maturity_date: "",
      narration: "",
      createdAt: "",
      updatedAt: ""
    },
    defaultItem: {
      id: "",
      issue_date: "",
      loan_type: "",
      transfer_acc_code_id: "",
      transfer_acc_no_id: "",
      loan_acc_no_id: "",
      loan_amount: "",
      markup_percentage: "",
      issue_duration: "",
      maturity_date: "",
      narration: "",
      createdAt: "",
      updatedAt: ""
    },

    // for form steps
    step: 1,

    // delete Id
    deleteId: null,
    editId: null,

    // new loan
    newLoan: false,

    // account data
    dataFromInputs: {
      guarantor: []
    },
    guarantor1: {},
    guarantor2: {},

    // Date inputs
    menu: false,
    menu2: false,

    // account holders data for guarantors
    accountHoldersData: null,

    // for validation on next page
    onNextPage: false,

    // get loan account codes
    loanAccounts: null,

    test: false,

    // snackbars new loan
    snackbarSuccessLoan: false,
    snackbarFailedLoan: false,
    successTextNewLoan: "Successfully Issued New Loan",
    failedTextNewLoan: "There seems to be an error, failed to issue new loan",

    // snackbars edit loan
    snackbarSuccessEdit: false,
    snackbarFailedEdit: false,
    successTextNewEdit: "Successfully edited",
    failedTextNewEdit: "There seems to be an error, failed to edit",

    // snackbars delete
    snackbarSuccessDelete: false,
    snackbarFailedDelete: false,
    successTextDelete: "Successfully deleted",
    failedTextDelete: "There seems to be an error, failed to delete",

    // For view complete info
    disableAndReadonly: false,

    // loader
    loaderOn: false,
    submitLoading: false
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

  methods: {
    editItem(item) {
      this.editId = item.id;
      this.editedIndex = this.loanAccountDetails.indexOf(item);
      this.editedItem = Object.assign({}, item);
      this.onNextPage = true;
      fetchLoanIssuesById(this, item.id);
    },

    deleteItem(item) {
      this.deleteId = item.id;
      this.editedIndex = this.loanAccountDetails.indexOf(item);
      this.editedItem = Object.assign({}, item);
      this.dialogDelete = true;
    },

    deleteItemConfirm() {
      deleteLoanIssue(this, this.deleteId);
      this.loanAccountDetails.splice(this.editedIndex, 1);
      this.closeDelete();
    },

    close() {
      this.dialog = false;
      this.disableAndReadonly = false;
      this.clear();
      this.newLoan = false;
      this.step = 1;
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
      this.dataFromInputs.guarantor = [];

      this.dataFromInputs.guarantor.push(this.guarantor1, this.guarantor2);
      if (this.editedIndex > -1) {
        Object.assign(
          this.loanAccountDetails[this.editedIndex],
          this.dataFromInputs
        );
      } else {
        this.loanAccountDetails.push(this.dataFromInputs);
      }
      if (this.newLoan === true) {
        addNewLoanIssue(this);
      } else {
        updateLoanIssue(this, this.editId);
      }
      this.close();
    },

    newLoanRequired() {
      this.newLoan = true;
      this.onNextPage = false;
    },

    nextPage() {
      this.step++;
      this.onNextPage = true;
    },

    clear() {
      this.dataFromInputs = {
        id: "",
        issue_date: "",
        loan_type: null,
        transfer_acc_code_id: "",
        transfer_acc_no_id: "",
        loan_acc_no_id: "",
        loan_amount: "",
        markup_percentage: "",
        issue_duration: "",
        maturity_date: "",
        narration: "",
        createdAt: "",
        updatedAt: ""
      };
      this.guarantor1 = {
        acc_no_id: null,
        guarantor_name: "",
        cnic: "",
        contact: ""
      };
      this.guarantor2 = {
        acc_no_id: null,
        guarantor_name: "",
        cnic: "",
        contact: ""
      };
      this.$refs.observer.reset();
    },

    showCompleteInfo(item) {
      fetchLoanIssuesById(this, item.id);
      this.onNextPage = true;
      this.disableAndReadonly = true;
    }
  },

  // hooks
  created() {
    fetchLoanIssues(this);
    fetchAccountHolders(this);
    getDetailAccounts(this);
  }
};
</script>
