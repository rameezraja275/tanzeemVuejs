<template>
  <div>
    <v-row justify="center">
      <v-dialog
        v-model="dialogPopUp"
        fullscreen
        hide-overlay
        transition="dialog-bottom-transition"
        scrollable
      >
        <v-card tile>
          <v-toolbar flat dark color="primary">
            <v-btn icon dark @click="dialogPopUp = false">
              <v-icon>mdi-close</v-icon>
            </v-btn>
            <v-toolbar-title>Create new account</v-toolbar-title>
            <v-spacer></v-spacer>
            <v-toolbar-items>
              <v-btn dark text @click="submitData()">
                Save
              </v-btn>
            </v-toolbar-items>
            <v-menu bottom right offset-y>
              <template v-slot:activator="{ on, attrs }">
                <v-btn dark icon v-bind="attrs" v-on="on">
                  <v-icon>mdi-dots-vertical</v-icon>
                </v-btn>
              </template>
              <v-list>
                <v-list-item
                  v-for="(item, i) in items"
                  :key="i"
                  @click="() => {}"
                >
                  <v-list-item-title>{{ item.title }}</v-list-item-title>
                </v-list-item>
              </v-list>
            </v-menu>
          </v-toolbar>

          <new-form
            :dataFromInputs1="dataFromInputs1"
            :guarantorObj2="guarantorObj2"
            :guarantorObj1="guarantorObj1"
            :accountHoldersData="accountHoldersData"
          ></new-form>
          <div style="flex: 1 1 auto;"></div>
        </v-card>
      </v-dialog>
    </v-row>
  </div>
</template>

<script>
import form from "./form";
import { newAccountHolder } from "../VoucherPost/actions/index";

export default {
  props: ["dialogPopUp", "accountHoldersData"],
  components: {
    "new-form": form
  },
  data() {
    return {
      notifications: false,
      sound: true,
      widgets: false,
      items: [
        {
          title: "Click Me"
        },
        {
          title: "Click Me"
        },
        {
          title: "Click Me"
        },
        {
          title: "Click Me 2"
        }
      ],
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

      dataFromInputs1: {
        first_name: "",
        middle_name: "",
        last_name: "",
        acc_code_id: null,
        acc_no: null,
        guardian_type: null,
        guardian_name: null,
        cell: null,
        landline_no: null,
        address: "",
        cnic: null,
        gender: null,
        dob: null,
        opening_date: null,
        guarantor: []
      }
    };
  },
  methods: {
    submitData: function() {
      this.dataFromInputs1.guarantor.push(this.guarantorObj1);
      this.dialogPopUp = false;
      console.log(this.dataFromInputs1.opening_date);
      newAccountHolder(this);
    }
  }
};
</script>
