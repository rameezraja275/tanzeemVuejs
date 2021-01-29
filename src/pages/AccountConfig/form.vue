<template>
  <div id="app">
    <v-app id="inspire">
      <v-card class="mx-auto mt-10 mb-10" max-width="1200" width="100%">
        <v-card-title class="title font-weight-regular justify-space-between">
          <span>{{ currentTitle }}</span>
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
                    v-model="dataFromInputs1.firstName"
                  ></v-text-field>
                </v-col>
                <v-col md="4">
                  <v-text-field
                    label="Middle Name"
                    v-model="dataFromInputs1.middleName"
                  ></v-text-field>
                </v-col>
                <v-col md="4">
                  <v-text-field
                    label="Last Name"
                    v-model="dataFromInputs1.lastName"
                  ></v-text-field>
                </v-col>
              </v-row>

              <v-row>
                <v-col md="4">
                  <v-text-field
                    label="Account Code"
                    :rules="rules"
                    v-model="dataFromInputs1.accountCode"
                  ></v-text-field>
                </v-col>
                <v-col md="4">
                  <v-text-field
                    label="Account Code Id"
                    :rules="rules"
                    v-model="dataFromInputs1.accountCodeId"
                  ></v-text-field>
                </v-col>
                <v-col md="4">
                  <v-text-field
                    label="Account Number"
                    :rules="rules"
                    v-model="dataFromInputs1.accountNumber"
                  ></v-text-field>
                </v-col>
              </v-row>

              <v-row>
                <v-col md="4">
                  <v-text-field
                    label="Guardian Type"
                    :rules="rules"
                    v-model="dataFromInputs1.guardianType"
                  ></v-text-field>
                </v-col>
                <v-col md="4">
                  <v-text-field
                    label="Guardian Name"
                    :rules="rules"
                    v-model="dataFromInputs1.guardianName"
                  ></v-text-field>
                </v-col>
              </v-row>

              <v-row>
                <v-col md="4">
                  <v-text-field
                    label="Cell Phone"
                    v-model="dataFromInputs1.cellPhone"
                  ></v-text-field>
                </v-col>
                <v-col md="4">
                  <v-text-field
                    label="Landline Number"
                    v-model="dataFromInputs1.landLineNumber"
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
                        v-model="date"
                        label="Date Of Birth"
                        prepend-icon="mdi-calendar"
                        v-bind="attrs"
                        v-on="on"
                      ></v-text-field>
                    </template>
                    <v-date-picker
                      ref="picker"
                      v-model="dataFromInputs1.dateOfBirth"
                      :max="new Date().toISOString().substr(0, 10)"
                      min="1950-01-01"
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
                        label="Picker in menu"
                        prepend-icon="mdi-calendar"
                        v-bind="attrs"
                        v-on="on"
                      ></v-text-field>
                    </template>
                    <v-date-picker v-model="date2" no-title scrollable>
                      <v-spacer></v-spacer>
                      <v-btn text color="primary" @click="menu2 = false">
                        Cancel
                      </v-btn>
                      <v-btn
                        text
                        color="primary"
                        @click="$refs.menu2.save(date2)"
                      >
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
                    :rules="rules"
                    v-model="guarantorObj1.guarantorName"
                  ></v-text-field>
                </v-col>

                <v-col md="4">
                  <v-text-field
                    label="Guarantor Contact"
                    :rules="rules"
                    v-model="guarantorObj1.contact"
                  ></v-text-field>
                </v-col>

                <v-col md="4">
                  <v-text-field
                    label="Guarantor CNIC"
                    :rules="rules"
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
                    v-model="guarantorObj1.accountNumberId"
                    label="Account Holder ID's"
                    :rules="rules"
                    required
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
                    :rules="rules"
                    v-model="guarantorObj2.guarantorName"
                  ></v-text-field>
                </v-col>

                <v-col md="4">
                  <v-text-field
                    label="Guarantor Contact"
                    :rules="rules"
                    v-model="guarantorObj2.contact"
                  ></v-text-field>
                </v-col>

                <v-col md="4">
                  <v-text-field
                    label="Guarantor CNIC"
                    :rules="rules"
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
                    v-model="guarantorObj2.accountNumberId"
                    label="Account Holder ID's"
                    :rules="rules"
                    required
                  ></v-select>
                </v-col>
              </v-row>
            </v-card-text>
          </v-window-item>

          <!-- <v-window-item :value="3">
                <div class="pa-4 text-center">
                    <v-img
                    class="mb-4"
                    contain
                    height="128"
                    src="https://cdn.vuetifyjs.com/images/logos/v.svg"
                    ></v-img>
                    <h3 class="title font-weight-light mb-2">
                    Welcome to Vuetify
                    </h3>
                    <span class="caption grey--text">Thanks for signing up!</span>
                </div>
                </v-window-item> -->
        </v-window>

        <v-divider></v-divider>

        <v-card-actions>
          <v-btn :disabled="step === 1" text @click="step--">
            Back
          </v-btn>
          <v-spacer></v-spacer>
          <v-btn
            :disabled="step === 2"
            color="primary"
            depressed
            @click="test()"
          >
            Next
          </v-btn>
        </v-card-actions>
      </v-card>
    </v-app>
  </div>
</template>

<script>
import { GET_ACCOUNTS } from "../../graphql/quries";

export default {
  props: [
    "guarantorObj1",
    "dataFromInputs1",
    "guarantorObj2",
    "accountHoldersData"
  ],
  data: () => ({
    step: 1,
    rules: [
      value => !!value || "Required."
      // value => (value && value.length >= 3) || 'Min 3 characters',
    ],
    genderOptions: ["Male", "Female", "Other"],
    date: null,
    menu: false,
    date2: new Date().toISOString().substr(0, 10),
    menu2: false,
    accounts: []
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
    test() {
      this.step++;
      this.dataFromInputs1.accountOpeningDate = this.date2;
    }
  },
  watch: {
    menu(val) {
      val && setTimeout(() => (this.$refs.picker.activePicker = "YEAR"));
    }
  },
  created() {},
  apollo: {
    getGroupAccounts: {
      query: GET_ACCOUNTS,
      variables: {
        acc_type: 1
      },
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
