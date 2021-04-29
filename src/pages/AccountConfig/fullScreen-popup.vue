<template>
  <v-card tile>
    <v-toolbar flat dark color="primary">
      <v-btn icon dark @click="closePopup()">
        <v-icon>mdi-close</v-icon>
      </v-btn>
      <v-toolbar-title>{{ currentTitle }}</v-toolbar-title>
      <v-spacer></v-spacer>
    </v-toolbar>
    <snack-bar
      :snackbarModel="snackBarModel"
      :snackBarColor="snackBarColor"
      :snackbarText="snackBarText"
      :closeSnackbar="closeSnackbar"
    ></snack-bar>

    <!-- FORMM -->
    <v-app id="inspire">
      <v-card class="mx-auto mt-10 mb-10" max-width="1200" width="100%">
        <validation-observer ref="observer" v-slot="{ invalid }">
          <v-form @submit.prevent="submit" autocomplete="off">
            <v-card-title
              class="title font-weight-regular justify-space-between"
            >
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
                <v-card-text>
                  <span class="subtitle-2">
                    Enter Basic Info:
                  </span>
                  <v-row>
                    <v-col md="4">
                      <validation-provider
                        v-slot="{ errors }"
                        name="First Name"
                        rules="required"
                      >
                        <v-text-field
                          label="First Name"
                          ref="firstNameFocus"
                          required
                          :error-messages="errors"
                          v-model="dataFromInputs.first_name"
                          :readonly="disableAndReadonly"
                        ></v-text-field>
                      </validation-provider>
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
                      <validation-provider
                        v-slot="{ errors }"
                        name="A/C Code"
                        rules="required"
                      >
                        <v-autocomplete
                          v-model="dataFromInputs.acc_code_id"
                          :items="accounts"
                          required
                          :error-messages="errors"
                          :readonly="disableAndReadonly"
                          :item-text="accountNameNdCode"
                          item-value="id"
                          label="A/C Code"
                          :disabled="editAccountDetails ? true : false"
                          :loading="selectLoadingACCode === 1"
                        ></v-autocomplete>
                      </validation-provider>
                    </v-col>
                    <v-col md="4">
                      <validation-provider
                        v-slot="{ errors }"
                        name="A/C No"
                        rules="required"
                      >
                        <v-text-field
                          label="A/C No"
                          v-model="dataFromInputs.acc_no"
                          required
                          :error-messages="errors"
                          :readonly="disableAndReadonly"
                          :disabled="editAccountDetails ? true : false"
                        ></v-text-field>
                      </validation-provider>
                    </v-col>
                  </v-row>

                  <v-row>
                    <v-col md="4">
                      <validation-provider
                        v-slot="{ errors }"
                        name="Guardian Type"
                        rules="required"
                      >
                        <v-text-field
                          label="Guardian Type"
                          v-model="dataFromInputs.guardian_type"
                          required
                          :error-messages="errors"
                          :readonly="disableAndReadonly"
                        ></v-text-field>
                      </validation-provider>
                    </v-col>
                    <v-col md="4">
                      <validation-provider
                        v-slot="{ errors }"
                        name="Guardian Name"
                        rules="required"
                      >
                        <v-text-field
                          label="Guardian Name"
                          v-model="dataFromInputs.guardian_name"
                          required
                          :error-messages="errors"
                          :readonly="disableAndReadonly"
                        ></v-text-field>
                      </validation-provider>
                    </v-col>
                  </v-row>

                  <v-row>
                    <v-col md="4">
                      <validation-provider
                        v-slot="{ errors }"
                        name="Cell Phone"
                        rules="required|max:11|min:11"
                      >
                        <v-text-field
                          label="Cell Phone"
                          v-model="dataFromInputs.cell"
                          :readonly="disableAndReadonly"
                          required
                          :error-messages="errors"
                        ></v-text-field>
                      </validation-provider>
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
                      <validation-provider
                        v-slot="{ errors }"
                        name="CNIC"
                        rules="required|max:13|min:13"
                      >
                        <v-text-field
                          label="CNIC"
                          v-model="dataFromInputs.cnic"
                          required
                          :error-messages="errors"
                          :readonly="disableAndReadonly"
                        ></v-text-field>
                      </validation-provider>
                    </v-col>
                  </v-row>

                  <v-row>
                    <v-col md="4">
                      <validation-provider
                        v-slot="{ errors }"
                        name="Gender"
                        rules="required"
                      >
                        <v-autocomplete
                          :items="genderOptions"
                          v-model="dataFromInputs.gender"
                          label="Gender"
                          required
                          :error-messages="errors"
                          :readonly="disableAndReadonly"
                        ></v-autocomplete>
                      </validation-provider>
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
                          min="1800-01-01"
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
                          <validation-provider
                            v-slot="{ errors }"
                            name="A/C Opening Date"
                            rules="required"
                          >
                            <v-text-field
                              v-model="dataFromInputs.opening_date"
                              label="A/C Opening Date"
                              prepend-icon="mdi-calendar"
                              v-bind="attrs"
                              v-on="on"
                              required
                              :error-messages="errors"
                              :readonly="disableAndReadonly"
                            ></v-text-field>
                          </validation-provider>
                        </template>
                        <v-date-picker
                          v-model="dataFromInputs.opening_date"
                          :max="new Date().toISOString().substr(0, 10)"
                          @input="menu2 = false"
                        ></v-date-picker>
                      </v-menu>
                    </v-col>
                  </v-row>
                </v-card-text>
              </v-window-item>

              <v-window-item :value="2">
                <v-card-text>
                  <span class="subtitle-2">
                    Please enter your guarantor info:
                  </span>

                  <v-row>
                    <v-col md="4">
                      <v-autocomplete
                        :items="returnAccountHolders"
                        item-text="first_name"
                        item-value="id"
                        v-model="guarantorObj1.acc_no_id"
                        label="A/C No"
                        :readonly="disableAndReadonly"
                        :loading="slctLoadingOnAcHolders"
                      ></v-autocomplete>
                    </v-col>
                  </v-row>

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
                  <span class="subtitle-2">
                    Second guarantor(optional):
                  </span>

                  <v-row>
                    <v-col md="4">
                      <v-autocomplete
                        :items="returnAccountHolders"
                        item-text="first_name"
                        item-value="id"
                        v-model="guarantorObj2.acc_no_id"
                        label="A/C No"
                        :readonly="disableAndReadonly"
                        :loading="slctLoadingOnAcHolders"
                      ></v-autocomplete>
                    </v-col>
                  </v-row>

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
                </v-card-text>
              </v-window-item>
            </v-window>

            <v-divider></v-divider>

            <v-card-actions>
              <v-btn :disabled="step === 1" text @click="step--"> Back </v-btn>
              <v-spacer></v-spacer>
              <v-btn
                :disabled="invalid || disableAndReadonly"
                color="success"
                depressed
                @click="submit"
                :loading="btnLoader"
              >
                S<span class="text-lowercase">ubmit</span>
              </v-btn>

              <v-btn
                :disabled="step === 2"
                color="primary"
                depressed
                @click="step++"
              >
                N<span class="text-lowercase">ext</span>
              </v-btn>
            </v-card-actions>
          </v-form>
        </validation-observer>
      </v-card>
    </v-app>
  </v-card>
</template>

<script>
import {
  newAccountHolder,
  updateAccountHolder
} from "../AccountConfig/actions/actions";
import snackBarComp from "../../components/snackBar";
import { GET_ACCOUNTS_NO_ID } from "../../graphql/quries";
import { required, max, min } from "vee-validate/dist/rules";
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

extend("max", {
  ...max,
  message: "{_field_} may not be greater than {length} characters"
});

extend("min", {
  ...min,
  message: "{_field_} may not be less than {length} characters"
});

export default {
  components: {
    ValidationProvider,
    ValidationObserver,
    "snack-bar": snackBarComp
  },
  props: [
    "hideOrShowForm",
    "accountHoldersData",
    "editAccountDetails",
    "dialogPopUp",
    "disableAndReadonly",
    "editedIndex",
    "updateList",
    "clearEditAccObj",
    "slctLoadingOnAcHolders"
  ],
  data: () => ({
    step: 1,
    valid: true,
    genderOptions: ["Male", "Female"],
    date: null,
    menu: false,
    date2: new Date().toISOString().substr(0, 10),
    menu2: false,
    accounts: [],

    // input data
    guarantorObj1: {},
    guarantorObj2: {},

    dataFromInputs: { guarantor: [] },

    // button loader
    btnLoader: false,

    snackBarModel: false,
    snackBarText: null,
    snackBarColor: null,

    // loader for autocompletes
    selectLoadingACCode: 0
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
      return [{ first_name: "Deselect", id: 0 }, ...this.accountHoldersData];
    },
    idIsNotDefined1() {
      return this.guarantorObj1.acc_no_id ? true : false;
    },
    idIsNotDefined2() {
      return this.guarantorObj2.acc_no_id ? true : false;
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
    },
    returnGuarantor1AccNoId() {
      return this.guarantorObj1.acc_no_id;
    },
    returnGuarantor2AccNoId() {
      return this.guarantorObj2.acc_no_id;
    }
  },

  methods: {
    accountNameNdCode(item) {
      return `${item.acc_code} - ${item.acc_name}`;
    },
    closePopup() {
      this.reset();
      this.hideOrShowForm(false);
    },
    save(date) {
      this.$refs.menu.save(date);
    },
    // validate() {
    //   this.$refs.form.validate();
    //   if (this.$refs.form.validate()) {
    //     this.submitData();
    //   }
    // },
    submit: function() {
      this.dataFromInputs.guarantor = [];
      if (this.guarantorObj1) {
        this.dataFromInputs.guarantor.push(this.guarantorObj1);
      }
      if (this.guarantorObj2) {
        this.dataFromInputs.guarantor.push(this.guarantorObj2);
      }

      if (this.editAccountDetails !== null) {
        updateAccountHolder(this, this.editedIndex);
      } else {
        newAccountHolder(this);
      }
    },

    reset() {
      this.guarantorObj1 = {
        acc_no_id: "",
        guarantor_name: "",
        cnic: "",
        contact: ""
      };
      this.guarantorObj2 = {
        acc_no_id: "",
        guarantor_name: "",
        cnic: "",
        contact: ""
      };
      this.dataFromInputs = {
        first_name: "",
        middle_name: "",
        last_name: "",
        acc_code_id: "",
        acc_no: "",
        guardian_type: "",
        guardian_name: "",
        cell: "",
        landline_no: "",
        address: "",
        cnic: "",
        gender: "",
        dob: "",
        opening_date: ""
      };
      this.clearEditAccObj();
      this.$refs.observer.reset();
    },

    // "MUST TEST IF TYPENAME IS REMOVED FROM GUARANTORS OR NOT"
    // deleteTypeName() {
    //   // delete type name from obj
    //   delete this.editAccountDetails.account_holder.__typename;
    //   delete this.editAccountDetails.__typename;
    //   this.editAccountDetails.guarantors.forEach((element) => {
    //     delete element.__typename;
    //   });
    // },
    closeSnackbar() {
      this.snackBarModel = false;
    }
  },
  watch: {
    menu(val) {
      val && setTimeout(() => (this.$refs.picker.activePicker = "YEAR"));
    },
    dialogPopUp(val) {
      if (val === true) {
        setTimeout(() => {
          this.$refs.firstNameFocus.focus();
        }, 280);
        if (this.editAccountDetails) {
          if (this.editAccountDetails.account_holder.first_name) {
            this.dataFromInputs = this.editAccountDetails.account_holder;
            if (this.editAccountDetails.guarantors[0]) {
              this.guarantorObj1 = this.editAccountDetails.guarantors[0];
            }
            if (this.editAccountDetails.guarantors[1]) {
              this.guarantorObj2 = this.editAccountDetails.guarantors[1];
            }
          }
        }
      } else {
        this.step = 1;
        this.reset();
      }
    },
    returnGuarantor1AccNoId(val) {
      if (val === 0) {
        this.guarantorObj1 = {};
      }
    },
    returnGuarantor2AccNoId(val) {
      if (val === 0) {
        this.guarantorObj2 = {};
      }
    }
  },
  created() {
    if (this.editAccountDetails !== null) {
      // delete type name from obj
      // this.deleteTypeName();

      this.dataFromInputs = this.editAccountDetails.account_holder;
      if (this.editAccountDetails.guarantors[0] !== undefined) {
        this.guarantorObj1 = this.editAccountDetails.guarantors[0];
      }
      if (this.editAccountDetails.guarantors[1] !== undefined) {
        this.guarantorObj2 = this.editAccountDetails.guarantors[1];
      }
    }
  },
  mounted() {
    setTimeout(() => {
      this.$refs.firstNameFocus.focus();
    }, 280);
  },
  apollo: {
    getAccounts: {
      query: GET_ACCOUNTS_NO_ID,
      result({ data }) {
        this.accounts = data.getAccounts;
      },
      loadingKey: "selectLoadingACCode"
    }
  }
};
</script>

<style scoped>
.d-flex * {
  margin: 0 20px;
}
.subtitle-2 {
  font-weight: 500;
  color: #222;
}
</style>
