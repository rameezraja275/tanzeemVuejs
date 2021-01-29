<template>
  <v-app id="app">
    <component :is="this.$route.meta.layout || 'div'">
      <router-view />
    </component>
  </v-app>
</template>

<script>
export default {
  name: "Form",
  methods: {
    conso: function() {
      console.log("data ", this.$apollo);
    }
  }
};
</script>
