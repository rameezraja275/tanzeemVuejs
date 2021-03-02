<template>
  <div style="cursor: pointer;">
    <v-hover v-slot="{ hover }">
      <v-card class="mt-5" width="320" :elevation="hover ? 8 : 2">
        <v-list-item three-line>
          <div style="position: relative; top: -17px">
            <v-sheet
              class="mr-5 alignIcon"
              :color="sheetColor"
              :elevation="hover ? 5 : 2"
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

        <!-- <v-card-actions>
            <v-btn
            outlined
            rounded
            text
            >
            Button
            </v-btn>
        </v-card-actions> -->
      </v-card>
    </v-hover>
  </div>
</template>

<script>
export default {
  props: ["cardTitle", "cardTextContent", "iconName", "sheetColor"]
};
</script>

<style scoped>
.alignIcon {
  display: flex;
  justify-content: center;
  align-items: center;
}
</style>
