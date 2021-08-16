<template>
  <div style="width: 100%; padding: 40px 30px;">
    <v-card elevation="1" class="mb-10">
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
                        v-model="startDate"
                        label="As On"
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
                    v-model="startDate"
                    :max="new Date().toISOString().substr(0, 10)"
                    @input="menu = false"
                  ></v-date-picker>
                </v-menu>
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

    <Table
      :currentHeaderForTable="headersForBalanceSheet"
      :isDefaultFooterHidden="true"
      :itemsForTable="itemsForBalanceSheet"
      :isTableTitleHidden="false"
      tableTitle="Assets"
      :isTableLoading="tableLoading"
    />

    <Table
      :currentHeaderForTable="headersForBalanceSheet"
      :isDefaultFooterHidden="true"
      :itemsForTable="itemsForBalanceSheet"
      :isTableTitleHidden="false"
      tableTitle="Liabilities"
      :isTableLoading="tableLoading"
    />
  </div>
</template>

<script>
import SnackBar from "../../../../components/snackBar.vue";
import Table from "../dataTable.vue";

import { fetchReportsBlncSheet } from "../../actions/actions";
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
    SnackBar,
    Table
  },
  data() {
    return {
      menu: null,
      startDate: new Date().toISOString().substr(0, 10),
      btnLoading: false,
      snackbarModel: false,
      snackBarColor: "",
      snackbarText: "",
      itemsForBalanceSheet: [],
      tableLoading: false,

      headersForBalanceSheet: [
        { text: "A/C title", value: "acc_name", sortable: false },
        { text: "DR", value: "dr", sortable: false },
        { text: "CR", value: "cr", sortable: false },
        { text: "Total Asset", value: "total", sortable: false }
      ]
    };
  },
  methods: {
    applyFilters() {
      fetchReportsBlncSheet(this);
    },
    tableLoadingStatus(status) {
      this.tableLoading = status;
    },
    closeSnackbar() {
      this.snackbarModel = false;
    }
  },
  watch: {
    $route() {
      this.startDate = new Date().toISOString().substr(0, 10);
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
