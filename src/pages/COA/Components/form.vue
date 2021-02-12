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
            v-model="acc_code"
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
            <v-radio label="Group" :value="GROUP_ACCOUNTS"></v-radio>
            <v-radio label="Detail" :value="DETAIL_ACCOUNTS"></v-radio>
          </v-radio-group>
        </validation-provider>
        <v-select
          v-model="accConfig"
          :items="configAccounts"
          :error-messages="errors"
          label="Configure account"
          data-vv-name="select"
          item-text="label"
          item-value="id"
        ></v-select>
        <v-alert :value="message" dense elevation="2" type="error">
          {{ message }}
        </v-alert>
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
  DELETE_ACCOUNT,
  GET_ACCOUNTS_PARENTS,
  GET_ACCOUNTS_CONFIG
} from "../../../graphql/quries";
import {
  DEFAULT,
  GROUP_ACCOUNTS,
  DETAIL_ACCOUNTS
} from "../../../utils/constants";

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
    acc_code: "",
    accountName: "",
    accType: GROUP_ACCOUNTS,
    accParent: null,
    id: null,
    items: [],
    getGroupAccounts: [],
    allAcounts: [],
    configAccounts: [],
    mutationLoading: false,
    accConfig: null,
    message: null,
    GROUP_ACCOUNTS,
    DETAIL_ACCOUNTS
  }),
  apollo: {
    getGroupAccounts: {
      query: GET_ACCOUNTS,
      variables: {
        acc_type: GROUP_ACCOUNTS
      },
      result({ data }) {
        this.getGroupAccounts = data.getAccounts;
      }
    },
    getAllAccounts: {
      query: GET_ACCOUNTS,
      variables: {
        acc_type: DETAIL_ACCOUNTS
      },
      result({ data }) {
        this.allAcounts = data.getAccounts;
        this.getCurrentAccount();
      }
    },
    getConfigAccounts: {
      query: GET_ACCOUNTS_CONFIG,
      result({ data }) {
        this.configAccounts = data.getAccountConfig;
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
      let variables = {
        acc_name: this.accountName,
        acc_parent: this.accParent,
        acc_type: this.accType,
        acc_config: this.accConfig
      };

      if (variables.acc_config == null) {
        variables.acc_config = 0;
      }
      try {
        const result = await this.$apollo.mutate({
          mutation: this.isEditable ? UPDATE_ACCOUNT : ADD_ACCOUNT,
          variables: this.isEditable
            ? {
                ...variables,
                id: this.id
              }
            : {
                ...variables,
                acc_code: Number(this.acc_code)
              }
        });
        if (result.errors) {
          throw result.errors[0].message;
        }
        const asd = await this.$apollo.query({
          query: GET_ACCOUNTS_PARENTS
        });
      } catch (e) {
        this.message = e;
      }
      this.mutationLoading = false;
    },
    onClear() {
      this.acc_code = "";
      this.accountName = "";
      this.accParent = null;
      this.accType = GROUP_ACCOUNTS;
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
        const {
          acc_code,
          acc_name,
          acc_parent,
          id,
          acc_type,
          acc_config
        } = accountData;
        this.acc_code = acc_code;
        this.accountName = acc_name;
        this.accParent = acc_parent;
        this.accType = acc_type;
        this.accConfig = acc_config;
        this.id = id;
      }
    }
  },
  created() {
    this.acc_code == this.$route.params.acccode;
    this.getCurrentAccount();
  },
  watch: {
    $route: function(newCode, oldCode) {
      if (newCode.params.acccode == "0") {
        this.onClear();
      }
      this.getCurrentAccount();
    }
  }
};
</script>
