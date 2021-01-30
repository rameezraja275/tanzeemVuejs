<template>
  <div id="app">
    <v-app id="inspire">
      <v-card class="mx-auto mt-10 mb-10" max-width="1200" width="100%">
        <v-form ref="form" v-model="valid" lazy-validation>
          <v-card-title class="title font-weight-regular justify-space-between">
            <span>{{ currentTitle }}</span>
            <v-snackbar v-model="snackbar" top color="red" timeout="2500">
              {{ text }}
            </v-snackbar>
            <v-snackbar
              v-model="snackbarSuccess"
              top
              color="green"
              timeout="2500"
            >
              Added Successfully!
            </v-snackbar>
            <v-avatar
              color="primary lighten-2"
              class="subheading white--text"
              size="24"
              v-text="step"
            ></v-avatar>
          </v-card-title>
          <v-window v-model="step">
            <v-window-item :value="1">
              <!-- <span class="caption grey--text text--darken-1">
                        This is the email you will use to login to your Vuetify account
                        </span> -->
              <v-card-text>
                <v-row>
                  <v-col md="4">
                    <v-text-field
                      label="First Name"
                      :rules="rules"
                      v-model="dataFromInputs1.first_name"
                    ></v-text-field>
                  </v-col>
                  <v-col md="4">
                    <v-text-field
                      label="Middle Name"
                      v-model="dataFromInputs1.middle_name"
                    ></v-text-field>
                  </v-col>
                  <v-col md="4">
                    <v-text-field
                      label="Last Name"
                      v-model="dataFromInputs1.last_name"
                    ></v-text-field>
                  </v-col>
                </v-row>

                <v-row>
                  <v-col md="4">
                    <v-autocomplete
                      v-model="dataFromInputs1.acc_code_id"
                      :items="accounts"
                      :rules="rules"
                      item-text="acc_code"
                      item-value="id"
                      label="Account"
                    ></v-autocomplete>
                  </v-col>
                  <v-col md="4">
                    <v-text-field
                      label="Account Number"
                      :rules="rules"
                      v-model="dataFromInputs1.acc_no"
                      required
                    ></v-text-field>
                  </v-col>
                </v-row>

                <v-row>
                  <v-col md="4">
                    <v-text-field
                      label="Guardian Type"
                      :rules="rules"
                      v-model="dataFromInputs1.guardian_type"
                      required
                    ></v-text-field>
                  </v-col>
                  <v-col md="4">
                    <v-text-field
                      label="Guardian Name"
                      :rules="rules"
                      v-model="dataFromInputs1.guardian_name"
                      required
                    ></v-text-field>
                  </v-col>
                </v-row>

                <v-row>
                  <v-col md="4">
                    <v-text-field
                      label="Cell Phone"
                      v-model="dataFromInputs1.cell"
                    ></v-text-field>
                  </v-col>
                  <v-col md="4">
                    <v-text-field
                      label="Landline Number"
                      v-model="dataFromInputs1.landline_no"
                    ></v-text-field>
                  </v-col>
                </v-row>

                <v-row>
                  <v-col md="4">
                    <v-text-field
                      label="Address"
                      v-model="dataFromInputs1.address"
                    ></v-text-field>
                  </v-col>
                  <v-col md="4">
                    <v-text-field
                      label="CNIC"
                      v-model="dataFromInputs1.cnic"
                    ></v-text-field>
                  </v-col>
                </v-row>

                <v-row>
                  <v-col md="4">
                    <v-select
                      :items="genderOptions"
                      v-model="dataFromInputs1.gender"
                      label="Gender"
                      :rules="rules"
                      required
                    ></v-select>
                  </v-col>
                  <v-col md="4">
                    <v-menu
                      ref="menu"
                      v-model="menu"
                      :close-on-content-click="false"
                      transition="scale-transition"
                      offset-y
                      min-width="auto"
                    >
                      <template v-slot:activator="{ on, attrs }">
                        <v-text-field
                          v-model="dataFromInputs1.dob"
                          label="Date Of Birth"
                          prepend-icon="mdi-calendar"
                          v-bind="attrs"
                          v-on="on"
                        ></v-text-field>
                      </template>
                      <v-date-picker
                        ref="picker"
                        v-model="dataFromInputs1.dob"
                        :max="new Date().toISOString().substr(0, 10)"
                        min="1900-01-01"
                        @change="save"
                      ></v-date-picker>
                    </v-menu>
                  </v-col>
                </v-row>

                <v-row>
                  <v-col md="4">
                    <v-menu
                      ref="menu2"
                      v-model="menu2"
                      :close-on-content-click="false"
                      :return-value.sync="date2"
                      transition="scale-transition"
                      offset-y
                      min-width="auto"
                    >
                      <template v-slot:activator="{ on, attrs }">
                        <v-text-field
                          v-model="date2"
                          label="Account Opening Date"
                          prepend-icon="mdi-calendar"
                          v-bind="attrs"
                          v-on="on"
                          :rules="rules"
                          required
                        ></v-text-field>
                      </template>
                      <v-date-picker v-model="date2" no-title scrollable>
                        <v-spacer></v-spacer>
                        <v-btn text color="primary" @click="menu2 = false">
                          Cancel
                        </v-btn>
                        <v-btn text color="primary" @click="setDate2()">
                          OK
                        </v-btn>
                      </v-date-picker>
                    </v-menu>
                  </v-col>
                </v-row>
              </v-card-text>
            </v-window-item>

            <v-window-item :value="2">
              <v-card-text>
                <span class="caption grey--text text--darken-1">
                  Please enter your guarantor's info
                </span>

                <v-row>
                  <v-col md="4">
                    <v-text-field
                      label="Guarantor Name"
                      v-model="guarantorObj1.guarantor_name"
                    ></v-text-field>
                  </v-col>

                  <v-col md="4">
                    <v-text-field
                      label="Guarantor Contact"
                      v-model="guarantorObj1.contact"
                    ></v-text-field>
                  </v-col>

                  <v-col md="4">
                    <v-text-field
                      label="Guarantor CNIC"
                      v-model="guarantorObj1.cnic"
                    ></v-text-field>
                  </v-col>
                </v-row>

                <v-row>
                  <v-col md="4">
                    <v-select
                      :items="accountHoldersData"
                      item-text="first_name"
                      item-value="id"
                      v-model="guarantorObj1.acc_no_id"
                      label="Account Number ID"
                    ></v-select>
                  </v-col>
                </v-row>

                <span class="caption grey--text text--darken-1">
                  Second guarantor(optional)
                </span>

                <v-row>
                  <v-col md="4">
                    <v-text-field
                      label="Guarantor Name"
                      v-model="guarantorObj2.guarantor_name"
                    ></v-text-field>
                  </v-col>

                  <v-col md="4">
                    <v-text-field
                      label="Guarantor Contact"
                      v-model="guarantorObj2.contact"
                    ></v-text-field>
                  </v-col>

                  <v-col md="4">
                    <v-text-field
                      label="Guarantor CNIC"
                      v-model="guarantorObj2.cnic"
                    ></v-text-field>
                  </v-col>
                </v-row>

                <v-row>
                  <v-col md="4">
                    <v-select
                      :items="accountHoldersData"
                      item-text="first_name"
                      item-value="id"
                      v-model="guarantorObj2.acc_no_id"
                      label="Account Holder ID's"
                    ></v-select>
                  </v-col>
                </v-row>
              </v-card-text>
            </v-window-item>
          </v-window>

          <v-divider></v-divider>

          <v-card-actions>
            <v-btn :disabled="step === 1" text @click="step--">
              Back
            </v-btn>
            <v-spacer></v-spacer>
            <v-btn
              :disabled="!valid"
              color="success"
              depressed
              @click="validate"
              :loading="loading"
            >
              Submit
            </v-btn>

            <v-btn
              :disabled="step === 2"
              color="primary"
              depressed
              @click="step++"
            >
              Next
            </v-btn>
          </v-card-actions>
        </v-form>
      </v-card>
    </v-app>
  </div>
</template>

<script>
import {
  newAccountHolder,
  updateAccountHolder
} from "../VoucherPost/actions/index";
import { GET_ACCOUNTS_NO_ID } from "../../graphql/quries";

export default {
  props: ["dialogPopUp", "accountHoldersData", "editAccountDetails"],
  data: () => ({
    step: 1,
    valid: true,
    rules: [value => !!value || "Required."],
    genderOptions: ["Male", "Female", "Other"],
    date: null,
    menu: false,
    date2: new Date().toISOString().substr(0, 10),
    menu2: false,
    accounts: [],

    // input data
    guarantorObj1: {
      acc_no_id: null,
      guarantor_name: null,
      cnic: null,
      contact: null
    },
    guarantorObj2: {
      acc_no_id: null,
      guarantor_name: null,
      cnic: null,
      contact: null
    },

    dataFromInputs1: {
      first_name: null,
      middle_name: null,
      last_name: null,
      acc_code_id: null,
      acc_no: null,
      guardian_type: null,
      guardian_name: null,
      cell: null,
      landline_no: null,
      address: null,
      cnic: null,
      gender: null,
      dob: null,
      opening_date: null,
      guarantor: []
    },

    // button loader
    loading: false,

    // snackbar
    snackbar: false,
    text: "There seems to be an error, please try again!",

    snackbarSuccess: false
  }),

  computed: {
    currentTitle() {
      switch (this.step) {
        case 1:
          return "Enter new user details";
        case 2:
          return "Guarantor Details";
        default:
          return "Not set up yet";
      }
    }
  },
  methods: {
    save(date) {
      this.$refs.menu.save(date);
    },
    setDate2() {
      this.$refs.menu2.save(this.date2);
      this.dataFromInputs1.opening_date = this.date2;
    },
    validate() {
      this.$refs.form.validate();
      if (this.$refs.form.validate()) {
        this.submitData();
      }
    },
    submitData: function() {
      if (
        this.guarantorObj2.guarantor_name !== "" &&
        this.guarantorObj2.guarantor_name !== null
      ) {
        this.dataFromInputs1.guarantor.push(this.guarantorObj2);
      } else if (
        this.guarantorObj2.guarantor_name !== "" &&
        this.guarantorObj2.guarantor_name !== null
      ) {
        this.dataFromInputs1.guarantor.push(this.guarantorObj1);
      } else {
        console.log("test");
      }
      if (this.editAccountDetails !== null) {
        // delete extra properties of dataFromInputs1 obj
        updateAccountHolder(this);
      } else {
        newAccountHolder(this);
      }
    }
  },
  watch: {
    menu(val) {
      val && setTimeout(() => (this.$refs.picker.activePicker = "YEAR"));
    }
  },
  created() {
    if (this.editAccountDetails !== null) {
      this.dataFromInputs1 = this.editAccountDetails;
    }
  },
  apollo: {
    getGroupAccounts: {
      query: GET_ACCOUNTS_NO_ID,
      result({ data }) {
        this.accounts = data.getAccounts;
      }
    }
  }
};
</script>

<style scoped>
.d-flex * {
  margin: 0 20px;
}
</style>
