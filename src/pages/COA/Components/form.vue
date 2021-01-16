<template>
  <div class="container">
    <h3 class="my-5">{{ isEditable ? "Edit" : "Add" + " Account" }}</h3>
    <validation-observer ref="observer" v-slot="{ invalid }">
      <form @submit.prevent="onSubmit">
        <validation-provider
          v-slot="{ errors }"
          name="Acc Code"
          rules="required|max:4"
        >
          <v-text-field
            :disabled="isEditable"
            v-model="accountCode"
            :counter="4"
            :error-messages="errors"
            label="Acc Code"
            required
          ></v-text-field>
        </validation-provider>
        <validation-provider
          v-slot="{ errors }"
          name="Acc Name"
          rules="required|max:30"
        >
          <v-text-field
            v-model="accountName"
            :counter="30"
            :error-messages="errors"
            label="Acc Name"
            required
          ></v-text-field>
        </validation-provider>
        <validation-provider
          v-slot="{ errors }"
          name="accParent"
          rules="required"
        >
          <v-select
            v-model="accParent"
            :items="getGroupAccounts"
            :error-messages="errors"
            label="Acc Parent"
            data-vv-name="select"
            required
            item-text="acc_name"
            item-value="id"
          ></v-select>
        </validation-provider>
        <p>Account Type</p>
        <validation-provider
          v-slot="{ errors }"
          name="accType"
          rules="required"
        >
          <v-radio-group v-model="accType" row :error-messages="errors">
            <v-radio label="Group" :value="1"></v-radio>
            <v-radio label="Detail" :value="2"></v-radio>
          </v-radio-group>
        </validation-provider>
        <div class="text-right">
          <v-btn
            class="mr-4"
            type="submit"
            :disabled="invalid || mutationLoading"
            color="primary"
            elevation="5"
            medium
            :loading="mutationLoading"
          >
            Save
          </v-btn>
          <v-btn class="mr-4" @click="onClear" elevation="5" medium>
            Clear
          </v-btn>
          <v-btn
            v-if="isEditable"
            @click="onDelete"
            color="error"
            elevation="5"
            medium
          >
            Delete
          </v-btn>
        </div>
      </form>
    </validation-observer>
  </div>
</template>

<script>
import { required, digits, email, max, regex } from "vee-validate/dist/rules";
import {
  extend,
  ValidationObserver,
  ValidationProvider,
  setInteractionMode
} from "vee-validate";
import {
  ADD_ACCOUNT,
  GET_ACCOUNTS,
  GET_ACCOUNTS_CHILDS,
  GET_ACCOUNTS_INFO_BY_ACCCODE,
  UPDATE_ACCOUNT,
  DELETE_ACCOUNT
} from "../../../graphql/quries";

setInteractionMode("eager");

extend("required", {
  ...required,
  message: "{_field_} can not be empty"
});

extend("max", {
  ...max,
  message: "{_field_} may not be greater than {length} characters"
});

export default {
  components: {
    ValidationProvider,
    ValidationObserver
  },
  data: () => ({
    accountCode: "",
    accountName: "",
    accType: 1,
    accParent: null,
    id: null,
    items: [],
    getGroupAccounts: [],
    allAcounts: [],
    mutationLoading: false
  }),
  apollo: {
    getGroupAccounts: {
      query: GET_ACCOUNTS,
      variables: {
        acc_type: 1
      },
      result({ data }) {
        this.getGroupAccounts = data.getAccounts;
      }
    },
    getAllAccounts: {
      query: GET_ACCOUNTS,
      variables: {
        acc_type: 0
      },
      result({ data }) {
        this.allAcounts = data.getAccounts;
        this.getCurrentAccount();
      }
    }
  },
  computed: {
    isEditable() {
      return this.$route.params.acccode > 0;
    },
    routeName() {
      return this.$route.params.acccode;
    }
  },
  methods: {
    async onSubmit() {
      this.$refs.observer.validate();
      this.mutationLoading = true;
      const variables = {
        acc_code: Number(this.accountCode),
        acc_name: this.accountName,
        acc_parent: this.accParent,
        acc_type: this.accType
      };
      const result = await this.$apollo.mutate({
        mutation: this.isEditable ? UPDATE_ACCOUNT : ADD_ACCOUNT,
        variables: this.isEditable
          ? {
              ...variables,
              id: this.id
            }
          : variables
      });
      this.mutationLoading = false;
    },
    onClear() {
      this.accountCode = "";
      this.accountName = "";
      this.accParent = null;
      this.accType = 1;
      this.$refs.observer.reset();
    },
    async onDelete() {
      await this.$apollo.mutate({
        mutation: DELETE_ACCOUNT,
        variables: {
          id: this.id
        }
      });
    },
    getCurrentAccount() {
      const data = this.allAcounts;
      if (data) {
        const accounts = data;
        const accountData = accounts.find(
          account => account.acc_code == this.$route.params.acccode
        );
        const { acc_code, acc_name, acc_parent, id, acc_type } = accountData;
        this.accountCode = acc_code;
        this.accountName = acc_name;
        this.accParent = acc_parent;
        this.accType = acc_type;
        this.id = id;
      }
    }
  },
  watch: {
    $route: function(newCode, oldCode) {
      console.log("this", oldCode.params.acccode);
      if (newCode.params.acccode == "0") {
        this.onClear();
      }
      this.getCurrentAccount();
    }
  }
};
</script>
