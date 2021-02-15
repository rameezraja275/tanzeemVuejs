<template>
  <v-card tile>
    <v-snackbar
      v-model="snackBarModel"
      top
      :color="snackBarColor"
      :timeout="snackBarTime"
    >
      {{ snackBarText }}
    </v-snackbar>
    <v-toolbar flat dark color="primary">
      <v-btn icon dark @click="closePopup()">
        <v-icon>mdi-close</v-icon>
      </v-btn>
      <v-toolbar-title>{{ currentTitle }}</v-toolbar-title>
      <v-spacer></v-spacer>
    </v-toolbar>

    <!-- FORMM -->
    <v-app id="inspire">
      <v-card class="mx-auto mt-10 mb-10" max-width="1200" width="100%">
        <v-form ref="form" v-model="valid" lazy-validation>
          <v-card-title class="title font-weight-regular justify-space-between">
            <span>{{ formTitle }}</span>
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
                      v-model="dataFromInputs.first_name"
                      :readonly="disableAndReadonly"
                    ></v-text-field>
                  </v-col>
                  <v-col md="4">
                    <v-text-field
                      label="Middle Name"
                      v-model="dataFromInputs.middle_name"
                      :readonly="disableAndReadonly"
                    ></v-text-field>
                  </v-col>
                  <v-col md="4">
                    <v-text-field
                      label="Last Name"
                      v-model="dataFromInputs.last_name"
                      :readonly="disableAndReadonly"
                    ></v-text-field>
                  </v-col>
                </v-row>

                <v-row>
                  <v-col md="4">
                    <v-autocomplete
                      v-model="dataFromInputs.acc_code_id"
                      :items="accounts"
                      :rules="rules"
                      :readonly="disableAndReadonly"
                      item-text="acc_code"
                      item-value="id"
                      label="Account"
                    ></v-autocomplete>
                  </v-col>
                  <v-col md="4">
                    <v-text-field
                      label="Account Number"
                      :rules="rules"
                      v-model="dataFromInputs.acc_no"
                      required
                      :readonly="disableAndReadonly"
                    ></v-text-field>
                  </v-col>
                </v-row>

                <v-row>
                  <v-col md="4">
                    <v-text-field
                      label="Guardian Type"
                      :rules="rules"
                      v-model="dataFromInputs.guardian_type"
                      required
                      :readonly="disableAndReadonly"
                    ></v-text-field>
                  </v-col>
                  <v-col md="4">
                    <v-text-field
                      label="Guardian Name"
                      :rules="rules"
                      v-model="dataFromInputs.guardian_name"
                      required
                      :readonly="disableAndReadonly"
                    ></v-text-field>
                  </v-col>
                </v-row>

                <v-row>
                  <v-col md="4">
                    <v-text-field
                      label="Cell Phone"
                      v-model="dataFromInputs.cell"
                      :readonly="disableAndReadonly"
                    ></v-text-field>
                  </v-col>
                  <v-col md="4">
                    <v-text-field
                      label="Landline Number"
                      v-model="dataFromInputs.landline_no"
                      :readonly="disableAndReadonly"
                    ></v-text-field>
                  </v-col>
                </v-row>

                <v-row>
                  <v-col md="4">
                    <v-text-field
                      label="Address"
                      v-model="dataFromInputs.address"
                      :readonly="disableAndReadonly"
                    ></v-text-field>
                  </v-col>
                  <v-col md="4">
                    <v-text-field
                      label="CNIC"
                      v-model="dataFromInputs.cnic"
                      :readonly="disableAndReadonly"
                    ></v-text-field>
                  </v-col>
                </v-row>

                <v-row>
                  <v-col md="4">
                    <v-autocomplete
                      :items="genderOptions"
                      v-model="dataFromInputs.gender"
                      label="Gender"
                      :rules="rules"
                      required
                      :readonly="disableAndReadonly"
                    ></v-autocomplete>
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
                          v-model="dataFromInputs.dob"
                          label="Date Of Birth"
                          prepend-icon="mdi-calendar"
                          v-bind="attrs"
                          v-on="on"
                          :readonly="disableAndReadonly"
                        ></v-text-field>
                      </template>
                      <v-date-picker
                        ref="picker"
                        v-model="dataFromInputs.dob"
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
                          v-model="dataFromInputs.opening_date"
                          label="Account Opening Date"
                          prepend-icon="mdi-calendar"
                          v-bind="attrs"
                          v-on="on"
                          :rules="rules"
                          required
                          :readonly="disableAndReadonly"
                        ></v-text-field>
                      </template>
                      <v-date-picker
                        v-model="dataFromInputs.opening_date"
                        @input="menu2 = false"
                      ></v-date-picker>
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
                      v-model="setGuarantors1.guarantor_name"
                      :readonly="disableAndReadonly"
                      :disabled="idIsNotDefined1"
                    ></v-text-field>
                  </v-col>

                  <v-col md="4">
                    <v-text-field
                      label="Guarantor Contact"
                      v-model="setGuarantors1.contact"
                      :readonly="disableAndReadonly"
                      :disabled="idIsNotDefined1"
                    ></v-text-field>
                  </v-col>

                  <v-col md="4">
                    <v-text-field
                      label="Guarantor CNIC"
                      v-model="setGuarantors1.cnic"
                      :readonly="disableAndReadonly"
                      :disabled="idIsNotDefined1"
                    ></v-text-field>
                  </v-col>
                </v-row>

                <v-row>
                  <v-col md="4">
                    <v-autocomplete
                      :items="returnAccountHolders"
                      item-text="first_name"
                      item-value="id"
                      v-model="guarantorObj1.acc_no_id"
                      label="Account Number ID"
                      :readonly="disableAndReadonly"
                    ></v-autocomplete>
                  </v-col>
                </v-row>

                <span class="caption grey--text text--darken-1">
                  Second guarantor(optional)
                </span>

                <v-row>
                  <v-col md="4">
                    <v-text-field
                      label="Guarantor Name"
                      v-model="setGuarantors2.guarantor_name"
                      :readonly="disableAndReadonly"
                      :disabled="idIsNotDefined2"
                    ></v-text-field>
                  </v-col>

                  <v-col md="4">
                    <v-text-field
                      label="Guarantor Contact"
                      :readonly="disableAndReadonly"
                      v-model="setGuarantors2.contact"
                      :disabled="idIsNotDefined2"
                    ></v-text-field>
                  </v-col>

                  <v-col md="4">
                    <v-text-field
                      label="Guarantor CNIC"
                      v-model="setGuarantors2.cnic"
                      :readonly="disableAndReadonly"
                      :disabled="idIsNotDefined2"
                    ></v-text-field>
                  </v-col>
                </v-row>

                <v-row>
                  <v-col md="4">
                    <v-autocomplete
                      :items="returnAccountHolders"
                      item-text="first_name"
                      item-value="id"
                      v-model="guarantorObj2.acc_no_id"
                      label="Account Number ID's"
                      :readonly="disableAndReadonly"
                    ></v-autocomplete>
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
              :disabled="disableAndReadonly"
              color="success"
              depressed
              @click="validate"
              :btnLoader="btnLoader"
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
  </v-card>
</template>

<script>
import {
  newAccountHolder,
  updateAccountHolder
} from "../AccountConfig/actions/actions";
import { GET_ACCOUNTS_NO_ID } from "../../graphql/quries";

export default {
  props: [
    "hideOrShowForm",
    "accountHoldersData",
    "editAccountDetails",
    "dialogPopUp",
    "disableAndReadonly",
    "editedIndex"
  ],
  data: () => ({
    step: 1,
    valid: true,
    rules: [value => !!value || "Required."],
    genderOptions: ["Male", "Female"],
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

    dataFromInputs: {
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
    btnLoader: false,

    // snackbar
    snackBarModel: false,
    snackBarText: null,
    snackBarColor: null,
    snackBarTime: 2100,

    editDataAlert: false,
    editSuccess: "Edited successfully!"
  }),

  computed: {
    currentTitle() {
      switch (this.step) {
        case 1:
          return "A/C Holder Info";
        case 2:
          return "Guarantor Details";
        default:
          return "Not set up yet";
      }
    },
    formTitle() {
      var temp = null;
      if (this.editedIndex === -1 && this.disableAndReadonly == false) {
        temp = "New A/C Holder";
      } else if (this.editedIndex !== -1 && this.disableAndReadonly == false) {
        temp = "Edit A/C Holder";
      } else if (this.disableAndReadonly == true) {
        temp = "View A/C Holder";
      }
      return temp;
    },
    returnAccountHolders() {
      let temp = {
        first_name: "Deselect",
        id: 0
      };
      let newObj = [...this.accountHoldersData];
      newObj.unshift(temp);
      return newObj;
    },
    idIsNotDefined1() {
      let temp = null;
      if (this.guarantorObj1.acc_no_id !== 0) {
        temp = true;
      } else {
        temp = false;
      }
      if (this.guarantorObj1.acc_no_id == null) {
        temp = false;
      }
      return temp;
    },
    idIsNotDefined2() {
      let temp = null;
      if (this.guarantorObj2.acc_no_id !== 0) {
        temp = true;
      } else {
        temp = false;
      }
      if (this.guarantorObj2.acc_no_id == null) {
        temp = false;
      }
      return temp;
    },

    setGuarantors1() {
      var temp = {};
      if (this.guarantorObj1.acc_no_id) {
        this.accountHoldersData.forEach(element => {
          if (element.id == this.guarantorObj1.acc_no_id) {
            this.guarantorObj1.guarantor_name = element.first_name;
            this.guarantorObj1.cnic = element.cnic;
            this.guarantorObj1.contact = element.cell;
            if (element.middle_name == null) {
              temp.middleName = "";
            } else {
              temp.middleName = element.middle_name;
            }
            temp.guarantor_name = `${element.first_name} ${temp.middleName} ${element.last_name}`;
            temp.cnic = element.cnic;
            temp.contact = element.cell;
          }
        });
      }
      return temp.guarantor_name ? temp : this.guarantorObj1;
    },
    setGuarantors2() {
      var temp = {};
      if (this.guarantorObj2.acc_no_id) {
        this.accountHoldersData.forEach(element => {
          if (element.id == this.guarantorObj2.acc_no_id) {
            this.guarantorObj2.guarantor_name = element.first_name;
            this.guarantorObj2.cnic = element.cnic;
            this.guarantorObj2.contact = element.cell;
            if (element.middle_name == null) {
              temp.middleName = "";
            } else {
              temp.middleName = element.middle_name;
            }
            temp.guarantor_name = `${element.first_name} ${temp.middleName} ${element.last_name}`;
            temp.cnic = element.cnic;
            temp.contact = element.cell;
          }
        });
      }
      return temp.guarantor_name ? temp : this.guarantorObj2;
    }
  },

  methods: {
    closePopup() {
      this.reset();
      this.hideOrShowForm(false);
    },
    save(date) {
      this.$refs.menu.save(date);
    },
    validate() {
      console.log(this.guarantorObj1);
      this.$refs.form.validate();
      if (this.$refs.form.validate()) {
        this.submitData();
      }
    },
    submitData: function() {
      this.dataFromInputs.guarantor = [];
      if (
        this.guarantorObj1.guarantor_name !== "" &&
        this.guarantorObj1.guarantor_name !== null
      ) {
        this.dataFromInputs.guarantor.push(this.guarantorObj1);
      }
      if (
        this.guarantorObj2.guarantor_name !== "" &&
        this.guarantorObj2.guarantor_name !== null
      ) {
        this.dataFromInputs.guarantor.push(this.guarantorObj2);
      }

      if (this.editAccountDetails !== null) {
        updateAccountHolder(this);
      } else {
        newAccountHolder(this);
      }
    },

    reset() {
      (this.guarantorObj1 = {
        acc_no_id: "",
        guarantor_name: "",
        cnic: "",
        contact: ""
      }),
        (this.guarantorObj2 = {
          acc_no_id: "",
          guarantor_name: "",
          cnic: "",
          contact: ""
        }),
        this.$refs.form.reset();
    },

    deleteTypeName() {
      // delete type name from obj
      delete this.editAccountDetails.account_holder.__typename;
      delete this.editAccountDetails.__typename;
      this.editAccountDetails.guarantors.forEach(element => {
        delete element.__typename;
      });
    }
  },
  watch: {
    snackBarModel(val) {
      if (!val) {
        this.closePopup();
      }
    },
    menu(val) {
      val && setTimeout(() => (this.$refs.picker.activePicker = "YEAR"));
    },
    dialogPopUp(val) {
      if (val === true) {
        if (
          this.editAccountDetails !== null &&
          this.editAccountDetails.account_holder.first_name !== ""
        ) {
          // delete type name from obj
          this.deleteTypeName();

          this.dataFromInputs = this.editAccountDetails.account_holder;

          if (this.editAccountDetails.guarantors[0] !== undefined) {
            this.guarantorObj1 = this.editAccountDetails.guarantors[0];
          }
          if (this.editAccountDetails.guarantors[1] !== undefined) {
            this.guarantorObj2 = this.editAccountDetails.guarantors[1];
          }
        }
      } else {
        this.step = 1;
        this.reset();
      }
    }
  },
  created() {
    if (this.editAccountDetails !== null) {
      // delete type name from obj
      this.deleteTypeName();

      this.dataFromInputs = this.editAccountDetails.account_holder;
      if (this.editAccountDetails.guarantors[0] !== undefined) {
        this.guarantorObj1 = this.editAccountDetails.guarantors[0];
      }
      if (this.editAccountDetails.guarantors[1] !== undefined) {
        this.guarantorObj2 = this.editAccountDetails.guarantors[1];
      }
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
