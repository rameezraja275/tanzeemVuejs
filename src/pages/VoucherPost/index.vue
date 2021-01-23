<template>
  <v-card class="flex">
    <List />
    <router-view />
  </v-card>
</template>

<script>
import List from "./components/List";

export default {
  name: "VP",
  components: {
    List
  }
};
</script>
