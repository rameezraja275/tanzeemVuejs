<template>
  <v-card>
    <validation-observer ref="observer" v-slot="{ invalid }">
      <form @submit.prevent="submit" autocomplete="off">
        <v-card-title>
          <span class="headline">{{ formTitle }}</span>
        </v-card-title>
        <v-card-text>
          <v-container>
            <v-row>
              <v-col cols="12" sm="6" md="6">
                <validation-provider
                  v-slot="{ errors }"
                  name="A/C Code"
                  rules="required"
                >
                  <v-autocomplete
                    v-model="formItems.acc_code_id"
                    :items="accounts"
                    :error-messages="errors"
                    :loading="selectLoadingACCode"
                    label="A/C Code"
                    data-vv-name="select"
                    required
                    :item-text="accountNameNdCode"
                    item-value="id"
                    v-on:blur="getAccCode"
                  ></v-autocomplete>
                </validation-provider>
              </v-col>
              <v-col cols="12" sm="6" md="6">
                <v-autocomplete
                  v-model="formItems.acc_no_id"
                  :loading="selectLoadingSubAc"
                  :items="accounts_child"
                  label="A/C No"
                  :item-text="accountNameNdCode"
                  item-value="id"
                ></v-autocomplete>
              </v-col>
              <v-col cols="12" sm="6" md="6">
                <validation-provider
                  v-slot="{ errors }"
                  name="Debit"
                  rules="required|min_value:0"
                >
                  <v-text-field
                    v-model.number="formItems.dr"
                    label="DR"
                    :error-messages="errors"
                    required
                    type="number"
                    :step="allowedDecimalPlaces"
                    :rules="
                      formItems.dr !== ``
                        ? [
                            formItems.dr !== formItems.cr ||
                              'CR and DR can not be equal'
                          ]
                        : []
                    "
                  ></v-text-field>
                </validation-provider>
              </v-col>
              <v-col cols="12" sm="6" md="6">
                <validation-provider
                  v-slot="{ errors }"
                  name="Credit"
                  rules="required|min_value:0"
                >
                  <v-text-field
                    v-model.number="formItems.cr"
                    label="CR"
                    :error-messages="errors"
                    required
                    type="number"
                    :step="allowedDecimalPlaces"
                    :rules="
                      formItems.cr !== ``
                        ? [
                            formItems.dr !== formItems.cr ||
                              'CR and DR can not be equal'
                          ]
                        : []
                    "
                  ></v-text-field>
                </validation-provider>
              </v-col>
            </v-row>
            <v-row>
              <v-col cols="12" sm="6" md="12">
                <v-textarea
                  label="Narration"
                  v-model="formItems.narration"
                  rows="4"
                ></v-textarea>
              </v-col>
            </v-row>
          </v-container>
        </v-card-text>

        <v-card-actions>
          <v-spacer></v-spacer>
          <v-btn color="blue darken-1" text @click="closeForm()">
            Cancel
          </v-btn>
          <v-btn
            type="submit"
            :disabled="invalid || crDrEqual"
            color="blue darken-1"
            text
          >
            Save
          </v-btn>
        </v-card-actions>
      </form>
    </validation-observer>
  </v-card>
</template>

<script>
import { GET_ACCOUNTS, GET_ACCOUNTS_CHILDS } from "../../../graphql/quries";
import { required, digits, min_value } from "vee-validate/dist/rules";
import {
  extend,
  ValidationObserver,
  ValidationProvider,
  setInteractionMode
} from "vee-validate";
import { getAccountChilds, getGroupAccounts } from "../actions/index";
import { ALLOWED_DECIMALS } from "../../../utils/constants";
setInteractionMode("eager");

extend("digits", {
  ...digits,
  message: "{_field_} needs to be {length} digits. ({_value_})"
});
extend("required", {
  ...required,
  message: "{_field_} can not be empty"
});
extend("min_value", {
  ...min_value,
  message: "{_field_} may not be less than zero"
});

export default {
  components: {
    ValidationProvider,
    ValidationObserver
  },
  props: ["editedItem", "close", "save", "formTitle", "dialog"],
  data: () => ({
    accounts: [],
    accounts_child: [],
    crDrEqual: false,
    selectLoadingACCode: false,
    selectLoadingSubAc: false,
    allowedDecimalPlaces: ALLOWED_DECIMALS,
    formItems: {}
  }),
  methods: {
    getAccCode() {
      if (this.formItems.acc_code_id) {
        this.accounts.forEach(element => {
          if (element.id == this.formItems.acc_code_id) {
            this.formItems.acc_code = element.acc_code;
            // this.setAccCode(element.acc_code);
          }
        });
      }
    },
    accountNameNdCode(item) {
      return `${item.acc_code} - ${item.acc_name}`;
    },
    submit() {
      this.$refs.observer.validate();
      this.accounts_child = [];
      this.save(this.formItems);
      this.$refs.observer.reset();
    },
    closeForm() {
      this.close();
      this.accounts_child = [];
      this.formItems = {};
      this.$refs.observer.reset();
    }
  },
  computed: {
    returnCr() {
      return this.formItems.cr;
    },
    returnDr() {
      return this.formItems.dr;
    }
  },
  watch: {
    formItems: {
      handler(newItem, oldItem) {
        if (newItem.acc_code_id) {
          getAccountChilds(this, newItem);
        }
      },
      deep: true
    },
    dialog(val) {
      if (val) {
        this.formItems = { ...this.editedItem };
      }
    },
    returnCr(val) {
      if (val) {
        this.formItems.dr = 0;
        this.crDrEqual = false;
      }
      if (val === this.formItems.dr) {
        this.crDrEqual = true;
      }
    },
    returnDr(val) {
      if (val) {
        this.formItems.cr = 0;
        this.crDrEqual = false;
      }
      if (val === this.formItems.cr) {
        this.crDrEqual = true;
      }
    }
  },
  created() {
    this.formItems = { ...this.editedItem };
    if (this.formItems.acc_code_id) {
      getAccountChilds(this, this.formItems);
    }
    getGroupAccounts(this);
  }
};
</script>
