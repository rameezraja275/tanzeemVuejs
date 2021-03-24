<template>
  <div>
    <v-row class="mt-10">
      <v-col cols="12" sm="6" md="3">
        <dashBoard-Card
          :cardTitle="cardTitle1"
          :cardTextContent="cardTextContent1"
          :iconName="iconName1"
          :sheetColor="sheetColor1"
          elevateCurrent="true"
        ></dashBoard-Card>
      </v-col>
      <v-col cols="12" sm="6" md="3">
        <dashBoard-Card
          :cardTitle="cardTitle2"
          :cardTextContent="cardTextContent2"
          :iconName="iconName2"
          :sheetColor="sheetColor2"
        ></dashBoard-Card>
      </v-col>
      <v-col cols="12" sm="6" md="3">
        <dashBoard-Card
          :cardTitle="cardTitle3"
          :cardTextContent="cardTextContent3"
          :iconName="iconName3"
          :sheetColor="sheetColor3"
          elevateCurrent="true"
          :to="{ path: `/accountconfig` }"
        ></dashBoard-Card>
      </v-col>
      <v-col cols="12" sm="6" md="3">
        <dashBoard-Card
          :cardTitle="cardTitle4"
          :cardTextContent="cardTextContent4"
          :iconName="iconName4"
          :sheetColor="sheetColor4"
        ></dashBoard-Card>
      </v-col>
    </v-row>
  </div>
</template>

<script>
import dashBoardCard from "./card";

export default {
  components: {
    "dashBoard-Card": dashBoardCard
  },
  data() {
    return {
      cardTitle1: "Loan Issue",
      cardTextContent1: "10,00,000",
      iconName1: "mdi-account-cash-outline",
      sheetColor1: "green",

      cardTitle2: "Loan Receivable",
      cardTextContent2: "16,000",
      iconName2: "mdi-cash-plus",
      sheetColor2: "blue",

      cardTitle3: "No Of Members",
      cardTextContent3: "12,000",
      iconName3: "mdi-cash-plus",
      sheetColor3: "orange",

      cardTitle4: "Another thing",
      cardTextContent4: "22,000",
      iconName4: "mdi-cash-plus",
      sheetColor4: "red"
    };
  }
};
</script>
