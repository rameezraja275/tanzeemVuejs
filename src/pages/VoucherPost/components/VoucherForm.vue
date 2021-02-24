<template>
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
                <validation-provider
                  v-slot="{ errors }"
                  name="Account"
                  rules="required"
                >
                  <v-select
                    v-model="editedItem.acc_code_id"
                    :items="accounts"
                    :error-messages="errors"
                    label="Account"
                    data-vv-name="select"
                    required
                    item-text="acc_name"
                    item-value="id"
                  ></v-select>
                </validation-provider>
              </v-col>
              <v-col cols="12" sm="6" md="4">
                <v-select
                  v-model="editedItem.acc_no_id"
                  :items="accounts_child"
                  label="Sub Account"
                  item-text="acc_name"
                  item-value="id"
                ></v-select>
              </v-col>
              <v-col cols="12" sm="6" md="4">
                <validation-provider
                  v-slot="{ errors }"
                  name="Narration"
                  rules="required"
                >
                  <v-text-field
                    v-model="editedItem.narration"
                    label="Narration"
                    :error-messages="errors"
                    required
                  ></v-text-field>
                </validation-provider>
              </v-col>
              <v-col cols="12" sm="6" md="4">
                <validation-provider
                  v-slot="{ errors }"
                  name="debit"
                  rules="required"
                >
                  <v-text-field
                    v-model.number="editedItem.dr"
                    label="dr"
                    :error-messages="errors"
                    required
                    prefix="Rs."
                    type="number"
                  ></v-text-field>
                </validation-provider>
              </v-col>
              <v-col cols="12" sm="6" md="4">
                <validation-provider
                  v-slot="{ errors }"
                  name="credit"
                  rules="required"
                >
                  <v-text-field
                    v-model.number="editedItem.cr"
                    label="cr"
                    :error-messages="errors"
                    required
                    prefix="Rs."
                    type="number"
                  ></v-text-field>
                </validation-provider>
              </v-col>
            </v-row>
          </v-container>
        </v-card-text>

        <v-card-actions>
          <v-spacer></v-spacer>
          <v-btn color="blue darken-1" text @click="close">
            Cancel
          </v-btn>
          <v-btn type="submit" :disabled="invalid" color="blue darken-1" text>
            Save
          </v-btn>
        </v-card-actions>
      </form>
    </validation-observer>
  </v-card>
</template>

<script>
import { GET_ACCOUNTS, GET_ACCOUNTS_CHILDS } from "../../../graphql/quries";
import { required, digits } from "vee-validate/dist/rules";
import {
  extend,
  ValidationObserver,
  ValidationProvider,
  setInteractionMode
} from "vee-validate";
import { getAccountChilds } from "../actions/index";

setInteractionMode("eager");

extend("digits", {
  ...digits,
  message: "{_field_} needs to be {length} digits. ({_value_})"
});

extend("required", {
  ...required,
  message: "{_field_} can not be empty"
});

export default {
  components: {
    ValidationProvider,
    ValidationObserver
  },
  props: ["editedItem", "close", "save", "formTitle"],
  data: () => ({
    accounts: [],
    accounts_child: []
  }),
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
  },
  methods: {
    submit() {
      this.$refs.observer.validate();
      this.save();
    }
  },
  computed: {
    returnCr() {
      return this.editedItem.cr;
    },
    returnDr() {
      return this.editedItem.dr;
    }
  },
  watch: {
    editedItem: {
      handler(newItem, oldItem) {
        if (newItem.acc_code_id) {
          getAccountChilds(this, newItem);
        }
      },
      deep: true
    },
    returnCr(val) {
      if (val) {
        this.editedItem.dr = 0;
      }
    },
    returnDr(val) {
      if (val) {
        this.editedItem.cr = 0;
      }
    }
  }
};
</script>
