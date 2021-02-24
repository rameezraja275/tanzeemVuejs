<template>
  <div class="container">
    <dash-board></dash-board>
  </div>
</template>

<script>
import dashBoard from "./components/dashboard";

export default {
  name: "Dashbaord",
  components: {
    "dash-board": dashBoard
  }
};
</script>
