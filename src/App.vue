<template>
  <v-app id="app">
    <component :is="this.$route.meta.layout || 'div'">
      <router-view></router-view>
    </component>
  </v-app>
</template>

<script>
export default {
  name: "app"
};
</script>
