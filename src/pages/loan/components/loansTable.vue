<template>
  <div class="mt-10 container">
    <!-- add new response -->
    <snack-bar
      :snackbarModel="snackBarModel"
      :snackBarColor="snackBarColor"
      :snackbarText="snackBarText"
      :closeSnackbar="closeSnackbar"
    ></snack-bar>
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
              <v-btn color="primary" dark class="mb-2" v-bind="attrs" v-on="on">
                <span
                  >N<span class="text-lowercase">ew </span>L<span
                    class="text-lowercase"
                    >oan</span
                  ></span
                >
              </v-btn>
            </template>

            <!-- FORRMMM -->
            <v-card>
              <validation-observer ref="observer" v-slot="{ invalid }">
                <form @submit.prevent="submit" autocomplete="off">
                  <v-card-title>
                    <span>{{ formTitle }}</span>
                  </v-card-title>
                  <v-window v-model="step">
                    <v-window-item :value="1">
                      <v-card-text>
                        <span
                          class="subtitle-2"
                          style="font-weight: 500; color: #222"
                        >
                          Enter Basic Info:
                        </span>
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
                                :max="new Date().toISOString().substr(0, 10)"
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
                                :loading="
                                  dataFromInputs.loan_type == 2 &&
                                    slctTrnsfrAcCodeLoader
                                "
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
                                :loading="
                                  dataFromInputs.loan_type == 2 &&
                                    slctTrnsfrAccNoIdLoader
                                "
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
                                :item-text="loanAcIdNdName"
                                item-value="id"
                                :readonly="disableAndReadonly"
                                label="Loan A/C No"
                                required
                                :error-messages="errors"
                                :loading="slctLoanAcNoLoader"
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
                          class="subtitle-2"
                          style="font-weight: 500; color: #222"
                          >Please enter your guarantor info:</span
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
                                :item-text="AcNumIdNdName"
                                item-value="id"
                                label="A/C No"
                                required
                                :error-messages="errors"
                                :loading="slctLoadingOnAcHolders"
                                :rules="
                                  guarantor1.acc_no_id !== undefined
                                    ? [
                                        guarantor1.acc_no_id !==
                                          guarantor2.acc_no_id ||
                                          'Guarantor 1 and guarantor 2 can not be the same person'
                                      ]
                                    : []
                                "
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

                        <span
                          class="subtitle-2"
                          style="font-weight: 500; color: #222"
                          >Please enter your second guarantor info:</span
                        >
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
                                :item-text="AcNumIdNdName"
                                item-value="id"
                                label="A/C No"
                                required
                                :error-messages="errors"
                                :rules="
                                  guarantor2.acc_no_id !== undefined
                                    ? [
                                        guarantor2.acc_no_id !==
                                          guarantor1.acc_no_id ||
                                          'Guarantor 1 and guarantor 2 can not be the same person'
                                      ]
                                    : []
                                "
                                :loading="slctLoadingOnAcHolders"
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
                  </v-window>

                  <v-divider></v-divider>
                  <v-card-actions>
                    <v-btn color="blue darken-1" text @click="close">
                      C<span class="text-lowercase">ancel</span>
                    </v-btn>
                    <v-spacer></v-spacer>
                    <v-btn :disabled="step === 1" text @click="step--">
                      B<span class="text-lowercase">ack</span>
                    </v-btn>
                    <v-btn
                      v-if="step === 1"
                      color="primary"
                      depressed
                      @click="step++"
                    >
                      N<span class="text-lowercase">ext</span>
                    </v-btn>
                    <v-btn
                      color="success"
                      v-if="step === 2"
                      @click="submit"
                      depressed
                      :disabled="disableSubmitBtn(invalid)"
                      :loading="submitLoading"
                    >
                      S<span class="text-lowercase">ubmit</span>
                    </v-btn>
                  </v-card-actions>
                </form>
              </validation-observer>
            </v-card>
          </v-dialog>

          <!-- Delete dialog -->
          <v-dialog v-model="dialogDelete" max-width="500px">
            <v-card>
              <p
                style="
                  font-size: 20px;
                  text-align: center;
                  padding-top: 10px;
                  margin-bottom: 0px;
                "
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
        </v-toolbar>
      </template>
      <template v-slot:[`item.actions`]="{ item }">
        <v-icon small class="mr-2" @click="editItem(item)"> mdi-pencil </v-icon>
        <v-icon small @click="deleteItem(item)"> mdi-delete </v-icon>
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
  getAccNoItems,
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
import snackBarComp from "../../../components/snackBar";

setInteractionMode("eager");

extend("required", {
  ...required,
  message: "{_field_} can not be empty"
});

export default {
  components: {
    ValidationProvider,
    ValidationObserver,
    "snack-bar": snackBarComp
  },
  data: () => ({
    dialog: false,
    dialogDelete: false,
    headers: [
      { text: "Issue Date", value: "issue_date", sortable: false },
      {
        text: "A/C Name",
        value: "loan_acc_name",
        sortable: false
      },
      { text: "Amount", value: "loan_amount", sortable: false },
      {
        text: "Markup Percentage",
        value: "markup_percentage",
        sortable: false
      },
      { text: "Actions", value: "actions", sortable: false }
    ],
    loanAccountDetails: [],
    editedIndex: -1,
    // editedItem: {
    //   id: "",
    //   issue_date: "",
    //   loan_type: "",
    //   transfer_acc_code_id: "",
    //   transfer_acc_no_id: "",
    //   loan_acc_no_id: "",
    //   loan_amount: "",
    //   markup_percentage: "",
    //   issue_duration: "",
    //   maturity_date: "",
    //   narration: "",
    //   createdAt: "",
    //   updatedAt: ""
    // },
    // defaultItem: {
    //   id: "",
    //   issue_date: "",
    //   loan_type: "",
    //   transfer_acc_code_id: "",
    //   transfer_acc_no_id: "",
    //   loan_acc_no_id: "",
    //   loan_amount: "",
    //   markup_percentage: "",
    //   issue_duration: "",
    //   maturity_date: "",
    //   narration: "",
    //   createdAt: "",
    //   updatedAt: ""
    // },

    // for form steps
    step: 1,

    // delete Id
    selectedItemId: null,
    // deleteId: null,
    // editId: null,

    // new loan
    // newLoan: false,

    // account data
    dataFromInputs: {
      loan_type: 1,
      guarantor: []
    },
    guarantor1: {},
    guarantor2: {},

    // Date inputs
    menu: false,
    menu2: false,

    // account holders data for guarantors
    accountHoldersData: null,

    // get loan account codes
    loanAccounts: null,

    // snackbars new loan
    snackBarModel: false,
    snackBarColor: null,
    snackBarText: null,
    // For view complete info
    disableAndReadonly: false,

    // loader
    loaderOn: false,
    submitLoading: false,

    // show complete info
    viewLoanOpen: false,

    // banks
    // bankAccounts: null,

    // all group accounts
    allGroupAccounts: null,

    // account childs
    childsAfterSelection: null,

    accountName: "",

    // loader on autocomplete
    slctLoanAcNoLoader: false,
    slctTrnsfrAcCodeLoader: false,
    slctTrnsfrAccNoIdLoader: false,
    slctLoadingOnAcHolders: false,

    deleteBtnLoading: false
  }),

  computed: {
    submitDisabled() {
      // var temp = null;
      // if (this.step === 2 && !this.viewLoanOpen) {
      //   temp = false;
      // } else {
      //   temp = true;
      // }
      return this.step === 2 && !this.viewLoanOpen ? false : true;
    },
    getChildsOfSelected() {
      if (this.dataFromInputs.transfer_acc_code_id) {
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
      if (this.guarantor1.acc_no_id) {
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
      if (this.guarantor2.acc_no_id) {
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
    changeInDates() {
      // var temp = null;
      // if ( this.dataFromInputs.issue_date && this.dataFromInputs.issue_duration ) {
      //   temp = true;
      // } else {
      //   temp = false;
      // }
      return this.dataFromInputs.issue_date &&
        this.dataFromInputs.issue_duration
        ? true
        : false;
    },
    // getEndDate() {
    //   var date = new Date();
    //   var dd = date.getDate();
    //   var mm = date.getMonth() + 1;
    //   var yy = date.getFullYear();
    //   var finalDate = null;
    //   if (mm == 0) {
    //     mm = 12;
    //   }
    //   if (mm < 10) {
    //     finalDate = `${yy}-0${mm}-${dd}`;
    //   } else {
    //     finalDate = `${yy}-${mm}-${dd}`;
    //   }
    //   return finalDate;
    // }
    returnLoanType() {
      return this.dataFromInputs.loan_type;
    }
  },

  watch: {
    dialog(val) {
      val || this.close();
    },
    dialogDelete(val) {
      val || this.closeDelete();
    },
    changeInDates(val) {
      if (val === true && this.editedIndex !== 0) {
        this.maturityDate();
      }
    },
    returnLoanType(val) {
      if (val === 1) {
        this.slctTrnsfrAcCodeLoader = false;
        this.slctTrnsfrAccNoIdLoader = false;
        this.dataFromInputs.transfer_acc_code_id = 0;
        this.dataFromInputs.transfer_acc_no_id = 0;
      }
    }
  },

  methods: {
    AcNumIdNdName(item) {
      return `${item.first_name} - ${item.acc_no}`;
    },
    disableSubmitBtn(isInvalid) {
      var temp = null;
      if (isInvalid) {
        temp = true;
      } else {
        temp = false;
        if (!this.step === 2) {
          temp = true;
        }
        if (this.viewLoanOpen) {
          temp = true;
        }
      }
      return temp;
    },
    loanAcIdNdName(item) {
      this.accountName = item.acc_name;
      return `${item.acc_code} - ${item.acc_name}`;
    },
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
      this.selectedItemId = item.id;
      this.editedIndex = this.loanAccountDetails.indexOf(item);
      this.editedItem = Object.assign({}, item);
      fetchLoanIssuesById(this, item.id);
    },

    deleteItem(item) {
      this.selectedItemId = item.id;
      this.editedIndex = this.loanAccountDetails.indexOf(item);
      this.editedItem = Object.assign({}, item);
      this.dialogDelete = true;
    },

    deleteItemConfirm() {
      deleteLoanIssue(this, this.editedIndex);
    },

    close() {
      this.maturityDate;
      this.dialog = false;
      this.viewLoanOpen = false;
      this.disableAndReadonly = false;
      this.clear();
      // this.newLoan = false;
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
      if (this.formTitle === "New Loan") {
        addNewLoanIssue(this);
      } else {
        updateLoanIssue(this, this.editedIndex);
      }
    },

    // newLoanRequired() {
    //   this.newLoan = true;
    // },

    clear() {
      this.dataFromInputs = {
        loan_type: 1
      };
      this.guarantor1 = {};
      this.guarantor2 = {};
      this.$refs.observer.reset();
    },

    showCompleteInfo(item) {
      this.viewLoanOpen = true;
      fetchLoanIssuesById(this, item.id);
      this.disableAndReadonly = true;
    },

    closeSnackbar() {
      this.snackBarModel = false;
    }
  },

  // hooks
  created() {
    fetchLoanIssues(this);
    fetchAccountHolders(this);
    getDetailAccounts(this);
    getAccNoItems(this);
  }
};
</script>
