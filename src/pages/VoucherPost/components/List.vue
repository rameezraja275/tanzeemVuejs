<template>
  <v-card max-width="500" tile>
    <snack-bar
      :snackbarModel="snackBarModel"
      :snackBarColor="snackBarColor"
      :snackbarText="snackBarText"
      :closeSnackbar="closeSnackbar"
    ></snack-bar>
    <v-list shaped>
      <v-subheader>Vouchers</v-subheader>
      <div class="px-5">
        <v-btn block plain @click="addNewVoucherPost()" class="primary">
          <span
            >A<span class="text-lowercase">dd </span>N<span
              class="text-lowercase"
              >ew </span
            >V<span class="text-lowercase">oucher</span></span
          >
        </v-btn>
        <v-btn
          block
          plain
          @click="$refs.fileUpload.click()"
          class="primary mt-3"
          :loading="importBtnLoading"
        >
          <span
            >I<span class="text-lowercase">mport </span>F<span
              class="text-lowercase"
              >rom </span
            >E<span class="text-lowercase">xcel</span></span
          >
        </v-btn>
        <input
          ref="fileUpload"
          type="file"
          @change="selectFileToImport"
          hidden
        />
        <v-menu
          v-model="menu2"
          :close-on-content-click="false"
          :nudge-right="40"
          transition="scale-transition"
          offset-y
          min-width="auto"
        >
          <template v-slot:activator="{ on, attrs }">
            <v-text-field
              v-model="filterDate"
              label="Filter by date"
              prepend-icon="mdi-calendar"
              readonly
              v-bind="attrs"
              v-on="on"
            ></v-text-field>
          </template>
          <v-date-picker
            v-model="filterDate"
            @input="menu2 = false"
            :max="new Date().toISOString().substr(0, 10)"
          ></v-date-picker>
        </v-menu>
      </div>
      <v-list-item-group v-model="selectedItem" color="primary">
        <v-progress-linear
          :active="loading"
          :indeterminate="loading"
          bottom
          color="#1976d2"
        ></v-progress-linear>
        <p
          v-if="!vouchersGroups.length && !loading"
          class="ml-5"
          style="color: black;"
        >
          No Vouchers to show!
        </p>
        <v-list-item
          v-for="(voucherGroup, i) in vouchersGroups"
          :key="i"
          :to="{ path: `/voucherpost/${voucherGroup.id}` }"
        >
          <v-list-item-content>
            <v-list-item-title
              v-text="`Voucher # ${voucherGroup.id}`"
            ></v-list-item-title>
          </v-list-item-content>
        </v-list-item>
      </v-list-item-group>
    </v-list>
  </v-card>
</template>

<script>
import { mapActions } from "vuex";
import { getVoucherByDate, addVouchersByImport } from "../actions/index";
import snackBarComp from "../../../components/snackBar";
import XLSX from "xlsx";

export default {
  props: ["vouchersGroups", "voucherGroupsList", "addNewVoucherToList"],
  components: {
    "snack-bar": snackBarComp
  },
  data: () => ({
    loading: false,
    selectedItem: 1,
    menu2: false,
    filterDate: new Date().toISOString().substr(0, 10),

    snackBarColor: "",
    snackBarText: "",
    snackBarModel: false,
    file: "",

    importBtnLoading: false
  }),
  created() {
    getVoucherByDate(this);
  },
  watch: {
    filterDate: {
      handler(newItem) {
        this.changeVouchersFilterDate(newItem);
        getVoucherByDate(this);
      },
      deep: true
    }
  },
  methods: {
    ...mapActions(["changeFocusOnDate", "changeVouchersFilterDate"]),
    addNewVoucherPost() {
      if (this.$route.params.vpid) {
        this.$router.push({ path: "/voucherpost" });
      }
      this.changeFocusOnDate(true);
    },
    closeSnackbar() {
      this.snackBarModel = false;
    },
    selectFileToImport(event) {
      this.file = event.target.files ? event.target.files[0] : null;
      if (this.file) {
        const reader = new FileReader();

        reader.onload = e => {
          const bstr = e.target.result;
          const wb = XLSX.read(bstr, {
            type: "binary"
          });
          const wsname = wb.SheetNames[0];
          const ws = wb.Sheets[wsname];
          const data = XLSX.utils.sheet_to_json(ws, { header: 1, raw: false });
          const verifyFileTemplate = function() {
            var temp = null;
            data.forEach(element => {
              if (!element[1] || !element[2]) {
                temp = false;
              }
            });
            if (!data[1][0]) {
              temp = false;
            }
            if (temp === null) {
              temp = true;
            }
            return temp;
          };
          if (!verifyFileTemplate()) {
            this.snackBarModel = true;
            this.snackBarText =
              "The data from the file is not structured properly";
            this.snackBarColor = "red";
            return;
          }
          const dateToSend = this.formatDateInImport(data[1][0]);

          let dataToSend = { voucher_date: dateToSend, vouchers: [] };
          data.forEach((element, index) => {
            if (index >= 1) {
              dataToSend.vouchers.push({
                accNo: element[1],
                amount: element[2]
              });
            }
          });

          addVouchersByImport(this, dataToSend);
        };

        reader.readAsBinaryString(this.file);
      }
    },
    formatDateInImport(date) {
      date = date.split("/");
      var temp = date[0];
      date[2] = `20${date[2]}`;
      date[0] = date[2];
      date[2] = temp;
      date = date.join("-");
      return date;
    }
  }
};
</script>
