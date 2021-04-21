<template>
  <div class="container">
    <snack-bar
      :snackbarText="message"
      :snackBarColor="snackBarColor"
      :snackbarModel="snackbarModel"
      :closeSnackbar="closeSnackbar"
    ></snack-bar>
    <h3 class="my-5">
      {{ isEditable ? "Edit" + " Account" : "Add" + " Account" }}
    </h3>
    <validation-observer ref="observer" v-slot="{ invalid }">
      <form @submit.prevent="onSubmit" autocomplete="off">
        <validation-provider
          v-slot="{ errors }"
          name="A/C Code"
          rules="required|max:4"
        >
          <v-text-field
            :disabled="isEditable"
            ref="accCode"
            v-on:blur="accCodeOutOfFocus"
            v-model="acc_code"
            :counter="4"
            :error-messages="errors"
            label="A/C Code"
            required
            type="number"
          ></v-text-field>
        </validation-provider>
        <validation-provider
          v-slot="{ errors }"
          name="A/C Name"
          rules="required|max:30"
        >
          <v-text-field
            v-model="accountName"
            :counter="30"
            :error-messages="errors"
            label="A/C Name"
            required
          ></v-text-field>
        </validation-provider>
        <validation-provider
          v-slot="{ errors }"
          name="A/C Parent"
          rules="required"
        >
          <v-autocomplete
            v-model="accParent"
            :items="groupAccounts"
            :error-messages="errors"
            label="A/C Parent"
            data-vv-name="select"
            required
            :item-text="accNameAccCode"
            item-value="id"
            :loading="slctLoadingAcParents === 1"
          ></v-autocomplete>
        </validation-provider>
        <p>Account Type</p>
        <validation-provider
          v-slot="{ errors }"
          name="A/C Type"
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
          label="Configure Account"
          :disabled="disableConfigureAC"
          data-vv-name="select"
          item-text="label"
          item-value="id"
          :loading="slctLoadingCnfigAC === 1"
        ></v-select>
        <div class="text-right">
          <v-btn
            class="mr-4"
            type="submit"
            :disabled="invalid || mutationLoading || disableDeleteNdSave"
            color="primary"
            elevation="5"
            medium
            :loading="mutationLoading"
          >
            Save
          </v-btn>
          <!-- <v-btn class="mr-4" @click="onClear" elevation="5" medium>
            Clear
          </v-btn> -->
          <v-btn
            v-if="isEditable"
            @click="openDeleteDialog"
            :disabled="disableDeleteNdSave"
            color="error"
            elevation="5"
            medium
          >
            Delete
          </v-btn>
        </div>
        <v-dialog v-model="dialogDelete" max-width="500px">
          <v-card>
            <p
              style="font-size:20px;text-align:center;padding-top:10px;margin-bottom:0px;"
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
                @click="onDelete"
                :loading="deleteBtnLoading"
                style="font-size: 14px"
                >OK</v-btn
              >
              <v-spacer></v-spacer>
            </v-card-actions>
          </v-card>
        </v-dialog>
      </form>
    </validation-observer>
  </div>
</template>

<script>
import { required, digits, email, max, regex } from "vee-validate/dist/rules";
import { mapActions, mapState } from "vuex";
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
  GET_ACCOUNTS_NO_ID,
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
import { removeGraphQlTagFromErrors } from "../../../utils/helpers";
import snackBarComp from "../../../components/snackBar";

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
  props: ["addInParentArray", "removeItemFromArray"],
  components: {
    ValidationProvider,
    ValidationObserver,
    "snack-bar": snackBarComp
  },
  data: () => ({
    acc_code: "",
    accountName: "",
    accType: GROUP_ACCOUNTS,
    accParent: null,
    id: null,
    items: [],
    groupAccounts: [],
    allAcounts: [],
    configAccounts: [],
    mutationLoading: false,
    accConfig: null,
    message: null,
    GROUP_ACCOUNTS,
    DETAIL_ACCOUNTS,

    snackbarModel: false,
    snackBarColor: null,

    deleteBtnLoading: false,

    dialogDelete: false,

    isMainAccount: false,

    // for autocomplete loader
    slctLoadingAcParents: 0,
    slctLoadingCnfigAC: 0
  }),
  apollo: {
    getAccounts: {
      query: GET_ACCOUNTS,
      variables: {
        acc_type: GROUP_ACCOUNTS
      },
      result({ data }) {
        this.groupAccounts = data.getAccounts;
      },
      error(error) {
        var temp = error.toString();
        this.message = temp;
        this.snackBarColor = "red";
        this.snackbarModel = true;
      },
      loadingKey: "slctLoadingAcParents"
    },
    getAllAccounts: {
      query: GET_ACCOUNTS_NO_ID,
      result({ data }) {
        this.allAcounts = data.getAccounts;
        this.getCurrentAccount();
      }
    },
    getAccountConfig: {
      query: GET_ACCOUNTS_CONFIG,
      result({ data }) {
        this.configAccounts = data.getAccountConfig;
      },
      loadingKey: "slctLoadingCnfigAC"
    }
  },
  computed: {
    ...mapState({
      acCodeFocus: state => state.auth_module.acCodeFocus
    }),
    disableDeleteNdSave() {
      var temp = null;
      if (this.isEditable) {
        if (this.isMainAccount) {
          temp = true;
        } else {
          temp = false;
        }
      } else {
        temp = false;
      }
      return temp;
    },
    disableConfigureAC() {
      var temp = null;
      if (this.accType == DETAIL_ACCOUNTS) {
        this.changeAccConfig();
        temp = true;
      } else {
        temp = false;
      }
      return temp;
    },
    isEditable() {
      return this.$route.params.acccode > 0;
    },
    routeName() {
      return this.$route.params.acccode;
    }
  },
  methods: {
    ...mapActions(["changeFocusOnAccInput"]),
    accCodeOutOfFocus() {
      this.changeFocusOnAccInput(false);
    },
    openDeleteDialog() {
      this.dialogDelete = true;
    },
    closeDelete() {
      this.dialogDelete = false;
    },
    accNameAccCode(item) {
      return `${item.acc_code} - ${item.acc_name}`;
    },
    changeAccConfig() {
      this.accConfig = "";
    },
    async onSubmit() {
      this.$refs.observer.validate();
      this.mutationLoading = true;
      let variables = {
        acc_name: this.accountName,
        acc_parent: this.accParent,
        acc_type: this.accType,
        acc_config: this.accConfig
      };

      if (!variables.acc_config) {
        variables.acc_config = 0;
      }
      var tempObj = {
        ...variables,
        acc_code: this.acc_code
      };
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
          // update: this.updateCache(this.isEditable)
        });

        if (result.errors) {
          throw result.errors[0].message;
        } else {
          if (this.isEditable) {
            this.message = "Account updated successfully ";
          } else {
            this.message = "Successfully added new account";
          }
          this.snackBarColor = "success";
          this.snackbarModel = true;
          if (!this.isEditable) {
            tempObj.id = result.data.addAccount.id;
          } else {
            tempObj.id = result.data.updateAccount.id;
          }
          if (tempObj.acc_type === GROUP_ACCOUNTS) {
            tempObj.children = [];
          }
          this.addInParentArray(tempObj, this.isEditable);
          this.allAcounts.push(tempObj);
          this.onClear();
        }
      } catch (e) {
        this.snackBarColor = "red";
        var newText = e.toString();
        newText = newText.replace("Error: GraphQL error: ", "");
        this.message = removeGraphQlTagFromErrors(e);
        this.snackbarModel = true;
      }
      this.mutationLoading = false;
    },
    onClear() {
      this.acc_code = "";
      this.accountName = "";
      this.accParent = null;
      this.accType = null;
      this.$refs.observer.reset();
    },
    async onDelete() {
      var temp = this.id;
      this.deleteBtnLoading = true;
      try {
        const result = await this.$apollo.mutate({
          mutation: DELETE_ACCOUNT,
          variables: { id: this.id },
          update: cache => {
            try {
              const currentData = cache.readQuery({
                query: GET_ACCOUNTS_CHILDS,
                variables: { acc_parent: this.accParent }
              });
              let temp = [...currentData.getAccountChilds];
              currentData.getAccountChilds.forEach((element, index) => {
                if (element.id == this.id) {
                  temp.splice(index, 1);
                }
              });
              cache.writeQuery({
                query: GET_ACCOUNTS_CHILDS,
                variables: { acc_parent: this.accParent },
                data: {
                  getAccountChilds: [...temp]
                }
              });
            } catch (error) {
              console.log(
                "error in update cache after delete get account childs"
              );
            }
            try {
              // add in get all accounts query
              const currentData = cache.readQuery({
                query: GET_ACCOUNTS_NO_ID
              });
              let temp = currentData.getAccounts;
              currentData.getAccounts.forEach((element, index) => {
                if (element.id == this.id) {
                  temp.splice(index, 1);
                }
              });
              cache.writeQuery({
                query: GET_ACCOUNTS_NO_ID,
                data: {
                  getAccounts: [...temp]
                }
              });
            } catch (error) {
              console.log("error in update cache get accounts query");
            }
            try {
              const currentData = cache.readQuery({
                query: GET_ACCOUNTS,
                variables: {
                  acc_type: this.accType
                }
              });

              let temp = currentData.getAccounts;
              currentData.getAccounts.forEach((element, index) => {
                if (element.id == this.id) {
                  temp.splice(index, 1);
                }
              });
              cache.writeQuery({
                query: GET_ACCOUNTS,
                variables: {
                  acc_type: this.accType
                },
                data: {
                  getAccounts: [...temp]
                }
              });
            } catch (error) {
              console.log("error in update delete using get account");
            }
          }
        });
        if (result.errors) {
          throw result.errors[0].message;
        } else {
          this.message = "Successfully deleted account";
          this.snackBarColor = "success";
          this.snackbarModel = true;
          this.removeItemFromArray(temp);
          this.$router.push({ path: `/coa` });
          this.closeDelete();
          this.onClear();
        }
      } catch (e) {
        this.message = removeGraphQlTagFromErrors(e);
        this.snackBarColor = "red";
        this.snackbarModel = true;
      }
      this.deleteBtnLoading = false;
    },
    getCurrentAccount() {
      const data = this.allAcounts;
      if (data) {
        const accounts = data;
        var accountData = {};
        accounts.forEach(element => {
          if (element.acc_code == this.$route.params.acccode) {
            accountData = element;
            if (this.isEditable) {
              if (element.acc_parent === 0) {
                this.isMainAccount = true;
              } else {
                this.isMainAccount = false;
              }
            }
          }
        });
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
    },
    closeSnackbar() {
      this.snackbarModel = false;
    },
    updateCache(isEditable) {
      if (!isEditable) {
        let func = (cache, { data: { addAccount } }) => {
          if (!this.accConfig) {
            this.accConfig = 0;
          }
          let temp = {
            id: addAccount.id,
            acc_code: this.acc_code,
            acc_parent: this.accParent,
            acc_name: this.accountName,
            acc_config: this.accConfig,
            acc_type: this.accType,
            __typename: "Account"
          };
          try {
            // get in get account childs query
            const currentData = cache.readQuery({
              query: GET_ACCOUNTS_CHILDS,
              variables: {
                acc_parent: this.accParent
              }
            });
            cache.writeQuery({
              query: GET_ACCOUNTS_CHILDS,
              variables: {
                acc_parent: this.accParent
              },
              data: {
                getAccountChilds: [...currentData.getAccountChilds, temp]
              }
            });
          } catch (error) {
            console.log("error in update cache get account childs");
          }
          try {
            // add in get all accounts query
            const currentData = cache.readQuery({
              query: GET_ACCOUNTS_NO_ID
            });
            cache.writeQuery({
              query: GET_ACCOUNTS_NO_ID,
              data: {
                getAccounts: [...currentData.getAccounts, temp]
              }
            });
          } catch (error) {
            console.log("error in update cache get accounts query");
          }
          try {
            const currentData = cache.readQuery({
              query: GET_ACCOUNTS,
              variables: {
                acc_type: this.accType
              }
            });
            // console.log(currentData, "data from update cache in GET ACCOUNTS BY TYPE");
            // PROBLEM IS HERE
            cache.writeQuery({
              query: GET_ACCOUNTS,
              variables: {
                acc_type: this.accType
              },
              data: {
                getAccounts: [...currentData.getAccounts, temp]
              }
            });
          } catch (error) {
            console.log(error);
          }
        };
        return func;
      } else {
        let func = (cache, { data: { updateAccount } }) => {
          try {
            // get in get account childs query
            const currentData = cache.readQuery({
              query: GET_ACCOUNTS_CHILDS,
              variables: {
                acc_parent: this.accParent
              }
            });
            let temp = currentData.getAccountChilds;
            currentData.getAccountChilds.forEach((element, index) => {
              if (element.id == updateAccount.id) {
                temp.splice(index, 1, updateAccount);
              }
            });
            cache.writeQuery({
              query: GET_ACCOUNTS_CHILDS,
              variables: {
                acc_parent: this.accParent
              },
              data: {
                getAccountChilds: [...temp]
              }
            });
          } catch (error) {
            console.log("error in update cache get account childs");
          }
          try {
            // add in get all accounts query
            const currentData = cache.readQuery({
              query: GET_ACCOUNTS_NO_ID
            });
            let temp = currentData.getAccounts;
            currentData.getAccounts.forEach((element, index) => {
              if (element.id == updateAccount.id) {
                temp.splice(index, 1, updateAccount);
              }
            });
            cache.writeQuery({
              query: GET_ACCOUNTS_NO_ID,
              data: {
                getAccounts: [...temp]
              }
            });
          } catch (error) {
            console.log("error in update cache get accounts query");
          }
        };
        return func;
      }
    }
  },
  created() {
    this.acc_code == this.$route.params.acccode;
    this.getCurrentAccount();
  },
  watch: {
    $route: function(newCode, oldCode) {
      if (!newCode.params.acccode) {
        this.onClear();
      }
      this.getCurrentAccount();
    },
    acCodeFocus(val) {
      if (val) {
        setTimeout(() => {
          this.$refs.accCode.focus();
          this.onClear();
        }, 50);
      }
    }
  }
};
</script>
