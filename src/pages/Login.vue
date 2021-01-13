<template>
  <form v-on:submit.prevent="onSubmit">
    <div class="measure">
      <label htmlFor="name">
        email
      </label>
      <input id="name" type="text" required v-model="email" />
      <label htmlFor="name">
        pass
      </label>
      <input id="name" type="text" required v-model="pass" />
      <input id="name" type="submit" value="submit" />
    </div>
  </form>
</template>

<script>
import { LOGIN } from "../graphql/quries";
export default {
  name: "Form",
  data() {
    return {
      email: "",
      pass: ""
    };
  },
  methods: {
    async onSubmit() {
      const email = this.email;
      const pass = this.pass;
      this.pass = "";
      this.email = "";
      console.log("this", this);
      const result = await this.$apollo.mutate({
        mutation: LOGIN,
        variables: {
          email,
          pass
        }
      });
      console.log(result);
    }
  }
};
</script>
