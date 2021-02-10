<template>
  <div>
    <v-snackbar v-model="model1" top color="success" :timeout="snackbarTime">
      {{ successText }}
    </v-snackbar>
    <v-snackbar v-model="model2" top color="red" :timeout="snackbarTime">
      {{ failedText }}
    </v-snackbar>
  </div>
</template>

<script>
export default {
  props: ["model1", "model2", "successText", "failedText"],
  data() {
    return {
      snackbarTime: 2500
    };
  }
};
</script>
