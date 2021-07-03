<template>
  <v-card elevation="1">
    <SnackBar
      :snackbarModel="snackbarModel"
      :snackBarColor="snackBarColor"
      :snackbarText="snackbarText"
      :closeSnackbar="closeSnackbar"
    />
    <v-sheet max-width="100%">
      <div class="py-4 px-3">
        <p class="py-1 headline">Reports</p>
      </div>
      <validation-observer ref="observer" v-slot="{ invalid }">
        <form class="d-flex flex-column align-center pb-4" autocomplete="off">
          <v-row style="min-width: 60%">
            <v-col style="max-width:355px" class="mx-auto">
              <v-menu
                v-model="menu"
                :close-on-content-click="false"
                :nudge-right="40"
                transition="scale-transition"
                offset-y
                min-width="auto"
              >
                <template v-slot:activator="{ on, attrs }">
                  <validation-provider
                    v-slot="{ errors }"
                    name="Start date"
                    rules="required"
                  >
                    <v-text-field
                      ref="startDate"
                      v-model="dataFromInputs.startDate"
                      label="Start Date"
                      prepend-inner-icon="mdi-calendar"
                      readonly
                      v-bind="attrs"
                      v-on="on"
                      required
                      :error-messages="errors"
                    ></v-text-field>
                  </validation-provider>
                </template>
                <v-date-picker
                  v-model="dataFromInputs.startDate"
                  :max="new Date().toISOString().substr(0, 10)"
                  @input="menu = false"
                ></v-date-picker>
              </v-menu>
            </v-col>
            <v-col>
              <v-menu
                v-model="menu2"
                :close-on-content-click="false"
                :nudge-right="40"
                transition="scale-transition"
                offset-y
                min-width="auto"
              >
                <template v-slot:activator="{ on, attrs }">
                  <validation-provider
                    v-slot="{ errors }"
                    name="End Date"
                    rules="required"
                  >
                    <v-text-field
                      ref="endDate"
                      v-model="dataFromInputs.endDate"
                      label="End Date"
                      prepend-inner-icon="mdi-calendar"
                      readonly
                      v-bind="attrs"
                      v-on="on"
                      required
                      :error-messages="errors"
                    ></v-text-field>
                  </validation-provider>
                </template>
                <v-date-picker
                  v-model="dataFromInputs.endDate"
                  :max="new Date().toISOString().substr(0, 10)"
                  @input="menu2 = false"
                ></v-date-picker>
              </v-menu>
            </v-col>
          </v-row>
          <v-row style="min-width: 60%">
            <v-col>
              <validation-provider
                v-slot="{ errors }"
                name="A/C Code"
                rules="required"
              >
                <v-autocomplete
                  v-model="dataFromInputs.acCodeId"
                  :items="acCodesArr"
                  :item-text="accountNameNdCode"
                  item-value="id"
                  label="A/C Code"
                  v-on:blur="callFetchChilds"
                  :loading="selectLoadingACCode === 1"
                  required
                  :error-messages="errors"
                ></v-autocomplete>
              </validation-provider>
            </v-col>
            <v-col>
              <v-autocomplete
                v-model="dataFromInputs.accNoId"
                :items="acNoArr"
                label="A/C No"
                :item-text="accountNameNdCode"
                item-value="id"
                :loading="selectLoadingACNo"
              ></v-autocomplete>
            </v-col>
          </v-row>
          <v-btn
            width="150px"
            depressed
            color="primary"
            @click="applyFilters"
            :disabled="invalid"
            :loading="btnLoading"
            >Show</v-btn
          >
        </form>
      </validation-observer>
    </v-sheet>
  </v-card>
</template>

<script>
import { GET_ACCOUNTS_NO_ID } from "../../../../graphql/quries";
import SnackBar from "../../../../components/snackBar.vue";
import {
  fetchReportsAcLedger,
  fetchAccountChilds
} from "../../actions/actions";
import { required, digits, min_value } from "vee-validate/dist/rules";
import {
  extend,
  ValidationObserver,
  ValidationProvider,
  setInteractionMode
} from "vee-validate";
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
    ValidationObserver,
    SnackBar
  },
  data() {
    return {
      menu: null,
      menu2: null,
      acCodesArr: [],
      acNoArr: [],
      dataFromInputs: {
        startDate: new Date().toISOString().substr(0, 10),
        endDate: new Date().toISOString().substr(0, 10)
      },
      selectLoadingACCode: 0,
      selectLoadingACNo: false,
      btnLoading: false,
      snackbarModel: false,
      snackBarColor: "",
      snackbarText: ""
    };
  },
  apollo: {
    getAccounts: {
      query: GET_ACCOUNTS_NO_ID,
      result({ data }) {
        this.acCodesArr = data.getAccounts;
      },
      loadingKey: "selectLoadingACCode"
    }
  },
  methods: {
    accountNameNdCode(item) {
      return `${item.acc_code} - ${item.acc_name}`;
    },
    applyFilters() {
      fetchReportsAcLedger(this);
    },
    emitFetchedReports(data) {
      this.$emit("emitFetchedReports", data);
    },
    tableLoadingStatus(status) {
      this.$emit("tableLoadingStatus", status);
    },
    callFetchChilds() {
      if (this.dataFromInputs.acCodeId) {
        fetchAccountChilds(this);
      }
    },
    closeSnackbar() {
      this.snackbarModel = false;
    }
  },
  watch: {
    $route() {
      this.dataFromInputs.startDate = new Date().toISOString().substr(0, 10);
      this.dataFromInputs.endDate = new Date().toISOString().substr(0, 10);
    }
  }
};
</script>

<style scoped>
.headline {
  border-right: 2px solid rgb(214, 214, 214);
  width: 110px;
}
</style>
