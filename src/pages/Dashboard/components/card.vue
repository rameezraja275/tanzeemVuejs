<template>
  <div style="cursor: pointer;" @click="goToPath()">
    <v-hover v-slot="{ hover }">
      <v-card
        class="mt-5"
        width="320"
        :elevation="hover && elevateCurrent ? 5 : 2"
      >
        <v-list-item three-line>
          <div style="position: relative; top: -17px">
            <v-sheet
              class="mr-5 alignIcon"
              :color="sheetColor"
              :elevation="hover && elevateCurrent ? 5 : 2"
              height="70"
              width="70"
            >
              <v-icon large color="white">{{ iconName }}</v-icon>
            </v-sheet>
          </div>
          <v-list-item-content>
            <v-list-item-title class="mb-1 title">
              {{ cardTitle }}
            </v-list-item-title>
            <v-list-item-title>{{ cardTextContent }}</v-list-item-title>
          </v-list-item-content>
        </v-list-item>
      </v-card>
    </v-hover>
  </div>
</template>

<script>
export default {
  props: [
    "cardTitle",
    "cardTextContent",
    "iconName",
    "sheetColor",
    "elevateCurrent"
  ],
  methods: {
    goToPath() {
      if (this.cardTitle === "Loan Issue") {
        this.$router.push({ path: `/loan` });
      } else if (this.cardTitle === "No Of Members") {
        this.$router.push({ path: "/accountconfig" });
      }
    }
  }
};
</script>

<style scoped>
.alignIcon {
  display: flex;
  justify-content: center;
  align-items: center;
}
</style>
