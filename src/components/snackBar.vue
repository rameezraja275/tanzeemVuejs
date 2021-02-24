<template>
  <v-snackbar v-model="snackbarModel" top :color="snackBarColor">
    {{ snackbarText }}
  </v-snackbar>
</template>

<script>
export default {
  props: ["snackbarModel", "snackBarColor", "snackbarText", "closeSnackbar"],
  watch: {
    snackbarModel(val) {
      if (val) {
        setTimeout(() => {
          this.closeSnackbar();
        }, 3000);
      }
    }
  }
};
</script>
