<template>
  <div class="mt-10 container">
    <!-- add new response -->
    <v-snackbar
      v-model="snackbarSuccessLoan"
      top
      color="success"
      :timeout="snackbarTime"
    >
      {{ successTextNewLoan }}
    </v-snackbar>
    <v-snackbar
      v-model="snackbarFailedLoan"
      top
      color="red"
      :timeout="snackbarTime"
    >
      {{ failedTextNewLoan }}
    </v-snackbar>
    <!-- edit response -->
    <v-snackbar
      v-model="snackbarSuccessEdit"
      top
      color="success"
      :timeout="snackbarTime"
    >
      {{ successTextNewEdit }}
    </v-snackbar>
    <v-snackbar
      v-model="snackbarFailedEdit"
      top
      color="red"
      :timeout="snackbarTime"
    >
      {{ failedTextNewEdit }}
    </v-snackbar>
    <!-- delete response -->
    <v-snackbar
      v-model="snackbarSuccessDelete"
      top
      color="success"
      :timeout="snackbarTime"
    >
      {{ successTextDelete }}
    </v-snackbar>
    <v-snackbar
      v-model="snackbarFailedDelete"
      top
      color="red"
      :timeout="snackbarTime"
    >
      {{ failedTextDelete }}
    </v-snackbar>

    <v-data-table
      :headers="headers"
      :loading="loaderOn"
      :items="loanAccountDetails"
      sort-by="calories"
      class="elevation-1"
    >
      <template v-slot:top>
        <v-toolbar flat>
          <v-toolbar-title>Loans</v-toolbar-title>
          <v-divider class="mx-4" inset vertical></v-divider>
          <v-spacer></v-spacer>
          <v-dialog v-model="dialog" max-width="900px" persistent>
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
                    <span>{{ formTitle }}</span>
                  </v-card-title>
                  <v-window v-model="step">
                    <v-window-item :value="1">
                      <v-card-text>
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
                                    :allowed-dates="allowedDates"
                                    v-bind="attrs"
                                    v-on="on"
                                    required
                                    :error-messages="errors"
                                  ></v-text-field>
                                </validation-provider>
                              </template>
                              <v-date-picker
                                v-model="dataFromInputs.issue_date"
                                :max="getEndDate"
                                @input="menu = false"
                              ></v-date-picker>
                            </v-menu>
                          </v-col>
                          <v-col cols="12" sm="6" md="6">
                            <!-- add v-model on radio group -->
                            <validation-provider
                              v-slot="{ errors }"
                              name="Payment Type"
                              rules="required"
                            >
                              <v-radio-group
                                row
                                v-model="dataFromInputs.loan_type"
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
                                dataFromInputs.loan_type == 2
                                  ? 'required'
                                  : null
                              "
                            >
                              <v-autocomplete
                                v-model="dataFromInputs.transfer_acc_code_id"
                                :items="getChildsOfSelected"
                                :disabled="dataFromInputs.loan_type == 1"
                                :item-text="transferCodeNname"
                                item-value="id"
                                :readonly="disableAndReadonly"
                                label="Transfer A/C Code"
                                :required="dataFromInputs.loan_type == 2"
                                :error-messages="errors"
                              ></v-autocomplete>
                            </validation-provider>
                          </v-col>
                          <v-col cols="12" sm="6" md="4">
                            <validation-provider
                              v-slot="{ errors }"
                              name="Transfer A/C No"
                              :rules="
                                dataFromInputs.loan_type == 2
                                  ? 'required'
                                  : null
                              "
                            >
                              <!-- <v-text-field
                                v-model="dataFromInputs.transfer_acc_no_id"
                                :disabled="dataFromInputs.loan_type == 1"
                                label="Transfer A/C No"
                                type="number"
                                :readonly="disableAndReadonly"
                                :required="dataFromInputs.loan_type == 2"
                                :error-messages="errors"
                              ></v-text-field> -->
                              <v-autocomplete
                                v-model="dataFromInputs.transfer_acc_no_id"
                                :items="childsAfterSelection"
                                :disabled="dataFromInputs.loan_type == 1"
                                :item-text="transferNoNname"
                                item-value="id"
                                :readonly="disableAndReadonly"
                                label="Transfer A/C No"
                                :required="dataFromInputs.loan_type == 2"
                                :error-messages="errors"
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
                                item-text="acc_code"
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
                              name="Duration"
                              rules="required"
                            >
                              <v-text-field
                                v-model="dataFromInputs.issue_duration"
                                label="Duration(months)"
                                type="number"
                                :readonly="disableAndReadonly"
                                required
                                :error-messages="errors"
                              ></v-text-field>
                            </validation-provider>
                          </v-col>
                          <v-col cols="12" sm="6" md="4">
                            <validation-provider
                              v-slot="{ errors }"
                              name="Loan Amount"
                              rules="required"
                            >
                              <v-text-field
                                v-model="dataFromInputs.loan_amount"
                                label="Loan Amount"
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
                            <validation-provider
                              v-slot="{ errors }"
                              name="Markup Percentage"
                              rules="required"
                            >
                              <v-text-field
                                v-model="dataFromInputs.markup_percentage"
                                label="Markup Percentage"
                                type="number"
                                :readonly="disableAndReadonly"
                                required
                                :error-messages="errors"
                              ></v-text-field>
                            </validation-provider>
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
                          >Please enter your <strong>guarantor</strong> account
                          details</span
                        >
                        <v-row>
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
                        </v-row>

                        <v-row>
                          <v-col cols="12" sm="6" md="4">
                            <validation-provider
                              v-slot="{ errors }"
                              name="Guarantor Name"
                              rules="required"
                            >
                              <v-text-field
                                v-model="setGuarantor1.name"
                                label="Guarantor Name"
                                readonly
                                required
                                :error-messages="errors"
                              ></v-text-field>
                            </validation-provider>
                          </v-col>
                          <v-col cols="12" sm="6" md="4">
                            <validation-provider
                              v-slot="{ errors }"
                              name="Guarantor CNIC"
                              rules="required"
                            >
                              <v-text-field
                                v-model="setGuarantor1.cnic"
                                label="Guarantor CNIC"
                                readonly
                                required
                                :error-messages="errors"
                              ></v-text-field>
                            </validation-provider>
                          </v-col>
                          <v-col cols="12" sm="6" md="4">
                            <validation-provider
                              v-slot="{ errors }"
                              name="Guarantor Contact"
                              rules="required"
                            >
                              <v-text-field
                                v-model="setGuarantor1.cell"
                                label="Guarantor Contact"
                                readonly
                                required
                                :error-messages="errors"
                              ></v-text-field>
                            </validation-provider>
                          </v-col>
                        </v-row>

                        <span>Please enter second guarantor info</span>
                        <v-row>
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
                        </v-row>

                        <v-row>
                          <v-col cols="12" sm="6" md="4">
                            <validation-provider
                              v-slot="{ errors }"
                              name="Guarantor Name"
                              rules="required"
                            >
                              <v-text-field
                                v-model="setGuarantor2.name"
                                label="Guarantor Name"
                                readonly
                                required
                                :error-messages="errors"
                              ></v-text-field>
                            </validation-provider>
                          </v-col>
                          <v-col cols="12" sm="6" md="4">
                            <v-text-field
                              v-model="setGuarantor2.cnic"
                              readonly
                              label="Guarantor CNIC"
                            ></v-text-field>
                          </v-col>
                          <v-col cols="12" sm="6" md="4">
                            <validation-provider
                              v-slot="{ errors }"
                              name="Guarantor Contact"
                              rules="required"
                            >
                              <v-text-field
                                v-model="setGuarantor2.cell"
                                label="Guarantor Contact"
                                required
                                readonly
                                :error-messages="errors"
                              ></v-text-field>
                            </validation-provider>
                          </v-col>
                        </v-row>
                      </v-card-text>
                    </v-window-item>

                    <v-card-actions>
                      <v-btn color="blue darken-1" text @click="close">
                        Cancel
                      </v-btn>
                      <v-spacer></v-spacer>
                      <v-btn :disabled="step === 1" text @click="step--">
                        Back
                      </v-btn>
                      <v-btn
                        :disabled="step === 2"
                        color="primary"
                        depressed
                        @click="nextPage"
                      >
                        Next
                      </v-btn>
                      <v-btn
                        color="success"
                        @click="submit"
                        depressed
                        :disabled="!invalid && onNextPage ? false : true"
                        :loading="submitLoading"
                      >
                        Submit
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
  getDetailAccounts,
  getAccountChilds
} from "../action/action";
import { fetchAccountHolders } from "../../AccountConfig/actions/actions";
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
      { text: "Loan Issue Date", value: "issue_date", sortable: false },
      {
        text: "Loan Account Name",
        value: "loan_acc_name",
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

    snackbarTime: 2500,
    // For view complete info
    disableAndReadonly: false,

    // loader
    loaderOn: false,
    submitLoading: false,

    // show complete info
    viewLoanOpen: false,

    newTest: new Date(),

    // banks
    bankAccounts: null,

    // all group accounts
    allGroupAccounts: null,

    // account childs
    childsAfterSelection: null
  }),

  computed: {
    getChildsOfSelected() {
      if (
        this.dataFromInputs.transfer_acc_code_id !== null ||
        this.dataFromInputs.transfer_acc_code_id !== ""
      ) {
        getAccountChilds(this, this.dataFromInputs.transfer_acc_code_id);
      }
      return this.allGroupAccounts;
    },
    formTitle() {
      var temp = null;
      if (this.editedIndex === -1 && this.viewLoanOpen == false) {
        temp = "New Loan";
      } else if (this.editedIndex !== -1 && this.viewLoanOpen == false) {
        temp = "Edit Loan";
      } else if (this.viewLoanOpen == true) {
        temp = "View Loan";
      }
      return temp;
    },
    setGuarantor1() {
      var temp = {};
      if (
        this.guarantor1.acc_no_id !== null ||
        this.guarantor1.accaccountHoldersData_no_id !== ""
      ) {
        this.accountHoldersData.forEach(element => {
          if (element.id == this.guarantor1.acc_no_id) {
            this.guarantor1.guarantor_name = element.first_name;
            this.guarantor1.cnic = element.cnic;
            this.guarantor1.contact = element.cell;
            if (element.middle_name == null) {
              temp.middleName = "";
            } else {
              temp.middleName = element.middle_name;
            }
            temp.name = `${element.first_name} ${temp.middleName} ${element.last_name}`;
            temp.cnic = element.cnic;
            temp.cell = element.cell;
          }
        });
      }
      return temp;
    },
    setGuarantor2() {
      var temp = {};
      if (
        this.guarantor2.acc_no_id !== null ||
        this.guarantor2.acc_no_id !== ""
      ) {
        this.accountHoldersData.forEach(element => {
          if (element.id == this.guarantor2.acc_no_id) {
            this.guarantor2.guarantor_name = element.first_name;
            this.guarantor2.cnic = element.cnic;
            this.guarantor2.contact = element.cell;
            if (element.middle_name == null) {
              temp.middleName = "";
            } else {
              temp.middleName = element.middle_name;
            }
            temp.name = `${element.first_name} ${temp.middleName} ${element.last_name}`;
            temp.cnic = element.cnic;
            temp.cell = element.cell;
          }
        });
      }
      return temp;
    },
    testing() {
      var temp = null;
      if (
        this.dataFromInputs.issue_date !== null &&
        this.dataFromInputs.issue_date !== "" &&
        this.dataFromInputs.issue_date !== undefined &&
        this.dataFromInputs.issue_duration !== null &&
        this.dataFromInputs.issue_duration !== "" &&
        this.dataFromInputs.issue_duration !== undefined
      ) {
        temp = true;
      } else {
        temp = false;
      }
      return temp;
    },
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
      console.log(finalDate);
      return finalDate;
    }
  },

  watch: {
    dialog(val) {
      val || this.close();
    },
    dialogDelete(val) {
      val || this.closeDelete();
    },
    testing(val) {
      if (val === true) {
        this.maturityDate();
      }
    }
  },

  methods: {
    transferCodeNname(item) {
      return `${item.acc_name} - ${item.acc_code}`;
    },
    transferNoNname(item) {
      return `${item.acc_name} - ${item.acc_code}`;
    },
    maturityDate() {
      var date = this.dataFromInputs.issue_date;
      var monthsToAdd = parseInt(this.dataFromInputs.issue_duration, 10);
      var year = date.slice(0, 4);
      var month = date.slice(5, 7);
      var day = date.slice(8, 10);

      var dt = new Date(year, month, day);
      dt.setMonth(dt.getMonth() + monthsToAdd);
      var dd = dt.getDate();
      var mm = dt.getMonth();
      var yy = dt.getFullYear();
      var finalDate = null;
      if (mm == 0) {
        mm = 12;
      }
      if (mm < 10) {
        finalDate = `${yy}-0${mm}-${dd}`;
      } else {
        finalDate = `${yy}-${mm}-${dd}`;
      }
      this.dataFromInputs.maturity_date = finalDate;
    },

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
      this.maturityDate;
      this.dialog = false;
      this.viewLoanOpen = false;
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
      }
      // else {
      //   this.loanAccountDetails.push(this.dataFromInputs);
      // }
      if (this.newLoan === true) {
        addNewLoanIssue(this);
      } else {
        updateLoanIssue(this, this.editId);
      }
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
      this.viewLoanOpen = true;
      fetchLoanIssuesById(this, item.id);
      this.onNextPage = false;
      this.disableAndReadonly = true;
    },

    allowedDates(val) {
      console.log("asfd", val);
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
