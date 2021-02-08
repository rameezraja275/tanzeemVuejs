<template>
  <div class="mt-10 container">
    <v-data-table
      :headers="headers"
      :items="loanAccountDetails"
      sort-by="calories"
      class="elevation-1"
    >
      <template v-slot:top>
        <v-toolbar flat>
          <v-toolbar-title>My CRUD</v-toolbar-title>
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
              <v-card-title>
                <span class="headline text--secondary">{{ formTitle }}</span>
              </v-card-title>
              <v-window v-model="step">
                <v-window-item :value="1">
                  <v-card-text>
                    <v-row>
                      <v-col cols="12" sm="6" md="4">
                        <v-text-field
                          v-model="dataFromInputs.loan_amount"
                          label="Loan Amount"
                        ></v-text-field>
                      </v-col>
                      <v-col cols="12" sm="6" md="4">
                        <v-text-field
                          v-model="dataFromInputs.markup_percentage"
                          label="Markup Percentage"
                        ></v-text-field>
                      </v-col>
                      <v-col cols="12" sm="6" md="4">
                        <v-text-field
                          v-model="dataFromInputs.issue_duration"
                          label="Issue Duration"
                        ></v-text-field>
                      </v-col>
                    </v-row>

                    <v-row>
                      <v-col cols="12" sm="6" md="4">
                        <p>Account Type:</p>
                        <!-- add v-model on radio group -->
                        <v-radio-group row v-model="dataFromInputs.loan_type">
                          <v-radio label="Cash" value="1"></v-radio>
                          <v-radio label="Transfer" value="2"></v-radio>
                        </v-radio-group>
                      </v-col>
                      <v-col cols="12" sm="6" md="4">
                        <v-text-field
                          v-model="dataFromInputs.transfer_acc_code_id"
                          :disabled="dataFromInputs.loan_type == 1"
                          label="Transfer Account Code ID"
                        ></v-text-field>
                      </v-col>
                      <v-col cols="12" sm="6" md="4">
                        <v-text-field
                          v-model="dataFromInputs.transfer_acc_no_id"
                          :disabled="dataFromInputs.loan_type == 1"
                          label="Transfer Account Number ID"
                        ></v-text-field>
                      </v-col>
                    </v-row>

                    <v-row>
                      <v-col cols="12" sm="6" md="4">
                        <v-text-field
                          v-model="dataFromInputs.loan_acc_code_id"
                          label="Loan Account Code ID"
                        ></v-text-field>
                      </v-col>
                      <v-col cols="12" sm="6" md="4">
                        <v-text-field
                          v-model="dataFromInputs.loan_acc_no_id"
                          label="Loan Account Number ID"
                        ></v-text-field>
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
                            <v-text-field
                              v-model="dataFromInputs.issue_date"
                              label="Issue Date"
                              prepend-icon="mdi-calendar"
                              readonly
                              v-bind="attrs"
                              v-on="on"
                            ></v-text-field>
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
                            <v-text-field
                              v-model="dataFromInputs.maturity_date"
                              label="Maturity Date"
                              prepend-icon="mdi-calendar"
                              readonly
                              v-bind="attrs"
                              v-on="on"
                            ></v-text-field>
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
                        <v-text-field
                          v-model="guarantor1.guarantor_name"
                          label="Guarantors Name"
                        ></v-text-field>
                      </v-col>
                      <v-col cols="12" sm="6" md="4">
                        <!-- <v-text-field v-model="guarantor1.acc_no_id" 
                        label="Account Number ID" 
                        ></v-text-field> -->
                        <v-autocomplete
                          v-model="guarantor1.acc_no_id"
                          :items="accountHoldersData"
                          item-text="first_name"
                          item-value="id"
                          label="Account Number ID"
                        ></v-autocomplete>
                      </v-col>
                      <v-col cols="12" sm="6" md="4">
                        <v-text-field
                          v-model="guarantor1.cnic"
                          label="Guarantor CNIC"
                        ></v-text-field>
                      </v-col>
                    </v-row>

                    <v-row>
                      <v-col cols="12" sm="6" md="4">
                        <v-text-field
                          v-model="guarantor1.contact"
                          label="Guarantor Contact"
                        ></v-text-field>
                      </v-col>
                    </v-row>

                    <span>Please enter second guarantors info</span>
                    <v-row>
                      <v-col cols="12" sm="6" md="4">
                        <v-text-field
                          v-model="guarantor2.guarantor_name"
                          label="Guarantors Name"
                        ></v-text-field>
                      </v-col>
                      <v-col cols="12" sm="6" md="4">
                        <v-autocomplete
                          v-model="guarantor2.acc_no_id"
                          :items="accountHoldersData"
                          item-text="first_name"
                          item-value="id"
                          label="Account Number ID"
                        ></v-autocomplete>
                      </v-col>
                      <v-col cols="12" sm="6" md="4">
                        <v-text-field
                          v-model="guarantor2.cnic"
                          label="Guarantor CNIC"
                        ></v-text-field>
                      </v-col>
                    </v-row>

                    <v-row>
                      <v-col cols="12" sm="6" md="4">
                        <v-text-field
                          v-model="guarantor2.contact"
                          label="Guarantor Contact"
                        ></v-text-field>
                      </v-col>
                    </v-row>
                  </v-card-text>
                </v-window-item>
              </v-window>

              <v-card-actions>
                <v-btn :disabled="step === 1" text @click="step--">
                  Back
                </v-btn>
                <v-btn color="blue darken-1" text @click="close">
                  Cancel
                </v-btn>
                <v-spacer></v-spacer>
                <v-btn color="success" @click="submit" depressed>
                  Submit
                </v-btn>
                <v-btn
                  :disabled="step === 3"
                  color="primary"
                  depressed
                  @click="step++"
                >
                  Next
                </v-btn>
              </v-card-actions>
            </v-card>
          </v-dialog>

          <!-- Delete dialog -->
          <v-dialog v-model="dialogDelete" max-width="500px">
            <v-card>
              <!-- <v-card-title class="headline pt-6">Are you sure you want to delete this item?</v-card-title> -->
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
  updateLoanIssue
} from "../action/action";
import { fetchAccountHolders } from "../../AccountConfig/actions/actions";

export default {
  data: () => ({
    dialog: false,
    dialogDelete: false,
    headers: [
      {
        text: "Markup Percentage",
        value: "markup_percentage",
        sortable: false
      },
      { text: "Loan Amount", value: "loan_amount" },
      { text: "Loan Issue Date", value: "issue_date", sortable: false },
      {
        text: "Loan Account Number Id",
        value: "loan_acc_no_id",
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
      loan_acc_code_id: "",
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
      loan_acc_code_id: "",
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
    accountHoldersData: null
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
      this.newLoan = false;
      console.log("change");
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
      if (this.editedIndex > -1) {
        Object.assign(
          this.loanAccountDetails[this.editedIndex],
          this.editedItem
        );
      } else {
        this.loanAccountDetails.push(this.editedItem);
      }
      this.dataFromInputs.guarantor.push(this.guarantor1, this.guarantor2);
      if (this.newLoan === true) {
        addNewLoanIssue(this);
      } else {
        updateLoanIssue(this, this.editId);
      }
      this.close();
    },

    newLoanRequired() {
      this.newLoan = true;
    }
  },

  // hooks
  created() {
    fetchLoanIssues(this);
    fetchAccountHolders(this);
  }
};
</script>
